/**
 * Story & Difficulty Selection Screen
 * Introduces the selected room's briefing and configures escape difficulty (Easy, Medium, Hard).
 */

import React, { useState } from 'react';
import { Difficulty, RoomId } from '../types/game';
import { DIFFICULTY_CONFIG, getRoomDefinition } from '../data/gameData';
import { Sparkles, Clock, HelpCircle, ArrowRight, ArrowLeft } from 'lucide-react';

interface StoryViewProps {
  roomId: RoomId;
  initialDifficulty: Difficulty;
  onStartInvestigation: (difficulty: Difficulty) => void;
  onBackToHub: () => void;
}

export const StoryView: React.FC<StoryViewProps> = ({
  roomId,
  initialDifficulty,
  onStartInvestigation,
  onBackToHub,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(initialDifficulty);
  const roomConfig = getRoomDefinition(roomId);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-3xl w-full my-8 bg-slate-900/90 border border-cyan-500/30 rounded-3xl shadow-2xl shadow-cyan-950/40 backdrop-blur-xl p-6 sm:p-10 relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-cyan-500/10 blur-3xl pointer-events-none" />

        {/* Back Link to Hub */}
        <button
          onClick={onBackToHub}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors mb-6 font-mono-code focus-visible:outline-none"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO GAME HUB</span>
        </button>

        {/* Story Intro Briefing */}
        <div className="border-b border-slate-800 pb-8">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono-code uppercase tracking-wider mb-2">
            <span className="text-base">{roomConfig.icon}</span>
            <Sparkles className="w-4 h-4" />
            <span>Mission Dossier · {roomConfig.tagline}</span>
          </div>

          <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-wide">
            {roomConfig.title}
          </h2>

          <div className="mt-4 p-5 rounded-2xl bg-slate-950/70 border border-slate-800 text-slate-200 leading-relaxed text-sm sm:text-base font-light italic">
            &ldquo;{roomConfig.story}&rdquo;
          </div>

          <p className="mt-4 text-xs sm:text-sm text-slate-400 leading-relaxed">
            Every interactive station in this chamber holds encrypted parameters. You have a finite countdown before security lockout seals the room.
          </p>
        </div>

        {/* Difficulty Selection */}
        <div className="pt-8">
          <h3 className="font-display text-base font-bold text-slate-200 tracking-wide mb-4">
            SELECT ESCAPE DIFFICULTY
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map((level) => {
              const config = DIFFICULTY_CONFIG[level];
              const isSelected = selectedDifficulty === level;

              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSelectedDifficulty(level)}
                  className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-950/80 ring-1 ring-cyan-400'
                      : 'border-slate-800 bg-slate-950/50 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className={`font-display text-sm font-bold ${isSelected ? 'text-cyan-300' : 'text-slate-300'}`}>
                        {config.name.split(' ')[0]}
                      </span>
                      <span className="text-xs font-mono-code text-cyan-400">
                        {config.multiplier}x Score
                      </span>
                    </div>

                    <div className="mt-3 space-y-1.5 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{config.timeLimitSeconds / 60} Minutes</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                        <span>{config.maxHints} Hints</span>
                      </div>
                    </div>

                    <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
                      {config.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className={isSelected ? 'text-cyan-400 font-semibold' : 'text-slate-500'}>
                      {isSelected ? '✓ Selected' : 'Tap to select'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Start Button */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={onBackToHub}
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-700 bg-slate-900 text-slate-300 hover:text-white text-xs font-semibold"
          >
            Choose Another Room
          </button>

          <button
            onClick={() => onStartInvestigation(selectedDifficulty)}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-display text-base font-bold tracking-wider text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-teal-300 hover:from-cyan-300 hover:to-teal-200 transition-all shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2"
          >
            <span>START INVESTIGATION</span>
            <ArrowRight className="w-5 h-5 text-slate-950" />
          </button>
        </div>
      </div>
    </div>
  );
};
