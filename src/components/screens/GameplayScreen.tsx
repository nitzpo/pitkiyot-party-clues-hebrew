import React from 'react';
import { useGameState } from '../../hooks/useGameState';
import { useAudio } from '../../hooks/useAudio';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Check, X, Clock, Pause, Play, Home } from 'lucide-react';

const GameplayScreen: React.FC = () => {
  const { gameState, correctGuess, skipNote, pauseGame, resumeGame, updateGameState } = useGameState();
  const { playSuccess, playSkip, playButtonClick } = useAudio();

  const currentTeam = gameState.teams[gameState.currentTeamIndex];
  const currentNote = gameState.notes[gameState.currentNoteIndex];
  const stageNames = ['', 'דיבור חופשי', 'מילה אחת', 'פנטומימה'];

  const handleCorrect = () => {
    if (!gameState.isPaused) {
      playSuccess();
      correctGuess();
    }
  };

  const handleSkip = () => {
    if (!gameState.isPaused) {
      playSkip();
      skipNote();
    }
  };

  const handlePause = () => {
    if (gameState.isPaused) {
      resumeGame();
    } else {
      pauseGame();
    }
  };

  const handleAbortGame = () => {
    playButtonClick();
    updateGameState({ gamePhase: 'home' });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isUrgent = gameState.turnTimeLeft <= 10;

  return (
    <div className="h-screen flex flex-col p-4 bg-gradient-to-br from-blue-100 to-orange-100 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 shrink-0">
        <Badge variant="outline" className="text-sm">
          שלב {gameState.currentStage} • {stageNames[gameState.currentStage]}
        </Badge>
        <Badge variant="outline" className="text-sm">
          {currentTeam.name}
        </Badge>
      </div>

      {/* Timer and Score */}
      <div className="text-center mb-4 shrink-0">
        <div className={`text-4xl md:text-6xl font-bold mb-2 ${isUrgent ? 'timer-urgent' : 'text-game-primary'}`}>
          {formatTime(gameState.turnTimeLeft)}
        </div>
        <div className="flex items-center justify-center gap-2">
          <Clock className="h-4 w-4" />
          <span className="text-sm text-muted-foreground">
            נקודות בסיבוב: {gameState.currentTurnScore > 0 && <span>+</span>}{gameState.currentTurnScore}
          </span>
        </div>
      </div>

      {/* Pause and Abort Controls */}
      <div className="text-center mb-4 shrink-0">
        <div className="flex justify-center gap-3">
          <Button
            onClick={handlePause}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            {gameState.isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            {gameState.isPaused ? 'המשך' : 'הפסק'}
          </Button>
          
          {gameState.isPaused && (
            <Button
              onClick={handleAbortGame}
              variant="destructive"
              size="sm"
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              יציאה למסך הבית
            </Button>
          )}
        </div>
      </div>

      {/* Current Note */}
      <div className="flex-1 flex items-center justify-center mb-4 min-h-0">
        <Card className="w-full max-w-md p-6 md:p-8 text-center bg-white shadow-xl border-2 border-game-primary">
          <div className="text-xl md:text-3xl font-bold text-game-primary mb-4">
            {gameState.isPaused ? 'המשחק מושהה' : (currentNote?.note || 'אין פתקים נוספים')}
          </div>
          
          {currentNote && !gameState.isPaused && (
            <div className="text-sm text-muted-foreground">
              פתק #{gameState.currentNoteIndex + 1}
            </div>
          )}
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4 shrink-0">
        <Button
          onClick={handleSkip}
          className="game-button game-button-warning py-6 md:py-8 text-lg md:text-xl"
          disabled={!currentNote || gameState.isPaused}
        >
          <X className="ml-2 h-5 w-5 md:h-6 md:w-6" />
          דלג
          <div className="text-sm opacity-75">-1</div>
        </Button>
        
        <Button
          onClick={handleCorrect}
          className="game-button game-button-success py-6 md:py-8 text-lg md:text-xl"
          disabled={!currentNote || gameState.isPaused}
        >
          <Check className="ml-2 h-5 w-5 md:h-6 md:w-6" />
          נכון!
          <div className="text-sm opacity-75"><span>+</span>1</div>
        </Button>
      </div>

      {/* Game Info */}
      <div className="mt-4 text-center text-xs md:text-sm text-muted-foreground shrink-0">
        <p>
          {gameState.notes.filter(n => !n.guessed && !n.skippedInTurn).length} פתקים זמינים בתור • {gameState.notes.filter(n => !n.guessed).length} פתקים נותרו בשלב
        </p>
      </div>
    </div>
  );
};

export default GameplayScreen;
