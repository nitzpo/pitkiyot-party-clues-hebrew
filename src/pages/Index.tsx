
import React, { useEffect } from 'react';
import GameScreen from '../components/GameScreen';

const Index = () => {
  useEffect(() => {
    // Set page title and direction
    document.title = 'פתקיות - משחק קבוצות';
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'he');
  }, []);

  return <GameScreen />;
};

export default Index;
