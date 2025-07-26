import React, { useEffect, useState } from 'react';
import { useGameState } from '../../hooks/useGameState';
import { useAudio } from '../../hooks/useAudio';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Sparkles, Crown } from 'lucide-react';

const TeamSelectionScreen: React.FC = () => {
  const { gameState, updateGameState } = useGameState();
  const { playButtonClick } = useAudio();
  const [animationStep, setAnimationStep] = useState<'spinning' | 'selected' | 'done'>('spinning');
  const [highlightedTeamIndex, setHighlightedTeamIndex] = useState(0);

  useEffect(() => {
    // Start the spinning animation
    const spinInterval = setInterval(() => {
      setHighlightedTeamIndex(prev => (prev + 1) % gameState.teams.length);
    }, 200);

    // Stop spinning after 2 seconds and show the selected team
    const stopSpinTimeout = setTimeout(() => {
      clearInterval(spinInterval);
      setHighlightedTeamIndex(gameState.currentTeamIndex);
      setAnimationStep('selected');
      playButtonClick();
    }, 2000);

    // Move to ready screen after showing selection
    const completeTimeout = setTimeout(() => {
      setAnimationStep('done');
      updateGameState({ gamePhase: 'ready' });
    }, 4000);

    return () => {
      clearInterval(spinInterval);
      clearTimeout(stopSpinTimeout);
      clearTimeout(completeTimeout);
    };
  }, [gameState.teams.length, gameState.currentTeamIndex, updateGameState, playButtonClick]);

  const selectedTeam = gameState.teams[gameState.currentTeamIndex];

  return (
    <div className="h-dvh flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-100 to-blue-100">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-8 w-8 text-purple-600 animate-sparkle" />
          <h1 className="text-3xl md:text-4xl font-bold text-purple-900">
            בחירת קבוצה מתחילה
          </h1>
          <Sparkles className="h-8 w-8 text-purple-600 animate-sparkle" />
        </div>
        <p className="text-lg text-muted-foreground">
          {animationStep === 'spinning' && 'מגריל קבוצה מתחילה...'}
          {animationStep === 'selected' && 'הקבוצה הנבחרת היא:'}
        </p>
      </div>

      <div className="grid gap-4 w-full max-w-md">
        {gameState.teams.map((team, index) => {
          const isHighlighted = highlightedTeamIndex === index;
          const isSelected = animationStep === 'selected' && index === gameState.currentTeamIndex;
          
          return (
            <Card
              key={team.id}
              className={`
                p-6 text-center transition-all duration-300 transform relative overflow-hidden
                ${isHighlighted && animationStep === 'spinning' 
                  ? 'scale-105 bg-gradient-to-r from-yellow-200 to-orange-200 border-yellow-400 shadow-lg' 
                  : ''
                }
                ${isSelected 
                  ? 'scale-110 bg-gradient-to-r from-green-200 to-emerald-200 border-green-400 shadow-xl animate-pulse-gentle' 
                  : ''
                }
                ${!isHighlighted && !isSelected 
                  ? 'bg-gray-50 border-gray-200' 
                  : ''
                }
              `}
            >
              {isSelected && (
                <div className="absolute inset-0 bg-gradient-to-r from-green-300/20 to-emerald-300/20 animate-pulse"></div>
              )}
              
              <div className="relative z-10 flex items-center justify-center gap-3">
                {isSelected && <Crown className="h-6 w-6 text-yellow-600" />}
                <span className={`text-xl font-bold ${isSelected ? 'text-green-800' : 'text-gray-700'}`}>
                  {team.name}
                </span>
                {isSelected && <Crown className="h-6 w-6 text-yellow-600" />}
              </div>

              {isSelected && (
                <Badge 
                  variant="outline" 
                  className="mt-3 bg-green-100 text-green-800 border-green-300"
                >
                  קבוצה מתחילה!
                </Badge>
              )}
            </Card>
          );
        })}
      </div>

      {animationStep === 'selected' && (
        <div className="mt-8 text-center animate-fade-in">
          <div className="text-2xl font-bold text-green-700 mb-2">
            🎉 {selectedTeam.name} מתחילה! 🎉
          </div>
          <p className="text-muted-foreground">
            מיד מתחילים...
          </p>
        </div>
      )}
    </div>
  );
};

export default TeamSelectionScreen; 