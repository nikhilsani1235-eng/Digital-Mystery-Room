/**
 * Main Interactive Game Room View
 * Features visual chamber canvas with interactive hotspots, HUD telemetry, and object investigation stations.
 * Supports all 4 rooms: The Vault, Secret Lab, Cyber Room, Haunted Room.
 */

import React, { useState } from 'react';
import { GameProgress, RoomObjectId, RoomId } from '../types/game';
import { getRoomDefinition } from '../data/gameData';
import {
  DoorClosed,
  Monitor,
  BookOpen,
  Clock,
  Archive,
  Image as ImageIcon,
  Shield,
  Layers,
  FileQuestion,
  FlaskConical,
  Flame,
  ArrowLeft,
  Search,
  Sparkles,
  Zap,
} from 'lucide-react';

interface RoomViewProps {
  progress: GameProgress;
  onInspectObject: (objectId: RoomObjectId) => void;
  onOpenInventory: () => void;
  onOpenHints: () => void;
  onBackToHub: () => void;
}

export const RoomView: React.FC<RoomViewProps> = ({
  progress,
  onInspectObject,
  onOpenInventory,
  onOpenHints,
  onBackToHub,
}) => {
  const [hoveredObjectId, setHoveredObjectId] = useState<RoomObjectId | null>(null);

  const roomConfig = getRoomDefinition(progress.currentRoomId);
  const roomObjects = roomConfig.objects;
  const roomClues = roomConfig.clues;
  const roomPuzzles = roomConfig.puzzles;

  // Icon resolver for objects across all rooms
  const getObjectIcon = (id: RoomObjectId) => {
    if (id.includes('door')) return <DoorClosed className="w-5 h-5" />;
    if (id.includes('computer') || id.includes('terminal')) return <Monitor className="w-5 h-5" />;
    if (id.includes('book') || id.includes('codex') || id.includes('grimoire')) return <BookOpen className="w-5 h-5" />;
    if (id.includes('clock') || id.includes('chronometer')) return <Clock className="w-5 h-5" />;
    if (id.includes('drawer') || id.includes('cabinet') || id.includes('locker')) return <Archive className="w-5 h-5" />;
    if (id.includes('painting') || id.includes('portrait')) return <ImageIcon className="w-5 h-5" />;
    if (id.includes('safe') || id.includes('keypad')) return <Shield className="w-5 h-5" />;
    if (id.includes('test-tube') || id.includes('chemical')) return <FlaskConical className="w-5 h-5" />;
    if (id.includes('altar')) return <Flame className="w-5 h-5" />;
    if (id.includes('table') || id.includes('breadboard')) return <Layers className="w-5 h-5" />;
    return <FileQuestion className="w-5 h-5" />;
  };

  // Calculate room-specific progress percentage
  const puzzleWeight = 65;
  const clueWeight = 35;
  const puzzleRatio = roomPuzzles.length > 0 ? progress.solvedPuzzleIds.length / roomPuzzles.length : 0;
  const clueRatio = roomClues.length > 0 ? progress.discoveredClueIds.length / roomClues.length : 0;
  const totalProgressPercent = Math.min(100, Math.round(puzzleRatio * puzzleWeight + clueRatio * clueWeight));

  const allSubPuzzlesSolved = progress.solvedPuzzleIds.length >= Math.max(1, roomPuzzles.length - 1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top HUD with "BACK TO GAME HUB" and Telemetry */}
      <div className="bg-slate-900/80 border border-cyan-500/30 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Room Wordmark & Back Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHub}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-white transition-all text-xs font-mono-code flex items-center gap-1.5 focus-visible:outline-none"
              title="Return to Mystery Game Hub"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400" />
              <span>BACK TO GAME HUB</span>
            </button>

            <div className="border-l border-slate-800 pl-3">
              <div className="flex items-center gap-1.5">
                <span className="text-base">{roomConfig.icon}</span>
                <h2 className="font-display text-base sm:text-lg font-extrabold text-white tracking-wide">
                  {roomConfig.title}
                </h2>
              </div>
              <span className="text-[10px] font-mono-code text-cyan-400 hidden sm:block">
                {roomConfig.tagline}
              </span>
            </div>
          </div>

          {/* Progress Percent Bar */}
          <div className="flex-1 max-w-md">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="font-display tracking-wider text-slate-200 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                ESCAPE PROGRESS
              </span>
              <span className="font-mono-code text-cyan-400 font-bold">
                {totalProgressPercent}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-teal-300 transition-all duration-500 shadow-sm shadow-cyan-400"
                style={{ width: `${totalProgressPercent}%` }}
              />
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 sm:gap-6 text-xs divide-x divide-slate-800 shrink-0">
            <div className="pl-0 text-slate-300">
              <span className="text-slate-500 block text-[10px] font-mono-code uppercase">Puzzles</span>
              <span className="font-mono-code text-sm font-bold text-cyan-300">
                {progress.solvedPuzzleIds.length} / {roomPuzzles.length}
              </span>
            </div>

            <div className="pl-4 text-slate-300">
              <span className="text-slate-500 block text-[10px] font-mono-code uppercase">Clues</span>
              <span className="font-mono-code text-sm font-bold text-purple-300">
                {progress.discoveredClueIds.length} / {roomClues.length}
              </span>
            </div>

            <div className="pl-4 text-slate-300">
              <span className="text-slate-500 block text-[10px] font-mono-code uppercase">Hints</span>
              <span className="font-mono-code text-sm font-bold text-amber-300">
                {progress.hintsRemaining} Left
              </span>
            </div>

            <div className="pl-4 text-slate-300">
              <span className="text-slate-500 block text-[10px] font-mono-code uppercase">Score</span>
              <span className="font-mono-code text-sm font-bold text-emerald-300">
                {progress.score} pts
              </span>
            </div>
          </div>
        </div>

        {/* Current Objective Guidance Banner */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-slate-300 font-medium">Objective:</span>
            <span>
              {!allSubPuzzlesSolved
                ? `Investigate stations in ${roomConfig.title} to find clues and unlock preliminary security locks.`
                : 'All preliminary locks cleared! Access the primary exit door to enter the final escape authorization code.'}
            </span>
          </div>
          <span className="font-mono-code text-[11px] text-cyan-400/80">
            Difficulty: {progress.difficulty}
          </span>
        </div>
      </div>

      {/* Interactive Visual Chamber Stage */}
      <div className="relative w-full aspect-[16/9] min-h-[380px] max-h-[640px] rounded-2xl overflow-hidden border border-cyan-500/40 shadow-2xl shadow-cyan-950/80 bg-slate-950 select-none">
        {/* Visual Background */}
        <img
          src={roomConfig.backgroundImage}
          alt={roomConfig.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-90"
        />

        {/* Scrim Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none" />

        {/* Hotspots for all interactive objects in this room */}
        {roomObjects.map((obj) => {
          const isInspected = progress.inspectedObjectIds.includes(obj.id);
          const isSolved = obj.hasPuzzle && obj.puzzleId && progress.solvedPuzzleIds.includes(obj.puzzleId);
          const hasClueFound = obj.hasClue && obj.clueId && progress.discoveredClueIds.includes(obj.clueId);
          const isHovered = hoveredObjectId === obj.id;

          return (
            <div
              key={obj.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
              style={{ left: `${obj.position.x}%`, top: `${obj.position.y}%` }}
              onMouseEnter={() => setHoveredObjectId(obj.id)}
              onMouseLeave={() => setHoveredObjectId(null)}
            >
              <button
                type="button"
                onClick={() => onInspectObject(obj.id)}
                className={`relative group p-2.5 sm:p-3 rounded-full transition-all transform hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                  isSolved
                    ? 'bg-emerald-950/90 border-2 border-emerald-400 text-emerald-300 shadow-lg shadow-emerald-950'
                    : hasClueFound || isInspected
                    ? 'bg-slate-900/90 border-2 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-950'
                    : 'bg-slate-950/90 border-2 border-cyan-400/80 text-cyan-200 animate-pulse-glow'
                }`}
                aria-label={`Inspect ${obj.name}`}
              >
                {/* Visual Icon */}
                {getObjectIcon(obj.id)}

                {/* Sub-status Indicator Dot */}
                {isSolved ? (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border border-slate-950 flex items-center justify-center text-[9px] text-slate-950 font-bold">
                    ✓
                  </span>
                ) : obj.hasPuzzle ? (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-purple-500 border border-slate-950 flex items-center justify-center text-[9px] text-white font-bold">
                    P
                  </span>
                ) : obj.hasClue ? (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-400 border border-slate-950 flex items-center justify-center text-[9px] text-slate-950 font-bold">
                    !
                  </span>
                ) : null}
              </button>

              {/* Hover Tooltip Card */}
              {isHovered && (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-48 sm:w-56 p-3 rounded-xl bg-slate-900/95 border border-cyan-500/60 shadow-2xl backdrop-blur-md pointer-events-none z-30 animate-fade-in text-left">
                  <div className="flex items-center justify-between text-[10px] font-mono-code text-cyan-400 uppercase">
                    <span>{obj.subtitle}</span>
                    {isSolved && <span className="text-emerald-400 font-bold">SOLVED</span>}
                  </div>
                  <h4 className="font-display text-xs font-bold text-white mt-0.5">
                    {obj.name}
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                    {obj.description}
                  </p>
                  <div className="mt-2 pt-1.5 border-t border-slate-800 text-[10px] text-cyan-300 font-semibold flex items-center gap-1">
                    <Search className="w-3 h-3" />
                    <span>Click to Investigate</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Ambient Room Watermark */}
        <div className="absolute bottom-3 left-4 pointer-events-none text-[11px] font-mono-code text-slate-400 bg-slate-950/70 px-2.5 py-1 rounded-md border border-slate-800">
          {roomConfig.icon} {roomConfig.title} · ESCAPE CHAMBER
        </div>
      </div>

      {/* Interactive Object Quick-Access Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm font-bold text-slate-200 tracking-wider flex items-center gap-2">
            <Search className="w-4 h-4 text-cyan-400" />
            INVESTIGATION STATIONS ({roomObjects.length} Objects)
          </h3>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Click any station to inspect clues and access puzzles
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {roomObjects.map((obj) => {
            const isInspected = progress.inspectedObjectIds.includes(obj.id);
            const isSolved = obj.hasPuzzle && obj.puzzleId && progress.solvedPuzzleIds.includes(obj.puzzleId);

            return (
              <button
                key={obj.id}
                type="button"
                onClick={() => onInspectObject(obj.id)}
                className={`p-3.5 rounded-xl border text-left transition-all group flex flex-col justify-between ${
                  isSolved
                    ? 'border-emerald-500/40 bg-emerald-950/20 hover:border-emerald-400'
                    : isInspected
                    ? 'border-slate-800 bg-slate-900/60 hover:border-cyan-500/60 hover:bg-slate-850'
                    : 'border-cyan-500/20 bg-slate-900/40 hover:border-cyan-400/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-lg ${
                      isSolved
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-950 text-cyan-400 border border-slate-800'
                    }`}>
                      {getObjectIcon(obj.id)}
                    </div>
                    {isSolved ? (
                      <span className="text-[10px] text-emerald-400 font-mono-code font-bold">
                        SOLVED
                      </span>
                    ) : obj.hasPuzzle ? (
                      <span className="text-[10px] text-purple-400 font-mono-code">
                        PUZZLE
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-mono-code">
                        INSPECT
                      </span>
                    )}
                  </div>

                  <h4 className="font-display text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {obj.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                    {obj.subtitle}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 group-hover:text-cyan-400">
                  <span>Investigate</span>
                  <span>➔</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
