import React from 'react';
import { useGameState } from '../../hooks/useGameState';
import { useAudio } from '../../hooks/useAudio';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Trophy, ArrowLeft, Star, Home } from 'lucide-react';

const StageEndScreen: React.FC = () => {
  const { gameState, nextStage, updateGameState } = useGameState();
  const { playButtonClick, playWin } = useAudio();

  const sortedTeams = [...gameState.teams].sort((a, b) => b.score - a.score);
  const stageNames = ['', 'דיבור חופשי', 'מילה אחת', 'פנטומימה'];
  const nextStageNames = ['', '', 'מילה אחת', 'פנטומימה'];

  React.useEffect(() => {
    playWin();
  }, [playWin]);

  const handleNext = () => {
    playButtonClick();
    nextStage();
  };

  const handleAbortGame = () => {
    playButtonClick();
    updateGameState({ gamePhase: 'home' });
  };

  return (
    <div className="h-dvh flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-lg text-center p-8 animate-scale-in my-auto">
        <div className="mb-6">
          <Star className="h-16 w-16 text-yellow-500 mx-auto mb-4 animate-pulse-gentle" />
          <h2 className="text-3xl font-bold mb-2">שלב הושלם!</h2>
          <Badge variant="outline" className="text-lg px-4 py-2">
            שלב {gameState.currentStage}: {stageNames[gameState.currentStage]}
          </Badge>
        </div>

        {/* Current Scoreboard */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center justify-center gap-2">
            <Trophy className="h-5 w-5" />
            טבלת נקודות עד כה
          </h3>
          
          <div className="space-y-2">
            {sortedTeams.map((team, index) => (
              <Card 
                key={team.id} 
                className={`p-4 flex items-center justify-between transition-all ${
                  index === 0 ? 'bg-yellow-50 border-yellow-300 scale-105' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    index === 2 ? 'bg-orange-400' : 'bg-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="font-medium text-lg">{team.name}</span>
                </div>
                <span className="font-bold text-2xl">{team.score}</span>
              </Card>
            ))}
          </div>
        </div>

        {gameState.currentStage < 3 ? (
          <>
            {/* Next Stage Info */}
            <Card className="p-4 mb-6 bg-blue-50">
              <h3 className="font-semibold mb-2 text-blue-900">השלב הבא:</h3>
              <p className="text-blue-800 font-medium">
                שלב {gameState.currentStage + 1}: {nextStageNames[gameState.currentStage + 1]}
              </p>
              <p className="text-blue-700 text-sm mt-1">
                אותם פתקים, חוקים חדשים!
              </p>
            </Card>

            <div className="space-y-3">
              <Button
                onClick={handleNext}
                className="game-button-primary w-full text-xl py-6"
              >
                <ArrowLeft className="ml-2 h-5 w-5" />
                המשך לשלב הבא
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <Button
              onClick={handleNext}
              className="game-button-success w-full text-xl py-6"
            >
              <Trophy className="ml-2 h-5 w-5" />
              סיים משחק!
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default StageEndScreen;
