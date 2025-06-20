
import React, { useState } from 'react';
import { useGameState } from '../../hooks/useGameState';
import { useAudio } from '../../hooks/useAudio';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Slider } from '../ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Plus, Shuffle } from 'lucide-react';
import notesData from '../../data/notes.json';

const NotesSetup: React.FC = () => {
  const { gameState, setNotes } = useGameState();
  const { playButtonClick } = useAudio();
  
  // Category selection state
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['movies', 'people']);
  const [noteCount, setNoteCount] = useState([30]);
  
  // Custom notes state
  const [customNotes, setCustomNotes] = useState<string[]>([]);
  const [newNote, setNewNote] = useState('');
  const [setupMethod, setSetupMethod] = useState<'categories' | 'custom'>('categories');

  const generateFromCategories = () => {
    const availableNotes = notesData.notes.filter(note => 
      note.categories.some(cat => selectedCategories.includes(cat))
    );
    
    const shuffled = [...availableNotes].sort(() => Math.random() - 0.5);
    const selectedNotes = shuffled.slice(0, noteCount[0]);
    
    setNotes(selectedNotes);
    playButtonClick();
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId]);
    } else {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    }
  };

  const addCustomNote = () => {
    if (newNote.trim() && !customNotes.includes(newNote.trim())) {
      const updatedNotes = [...customNotes, newNote.trim()];
      setCustomNotes(updatedNotes);
      setNotes(updatedNotes.map(note => ({ note, categories: ['custom'] })));
      setNewNote('');
      playButtonClick();
    }
  };

  const removeCustomNote = (index: number) => {
    const updatedNotes = customNotes.filter((_, i) => i !== index);
    setCustomNotes(updatedNotes);
    setNotes(updatedNotes.map(note => ({ note, categories: ['custom'] })));
    playButtonClick();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addCustomNote();
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">הגדרת פתקים</h3>
      
      <Tabs value={setupMethod} onValueChange={(value) => setSetupMethod(value as 'categories' | 'custom')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="categories">בחר קטגוריות</TabsTrigger>
          <TabsTrigger value="custom">שחקנים כותבים</TabsTrigger>
        </TabsList>
        
        <TabsContent value="categories" className="space-y-4">
          <div className="space-y-3">
            <Label>בחר קטגוריות</Label>
            <div className="grid grid-cols-2 gap-2">
              {notesData.categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Checkbox
                    id={category.id}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                  />
                  <Label htmlFor={category.id} className="text-sm">
                    {category.name_he}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <Label>מספר פתקים: {noteCount[0]}</Label>
            <Slider
              value={noteCount}
              onValueChange={setNoteCount}
              min={15}
              max={60}
              step={5}
              className="w-full"
            />
          </div>
          
          <Button
            onClick={generateFromCategories}
            disabled={selectedCategories.length === 0}
            className="game-button-primary w-full"
          >
            <Shuffle className="ml-2 h-4 w-4" />
            צור פתקים מהקטגוריות
          </Button>
        </TabsContent>
        
        <TabsContent value="custom" className="space-y-4">
          <div className="space-y-3">
            <Label htmlFor="custom-note">הוסף פתק חדש</Label>
            <div className="flex gap-2">
              <Input
                id="custom-note"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="כתוב פתק..."
                className="flex-1"
              />
              <Button
                onClick={addCustomNote}
                disabled={!newNote.trim() || customNotes.includes(newNote.trim())}
                size="icon"
                className="game-button-primary"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>פתקים במשחק ({customNotes.length})</Label>
            {customNotes.length === 0 ? (
              <Card className="p-4 text-center text-muted-foreground">
                לא נוספו פתקים עדיין
              </Card>
            ) : (
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {customNotes.map((note, index) => (
                  <Card key={index} className="p-2 flex items-center justify-between">
                    <span className="text-sm">*** (פתק מוסתר)</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeCustomNote(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      הסר
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <Card className="p-4 bg-blue-50">
        <div className="text-center">
          <p className="font-medium text-blue-900">
            מוכן למשחק: {gameState.notes.length} פתקים
          </p>
          {gameState.notes.length < 15 && (
            <p className="text-sm text-blue-700 mt-1">
              מומלץ לפחות 15 פתקים למשחק מהנה
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default NotesSetup;
