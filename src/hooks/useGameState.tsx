import { useState, useCallback, createContext, useContext, ReactNode } from 'react';

export interface Team {
  id: string;
  name: string;
  score: number;
}

export interface Note {
  note: string;
  categories: string[];
  guessed?: boolean;
  skippedInTurn?: boolean; // Track if note was skipped in current turn
}

export interface GameState {
  teams: Team[];
  notes: Note[];
  currentStage: number;
  currentTeamIndex: number;
  currentTurnScore: number;
  turnTimeLeft: number;
  isPlaying: boolean;
  gamePhase: 'home' | 'setup' | 'ready' | 'playing' | 'turnEnd' | 'stageEnd' | 'gameEnd' | 'rules' | 'settings';
  currentNoteIndex: number;
}

const INITIAL_STATE: GameState = {
  teams: [],
  notes: [],
  currentStage: 1,
  currentTeamIndex: 0,
  currentTurnScore: 0,
  turnTimeLeft: 60,
  isPlaying: false,
  gamePhase: 'home',
  currentNoteIndex: 0,
};

// Create context type
interface GameStateContextType {
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
  addTeam: (name: string) => void;
  removeTeam: (teamId: string) => void;
  updateTeamName: (teamId: string, name: string) => void;
  setNotes: (notes: Note[]) => void;
  startGame: () => void;
  startTurn: () => void;
  correctGuess: () => void;
  skipNote: () => void;
  endTurn: () => void;
  nextTurn: () => void;
  nextStage: () => void;
  resetGame: () => void;
  decrementTimer: () => void;
}

// Create context
const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

