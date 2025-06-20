import React from 'react';
import { useGameState } from '../../hooks/useGameState';
import { useAudio } from '../../hooks/useAudio';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Home } from 'lucide-react';

const ReadyScreen: React.FC = () => {
  const { gameState, startTurn, updateGameState } = useGameState();
  const { playButtonClick } = useAudio();

  const currentTeam = gameState.teams[gameState.currentTeamIndex];
  const stageNames = ['', 'דיבור חופשי', 'מילה אחת', 'פנטומימה'];
  const stageDescriptions = [
    '',
    'תאר את הפתק במילים - אסור לומר את הפתק או חלק ממנו',
    'רק מילה אחת לכל פתק - אפשר לחזור על המילה בטונים שונים',
    'רק תנועות גוף - אסור לדבר או להוציא קולות'
  ];

  const unguessedNotes = gameState.notes.filter(note => !note.guessed);

  const handleReady = () => {
    playButtonClick();
    startTurn();
  };

  const handleAbortGame = () => {
    playButtonClick();
    updateGameState({ gamePhase: 'home' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg text-center p-8 animate-slide-in-left">
        <div className="mb-6">
          <Badge variant="outline" className="mb-4 text-lg px-4 py-2">
            שלב {gameState.currentStage} • {stageNames[gameState.currentStage]}
          </Badge>
          
          <h2 className="text-2xl font-bold mb-2">
            תורה של {currentTeam.name}
          </h2>
          
          <p className="text-muted-foreground mb-4">
            {unguessedNotes.length} פתקים נותרו
          </p>
        </div>

        <Card className="p-4 mb-6 bg-blue-50">
          <h3 className="font-semibold mb-2 text-blue-900">חוקי השלב:</h3>
          <p className="text-blue-800 text-sm">
            {stageDescriptions[gameState.currentStage]}
          </p>
        </Card>

        <div className="mb-6">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-semibold text-green-600">נכון</div>
              <div>+1 נקודה</div>
            </div>
            <div>
              <div className="font-semibold text-orange-600">דלג</div>
              <div>-1 נקודה</div>
            </div>
            <div>
              <div className="font-semibold text-blue-600">זמן</div>
              <div>60 שניות</div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleReady}
            className="game-button-success w-full text-2xl py-6"
          >
            מוכן/ה? התחל!
          </Button>

          <Button
            onClick={handleAbortGame}
            variant="outline"
            className="w-full gap-2"
          >
            <Home className="h-4 w-4" />
            יציאה למסך הבית
          </Button>
        </div>

        <div className="mt-6 text-xs text-muted-foreground">
          העבר את הטלפון לשחקן שנותן רמזים
        </div>
      </Card>
    </div>
  );
};

export default ReadyScreen;
