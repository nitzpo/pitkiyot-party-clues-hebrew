
import React from 'react';
import { useGameState } from '../../hooks/useGameState';
import { useAudio } from '../../hooks/useAudio';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Check, X, Clock } from 'lucide-react';

const GameplayScreen: React.FC = () => {
  const { gameState, correctGuess, skipNote } = useGameState();
  const { playSuccess, playSkip } = useAudio();

  const currentTeam = gameState.teams[gameState.currentTeamIndex];
  const currentNote = gameState.notes[gameState.currentNoteIndex];
  const stageNames = ['', 'דיבור חופשי', 'מילה אחת', 'פנטומימה'];

  const handleCorrect = () => {
    playSuccess();
    correctGuess();
  };

  const handleSkip = () => {
    playSkip();
    skipNote();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isUrgent = gameState.turnTimeLeft <= 10;

  return (
    <div className="min-h-screen flex flex-col p-4 bg-gradient-to-br from-blue-100 to-orange-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <Badge variant="outline" className="text-sm">
          שלב {gameState.currentStage} • {stageNames[gameState.currentStage]}
        </Badge>
        <Badge variant="outline" className="text-sm">
          {currentTeam.name}
        </Badge>
      </div>

      {/* Timer */}
      <div className="text-center mb-6">
        <div className={`text-6xl font-bold mb-2 ${isUrgent ? 'timer-urgent' : 'text-game-primary'}`}>
          {formatTime(gameState.turnTimeLeft)}
        </div>
        <div className="flex items-center justify-center gap-2">
          <Clock className="h-4 w-4" />
          <span className="text-sm text-muted-foreground">
            נקודות בסיבוב: {gameState.currentTurnScore > 0 ? '+' : ''}{gameState.currentTurnScore}
          </span>
        </div>
      </div>

      {/* Current Note */}
      <div className="flex-1 flex items-center justify-center mb-6">
        <Card className="w-full max-w-md p-8 text-center bg-white shadow-xl border-2 border-game-primary">
          <div className="text-3xl font-bold text-game-primary mb-4">
            {currentNote?.note || 'אין פתקים נוספים'}
          </div>
          
          {currentNote && (
            <div className="text-sm text-muted-foreground">
              פתק #{gameState.currentNoteIndex + 1}
            </div>
          )}
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={handleSkip}
          className="game-button game-button-warning py-8 text-xl"
          disabled={!currentNote}
        >
          <X className="ml-2 h-6 w-6" />
          דלג
          <div className="text-sm opacity-75">-1</div>
        </Button>
        
        <Button
          onClick={handleCorrect}
          className="game-button game-button-success py-8 text-xl"
          disabled={!currentNote}
        >
          <Check className="ml-2 h-6 w-6" />
          נכון!
          <div className="text-sm opacity-75">+1</div>
        </Button>
      </div>

      {/* Game Info */}
      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>
          {gameState.notes.filter(n => !n.guessed).length} פתקים נותרו בשלב
        </p>
      </div>
    </div>
  );
};

export default GameplayScreen;