// Provider component
export const GameStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);

  const updateGameState = useCallback((updates: Partial<GameState>) => {
    setGameState(prev => ({ ...prev, ...updates }));
  }, []);

  const addTeam = useCallback((name: string) => {
    setGameState(prev => ({
      ...prev,
      teams: [...prev.teams, { id: Date.now().toString(), name, score: 0 }]
    }));
  }, []);

  const removeTeam = useCallback((teamId: string) => {
    setGameState(prev => ({
      ...prev,
      teams: prev.teams.filter(team => team.id !== teamId)
    }));
  }, []);

  const updateTeamName = useCallback((teamId: string, name: string) => {
    setGameState(prev => ({
      ...prev,
      teams: prev.teams.map(team => 
        team.id === teamId ? { ...team, name } : team
      )
    }));
  }, []);

  const setNotes = useCallback((notes: Note[]) => {
    setGameState(prev => ({
      ...prev,
      notes: notes.map(note => ({ ...note, guessed: false, skippedInTurn: false }))
    }));
  }, []);

  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      gamePhase: 'ready',
      currentStage: 1,
      currentTeamIndex: 0,
      currentTurnScore: 0,
      currentNoteIndex: 0,
      turnTimeLeft: 60,
      notes: prev.notes.map(note => ({ ...note, guessed: false, skippedInTurn: false }))
    }));
  }, []);

  const startTurn = useCallback(() => {
    setGameState(prev => {
      // Clear skipped flags for new turn
      const notesWithClearedSkips = prev.notes.map(note => ({ ...note, skippedInTurn: false }));
      const availableNotes = notesWithClearedSkips.filter(note => !note.guessed);
      
      if (availableNotes.length === 0) {
        // Stage complete
        return {
          ...prev,
          gamePhase: 'stageEnd'
        };
      }

      const firstAvailableIndex = notesWithClearedSkips.findIndex(note => !note.guessed);
      return {
        ...prev,
        notes: notesWithClearedSkips,
        gamePhase: 'playing',
        isPlaying: true,
        turnTimeLeft: 60,
        currentTurnScore: 0,
        currentNoteIndex: firstAvailableIndex
      };
    });
  }, []);

  const correctGuess = useCallback(() => {
    setGameState(prev => {
      const newNotes = [...prev.notes];
      newNotes[prev.currentNoteIndex] = { ...newNotes[prev.currentNoteIndex], guessed: true };
      
      // Find next available note (not guessed and not skipped in this turn)
      const nextAvailableIndex = newNotes.findIndex((note, index) => 
        index > prev.currentNoteIndex && !note.guessed && !note.skippedInTurn
      );
      
      const finalNextIndex = nextAvailableIndex === -1 
        ? newNotes.findIndex(note => !note.guessed && !note.skippedInTurn)
        : nextAvailableIndex;

      const availableNotes = newNotes.filter(note => !note.guessed && !note.skippedInTurn);
      
      // Check if no more notes available in this turn
      if (availableNotes.length === 0) {
        // End turn immediately
        const newTeams = [...prev.teams];
        newTeams[prev.currentTeamIndex].score += prev.currentTurnScore + 1;
        
        // Check if stage is complete (no unguessed notes)
        const unguessedNotes = newNotes.filter(note => !note.guessed);
        if (unguessedNotes.length === 0) {
          return {
            ...prev,
            notes: newNotes,
            teams: newTeams,
            gamePhase: 'stageEnd',
            isPlaying: false
          };
        }
        
        return {
          ...prev,
          notes: newNotes,
          teams: newTeams,
          gamePhase: 'turnEnd',
          isPlaying: false
        };
      }

      return {
        ...prev,
        notes: newNotes,
        currentTurnScore: prev.currentTurnScore + 1,
        currentNoteIndex: finalNextIndex === -1 ? prev.currentNoteIndex : finalNextIndex
      };
    });
  }, []);

  const skipNote = useCallback(() => {
    setGameState(prev => {
      const newNotes = [...prev.notes];
      newNotes[prev.currentNoteIndex] = { ...newNotes[prev.currentNoteIndex], skippedInTurn: true };
      
      // Find next available note (not guessed and not skipped in this turn)
      const nextAvailableIndex = newNotes.findIndex((note, index) => 
        index > prev.currentNoteIndex && !note.guessed && !note.skippedInTurn
      );
      
      const finalNextIndex = nextAvailableIndex === -1 
        ? newNotes.findIndex(note => !note.guessed && !note.skippedInTurn)
        : nextAvailableIndex;

      const availableNotes = newNotes.filter(note => !note.guessed && !note.skippedInTurn);
      
      // Check if no more notes available in this turn
      if (availableNotes.length === 0) {
        // End turn immediately
        const newTeams = [...prev.teams];
        newTeams[prev.currentTeamIndex].score += prev.currentTurnScore - 1;
        
        return {
          ...prev,
          notes: newNotes,
          teams: newTeams,
          gamePhase: 'turnEnd',
          isPlaying: false
        };
      }

      return {
        ...prev,
        notes: newNotes,
        currentTurnScore: prev.currentTurnScore - 1,
        currentNoteIndex: finalNextIndex === -1 ? prev.currentNoteIndex : finalNextIndex
      };
    });
  }, []);

  const endTurn = useCallback(() => {
    setGameState(prev => {
      const newTeams = [...prev.teams];
      newTeams[prev.currentTeamIndex].score += prev.currentTurnScore;
      
      return {
        ...prev,
        teams: newTeams,
        gamePhase: 'turnEnd',
        isPlaying: false
      };
    });
  }, []);

  const nextTurn = useCallback(() => {
    setGameState(prev => {
      const unguessedNotes = prev.notes.filter(note => !note.guessed);
      if (unguessedNotes.length === 0) {
        // Stage complete
        return {
          ...prev,
          gamePhase: 'stageEnd'
        };
      }

      return {
        ...prev,
        currentTeamIndex: (prev.currentTeamIndex + 1) % prev.teams.length,
        gamePhase: 'ready',
        currentTurnScore: 0
      };
    });
  }, []);

  const nextStage = useCallback(() => {
    setGameState(prev => {
      if (prev.currentStage >= 3) {
        // Game over
        return {
          ...prev,
          gamePhase: 'gameEnd'
        };
      }

      return {
        ...prev,
        currentStage: prev.currentStage + 1,
        gamePhase: 'ready',
        currentTeamIndex: 0,
        currentTurnScore: 0,
        currentNoteIndex: 0,
        notes: prev.notes.map(note => ({ ...note, guessed: false, skippedInTurn: false }))
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState(INITIAL_STATE);
  }, []);

  const decrementTimer = useCallback(() => {
    setGameState(prev => {
      if (prev.turnTimeLeft <= 1) {
        // Time's up - end turn
        const newTeams = [...prev.teams];
        newTeams[prev.currentTeamIndex].score += prev.currentTurnScore;
        
        return {
          ...prev,
          teams: newTeams,
          turnTimeLeft: 0,
          gamePhase: 'turnEnd',
          isPlaying: false
        };
      }
      return {
        ...prev,
        turnTimeLeft: prev.turnTimeLeft - 1
      };
    });
  }, []);

  const value = {
    gameState,
    updateGameState,
    addTeam,
    removeTeam,
    updateTeamName,
    setNotes,
    startGame,
    startTurn,
    correctGuess,
    skipNote,
    endTurn,
    nextTurn,
    nextStage,
    resetGame,
    decrementTimer
  };

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
};

// Hook to use the context
export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};
