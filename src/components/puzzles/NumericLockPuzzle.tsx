/**
 * Numerical Code Keypad Puzzle Component
 * Reusable for electronic safes, curio drawers, and numeric lockboxes.
 */

import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { ShieldCheck, Delete, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

interface NumericLockPuzzleProps {
  isSolved: boolean;
  targetCode?: string;
  title?: string;
  codename?: string;
  description?: string;
  onSolve: () => void;
  onOpenHint: () => void;
}

export const NumericLockPuzzle: React.FC<NumericLockPuzzleProps> = ({
  isSolved,
  targetCode = '7349',
  title = 'Electronic Vault Keypad',
  codename = 'SECURITY LOCK',
  description = 'Enter the 4-digit numeric code to release the mechanical latch.',
  onSolve,
  onOpenHint,
}) => {
  const [digits, setDigits] = useState<string>('');
  const [errorStatus, setErrorStatus] = useState<boolean>(false);
  const [successStatus, setSuccessStatus] = useState<boolean>(false);

  const codeLength = targetCode.length;

  const handleKeyPress = (num: string) => {
    if (isSolved || successStatus) return;
    if (digits.length < codeLength) {
      sound.playClick();
      setErrorStatus(false);
      setDigits((prev) => prev + num);
    }
  };

  const handleDelete = () => {
    sound.playClick();
    setErrorStatus(false);
    setDigits((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    sound.playClick();
    setErrorStatus(false);
    setDigits('');
  };

  const handleSubmit = () => {
    if (isSolved) return;
    if (digits === targetCode) {
      sound.playCorrect();
      setSuccessStatus(true);
      setTimeout(() => {
        onSolve();
      }, 700);
    } else {
      sound.playWrong();
      setErrorStatus(true);
      setTimeout(() => {
        setDigits('');
        setErrorStatus(false);
      }, 1200);
    }
  };

  return (
    <div className="p-6 bg-slate-950/90 border border-slate-800 rounded-2xl max-w-md mx-auto text-center shadow-2xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="text-left">
          <span className="text-xs font-mono-code text-cyan-400 uppercase tracking-wider">{codename}</span>
          <h3 className="font-display text-lg font-bold text-slate-100">{title}</h3>
        </div>
        <button
          onClick={onOpenHint}
          className="p-1.5 rounded-lg border border-amber-500/30 bg-amber-950/30 text-amber-300 hover:bg-amber-900/50 transition-colors text-xs flex items-center gap-1"
          title="Need a hint?"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Hint</span>
        </button>
      </div>

      <p className="mt-2 text-xs text-slate-400 text-left">
        {description}
      </p>

      {/* Vault Status Display */}
      <div className="mt-5">
        <div
          className={`py-4 px-6 rounded-xl border font-mono-code text-3xl font-bold tracking-[0.4em] transition-all flex items-center justify-center gap-3 ${
            isSolved || successStatus
              ? 'border-emerald-500/80 bg-emerald-950/40 text-emerald-400 shadow-lg shadow-emerald-950/60'
              : errorStatus
              ? 'border-red-500/80 bg-red-950/40 text-red-400 animate-shake'
              : 'border-cyan-500/40 bg-slate-900/80 text-cyan-300 shadow-inner'
          }`}
        >
          {isSolved || successStatus ? (
            <span className="tracking-widest flex items-center gap-2 text-xl sm:text-2xl">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" /> UNLOCKED
            </span>
          ) : (
            <span>{digits.padEnd(codeLength, '·')}</span>
          )}
        </div>

        {errorStatus && (
          <div className="mt-2 text-xs text-red-400 font-mono-code flex items-center justify-center gap-1.5 animate-fade-in">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>ACCESS DENIED · INVALID CODE ENTRY</span>
          </div>
        )}
      </div>

      {/* Numeric Keypad Buttons 0-9 */}
      <div className="mt-6 grid grid-cols-3 gap-2.5 max-w-[280px] mx-auto">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
          <button
            key={digit}
            type="button"
            disabled={isSolved || successStatus}
            onClick={() => handleKeyPress(digit)}
            className="h-12 rounded-xl border border-slate-800 bg-slate-900/70 hover:bg-slate-800 hover:border-cyan-500/40 text-slate-100 font-display text-lg font-bold active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
          >
            {digit}
          </button>
        ))}

        <button
          type="button"
          disabled={isSolved || successStatus || digits.length === 0}
          onClick={handleClear}
          className="h-12 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800 text-xs font-mono-code text-slate-400 hover:text-slate-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          CLR
        </button>

        <button
          type="button"
          disabled={isSolved || successStatus}
          onClick={() => handleKeyPress('0')}
          className="h-12 rounded-xl border border-slate-800 bg-slate-900/70 hover:bg-slate-800 hover:border-cyan-500/40 text-slate-100 font-display text-lg font-bold active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          0
        </button>

        <button
          type="button"
          disabled={isSolved || successStatus || digits.length === 0}
          onClick={handleDelete}
          aria-label="Delete character"
          className="h-12 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Delete className="w-5 h-5" />
        </button>
      </div>

      {/* Confirmation Action */}
      <div className="mt-5">
        <button
          type="button"
          disabled={isSolved || successStatus || digits.length !== codeLength}
          onClick={handleSubmit}
          className={`w-full py-3 rounded-xl font-display text-sm font-bold tracking-wider transition-all flex items-center justify-center gap-2 ${
            isSolved || successStatus
              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
              : digits.length === codeLength
              ? 'bg-gradient-to-r from-cyan-400 to-teal-300 text-slate-950 hover:from-cyan-300 hover:to-teal-200 shadow-lg shadow-cyan-500/25 active:scale-98'
              : 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{isSolved || successStatus ? 'CODE ACCEPTED' : 'ENTER CODE'}</span>
        </button>
      </div>
    </div>
  );
};
