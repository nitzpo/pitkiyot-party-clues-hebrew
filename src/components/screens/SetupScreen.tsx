import React, { useState } from 'react';
import { useGameState } from '../../hooks/useGameState';
import { useAudio } from '../../hooks/useAudio';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Separator } from '../ui/separator';
import { ArrowLeft } from 'lucide-react';
import TeamSetup from '../game/TeamSetup';
import NotesSetup from '../game/NotesSetup';

const SetupScreen: React.FC = () => {
  const { gameState, startGame, updateGameState } = useGameState();
  const { playButtonClick } = useAudio();
  const [setupStep, setSetupStep] = useState<'teams' | 'notes'>('teams');

  const canStartGame = gameState.teams.length >= 2 && gameState.notes.length >= 10;

  const handleStartGame = () => {
    if (canStartGame) {
      playButtonClick();
      startGame();
    }
  };

  const handleNext = () => {
    if (setupStep === 'teams' && gameState.teams.length >= 2) {
      playButtonClick();
      setSetupStep('notes');
    }
  };

  const handleBack = () => {
    if (setupStep === 'notes') {
      playButtonClick();
      setSetupStep('teams');
    }
  };

  const handleCancel = () => {
    playButtonClick();
    updateGameState({ gamePhase: 'home' });
  };

  return (
    <div className={`h-dvh p-4 ${setupStep === 'notes' ? 'overflow-y-auto' : 'flex items-center justify-center'}`}>
      <Card className={`w-full max-w-2xl p-6 animate-slide-in-right ${setupStep === 'notes' ? 'my-8' : ''}`}>
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-center mb-2">הגדרת המשחק</h2>
          <div className="flex justify-center space-x-2 rtl:space-x-reverse">
            <div className={`w-4 h-4 rounded-full ${setupStep === 'teams' ? 'bg-game-primary' : 'bg-gray-300'}`} />
            <div className={`w-4 h-4 rounded-full ${setupStep === 'notes' ? 'bg-game-primary' : 'bg-gray-300'}`} />
          </div>
        </div>

        {setupStep === 'teams' && (
          <div className="space-y-6">
            <TeamSetup />
            
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={handleCancel}
              >
                ביטול
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={gameState.teams.length < 2}
                className="game-button-primary"
              >
                הבא
                <ArrowLeft className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {setupStep === 'notes' && (
          <div className="space-y-6">
            <NotesSetup />
            
            <Separator />
            
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={handleBack}
              >
                חזור
              </Button>
              
              <Button
                onClick={handleStartGame}
                disabled={!canStartGame}
                className="game-button-success text-lg px-8"
              >
                התחילו לשחק!
              </Button>
            </div>
            
            {!canStartGame && (
              <p className="text-sm text-center text-muted-foreground">
                {gameState.teams.length < 2 && "נדרשות לפחות 2 קבוצות"}
                {gameState.teams.length >= 2 && gameState.notes.length < 10 && "נדרשים לפחות 10 פתקים"}
              </p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default SetupScreen;
