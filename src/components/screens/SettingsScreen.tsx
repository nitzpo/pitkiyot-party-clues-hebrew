
import React, { useState } from 'react';
import { useGameState } from '../../hooks/useGameState';
import { useAudio } from '../../hooks/useAudio';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { ArrowRight, Volume2, VolumeX } from 'lucide-react';

const SettingsScreen: React.FC = () => {
  const { updateGameState } = useGameState();
  const { playButtonClick } = useAudio();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);

  const handleBack = () => {
    playButtonClick();
    updateGameState({ gamePhase: 'home' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
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
                onCheckedChange={setSoundEnabled}
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
