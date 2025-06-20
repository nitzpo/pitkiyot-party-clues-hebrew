# Changelog

## [Unreleased] - 2024-12-19

### 🆕 Latest Updates

#### Game Control Enhancements
- **Added**: Pause/Resume functionality during gameplay with visual feedback
- **Added**: Abort game option when paused - return to home screen instantly
- **Added**: Abort game buttons on all explanation screens (Ready, Turn End, Stage End)
- **Enhanced**: Mobile layout optimization with dynamic height control
- **Fixed**: Timer now properly respects pause state and doesn't countdown when paused
- **Improved**: Game controls and timer are now always visible together on mobile

#### User Interface & Experience Improvements
- **Simplified**: Notes setup - removed tabs, now uses unified mixed mode (categories + custom)
- **Fixed**: RTL alignment issues in team setup and notes creation screens
- **Fixed**: Placeholder text alignment in input fields now properly right-aligned
- **Added**: Auto-focus on note input field after adding a note for continuous writing
- **Added**: Enter key support for creating notes in sequence
- **Enhanced**: Custom notes management with "Reset All" and "Undo Last" functionality
- **Improved**: Note input workflow with better error handling and visual feedback

#### Critical Data Persistence Fixes
- **Fixed**: Auto-save timing issue preventing custom notes from being saved
- **Fixed**: Categories selection not persisting between sessions
- **Enhanced**: Auto-save now waits for component initialization before saving
- **Added**: `isLoaded` state to prevent premature localStorage writes
- **Guaranteed**: All user selections (teams, categories, custom notes) now persist correctly

#### Enhanced RTL Support
- **Fixed**: Category checkboxes now properly aligned with RTL text flow
- **Fixed**: Team cards layout with correct RTL positioning
- **Improved**: Label positioning and text alignment throughout
- **Enhanced**: Button order and spacing for Hebrew interface
- **Optimized**: Flex layouts with `flex-row-reverse` for proper RTL flow

#### Data Management & Persistence
- **Removed**: Manual save/load buttons from team setup in favor of automatic persistence
- **Enhanced**: Auto-save functionality for teams - saves immediately when teams are modified
- **Enhanced**: Auto-load functionality for teams - automatically loads last used teams
- **Added**: Real-time auto-save for all game settings (categories, custom notes, note count)
- **Added**: Automatic note shuffling before game starts for fair gameplay
- **Enhanced**: Persistent storage across all game configuration areas

#### Performance & Reliability
- **Added**: Automatic note shuffling when starting games for better randomization
- **Enhanced**: Game state management with better error handling
- **Improved**: Component organization and separation of concerns
- **Optimized**: Mobile responsiveness with better screen height utilization

### 🔧 Critical Fixes

#### React State Management Overhaul
- **Fixed**: Game state not updating across components due to multiple hook instances
- **Changed**: Converted `useGameState` from custom hook to React Context pattern
- **Added**: `GameStateProvider` wrapper component for shared state management
- **Updated**: App structure to properly provide game state context
- **Fixed**: File structure - renamed `useGameState.ts` to `useGameState.tsx` for JSX support

### ✨ New Features

#### Pause/Resume Functionality
- **Added**: Pause button during gameplay to temporarily stop the timer
- **Added**: `isPaused` state to game state management
- **Feature**: Resume gameplay from exact same position when unpausing
- **Enhanced**: Visual feedback shows "המשחק מושהה" when game is paused

#### Auto-Save & Data Persistence
- **Implemented**: Automatic saving of all game settings to localStorage
- **Added**: Auto-load of last used configuration when starting new game
- **Removed**: Manual save/load buttons for streamlined user experience
- **Enhanced**: Real-time persistence of notes, categories, and preferences

#### Mixed Notes System
- **Added**: New unified notes setup combining categories with custom notes
- **Feature**: Combine selected categories with custom notes in a single game
- **Added**: `generateMixedNotes()` function for intelligent note mixing
- **Added**: Visual breakdown showing custom vs category notes count
- **Simplified**: Removed complex tab system in favor of single unified interface

#### Advanced Game Logic
- **Enhanced**: Zero notes handling - games automatically end when no notes remain
- **Added**: `skippedInTurn` property to Note interface for turn-based skip tracking
- **Improved**: Skip functionality - skipped notes return in subsequent turns
- **Added**: Auto-progression when all available notes are used/skipped
- **Added**: Automatic note shuffling for fair and random gameplay

