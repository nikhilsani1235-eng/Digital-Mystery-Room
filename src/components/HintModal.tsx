/**
 * Hint System Modal
 * Manages tiered hint unlocks with confirmation and remaining hint tally.
 * Dynamically adapts to the puzzles of the currently active room.
 */

import React, { useState } from 'react';
import { GameProgress } from '../types/game';
import { getRoomPuzzles, PUZZLES } from '../data/gameData';
import { HelpCircle, X, Sparkles, CheckCircle2 } from 'lucide-react';

interface HintModalProps {
  isOpen: boolean;
  progress: GameProgress;
  activePuzzleId?: number | null;
  onClose: () => void;
  onUseHint: (puzzleId: number) => string | null;
}

export const HintModal: React.FC<HintModalProps> = ({
  isOpen,
  progress,
  activePuzzleId,
  onClose,
  onUseHint,
}) => {
  if (!isOpen) return null;

  const roomPuzzles = getRoomPuzzles(progress.currentRoomId) || PUZZLES;

  const [selectedPuzzleId, setSelectedPuzzleId] = useState<number>(() => {
    if (activePuzzleId && roomPuzzles.some((p) => p.id === activePuzzleId)) {
      return activePuzzleId;
    }
    return roomPuzzles[0]?.id || 1;
  });

  const [lastRevealedHint, setLastRevealedHint] = useState<string | null>(null);

  const selectedPuzzle = roomPuzzles.find((p) => p.id === selectedPuzzleId) || roomPuzzles[0];
  const isSelectedSolved = progress.solvedPuzzleIds.includes(selectedPuzzleId);

  const handleUnlockHint = () => {
    const hint = onUseHint(selectedPuzzleId);
    if (hint) {
      setLastRevealedHint(hint);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl max-w-lg w-full shadow-2xl shadow-amber-950/40 p-6 flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-950/80 border border-amber-500/40 text-amber-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-white tracking-wide">
                TACTICAL HINT PROTOCOL
              </h2>
              <p className="text-xs text-slate-400">
                Available Hints: <span className="font-mono-code text-amber-300 font-bold">{progress.hintsRemaining} remaining</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Puzzle Selector Chips */}
        <div className="mt-4">
          <span className="text-[11px] font-mono-code text-slate-400 uppercase tracking-wider block mb-2">
            Select Target Objective:
          </span>
          <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${roomPuzzles.length}, minmax(0, 1fr))` }}>
            {roomPuzzles.map((puzzle, index) => {
              const isSelected = selectedPuzzleId === puzzle.id;
              const isSolved = progress.solvedPuzzleIds.includes(puzzle.id);

              return (
                <button
                  key={puzzle.id}
                  type="button"
                  onClick={() => {
                    setSelectedPuzzleId(puzzle.id);
                    setLastRevealedHint(null);
                  }}
                  className={`py-2 px-1 rounded-lg border text-center transition-all flex flex-col items-center justify-center ${
                    isSelected
                      ? 'border-amber-400 bg-amber-950/50 text-amber-200'
                      : isSolved
                      ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400'
                      : 'border-slate-850 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold font-mono-code">P0{index + 1}</span>
                  {isSolved && <span className="text-[9px] text-emerald-400">✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Puzzle Info & Hint Display */}
        {selectedPuzzle && (
          <div className="mt-5 p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-left">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono-code text-amber-400 uppercase">
                {selectedPuzzle.codename}
              </span>
              {isSelectedSolved && (
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Solved
                </span>
              )}
            </div>
            <h3 className="font-display text-sm font-bold text-slate-100 mt-1">
              {selectedPuzzle.title}
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {selectedPuzzle.instructions}
            </p>

            {/* Hint Card */}
            {lastRevealedHint ? (
              <div className="mt-4 p-3.5 rounded-lg bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs leading-relaxed animate-fade-in">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>UNLOCKED INTEL:</span>
                </div>
                <p>{lastRevealedHint}</p>
              </div>
            ) : (
              <div className="mt-4 p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-400 italic">
                {isSelectedSolved
                  ? 'This puzzle is already solved.'
                  : 'Click below to reveal a tactical hint for this puzzle.'}
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400">
            {progress.hintsRemaining > 0 ? (
              <span>Costs 1 hint from your supply.</span>
            ) : (
              <span className="text-red-400">No hints remaining!</span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={progress.hintsRemaining <= 0 || isSelectedSolved}
              onClick={handleUnlockHint}
              className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-display text-xs font-bold transition-all shadow-md shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Unlock Hint
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
