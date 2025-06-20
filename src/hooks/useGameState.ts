
import { useState, useCallback } from 'react';

export interface Team {
  id: string;
  name: string;
  score: number;
}

export interface Note {
  note: string;
  categories: string[];
  guessed?: boolean;
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

export const useGameState = () => {
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
      notes: notes.map(note => ({ ...note, guessed: false }))
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
      notes: prev.notes.map(note => ({ ...note, guessed: false }))
    }));
  }, []);

  const startTurn = useCallback(() => {
    const unguessedNotes = gameState.notes.filter(note => !note.guessed);
    if (unguessedNotes.length === 0) {
      // Stage complete
      setGameState(prev => ({
        ...prev,
        gamePhase: 'stageEnd'
      }));
      return;
    }

    const firstUnguessedIndex = gameState.notes.findIndex(note => !note.guessed);
    setGameState(prev => ({
      ...prev,
      gamePhase: 'playing',
      isPlaying: true,
      turnTimeLeft: 60,
      currentTurnScore: 0,
      currentNoteIndex: firstUnguessedIndex
    }));
  }, [gameState.notes]);

  const correctGuess = useCallback(() => {
    setGameState(prev => {
      const newNotes = [...prev.notes];
      newNotes[prev.currentNoteIndex] = { ...newNotes[prev.currentNoteIndex], guessed: true };
      
      const nextUnguessedIndex = newNotes.findIndex((note, index) => 
        index > prev.currentNoteIndex && !note.guessed
      );
      
      const finalNextIndex = nextUnguessedIndex === -1 
        ? newNotes.findIndex(note => !note.guessed)
        : nextUnguessedIndex;

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
      const nextUnguessedIndex = prev.notes.findIndex((note, index) => 
        index > prev.currentNoteIndex && !note.guessed
      );
      
      const finalNextIndex = nextUnguessedIndex === -1 
        ? prev.notes.findIndex(note => !note.guessed)
        : nextUnguessedIndex;

      return {
        ...prev,
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
    const unguessedNotes = gameState.notes.filter(note => !note.guessed);
    if (unguessedNotes.length === 0) {
      // Stage complete
      setGameState(prev => ({
        ...prev,
        gamePhase: 'stageEnd'
      }));
      return;
    }

    setGameState(prev => ({
      ...prev,
      currentTeamIndex: (prev.currentTeamIndex + 1) % prev.teams.length,
      gamePhase: 'ready',
      currentTurnScore: 0
    }));
  }, [gameState.notes]);

  const nextStage = useCallback(() => {
    if (gameState.currentStage >= 3) {
      // Game over
      setGameState(prev => ({
        ...prev,
        gamePhase: 'gameEnd'
      }));
      return;
    }

    setGameState(prev => ({
      ...prev,
      currentStage: prev.currentStage + 1,
      gamePhase: 'ready',
      currentTeamIndex: 0,
      currentTurnScore: 0,
      currentNoteIndex: 0,
      notes: prev.notes.map(note => ({ ...note, guessed: false }))
    }));
  }, [gameState.currentStage]);

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

  return {
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
};
