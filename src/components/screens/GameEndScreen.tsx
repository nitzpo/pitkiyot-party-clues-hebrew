import React from 'react';
import { useGameState } from '../../hooks/useGameState';
import { useAudio } from '../../hooks/useAudio';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Trophy, RotateCcw, Home, Crown, Medal, Award } from 'lucide-react';

const GameEndScreen: React.FC = () => {
  const { gameState, resetGame, updateGameState } = useGameState();
  const { playButtonClick, playWin } = useAudio();

  const sortedTeams = [...gameState.teams].sort((a, b) => b.score - a.score);
  const winner = sortedTeams[0];

  React.useEffect(() => {
    playWin();
  }, [playWin]);

  const handlePlayAgain = () => {
    playButtonClick();
    updateGameState({ gamePhase: 'setup' });
  };

  const handleMainMenu = () => {
    playButtonClick();
    resetGame();
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Crown className="h-6 w-6 text-yellow-500" />;
      case 1: return <Medal className="h-6 w-6 text-gray-400" />;
      case 2: return <Award className="h-6 w-6 text-orange-400" />;
      default: return <div className="w-6 h-6" />;
    }
  };

  return (
    <div className="h-dvh flex items-center justify-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 overflow-y-auto">
      <Card className="w-full max-w-lg text-center p-8 animate-scale-in my-auto">
        {/* Celebration Header */}
        <div className="mb-8">
          <Trophy className="h-20 w-20 text-yellow-500 mx-auto mb-4 animate-pulse-gentle" />
          <h1 className="text-4xl font-bold mb-2 text-yellow-700">
            {winner.name}
          </h1>
          <h2 className="text-2xl font-semibold text-yellow-600">
            המנצחת!
          </h2>
          <div className="text-lg text-muted-foreground mt-2">
            עם {winner.score} נקודות
          </div>
        </div>

        {/* Final Scoreboard */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center justify-center gap-2">
            <Trophy className="h-5 w-5" />
            תוצאות סופיות
          </h3>
          
          <div className="space-y-3">
            {sortedTeams.map((team, index) => (
              <Card 
                key={team.id} 
                className={`p-4 flex items-center justify-between transition-all ${
                  index === 0 ? 'bg-yellow-50 border-yellow-300 scale-105 shadow-lg' : 
                  index === 1 ? 'bg-gray-50 border-gray-300' :
                  index === 2 ? 'bg-orange-50 border-orange-300' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  {getRankIcon(index)}
                  <div className="text-right">
                    <div className="font-semibold text-lg">{team.name}</div>
                    <div className="text-sm text-muted-foreground">
                      מקום {index + 1}
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold">{team.score}</div>
              </Card>
            ))}
          </div>
        </div>

        {/* Game Summary */}
        <Card className="p-4 mb-6 bg-blue-50">
          <div className="text-sm text-blue-800">
            <p className="font-medium">סיכום המשחק</p>
            <p>3 שלבים • {gameState.notes.length} פתקים • {gameState.teams.length} קבוצות</p>
            <p className="mt-1 text-xs">משחק מהנה לכולם! 🎉</p>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handlePlayAgain}
            className="game-button-primary w-full text-lg py-4"
          >
            <RotateCcw className="ml-2 h-5 w-5" />
            שחקו שוב
          </Button>
          
          <Button
            onClick={handleMainMenu}
            variant="outline"
            className="game-button w-full text-lg py-4"
          >
            <Home className="ml-2 h-5 w-5" />
            תפריט ראשי
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default GameEndScreen;
