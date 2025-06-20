
import React from 'react';
import { useGameState } from '../../hooks/useGameState';
import { useAudio } from '../../hooks/useAudio';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { ArrowRight } from 'lucide-react';

const RulesScreen: React.FC = () => {
  const { updateGameState } = useGameState();
  const { playButtonClick } = useAudio();

  const handleBack = () => {
    playButtonClick();
    updateGameState({ gamePhase: 'home' });
  };

  return (
    <div className="h-dvh flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-6 animate-slide-in-right">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-center mb-6">חוקי המשחק</h2>
        </div>

        <div className="space-y-6 text-right">
          <div>
            <h3 className="text-xl font-semibold mb-3 text-game-primary">מטרת המשחק</h3>
            <p className="text-muted-foreground leading-relaxed">
              המטרה היא לנחש כמה שיותר פתקים במהלך שלושה שלבים. כל שלב מגביל את אופן המתן הרמזים.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3 text-game-primary">שלבי המשחק</h3>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">שלב 1: דיבור חופשי</h4>
                <p className="text-blue-800 text-sm">
                  ניתן לתאר את הפתק במילים חופשיות, אסור לומר את המילה עצמה או חלק ממנה.
                </p>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-900 mb-2">שלב 2: מילה אחת</h4>
                <p className="text-orange-800 text-sm">
                  מותר לומר רק מילה אחת לכל פתק. ניתן לחזור על המילה בטונים שונים.
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">שלב 3: פנטומימה</h4>
                <p className="text-green-800 text-sm">
                  מותר רק להשתמש בתנועות גוף וחיקוי. אסור להוציא קולות או להצביע על חפצים.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3 text-game-primary">ניקוד</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• נחש נכון: +1 נקודה</li>
              <li>• דילוג: -1 נקודה</li>
              <li>• הפרת חוק: -1 נקודה (נחשב כדילוג)</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3 text-game-primary">זכייה</h3>
            <p className="text-muted-foreground">
              הקבוצה עם הניקוד הגבוה ביותר בסיום שלושת השלבים מנצחת!
            </p>
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

export default RulesScreen;
