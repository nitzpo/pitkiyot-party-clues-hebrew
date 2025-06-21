import React, { useState, useEffect } from 'react';
import { useGameState } from '../../hooks/useGameState';
import { useAudio } from '../../hooks/useAudio';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { Plus, X } from 'lucide-react';

const TeamSetup: React.FC = () => {
  const { gameState, addTeam, removeTeam } = useGameState();
  const { playButtonClick } = useAudio();
  const [newTeamName, setNewTeamName] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved team names on component mount
  useEffect(() => {
    // Prevent adding teams if they already exist in the state
    if (isLoaded || gameState.teams.length > 0) {
      setIsLoaded(true);
      return;
    }

    const savedTeams = localStorage.getItem('pitkiyot-team-names');
    if (savedTeams) {
      try {
        const teamNames: string[] = JSON.parse(savedTeams);
        teamNames.forEach(name => {
          if (name.trim()) {
            addTeam(name.trim());
          }
        });
      } catch (error) {
        console.error('Failed to load saved team names:', error);
      }
    }
    setIsLoaded(true);
  }, [addTeam, isLoaded, gameState.teams.length]);

  // Auto-save team names whenever they change
  useEffect(() => {
    if (isLoaded) {
      const teamNames = gameState.teams.map(team => team.name);
      localStorage.setItem('pitkiyot-team-names', JSON.stringify(teamNames));
    }
  }, [gameState.teams, isLoaded]);

  const handleAddTeam = () => {
    if (newTeamName.trim()) {
      playButtonClick();
      addTeam(newTeamName.trim());
      setNewTeamName('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTeam();
    }
  };

  return (
    <div className="space-y-4 text-right" dir="rtl">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">הגדרת קבוצות</h3>
      </div>
      
      <div className="space-y-3">
        <Label htmlFor="team-name" className="text-right block">הוסף קבוצה חדשה</Label>
        <div className="flex gap-2 flex-row-reverse">
          <Button
            onClick={handleAddTeam}
            disabled={!newTeamName.trim()}
            size="icon"
            className="game-button-primary"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Input
            id="team-name"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="שם הקבוצה..."
            className="flex-1 text-right placeholder:text-right"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-right block">קבוצות במשחק ({gameState.teams.length})</Label>
        {gameState.teams.length === 0 ? (
          <Card className="p-4 text-center text-muted-foreground">
            לא נוספו קבוצות עדיין
          </Card>
        ) : (
          <div className="space-y-2">
            {gameState.teams.map((team, index) => (
              <Card key={team.id} className="p-3">
                <div className="flex items-center justify-between">
                  {/* Team info on the right */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-game-primary text-white flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <span className="font-medium">{team.name}</span>
                  </div>
                  
                  {/* Action buttons on the left */}
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => { playButtonClick(); removeTeam(team.id); }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Card className="p-4 bg-green-50">
        <div className="text-center">
          <p className="font-medium text-green-900">
            {gameState.teams.length >= 2 ? 'מוכן למשחק!' : 'נדרשות לפחות 2 קבוצות'}
          </p>
          {gameState.teams.length < 2 && (
            <p className="text-sm text-green-700 mt-1">
              הוסף עוד {2 - gameState.teams.length} להתחלת המשחק
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TeamSetup;
