import React, { useState, useEffect } from 'react';
import { useGameState } from '../../hooks/useGameState';
import { useAudio } from '../../hooks/useAudio';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { Plus, X, Edit2, Save, RotateCcw } from 'lucide-react';

const TeamSetup: React.FC = () => {
  const { gameState, addTeam, removeTeam, updateTeamName } = useGameState();
  const { playButtonClick } = useAudio();
  const [newTeamName, setNewTeamName] = useState('');
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  // Load saved team names on component mount
  useEffect(() => {
    const savedTeams = localStorage.getItem('pitkiyot-team-names');
    if (savedTeams && gameState.teams.length === 0) {
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
  }, [addTeam, gameState.teams.length]);

  // Save team names to localStorage
  const saveTeamNames = () => {
    const teamNames = gameState.teams.map(team => team.name);
    localStorage.setItem('pitkiyot-team-names', JSON.stringify(teamNames));
    playButtonClick();
  };

  // Load team names from localStorage
  const loadTeamNames = () => {
    const savedTeams = localStorage.getItem('pitkiyot-team-names');
    if (savedTeams) {
      try {
        const teamNames: string[] = JSON.parse(savedTeams);
        
        // Clear current teams
        gameState.teams.forEach(team => {
          removeTeam(team.id);
        });
        
        // Add saved teams
        teamNames.forEach(name => {
          if (name.trim()) {
            addTeam(name.trim());
          }
        });
        
        playButtonClick();
      } catch (error) {
        console.error('Failed to load saved team names:', error);
      }
    }
  };

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

  const handleEditStart = (teamId: string, currentName: string) => {
    setEditingTeamId(teamId);
    setEditingName(currentName);
  };

  const handleEditSave = () => {
    if (editingTeamId && editingName.trim()) {
      updateTeamName(editingTeamId, editingName.trim());
      setEditingTeamId(null);
      setEditingName('');
    }
  };

  const handleEditCancel = () => {
    setEditingTeamId(null);
    setEditingName('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">הגדרת קבוצות</h3>
        <div className="flex gap-2">
          <Button
            onClick={saveTeamNames}
            size="sm"
            variant="outline"
            className="text-xs"
            disabled={gameState.teams.length === 0}
          >
            <Save className="h-3 w-3 ml-1" />
            שמור
          </Button>
          <Button
            onClick={loadTeamNames}
            size="sm"
            variant="outline"
            className="text-xs"
          >
            <RotateCcw className="h-3 w-3 ml-1" />
            טען
          </Button>
        </div>
      </div>
      
      <div className="space-y-3">
        <Label htmlFor="team-name">הוסף קבוצה חדשה</Label>
        <div className="flex gap-2">
          <Input
            id="team-name"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="שם הקבוצה..."
            className="flex-1"
          />
          <Button
            onClick={handleAddTeam}
            disabled={!newTeamName.trim()}
            size="icon"
            className="game-button-primary"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>קבוצות במשחק ({gameState.teams.length})</Label>
        {gameState.teams.length === 0 ? (
          <Card className="p-4 text-center text-muted-foreground">
            לא נוספו קבוצות עדיין
          </Card>
        ) : (
          <div className="space-y-2">
            {gameState.teams.map((team, index) => (
              <Card key={team.id} className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-game-primary text-white flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  {editingTeamId === team.id ? (
                    <div className="flex gap-2 flex-1">
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleEditSave()}
                        className="flex-1"
                        autoFocus
                      />
                      <Button size="sm" onClick={handleEditSave} className="game-button-success">
                        ✓
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleEditCancel}>
                        ✕
                      </Button>
                    </div>
                  ) : (
                    <span className="font-medium">{team.name}</span>
                  )}
                </div>
                
                {editingTeamId !== team.id && (
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditStart(team.id, team.name)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => { playButtonClick(); removeTeam(team.id); }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {gameState.teams.length < 2 && (
        <p className="text-sm text-orange-600 text-center">
          נדרשות לפחות 2 קבוצות כדי להתחיל
        </p>
      )}
    </div>
  );
};

export default TeamSetup;
