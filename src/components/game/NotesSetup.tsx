import React, { useState, useEffect } from 'react';
import { useGameState } from '../../hooks/useGameState';
import { useAudio } from '../../hooks/useAudio';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Slider } from '../ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Plus, Shuffle, Save, RotateCcw } from 'lucide-react';
import notesData from '../../data/notes.json';

interface SavedGameSettings {
  selectedCategories: string[];
  customNotes: string[];
  noteCount: number;
  setupMethod: 'categories' | 'custom' | 'mixed';
}

const NotesSetup: React.FC = () => {
  const { gameState, setNotes } = useGameState();
  const { playButtonClick } = useAudio();
  
  // Category selection state
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['movies', 'people']);
  const [noteCount, setNoteCount] = useState([30]);
  
  // Custom notes state
  const [customNotes, setCustomNotes] = useState<string[]>([]);
  const [newNote, setNewNote] = useState('');
  const [setupMethod, setSetupMethod] = useState<'categories' | 'custom' | 'mixed'>('categories');
  const [noteExistsError, setNoteExistsError] = useState(false);

  // Load saved settings on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('pitkiyot-game-settings');
    if (savedSettings) {
      try {
        const settings: SavedGameSettings = JSON.parse(savedSettings);
        setSelectedCategories(settings.selectedCategories || ['movies', 'people']);
        setCustomNotes(settings.customNotes || []);
        setNoteCount([settings.noteCount || 30]);
        setSetupMethod(settings.setupMethod || 'categories');
      } catch (error) {
        console.error('Failed to load saved settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = () => {
    const settings: SavedGameSettings = {
      selectedCategories,
      customNotes,
      noteCount: noteCount[0],
      setupMethod
    };
    localStorage.setItem('pitkiyot-game-settings', JSON.stringify(settings));
    playButtonClick();
  };

  // Load settings from localStorage
  const loadSettings = () => {
    const savedSettings = localStorage.getItem('pitkiyot-game-settings');
    if (savedSettings) {
      try {
        const settings: SavedGameSettings = JSON.parse(savedSettings);
        setSelectedCategories(settings.selectedCategories || ['movies', 'people']);
        setCustomNotes(settings.customNotes || []);
        setNoteCount([settings.noteCount || 30]);
        setSetupMethod(settings.setupMethod || 'categories');
        playButtonClick();
      } catch (error) {
        console.error('Failed to load saved settings:', error);
      }
    }
  };

  const generateFromCategories = () => {
    const availableNotes = notesData.notes.filter(note => 
      note.categories.some(cat => selectedCategories.includes(cat))
    );
    
    const shuffled = [...availableNotes].sort(() => Math.random() - 0.5);
    const selectedNotes = shuffled.slice(0, noteCount[0]);
    
    setNotes(selectedNotes);
    saveSettings(); // Auto-save when generating notes
    playButtonClick();
  };

  const generateMixedNotes = () => {
    const availableNotes = notesData.notes.filter(note => 
      note.categories.some(cat => selectedCategories.includes(cat))
    );
    
    const shuffled = [...availableNotes].sort(() => Math.random() - 0.5);
    const categoryNotes = shuffled.slice(0, Math.max(0, noteCount[0] - customNotes.length));
    const customNotesFormatted = customNotes.map(note => ({ note, categories: ['custom'] }));
    
    setNotes([...categoryNotes, ...customNotesFormatted]);
    saveSettings(); // Auto-save when generating notes
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
    if (newNote.trim()) {
      if (customNotes.includes(newNote.trim())) {
        setNoteExistsError(true);
        setTimeout(() => setNoteExistsError(false), 3000);
        return;
      }
      
      const updatedNotes = [...customNotes, newNote.trim()];
      setCustomNotes(updatedNotes);
      
      if (setupMethod === 'custom') {
        setNotes(updatedNotes.map(note => ({ note, categories: ['custom'] })));
      }
      
      setNewNote('');
      setNoteExistsError(false);
      playButtonClick();
    }
  };

  const removeCustomNote = (index: number) => {
    const updatedNotes = customNotes.filter((_, i) => i !== index);
    setCustomNotes(updatedNotes);
    
    if (setupMethod === 'custom') {
      setNotes(updatedNotes.map(note => ({ note, categories: ['custom'] })));
    }
    
    playButtonClick();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addCustomNote();
    }
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewNote(e.target.value);
    if (noteExistsError) {
      setNoteExistsError(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">הגדרת פתקים</h3>
        <div className="flex gap-2">
          <Button
            onClick={saveSettings}
            size="sm"
            variant="outline"
            className="text-xs"
          >
            <Save className="h-3 w-3 ml-1" />
            שמור
          </Button>
          <Button
            onClick={loadSettings}
            size="sm"
            variant="outline"
            className="text-xs"
          >
            <RotateCcw className="h-3 w-3 ml-1" />
            טען
          </Button>
        </div>
      </div>
      
      <Tabs value={setupMethod} onValueChange={(value) => setSetupMethod(value as 'categories' | 'custom' | 'mixed')}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="categories">בחר קטגוריות</TabsTrigger>
          <TabsTrigger value="custom">שחקנים כותבים</TabsTrigger>
          <TabsTrigger value="mixed">משלב</TabsTrigger>
        </TabsList>
        
        <TabsContent value="categories" className="space-y-4">
          <div className="space-y-3">
            <Label>בחר קטגוריות</Label>
            <div className="grid grid-cols-2 gap-3">
              {notesData.categories.map((category) => (
                <div key={category.id} className="flex items-center gap-3">
                  <Checkbox
                    id={category.id}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                  />
                  <Label htmlFor={category.id} className="text-sm cursor-pointer">
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
                onChange={handleNoteChange}
                onKeyPress={handleKeyPress}
                placeholder="כתוב פתק..."
                className={`flex-1 ${noteExistsError ? 'border-red-500' : ''}`}
              />
              <Button
                onClick={addCustomNote}
                disabled={!newNote.trim()}
                size="icon"
                className="game-button-primary"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {noteExistsError && (
              <p className="text-sm text-red-600 mt-1">
                המונח הזה כבר קיים ברשימה
              </p>
            )}
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

        <TabsContent value="mixed" className="space-y-4">
          <div className="space-y-3">
            <Label>בחר קטגוריות</Label>
            <div className="grid grid-cols-2 gap-3">
              {notesData.categories.map((category) => (
                <div key={category.id} className="flex items-center gap-3">
                  <Checkbox
                    id={`mixed-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                  />
                  <Label htmlFor={`mixed-${category.id}`} className="text-sm cursor-pointer">
                    {category.name_he}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="mixed-custom-note">הוסף פתקים מותאמים אישית</Label>
            <div className="flex gap-2">
              <Input
                id="mixed-custom-note"
                value={newNote}
                onChange={handleNoteChange}
                onKeyPress={handleKeyPress}
                placeholder="כתוב פתק..."
                className={`flex-1 ${noteExistsError ? 'border-red-500' : ''}`}
              />
              <Button
                onClick={addCustomNote}
                disabled={!newNote.trim()}
                size="icon"
                className="game-button-primary"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {noteExistsError && (
              <p className="text-sm text-red-600 mt-1">
                המונח הזה כבר קיים ברשימה
              </p>
            )}
          </div>

          {customNotes.length > 0 && (
            <div className="space-y-2">
              <Label>פתקים מותאמים אישית ({customNotes.length})</Label>
              <div className="space-y-1 max-h-32 overflow-y-auto">
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
            </div>
          )}
          
          <div className="space-y-3">
            <Label>סה"כ פתקים: {noteCount[0]}</Label>
            <p className="text-sm text-muted-foreground">
              {customNotes.length} פתקים מותאמים אישית + {Math.max(0, noteCount[0] - customNotes.length)} מקטגוריות
            </p>
            <Slider
              value={noteCount}
              onValueChange={setNoteCount}
              min={Math.max(15, customNotes.length)}
              max={60}
              step={5}
              className="w-full"
            />
          </div>
          
          <Button
            onClick={generateMixedNotes}
            disabled={selectedCategories.length === 0 && customNotes.length === 0}
            className="game-button-primary w-full"
          >
            <Shuffle className="ml-2 h-4 w-4" />
            צור פתקים משולבים
          </Button>
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
