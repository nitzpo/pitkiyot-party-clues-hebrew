import React, { useState, useEffect, useRef } from 'react';
import { useGameState } from '../../hooks/useGameState';
import { useAudio } from '../../hooks/useAudio';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Slider } from '../ui/slider';
import { Plus, Shuffle, Trash2, Undo2 } from 'lucide-react';
import notesData from '../../data/notes.json';

interface SavedGameSettings {
  selectedCategories: string[];
  customNotes: string[];
  noteCount: number;
}

const NotesSetup: React.FC = () => {
  const { gameState, setNotes } = useGameState();
  const { playButtonClick } = useAudio();
  
  // State for mixed mode (categories + custom notes)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['movies', 'people']);
  const [noteCount, setNoteCount] = useState([30]);
  const [customNotes, setCustomNotes] = useState<string[]>([]);
  const [newNote, setNewNote] = useState('');
  const [noteExistsError, setNoteExistsError] = useState(false);
  const [lastRemovedNote, setLastRemovedNote] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Load saved settings on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('pitkiyot-game-settings');
    if (savedSettings) {
      try {
        const settings: SavedGameSettings = JSON.parse(savedSettings);
        setSelectedCategories(settings.selectedCategories || ['movies', 'people']);
        setCustomNotes(settings.customNotes || []);
        setNoteCount([settings.noteCount || 30]);
      } catch (error) {
        console.error('Failed to load saved settings:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Auto-save settings whenever they change (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      const settings: SavedGameSettings = {
        selectedCategories,
        customNotes,
        noteCount: noteCount[0]
      };
      localStorage.setItem('pitkiyot-game-settings', JSON.stringify(settings));
    }
  }, [selectedCategories, customNotes, noteCount, isLoaded]);

  const generateMixedNotes = () => {
    const availableNotes = notesData.notes.filter(note => 
      note.categories.some(cat => selectedCategories.includes(cat))
    );
    
    const shuffled = [...availableNotes].sort(() => Math.random() - 0.5);
    const categoryNotes = shuffled.slice(0, Math.max(0, noteCount[0] - customNotes.length));
    const customNotesFormatted = customNotes.map(note => ({ note, categories: ['custom'] }));
    
    setNotes([...categoryNotes, ...customNotesFormatted]);
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
      
      setNewNote('');
      setNoteExistsError(false);
      setLastRemovedNote(null);
      playButtonClick();
      
      // Auto-focus the input field for next note
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const resetCustomNotes = () => {
    if (customNotes.length > 0) {
      setLastRemovedNote(null);
      setCustomNotes([]);
      playButtonClick();
    }
  };

  const undoLastNote = () => {
    if (lastRemovedNote) {
      const updatedNotes = [...customNotes, lastRemovedNote];
      setCustomNotes(updatedNotes);
      setLastRemovedNote(null);
      playButtonClick();
    }
  };

  const removeLastCustomNote = () => {
    if (customNotes.length > 0) {
      const removedNote = customNotes[customNotes.length - 1];
      const updatedNotes = customNotes.slice(0, -1);
      
      setCustomNotes(updatedNotes);
      setLastRemovedNote(removedNote);
      playButtonClick();
    }
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
    <div className="space-y-4 text-right" dir="rtl">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">הגדרת פתקים</h3>
      </div>
      
      <div className="space-y-4">
        {/* Category Selection */}
        <div className="space-y-3">
          <Label className="text-right block">בחר קטגוריות</Label>
          <div className="grid grid-cols-2 gap-3">
            {notesData.categories.map((category) => (
              <div key={category.id} className="flex items-center gap-3 flex-row-reverse">
                <Checkbox
                  id={category.id}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                />
                <Label htmlFor={category.id} className="text-sm cursor-pointer text-right flex-1">
                  {category.name_he}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Notes Input */}
        <div className="space-y-3">
          <Label htmlFor="custom-note" className="text-right block">הוסף פתקים מותאמים אישית</Label>
          <div className="flex gap-2 flex-row-reverse">
            <Button
              onClick={addCustomNote}
              disabled={!newNote.trim()}
              size="icon"
              className="game-button-primary"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Input
              ref={inputRef}
              id="custom-note"
              value={newNote}
              onChange={handleNoteChange}
              onKeyPress={handleKeyPress}
              placeholder="כתוב פתק..."
              className="flex-1 text-right placeholder:text-right"
            />
          </div>
          {noteExistsError && (
            <p className="text-sm text-red-600 mt-1 text-right">
              המונח הזה כבר קיים ברשימה
            </p>
          )}
        </div>

        {/* Custom Notes Management */}
        {customNotes.length > 0 && (
          <div className="space-y-3">
            <div className="flex gap-2 justify-end">
              <Button
                onClick={removeLastCustomNote}
                disabled={customNotes.length === 0}
                size="sm"
                variant="outline"
                className="gap-2 text-xs"
              >
                <Undo2 className="h-3 w-3" />
                מחק אחרון
              </Button>
              
              <Button
                onClick={resetCustomNotes}
                disabled={customNotes.length === 0}
                size="sm"
                variant="destructive"
                className="gap-2 text-xs"
              >
                <Trash2 className="h-3 w-3" />
                איפוס הכל
              </Button>
            </div>
            
            <Card className="p-4 text-center">
              <p className="text-sm text-muted-foreground">
                {customNotes.length} פתקים מותאמים אישית נוצרו
              </p>
            </Card>
          </div>
        )}
        
        {/* Note Count Slider */}
        <div className="space-y-3">
          <Label className="text-right block">סה"כ פתקים: {noteCount[0]}</Label>
          <p className="text-sm text-muted-foreground text-right">
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
        
        {/* Generate Button */}
        <Button
          onClick={generateMixedNotes}
          disabled={selectedCategories.length === 0 && customNotes.length === 0}
          className="game-button-primary w-full"
        >
          <Shuffle className="ml-2 h-4 w-4" />
          צור פתקים למשחק
        </Button>
      </div>
      
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
