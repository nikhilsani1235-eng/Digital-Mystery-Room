/**
 * Victory Screen & Final Escape Sequence
 * Displays animated clearance, detailed score metrics, and rank honors.
 * Provides "PLAY AGAIN", "BACK TO GAME HUB", and "RETURN TO HOME".
 */

import React from 'react';
import { GameProgress, GameScoreBreakdown } from '../types/game';
import { getRoomDefinition } from '../data/gameData';
import { Trophy, Clock, KeyRound, HelpCircle, RotateCcw, Home, Award, Sparkles, CheckCircle2, LayoutGrid } from 'lucide-react';

interface VictoryModalProps {
  progress: GameProgress;
  scoreBreakdown: GameScoreBreakdown;
  onPlayAgain: () => void;
  onBackToHub: () => void;
  onReturnHome: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  progress,
  scoreBreakdown,
  onPlayAgain,
  onBackToHub,
  onReturnHome,
}) => {
  const roomConfig = getRoomDefinition(progress.currentRoomId);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-2xl w-full my-8 shadow-2xl shadow-emerald-950/60 p-6 sm:p-10 relative overflow-hidden text-center">
        {/* Ambient Victory Rays */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-36 bg-gradient-to-b from-emerald-500/20 to-transparent blur-3xl pointer-events-none" />

        {/* Animated Trophy Emblem */}
        <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-emerald-900/80 to-teal-900/60 border border-emerald-400/50 text-emerald-300 shadow-xl shadow-emerald-950/80 mb-4 animate-bounce-subtle">
          <Trophy className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        {/* Victory Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/40 bg-emerald-950/60 text-emerald-300 text-xs font-mono-code uppercase tracking-wider mb-2">
          <span>{roomConfig.icon}</span>
          <Sparkles className="w-3.5 h-3.5" />
          <span>{roomConfig.title} ESCAPED · LOCKDOWN NEUTRALIZED</span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          MYSTERY SOLVED!
        </h1>

        <p className="mt-2 text-sm text-slate-300 max-w-md mx-auto">
          You cracked all security protocols in <span className="text-emerald-400 font-semibold">{roomConfig.title}</span>, deciphered connected clues, and executed the master escape override.
        </p>

        {/* Rank & Grade Badge */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 text-left flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono-code text-emerald-400 uppercase tracking-wider">
                Investigator Rank
              </span>
              <h3 className="font-display text-base sm:text-lg font-bold text-white">
                {scoreBreakdown.rank}
              </h3>
              <p className="text-xs text-slate-400">
                {scoreBreakdown.title}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono-code text-slate-400 uppercase">Final Score</span>
            <div className="font-display text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300 font-mono-code tabular-nums">
              {scoreBreakdown.finalScore}
            </div>
          </div>
        </div>

        {/* Performance Metric Breakdown Bento */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Time Elapsed</span>
            </div>
            <div className="font-mono-code text-base font-bold text-slate-100">
              {formatTime(progress.elapsedTime)}
            </div>
            <span className="text-[10px] text-slate-500 font-mono-code">
              +{scoreBreakdown.timeBonus} pts bonus
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Puzzles</span>
            </div>
            <div className="font-mono-code text-base font-bold text-slate-100">
              {progress.solvedPuzzleIds.length} / {roomConfig.puzzles.length}
            </div>
            <span className="text-[10px] text-slate-500 font-mono-code">
              +{scoreBreakdown.basePuzzlePoints} pts
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <KeyRound className="w-3.5 h-3.5 text-purple-400" />
              <span>Clues Found</span>
            </div>
            <div className="font-mono-code text-base font-bold text-slate-100">
              {progress.discoveredClueIds.length} / {roomConfig.clues.length}
            </div>
            <span className="text-[10px] text-slate-500 font-mono-code">
              +{scoreBreakdown.clueDiscoveryBonus} pts
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Hints Used</span>
            </div>
            <div className="font-mono-code text-base font-bold text-slate-100">
              {progress.hintsUsed}
            </div>
            <span className="text-[10px] text-slate-500 font-mono-code">
              -{scoreBreakdown.hintPenalty} pts
            </span>
          </div>
        </div>

        {/* Footer CTAs: PLAY AGAIN, BACK TO GAME HUB, RETURN TO HOME */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onPlayAgain}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-display text-sm font-bold tracking-wider text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4 text-slate-950" />
            <span>PLAY AGAIN</span>
          </button>

          <button
            onClick={onBackToHub}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-display text-sm font-bold tracking-wider text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 hover:border-cyan-400 transition-all flex items-center justify-center gap-2"
          >
            <LayoutGrid className="w-4 h-4 text-cyan-400" />
            <span>BACK TO GAME HUB</span>
          </button>

          <button
            onClick={onReturnHome}
            className="w-full sm:w-auto px-5 py-3 rounded-xl font-display text-sm font-semibold tracking-wide text-slate-300 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4 text-slate-400" />
            <span>HOME</span>
          </button>
        </div>
      </div>
    </div>
  );
};
