import React, { useState, useEffect } from 'react';
import { useGameState } from '../../hooks/useGameState';
import { useAudio } from '../../hooks/useAudio';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { ArrowRight, Volume2, VolumeX, Clock } from 'lucide-react';

const SettingsScreen: React.FC = () => {
  const { updateGameState } = useGameState();
  const { playButtonClick } = useAudio();
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('soundEnabled');
    return saved ? JSON.parse(saved) : true;
  });
  const [tickerEnabled, setTickerEnabled] = useState(() => {
    const saved = localStorage.getItem('tickerEnabled');
    return saved ? JSON.parse(saved) : true;
  });
  const [hapticEnabled, setHapticEnabled] = useState(() => {
    const saved = localStorage.getItem('hapticEnabled');
    return saved ? JSON.parse(saved) : true;
  });

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('soundEnabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('tickerEnabled', JSON.stringify(tickerEnabled));
  }, [tickerEnabled]);

  useEffect(() => {
    localStorage.setItem('hapticEnabled', JSON.stringify(hapticEnabled));
  }, [hapticEnabled]);

  const handleSoundChange = (enabled: boolean) => {
    setSoundEnabled(enabled);
    // When sound is turned on, enable ticker by default
    // When sound is turned off, disable ticker
    if (enabled) {
      setTickerEnabled(true);
    } else {
      setTickerEnabled(false);
    }
  };

  const handleTickerChange = (enabled: boolean) => {
    // Only allow ticker to be changed if sound is enabled
    if (soundEnabled) {
      setTickerEnabled(enabled);
    }
  };

  const handleBack = () => {
    playButtonClick();
    updateGameState({ gamePhase: 'home' });
  };

  return (
    <div className="h-dvh flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 animate-slide-in-right">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-center mb-2">הגדרות</h2>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                <Label htmlFor="sound-toggle" className="text-base">
                  צלילים
                </Label>
              </div>
              <Switch
                id="sound-toggle"
                checked={soundEnabled}
                onCheckedChange={handleSoundChange}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Clock className="h-5 w-5" />
                <Label htmlFor="ticker-toggle" className="text-base">
                  צליל טיק טק
                </Label>
              </div>
              <Switch
                id="ticker-toggle"
                checked={tickerEnabled}
                onCheckedChange={handleTickerChange}
                disabled={!soundEnabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="h-5 w-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                <Label htmlFor="haptic-toggle" className="text-base">
                  רטט
                </Label>
              </div>
              <Switch
                id="haptic-toggle"
                checked={hapticEnabled}
                onCheckedChange={setHapticEnabled}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="font-semibold text-muted-foreground">מידע על המשחק</h3>
            <div className="text-sm space-y-1 text-muted-foreground">
              <p>גרסה: 1.0.0</p>
              <p>פותח עבור משחקי קבוצות</p>
              <p>תמיכה בעברית ו-RTL</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleBack}
            className="game-button-primary"
          >
            <ArrowRight className="mr-2 h-4 w-4" />
            חזור לתפריט הראשי
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SettingsScreen;
