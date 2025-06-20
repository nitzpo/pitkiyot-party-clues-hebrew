
import React, { useEffect } from 'react';
import { useGameState } from '../hooks/useGameState';
import { useAudio } from '../hooks/useAudio';
import HomeScreen from './screens/HomeScreen';
import SetupScreen from './screens/SetupScreen';
import ReadyScreen from './screens/ReadyScreen';
import GameplayScreen from './screens/GameplayScreen';
import TurnEndScreen from './screens/TurnEndScreen';
import StageEndScreen from './screens/StageEndScreen';
import GameEndScreen from './screens/GameEndScreen';

const GameScreen: React.FC = () => {
  const { gameState, decrementTimer } = useGameState();
  const { playTick, playUrgentTick } = useAudio();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameState.isPlaying && gameState.turnTimeLeft > 0) {
      interval = setInterval(() => {
        decrementTimer();
        
        if (gameState.turnTimeLeft <= 10) {
          playUrgentTick();
        } else {
          playTick();
        }
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [gameState.isPlaying, gameState.turnTimeLeft, decrementTimer, playTick, playUrgentTick]);

  const renderScreen = () => {
    switch (gameState.gamePhase) {
      case 'setup':
        return <SetupScreen />;
      case 'ready':
        return <ReadyScreen />;
      case 'playing':
        return <GameplayScreen />;
      case 'turnEnd':
        return <TurnEndScreen />;
      case 'stageEnd':
        return <StageEndScreen />;
      case 'gameEnd':
        return <GameEndScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 rtl hebrew-text">
      {renderScreen()}
    </div>
  );
};

export default GameScreen;
