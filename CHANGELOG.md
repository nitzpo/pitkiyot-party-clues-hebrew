# Changelog

## [Unreleased] - 2024-12-19

### 🔧 Critical Fixes

#### React State Management Overhaul
- **Fixed**: Game state not updating across components due to multiple hook instances
- **Changed**: Converted `useGameState` from custom hook to React Context pattern
- **Added**: `GameStateProvider` wrapper component for shared state management
- **Updated**: App structure to properly provide game state context
- **Fixed**: File structure - renamed `useGameState.ts` to `useGameState.tsx` for JSX support

### ✨ New Features

#### Mixed Notes System
- **Added**: New "משלב" (Mixed) tab in Notes Setup
- **Feature**: Combine selected categories with custom notes in a single game
- **Added**: `generateMixedNotes()` function for intelligent note mixing
- **Added**: Visual breakdown showing custom vs category notes count

#### Advanced Game Logic
- **Enhanced**: Zero notes handling - games automatically end when no notes remain
- **Added**: `skippedInTurn` property to Note interface for turn-based skip tracking
- **Improved**: Skip functionality - skipped notes return in subsequent turns
- **Added**: Auto-progression when all available notes are used/skipped

### 🎨 UI/UX Improvements

#### RTL (Right-to-Left) Language Support
- **Fixed**: Categories alignment and spacing issues in Notes Setup
- **Replaced**: `space-x-2 rtl:space-x-reverse` with `gap-3` for better RTL spacing
- **Fixed**: Settings toggle button RTL positioning in Switch component
- **Added**: `rtl:data-[state=checked]:-translate-x-5` for proper RTL toggle animation
- **Fixed**: Points display formatting - "+" symbol now appears on left side in RTL

#### Enhanced User Experience
- **Added**: Duplicate prevention for custom notes with error messaging
- **Added**: `noteExistsError` state with 3-second auto-dismiss
- **Added**: Visual feedback with red border on input field for errors
- **Improved**: Checkbox and label spacing with `cursor-pointer` for better interaction
- **Enhanced**: Error handling and user feedback throughout the application

### 🛠️ Technical Improvements

#### Code Quality & Structure
- **Cleaned**: Removed duplicate `useGameState.ts` file
- **Improved**: Type safety with extended interfaces
- **Enhanced**: Component organization and separation of concerns
- **Added**: Proper error boundaries and state validation

#### Performance & Reliability
- **Optimized**: State updates and re-rendering patterns
- **Improved**: Memory management with proper cleanup
- **Enhanced**: Component lifecycle management

### 📱 Game Flow Enhancements

#### Turn Management
- **Improved**: Automatic turn progression when no notes available
- **Enhanced**: Skip note functionality with turn-based tracking
- **Added**: Intelligent game state transitions
- **Fixed**: Edge cases in game progression logic

#### Setup Process
- **Streamlined**: Notes selection process with mixed mode
- **Improved**: Category selection validation
- **Enhanced**: Custom notes input with duplicate prevention
- **Added**: Real-time feedback during setup

### 🔄 Breaking Changes
- **Changed**: `useGameState` is now a Context consumer instead of a standalone hook
- **Required**: Components using game state must be wrapped with `GameStateProvider`
- **Updated**: Import statements for `useGameState` hook

### 📝 Prepared Features (Not Yet Implemented)
- **Prepared**: Local storage structure for persistent settings
- **Ready**: Foundation for offline gameplay capabilities

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