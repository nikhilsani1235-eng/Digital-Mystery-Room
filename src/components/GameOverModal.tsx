/**
 * Game Over Screen
 * Displayed when the escape room countdown runs out.
 */

import React from 'react';
import { RotateCcw, Home, Skull, AlertCircle, LayoutGrid } from 'lucide-react';

interface GameOverModalProps {
  onRestart: () => void;
  onBackToHub?: () => void;
  onReturnHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  onRestart,
  onBackToHub,
  onReturnHome,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-fade-in">
      <div className="bg-slate-900 border border-red-500/40 rounded-3xl max-w-md w-full my-8 shadow-2xl shadow-red-950/80 p-6 sm:p-8 relative overflow-hidden text-center">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-red-500/10 blur-3xl pointer-events-none" />

        {/* Icon */}
        <div className="inline-flex p-4 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-400 shadow-xl mb-4">
          <Skull className="w-10 h-10 animate-pulse" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-red-500/40 bg-red-950/50 text-red-300 text-xs font-mono-code uppercase tracking-wider mb-2">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>TIME EXPIRED · REACTOR SEALED</span>
        </div>

        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
          THE MYSTERY REMAINS UNSOLVED
        </h2>

        <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xs mx-auto">
          The countdown clock reached zero before all cryptographic subsystems were neutralized. The chamber has locked down.
        </p>

        <div className="mt-8 flex flex-col gap-2.5">
          <button
            onClick={onRestart}
            className="w-full py-3.5 px-4 rounded-xl font-display text-xs font-bold tracking-wider text-slate-950 bg-gradient-to-r from-red-400 to-rose-300 hover:from-red-300 hover:to-rose-200 transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4 text-slate-950" />
            <span>RESTART THIS ROOM</span>
          </button>

          {onBackToHub && (
            <button
              onClick={onBackToHub}
              className="w-full py-3 px-4 rounded-xl font-display text-xs font-bold tracking-wider text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 transition-all flex items-center justify-center gap-2"
            >
              <LayoutGrid className="w-4 h-4 text-cyan-400" />
              <span>CHOOSE ANOTHER ROOM (HUB)</span>
            </button>
          )}

          <button
            onClick={onReturnHome}
            className="w-full py-2.5 px-4 rounded-xl font-display text-xs font-semibold tracking-wide text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4 text-slate-500" />
            <span>RETURN HOME</span>
          </button>
        </div>
      </div>
    </div>
  );
};
