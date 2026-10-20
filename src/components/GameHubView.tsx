/**
 * Mystery Game Hub Component
 * "CHOOSE YOUR MYSTERY"
 * Displays the 4 distinct escape rooms: The Vault, Secret Lab, Cyber Room, Haunted Room.
 * Each room is independently playable with separate progress and completion tracking.
 */

import React from 'react';
import { RoomId, RoomProgress } from '../types/game';
import { ROOMS_CONFIG } from '../data/gameData';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowLeft,
  KeyRound,
  Shield,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface GameHubViewProps {
  roomsProgress: Record<RoomId, RoomProgress>;
  currentRoomId: RoomId;
  onSelectRoom: (roomId: RoomId) => void;
  onBackToHome: () => void;
  onResetRoom: (roomId: RoomId) => void;
}

export const GameHubView: React.FC<GameHubViewProps> = ({
  roomsProgress,
  currentRoomId,
  onSelectRoom,
  onBackToHome,
  onResetRoom,
}) => {
  const roomKeys: RoomId[] = ['the-vault', 'secret-lab', 'cyber-room', 'haunted-room'];

  // Global Hub metrics
  const completedCount = roomKeys.filter((id) => roomsProgress[id]?.isEscaped).length;
  const totalScore = roomKeys.reduce((acc, id) => acc + (roomsProgress[id]?.score || 0), 0);
  const totalCluesDiscovered = roomKeys.reduce(
    (acc, id) => acc + (roomsProgress[id]?.discoveredClueIds?.length || 0),
    0
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Ambient Cyber / Mystery Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
        {/* Top Hub Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-400 hover:text-cyan-400 transition-colors uppercase font-mono-code focus-visible:outline-none"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </button>

          {/* Quick Hub Stats Bar */}
          <div className="flex items-center gap-3 sm:gap-6 text-xs font-mono-code">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <span className="text-slate-500">ROOMS CLEARED:</span>
              <span className="text-emerald-400 font-bold">{completedCount} / 4</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <span className="text-slate-500">TOTAL SCORE:</span>
              <span className="text-cyan-300 font-bold">{totalScore} PTS</span>
            </div>

            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <span className="text-slate-500">CLUES DISCOVERED:</span>
              <span className="text-purple-300 font-bold">{totalCluesDiscovered}</span>
            </div>
          </div>
        </div>

        {/* Hero Hub Header */}
        <div className="text-center my-8 sm:my-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-semibold tracking-widest uppercase mb-4 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>SELECT AN INDEPENDENT INVESTIGATION</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white">
            CHOOSE YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400">MYSTERY</span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto text-balance">
            Four independent escape rooms with unique lore, interactive stations, hidden clues, and multi-stage puzzles. Choose any room below to begin immediately.
          </p>
        </div>

        {/* 4 Interactive Room Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-4 flex-1">
          {roomKeys.map((roomId) => {
            const config = ROOMS_CONFIG[roomId];
            const p = roomsProgress[roomId];
            const isCompleted = p?.isEscaped;
            const puzzlesCount = config.puzzles.length;
            const solvedCount = p?.solvedPuzzleIds?.length || 0;
            const cluesCount = config.clues.length;
            const discoveredCount = p?.discoveredClueIds?.length || 0;

            // Calculate progress percentage for this specific room
            const progressPercent = Math.min(
              100,
              Math.round((solvedCount / puzzlesCount) * 70 + (discoveredCount / cluesCount) * 30)
            );

            const hasStarted = (p?.inspectedObjectIds?.length || 0) > 0 || solvedCount > 0;

            return (
              <div
                key={roomId}
                className={`relative rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden group bg-slate-900/80 backdrop-blur-xl ${
                  isCompleted
                    ? 'border-emerald-500/50 shadow-xl shadow-emerald-950/40 ring-1 ring-emerald-500/30'
                    : 'border-slate-800 hover:border-cyan-400/60 shadow-xl hover:shadow-cyan-950/40'
                }`}
              >
                {/* Room Image Preview Header with Dark Gradient Scrim */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                  <img
                    src={config.backgroundImage}
                    alt={config.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

                  {/* Status Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    {/* Room Icon */}
                    <div className="w-10 h-10 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-slate-700/80 flex items-center justify-center text-xl shadow-lg">
                      <span>{config.icon}</span>
                    </div>

                    {/* Status Badge: COMPLETED or Available */}
                    {isCompleted ? (
                      <span className="px-3 py-1 rounded-full text-xs font-mono-code font-bold uppercase tracking-wider bg-emerald-950/90 border border-emerald-400 text-emerald-300 flex items-center gap-1.5 shadow-md shadow-emerald-950/80">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>COMPLETED</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-mono-code font-semibold uppercase tracking-wider bg-slate-950/80 border border-cyan-500/40 text-cyan-300">
                        Available
                      </span>
                    )}
                  </div>

                  {/* Room Tagline overlay */}
                  <div className="absolute bottom-2 left-4 right-4">
                    <span className="text-[10px] font-mono-code text-cyan-400 uppercase tracking-wider block">
                      {config.tagline}
                    </span>
                    <h3 className="font-display text-xl font-extrabold text-white tracking-wide group-hover:text-cyan-200 transition-colors">
                      {config.title}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Description */}
                    <p className="text-xs text-slate-300 leading-relaxed min-h-[3rem]">
                      &ldquo;{config.description}&rdquo;
                    </p>

                    {/* Telemetry / Spec details */}
                    <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] font-mono-code">
                      <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-1.5 text-slate-300">
                        <Layers className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{puzzlesCount} Puzzles</span>
                      </div>

                      <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-1.5 text-slate-300">
                        <KeyRound className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span>{cluesCount} Clues</span>
                      </div>
                    </div>

                    {/* Progress Bar for This Room */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-[11px] font-mono-code mb-1">
                        <span className="text-slate-400">
                          {isCompleted ? 'Solved' : hasStarted ? 'Investigation Progress' : 'Ready'}
                        </span>
                        <span className={`font-bold ${isCompleted ? 'text-emerald-400' : 'text-cyan-400'}`}>
                          {progressPercent}%
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                        <div
                          className={`h-full transition-all duration-500 ${
                            isCompleted
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                              : 'bg-gradient-to-r from-cyan-500 to-sky-400'
                          }`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action CTA Buttons */}
                  <div className="pt-3 border-t border-slate-800/80 space-y-2">
                    <button
                      type="button"
                      onClick={() => onSelectRoom(roomId)}
                      className={`w-full py-3 px-4 rounded-xl font-display text-sm font-bold tracking-wider transition-all flex items-center justify-center gap-2 transform active:scale-98 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                        isCompleted
                          ? 'bg-slate-800/90 hover:bg-slate-750 text-emerald-300 border border-emerald-500/40 hover:border-emerald-400'
                          : 'bg-gradient-to-r from-cyan-400 via-sky-300 to-teal-300 hover:from-cyan-300 hover:to-teal-200 text-slate-950 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40'
                      }`}
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>{isCompleted ? 'PLAY AGAIN' : hasStarted ? 'CONTINUE ROOM' : 'PLAY NOW'}</span>
                    </button>

                    {/* Reset single room button if started */}
                    {hasStarted && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Reset progress for ${config.title}? (Other rooms will NOT be affected)`)) {
                            onResetRoom(roomId);
                          }
                        }}
                        className="w-full py-1.5 text-[11px] font-mono-code text-slate-500 hover:text-amber-400 hover:underline transition-colors flex items-center justify-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset {config.title} only</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Explanatory Banner */}
        <div className="mt-8 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2.5 text-center sm:text-left">
            <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              Each room maintains independent localStorage state. Completing or resetting one room preserves all other room progress.
            </span>
          </div>

          <button
            onClick={onBackToHome}
            className="px-4 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors whitespace-nowrap"
          >
            Back to Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};
