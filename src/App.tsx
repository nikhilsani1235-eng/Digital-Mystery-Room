/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useGameState } from './hooks/useGameState';
import { Navbar } from './components/Navbar';
import { LandingView } from './components/LandingView';
import { GameHubView } from './components/GameHubView';
import { StoryView } from './components/StoryView';
import { RoomView } from './components/RoomView';
import { ObjectModal } from './components/ObjectModal';
import { ClueInventoryModal } from './components/ClueInventoryModal';
import { HintModal } from './components/HintModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { AboutProjectModal } from './components/AboutProjectModal';
import { VictoryModal } from './components/VictoryModal';
import { GameOverModal } from './components/GameOverModal';
import { NotificationToast } from './components/NotificationToast';

export default function App() {
  const {
    progress,
    rooms,
    currentRoomId,
    activeObject,
    activePuzzleId,
    isInventoryOpen,
    isHintModalOpen,
    isHowToPlayOpen,
    isAboutOpen,
    activeNotification,
    setActiveObject,
    setActivePuzzleId,
    setIsInventoryOpen,
    setIsHintModalOpen,
    setIsHowToPlayOpen,
    setIsAboutOpen,
    selectRoom,
    startNewGame,
    continueSavedGame,
    hasSavedGame,
    resetRoom,
    setScreen,
    toggleSound,
    inspectObject,
    solvePuzzle,
    useHint,
    calculateScoreBreakdown,
  } = useGameState();

  const handleOpenHintForPuzzle = (puzzleId: number) => {
    setActivePuzzleId(puzzleId);
    setIsHintModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 3-Zone Top Navigation Bar */}
      <Navbar
        progress={progress}
        onToggleSound={toggleSound}
        onOpenInventory={() => setIsInventoryOpen(true)}
        onOpenHints={() => {
          setActivePuzzleId(null);
          setIsHintModalOpen(true);
        }}
        onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onNavigateHome={() => setScreen('LANDING')}
        onNavigateHub={() => setScreen('HUB')}
      />

      {/* Main Screen Views */}
      <div className="flex-1 flex flex-col">
        {progress.screen === 'LANDING' && (
          <LandingView
            progress={progress}
            hasSavedGame={hasSavedGame()}
            onStartNewGame={() => setScreen('HUB')}
            onContinueGame={continueSavedGame}
            onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
            onOpenAbout={() => setIsAboutOpen(true)}
          />
        )}

        {progress.screen === 'HUB' && (
          <GameHubView
            roomsProgress={rooms}
            currentRoomId={currentRoomId}
            onSelectRoom={(roomId) => selectRoom(roomId)}
            onBackToHome={() => setScreen('LANDING')}
            onResetRoom={(roomId) => resetRoom(roomId)}
          />
        )}

        {progress.screen === 'STORY' && (
          <StoryView
            roomId={currentRoomId}
            initialDifficulty={progress.difficulty}
            onStartInvestigation={(difficulty) => {
              startNewGame(difficulty);
              setScreen('ROOM');
            }}
            onBackToHub={() => setScreen('HUB')}
          />
        )}

        {(progress.screen === 'ROOM' ||
          progress.screen === 'VICTORY' ||
          progress.screen === 'GAME_OVER') && (
          <RoomView
            progress={progress}
            onInspectObject={inspectObject}
            onOpenInventory={() => setIsInventoryOpen(true)}
            onOpenHints={() => setIsHintModalOpen(true)}
            onBackToHub={() => setScreen('HUB')}
          />
        )}
      </div>

      {/* Modals & Dialogs */}
      {activeObject && (
        <ObjectModal
          objectInfo={activeObject}
          progress={progress}
          onClose={() => setActiveObject(null)}
          onSolvePuzzle={(pid) => {
            solvePuzzle(pid);
          }}
          onOpenHint={(pid) => handleOpenHintForPuzzle(pid)}
          onOpenInventory={() => {
            setActiveObject(null);
            setIsInventoryOpen(true);
          }}
        />
      )}

      <ClueInventoryModal
        isOpen={isInventoryOpen}
        discoveredClueIds={progress.discoveredClueIds}
        currentRoomId={progress.currentRoomId}
        onClose={() => setIsInventoryOpen(false)}
      />

      <HintModal
        isOpen={isHintModalOpen}
        progress={progress}
        activePuzzleId={activePuzzleId}
        onClose={() => setIsHintModalOpen(false)}
        onUseHint={useHint}
      />

      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />

      <AboutProjectModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      {/* Victory Screen Modal */}
      {progress.screen === 'VICTORY' && (
        <VictoryModal
          progress={progress}
          scoreBreakdown={calculateScoreBreakdown()}
          onPlayAgain={() => {
            resetRoom(currentRoomId);
            setScreen('STORY');
          }}
          onBackToHub={() => {
            setScreen('HUB');
          }}
          onReturnHome={() => {
            setScreen('LANDING');
          }}
        />
      )}

      {/* Game Over Screen Modal */}
      {progress.screen === 'GAME_OVER' && (
        <GameOverModal
          onRestart={() => {
            resetRoom(currentRoomId);
            setScreen('ROOM');
          }}
          onBackToHub={() => {
            setScreen('HUB');
          }}
          onReturnHome={() => {
            setScreen('LANDING');
          }}
        />
      )}

      {/* Interactive Alerts Toast */}
      <NotificationToast notification={activeNotification} />
    </div>
  );
}