#### Game Control Improvements
- **Added**: Comprehensive abort game functionality across all screens
- **Enhanced**: Mobile layout with proper height management for better visibility
- **Improved**: Game flow with better navigation and exit options

### 🎨 UI/UX Improvements

#### RTL (Hebrew) Language Support
- **Fixed**: Complete right-to-left text alignment throughout the application
- **Fixed**: Switch component RTL positioning with proper translation classes
- **Fixed**: Points display formatting to show "+" on the correct side
- **Fixed**: Category selection spacing using `gap-3` instead of problematic space utilities
- **Enhanced**: Input field placeholder alignment for RTL text
- **Fixed**: Team setup interface with proper RTL flow and alignment

#### Enhanced User Experience
- **Added**: Duplicate prevention for custom notes with error messaging
- **Added**: `noteExistsError` state with 3-second auto-dismiss
- **Added**: Visual feedback with red border on input field for errors
- **Improved**: Checkbox and label spacing with `cursor-pointer` for better interaction
- **Enhanced**: Error handling and user feedback throughout the application
- **Added**: Auto-focus on note input field after adding a note for continuous writing
- **Added**: Enter key support for creating notes in sequence
- **Enhanced**: Custom notes privacy - replaced visible list with management buttons

#### Mobile Optimization
- **Fixed**: Game controls and timer visibility issues on mobile devices
- **Enhanced**: Dynamic height management for better screen utilization
- **Improved**: Touch interactions and responsive design throughout

### 🛠️ Technical Improvements

#### Code Quality & Structure
- **Cleaned**: Removed duplicate `useGameState.ts` file
- **Improved**: Type safety with extended interfaces
- **Enhanced**: Component organization and separation of concerns
- **Added**: Proper error boundaries and state validation
- **Removed**: Manual save/load buttons in favor of automatic persistence
- **Added**: Automatic settings persistence with localStorage integration

#### Performance & Reliability
- **Optimized**: State updates and re-rendering patterns
- **Improved**: Memory management with proper cleanup
- **Enhanced**: Component lifecycle management
- **Added**: Comprehensive error handling for edge cases
- **Optimized**: Mobile performance with better resource management

#### Game Flow Enhancements
- **Enhanced**: Turn progression logic with proper state management
- **Improved**: Stage transitions with better user feedback
- **Added**: Comprehensive game abort functionality
- **Enhanced**: Timer management with pause/resume capabilities

---

## Key Benefits

✅ **Seamless Gameplay**: No more manual save/load - everything persists automatically  
✅ **Better Mobile Experience**: Controls and timer always visible, proper height management  
✅ **Simplified Setup**: Unified notes interface - no confusing tabs  
✅ **Enhanced Control**: Pause/resume and abort game functionality throughout  
✅ **Perfect RTL Support**: Complete Hebrew language optimization  
✅ **Improved UX**: Auto-focus, Enter key support, better error handling  
✅ **Fair Gameplay**: Automatic note shuffling for randomized games

### 🔄 Breaking Changes
- **Changed**: `useGameState` is now a Context consumer instead of a standalone hook
- **Required**: Components using game state must be wrapped with `GameStateProvider`
- **Updated**: Import statements for `useGameState` hook

### 📝 Additional Improvements

#### Auto-Save & Data Persistence
- **Implemented**: Automatic saving of all game settings to localStorage
- **Added**: Auto-load of last used configuration when starting new game
- **Removed**: Manual save/load buttons for streamlined user experience
- **Enhanced**: Real-time persistence of notes, categories, and preferences

#### Note Management Enhancements
- **Improved**: Custom notes interface with better privacy protection
- **Added**: "Reset All" button to clear all custom notes
- **Added**: "Undo Last" functionality for accidental note removal
- **Enhanced**: Note input workflow with auto-focus and Enter key support
- **Added**: Automatic note shuffling for fair gameplay

#### Game Control Improvements
- **Added**: Pause/resume functionality during active gameplay
- **Improved**: Timer behavior with pause state management
- **Enhanced**: Mobile-responsive design for better accessibility

---

### Migration Guide for Developers

If you're updating from the previous version:

1. Ensure your main App component wraps game components with `<GameStateProvider>`
2. Update any direct `useGameState` imports - the hook is now a Context consumer
3. Remove any old `useGameState.ts` file references
4. Test RTL layout if your app supports Hebrew/Arabic languages

### Contributors
- AI Assistant: Complete refactor and feature implementation
- User: Feature requirements, testing, and validation

---

*This changelog follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format.* 