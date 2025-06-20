
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

  const handleRules = () => {
    playButtonClick();
    updateGameState({ gamePhase: 'rules' });
  };

  const handleSettings = () => {
    playButtonClick();
    updateGameState({ gamePhase: 'settings' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center p-8 animate-fade-in">
        <div className="mb-12">
          {/* Cool title/logo section */}
          <div className="relative mb-6">
            <h1 className="text-6xl font-bold text-game-primary mb-4 animate-pulse-gentle drop-shadow-lg">
              פתקיות
            </h1>
            <div className="absolute -top-2 -right-4 w-8 h-8 bg-game-secondary rounded-full animate-bounce"></div>
            <div className="absolute -bottom-1 -left-3 w-6 h-6 bg-game-success rounded-full animate-pulse"></div>
          </div>
          <p className="text-xl text-muted-foreground font-medium">
            משחק קבוצות מהיר ומשעשע
          </p>
          <div className="mt-4 flex justify-center space-x-2 rtl:space-x-reverse">
            <div className="w-2 h-2 bg-game-primary rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-game-secondary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-game-success rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleNewGame}
            className="game-button game-button-primary w-full text-xl py-6"
          >
            משחק חדש
          </Button>

          <Button
            variant="outline"
            className="game-button w-full text-lg"
            onClick={handleRules}
          >
            חוקים
          </Button>

          <Button
            variant="ghost"
            className="game-button w-full text-lg"
            onClick={handleSettings}
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
