
import React, { useEffect } from 'react';
import GameScreen from '../components/GameScreen';
import { GameStateProvider } from '../hooks/useGameState';

const Index = () => {
  useEffect(() => {
    // Set page title and direction
    document.title = 'פתקיות - משחק קבוצות';
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'he');
  }, []);

  return (
    <GameStateProvider>
      <GameScreen />
    </GameStateProvider>
  );
};

export default Index;
