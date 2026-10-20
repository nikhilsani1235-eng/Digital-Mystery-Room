/**
 * Master Door Override Console Puzzle Component
 * The final security clearance disengaging magnetic clamps and initiating the escape sequence.
 */

import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { ShieldAlert, ShieldCheck, Delete, CheckCircle2, HelpCircle, Lock, Unlock, AlertCircle } from 'lucide-react';

interface FinalDoorKeypadPuzzleProps {
  isSolved: boolean;
  solvedPuzzleIds: number[];
  targetCodes?: string[];
  title?: string;
  codename?: string;
  doorName?: string;
  checklistItems?: Array<{ id: number; label: string }>;
  onSolve: () => void;
  onOpenHint: () => void;
}

const DEFAULT_CHECKLIST = [
  { id: 1, label: 'Vault Safe Combination Decoded' },
  { id: 2, label: 'Symbol Matrix Sub-Processor Aligned' },
  { id: 3, label: 'Caesar Cipher Mainframe Password Decrypted' },
  { id: 4, label: 'Boolean Logic Gate Relay Energized' },
  { id: 5, label: 'Master Blast Door Magnetic Seals Released' },
];

export const FinalDoorKeypadPuzzle: React.FC<FinalDoorKeypadPuzzleProps> = ({
  isSolved,
  solvedPuzzleIds,
  targetCodes = ['7349', '734910'],
  title = 'Master Blast Door Override Console',
  codename = 'FINAL ESCAPE OVERRIDE',
  doorName = 'Primary Exit Blast Door',
  checklistItems = DEFAULT_CHECKLIST,
  onSolve,
  onOpenHint,
}) => {
  const [digits, setDigits] = useState<string>('');
  const [errorStatus, setErrorStatus] = useState<boolean>(false);
  const [isUnlocking, setIsUnlocking] = useState<boolean>(false);

  const maxDigits = Math.max(...targetCodes.map((c) => c.length), 6);

  const handleKeyPress = (num: string) => {
    if (isSolved || isUnlocking) return;
    if (digits.length < maxDigits) {
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
    if (isSolved || isUnlocking) return;

    if (targetCodes.includes(digits)) {
      sound.playDoorUnlock();
      setIsUnlocking(true);
      setTimeout(() => {
        onSolve();
      }, 1200);
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
    <div className="p-6 bg-slate-950 border border-cyan-500/40 rounded-2xl max-w-lg mx-auto text-center shadow-2xl shadow-cyan-950/60">
      {/* Top Header */}
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

      {/* Door Security Subsystems Checklist */}
      <div className="mt-4 p-3.5 rounded-xl bg-slate-900/70 border border-slate-850 text-left">
        <div className="flex items-center justify-between text-[11px] font-mono-code text-slate-400 uppercase mb-2">
          <span>Security Clearance Protocol Status</span>
          <span className="text-cyan-400 font-bold">
            {checklistItems.filter((item) => solvedPuzzleIds.includes(item.id)).length} / {checklistItems.length} Verified
          </span>
        </div>

        <div className="space-y-1.5 text-xs font-mono-code">
          {checklistItems.map((item) => {
            const isItemSolved = solvedPuzzleIds.includes(item.id);
            return (
              <div
                key={item.id}
                className={`flex items-center gap-2 px-2.5 py-1 rounded-md transition-colors ${
                  isItemSolved
                    ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-950/50 text-slate-500 border border-slate-800'
                }`}
              >
                {isItemSolved ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                )}
                <span className="truncate">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Final Code Entry Visual Slot */}
      <div className="mt-5">
        <div
          className={`py-4 px-6 rounded-xl border font-mono-code text-3xl font-bold tracking-[0.4em] transition-all flex items-center justify-center gap-2 ${
            isSolved || isUnlocking
              ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300 shadow-xl shadow-emerald-950/80 animate-pulse'
              : errorStatus
              ? 'border-red-500 bg-red-950/40 text-red-400 animate-shake'
              : 'border-cyan-500/40 bg-slate-900/90 text-cyan-200'
          }`}
        >
          {isSolved || isUnlocking ? (
            <span className="tracking-widest flex items-center gap-2 text-xl text-emerald-300">
              <Unlock className="w-6 h-6 text-emerald-400" /> DISENGAGING SEALS...
            </span>
          ) : (
            <span>{digits ? digits : 'ENTER CODE'}</span>
          )}
        </div>

        {errorStatus && (
          <div className="mt-2 text-xs text-red-400 font-mono-code flex items-center justify-center gap-1.5 animate-fade-in">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>AUTHORIZATION REJECTED · INVALID MASTER KEY</span>
          </div>
        )}
      </div>

      {/* Numeric Keypad Buttons */}
      <div className="mt-5 grid grid-cols-3 gap-2.5 max-w-[280px] mx-auto">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
          <button
            key={digit}
            type="button"
            disabled={isSolved || isUnlocking}
            onClick={() => handleKeyPress(digit)}
            className="h-12 rounded-xl border border-slate-800 bg-slate-900/70 hover:bg-slate-800 hover:border-cyan-500/40 text-slate-100 font-display text-lg font-bold active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {digit}
          </button>
        ))}

        <button
          type="button"
          disabled={isSolved || isUnlocking || digits.length === 0}
          onClick={handleClear}
          className="h-12 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800 text-xs font-mono-code text-slate-400 hover:text-slate-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          CLR
        </button>

        <button
          type="button"
          disabled={isSolved || isUnlocking}
          onClick={() => handleKeyPress('0')}
          className="h-12 rounded-xl border border-slate-800 bg-slate-900/70 hover:bg-slate-800 hover:border-cyan-500/40 text-slate-100 font-display text-lg font-bold active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          0
        </button>

        <button
          type="button"
          disabled={isSolved || isUnlocking || digits.length === 0}
          onClick={handleDelete}
          aria-label="Delete character"
          className="h-12 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Delete className="w-5 h-5" />
        </button>
      </div>

      {/* Master Override Trigger */}
      <div className="mt-5">
        <button
          type="button"
          disabled={isSolved || isUnlocking || digits.length < 3}
          onClick={handleSubmit}
          className={`w-full py-3.5 rounded-xl font-display text-sm font-bold tracking-wider transition-all flex items-center justify-center gap-2 ${
            isSolved || isUnlocking
              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
              : digits.length >= 3
              ? 'bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 text-slate-950 hover:from-emerald-300 hover:to-cyan-200 shadow-xl shadow-emerald-500/30 active:scale-98 animate-pulse-glow'
              : 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>{isSolved || isUnlocking ? 'LOCKDOWN RELEASED' : 'EXECUTE MASTER OVERRIDE'}</span>
        </button>
      </div>
    </div>
  );
};
