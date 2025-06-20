# Changelog

## [Unreleased] - 2024-12-19

### 🆕 Latest Updates (Most Recent)

#### Mobile Scrolling & Layout Fixes 
- **Fixed**: Mobile vertical scrolling issues completely eliminated
- **Updated**: GameplayScreen to use `h-dvh` instead of `h-screen` for proper mobile height
- **Enhanced**: Mobile-specific layout optimizations with reduced padding and margins
- **Added**: Comprehensive mobile CSS rules to prevent overscroll and bouncing
- **Improved**: Button and text sizing for mobile devices with responsive breakpoints
- **Fixed**: Body and HTML overflow settings to prevent unwanted scrolling
- **Optimized**: Mobile viewport height handling for browsers with dynamic UI elements
- **Added**: `overscroll-behavior: none` to prevent pull-to-refresh interference

#### Mobile & Audio Experience Enhancements
- **Fixed**: Custom notes reset buttons layout optimized for mobile screens
- **Removed**: Undo button to prevent button overflow on small screens  
- **Enhanced**: Button sizing with smaller icons and text for mobile compatibility
- **Fixed**: Screen height issues on mobile devices using `h-dvh` instead of `min-h-screen`
- **Improved**: Viewport height now accounts for browser controls (address bar, etc.)
- **Added**: Ticker sound setting in game settings for granular audio control
- **Feature**: Ticker sound automatically enables/disables with main sound setting
- **Enhanced**: Sound management with persistent settings stored in localStorage
- **Optimized**: Mobile layout across all game screens for better usability

#### Advanced Audio Settings
- **Added**: Separate ticker sound toggle in settings screen
- **Feature**: Ticker sounds (playTick/playUrgentTick) can be disabled while keeping other sounds
- **Enhanced**: Settings automatically link - ticker enables when sound is on, disables when sound is off
- **Added**: Persistent audio preferences stored in localStorage
- **Improved**: Sound control with individual setting for each audio type
- **Added**: Clock icon for ticker sound setting for better visual identification

#### Mobile Responsiveness Improvements  
- **Updated**: All game screens now use `h-dvh` for proper mobile height calculation
- **Fixed**: HomeScreen, SetupScreen, ReadyScreen, TurnEndScreen, StageEndScreen, GameEndScreen, RulesScreen, SettingsScreen
- **Enhanced**: Better mobile experience with screen that fits visible viewport area
- **Optimized**: Touch interaction and screen real estate usage on mobile devices

### 🆕 Earlier Updates

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
- **Added**: `GameStateProvider`