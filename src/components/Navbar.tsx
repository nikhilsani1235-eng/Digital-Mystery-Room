/**
 * Top Navigation Bar
 * Follows the 3-Zone Contract: Brand Wordmark | Nav Links & Counters | Primary Actions
 * Supports multi-room navigation and Mystery Game Hub routing.
 */

import React from 'react';
import { GameProgress } from '../types/game';
import { getRoomDefinition } from '../data/gameData';
import { Volume2, VolumeX, KeyRound, HelpCircle, Info, BookOpen, Clock, LayoutGrid } from 'lucide-react';

interface NavbarProps {
  progress: GameProgress;
  onToggleSound: () => void;
  onOpenInventory: () => void;
  onOpenHints: () => void;
  onOpenHowToPlay: () => void;
  onOpenAbout: () => void;
  onNavigateHome: () => void;
  onNavigateHub: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  progress,
  onToggleSound,
  onOpenInventory,
  onOpenHints,
  onOpenHowToPlay,
  onOpenAbout,
  onNavigateHome,
  onNavigateHub,
}) => {
  const activeRoom = getRoomDefinition(progress.currentRoomId);
  const totalClues = activeRoom.clues.length;

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = progress.timeRemaining < 180;
  const isPlaying = progress.screen === 'ROOM';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-500/20 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={onNavigateHome}
          className="font-display text-lg sm:text-xl font-bold tracking-wider text-cyan-400 hover:text-cyan-300 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-sm flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse inline-block" />
          DIGITAL MYSTERY ROOM
        </button>

        {/* Zone 2: Navigation & In-Game Telemetry */}
        <nav className="flex items-center gap-3 sm:gap-5 text-xs sm:text-sm font-medium text-slate-300">
          {/* Mystery Game Hub Link */}
          <button
            onClick={onNavigateHub}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border transition-all text-xs font-mono-code focus-visible:outline-none ${
              progress.screen === 'HUB'
                ? 'border-cyan-400 bg-cyan-950/50 text-cyan-300 font-bold'
                : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 text-cyan-400" />
            <span>Mystery Hub</span>
          </button>

          {isPlaying && (
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md border font-mono-code tabular-nums transition-colors text-xs ${
                isLowTime
                  ? 'border-red-500/60 bg-red-950/40 text-red-400 animate-pulse'
                  : 'border-cyan-500/40 bg-cyan-950/30 text-cyan-300'
              }`}
              title="Time Remaining"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>TIME: {formatTime(progress.timeRemaining)}</span>
            </div>
          )}

          {isPlaying && (
            <button
              onClick={onOpenInventory}
              className="flex items-center gap-1.5 text-slate-300 hover:text-cyan-400 transition-colors whitespace-nowrap focus-visible:outline-none text-xs"
            >
              <KeyRound className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Clues</span>
              <span className="font-mono-code text-xs text-cyan-300">({progress.discoveredClueIds.length}/{totalClues})</span>
            </button>
          )}

          {isPlaying && (
            <button
              onClick={onOpenHints}
              className="flex items-center gap-1.5 text-slate-300 hover:text-cyan-400 transition-colors whitespace-nowrap focus-visible:outline-none text-xs"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Hints</span>
              <span className="font-mono-code text-xs text-amber-300">({progress.hintsRemaining})</span>
            </button>
          )}

          <button
            onClick={onOpenHowToPlay}
            className="hidden md:flex items-center gap-1.5 text-slate-300 hover:text-cyan-400 transition-colors whitespace-nowrap focus-visible:outline-none text-xs"
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            <span>How to Play</span>
          </button>

          <button
            onClick={onOpenAbout}
            className="hidden lg:flex items-center gap-1.5 text-slate-300 hover:text-cyan-400 transition-colors whitespace-nowrap focus-visible:outline-none text-xs"
          >
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>B.Tech Project</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onToggleSound}
            aria-label={progress.soundEnabled ? 'Mute Audio' : 'Enable Audio'}
            className="p-2 rounded-lg border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            title={progress.soundEnabled ? 'Sound FX Enabled' : 'Sound FX Muted'}
          >
            {progress.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {progress.screen !== 'LANDING' && (
            <button
              onClick={onNavigateHome}
              className="px-3 py-1.5 text-xs font-semibold tracking-wide text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 bg-slate-900 rounded-lg transition-colors whitespace-nowrap"
            >
              Main Menu
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
