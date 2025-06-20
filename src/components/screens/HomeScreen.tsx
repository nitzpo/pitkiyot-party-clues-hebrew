
import React from 'react';
import { useGameState } from '../../hooks/useGameState';
import { useAudio } from '../../hooks/useAudio';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

const HomeScreen: React.FC = () => {
  const { updateGameState } = useGameState();
  const { playButtonClick } = useAudio();

  const handleNewGame = () => {
    playButtonClick();
    updateGameState({ gamePhase: 'setup' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center p-8 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-game-primary mb-2 animate-pulse-gentle">
            פתקיות
          </h1>
          <p className="text-xl text-muted-foreground">
            משחק קבוצות מהיר ומשעשע
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleNewGame}
            className="game-button game-button-primary w-full text-xl"
          >
            משחק חדש
          </Button>

          <Button
            variant="outline"
            className="game-button w-full text-lg"
            onClick={() => {
              playButtonClick();
              // TODO: Show rules modal
            }}
          >
            חוקים
          </Button>

          <Button
            variant="ghost"
            className="game-button w-full text-lg"
            onClick={() => {
              playButtonClick();
              // TODO: Show settings modal
            }}
          >
            הגדרות
          </Button>
        </div>

        <div className="mt-8 text-sm text-muted-foreground">
          <p>משחק לקבוצות • 3 שלבים • כיף אינסופי</p>
        </div>
      </Card>
    </div>
  );
};

export default HomeScreen;
