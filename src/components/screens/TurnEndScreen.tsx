import React from 'react';
import { useGameState } from '../../hooks/useGameState';
import { useAudio } from '../../hooks/useAudio';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Trophy, Users, ArrowLeft, Home } from 'lucide-react';

const TurnEndScreen: React.FC = () => {
  const { gameState, nextTurn, updateGameState } = useGameState();
  const { playButtonClick } = useAudio();

  const currentTeam = gameState.teams[gameState.currentTeamIndex];
  const sortedTeams = [...gameState.teams].sort((a, b) => b.score - a.score);

  const handleNext = () => {
    playButtonClick();
    nextTurn();
  };

  const handleAbortGame = () => {
    playButtonClick();
    updateGameState({ gamePhase: 'home' });
  };

  return (
    <div className="h-dvh flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-lg text-center p-8 animate-fade-in my-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">סיום תור!</h2>
          <Badge variant="outline" className="text-lg px-4 py-2">
            {currentTeam.name}
          </Badge>
        </div>

        {/* Turn Results */}
        <Card className="p-6 mb-6 bg-blue-50">
          <div className="text-4xl font-bold text-game-primary mb-2">
            {gameState.currentTurnScore > 0 && <span>+</span>}{gameState.currentTurnScore}
          </div>
          <p className="text-blue-800">נקודות בתור זה</p>
        </Card>

        {/* Current Scoreboard */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center justify-center gap-2">
            <Trophy className="h-5 w-5" />
            טבלת נקודות
          </h3>
          
          <div className="space-y-2">
            {sortedTeams.map((team, index) => (
              <Card 
                key={team.id} 
                className={`p-3 flex items-center justify-between ${
                  index === 0 ? 'bg-yellow-50 border-yellow-300' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    index === 2 ? 'bg-orange-400' : 'bg-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="font-medium">{team.name}</span>
                </div>
                <span className="font-bold text-lg">{team.score}</span>
              </Card>
            ))}
          </div>
        </div>

        {/* Next Team Info */}
        <div className="mb-6 p-4 bg-green-50 rounded-lg">
          <div className="flex items-center justify-center gap-2 text-green-800">
            <Users className="h-4 w-4" />
            <span className="text-sm">
              הבא: {gameState.teams[(gameState.currentTeamIndex + 1) % gameState.teams.length].name}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleNext}
            className="game-button-primary w-full text-xl py-6"
          >
            המשך למשחק
            <ArrowLeft className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default TurnEndScreen;
