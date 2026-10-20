/**
 * Symbol Sequence Matrix Component
 * Customizable for cyber runes, biochemical symbols, and occult signs.
 */

import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { CheckCircle2, RotateCcw, HelpCircle, Binary, AlertCircle } from 'lucide-react';
import { RuneSymbol } from '../../types/game';

interface SymbolSequencePuzzleProps {
  isSolved: boolean;
  availableRunes?: RuneSymbol[];
  targetSequence?: string[];
  title?: string;
  codename?: string;
  description?: string;
  onSolve: () => void;
  onOpenHint: () => void;
}

const DEFAULT_RUNES: RuneSymbol[] = [
  { id: 'omega', glyph: 'Ω', name: 'Omega' },
  { id: 'psi', glyph: 'Ψ', name: 'Psi' },
  { id: 'delta', glyph: 'Δ', name: 'Delta' },
  { id: 'sigma', glyph: 'Σ', name: 'Sigma' },
  { id: 'lambda', glyph: 'Λ', name: 'Lambda' },
  { id: 'theta', glyph: 'Θ', name: 'Theta' },
  { id: 'phi', glyph: 'Φ', name: 'Phi' },
  { id: 'pi', glyph: 'Π', name: 'Pi' },
];

const DEFAULT_SEQUENCE = ['omega', 'psi', 'delta', 'sigma'];

export const SymbolSequencePuzzle: React.FC<SymbolSequencePuzzleProps> = ({
  isSolved,
  availableRunes = DEFAULT_RUNES,
  targetSequence = DEFAULT_SEQUENCE,
  title = 'Glyph Sequence Matrix',
  codename = 'PUZZLE 02 · SYMBOL PROCESSOR',
  description = 'Click the symbols in the harmonic sequence discovered in your investigation.',
  onSolve,
  onOpenHint,
}) => {
  const [selectedSequence, setSelectedSequence] = useState<string[]>([]);
  const [errorStatus, setErrorStatus] = useState<boolean>(false);
  const [successStatus, setSuccessStatus] = useState<boolean>(false);

  const targetLength = targetSequence.length;

  const handleSelectRune = (runeId: string) => {
    if (isSolved || successStatus || errorStatus) return;
    if (selectedSequence.length >= targetLength) return;

    sound.playClick();
    const nextSeq = [...selectedSequence, runeId];
    setSelectedSequence(nextSeq);

    // If targetLength selected, evaluate
    if (nextSeq.length === targetLength) {
      const isCorrect = nextSeq.every((id, idx) => id === targetSequence[idx]);
      if (isCorrect) {
        sound.playCorrect();
        setSuccessStatus(true);
        setTimeout(() => {
          onSolve();
        }, 800);
      } else {
        sound.playWrong();
        setErrorStatus(true);
        setTimeout(() => {
          setSelectedSequence([]);
          setErrorStatus(false);
        }, 1200);
      }
    }
  };

  const handleReset = () => {
    if (isSolved || successStatus) return;
    sound.playClick();
    setSelectedSequence([]);
    setErrorStatus(false);
  };

  return (
    <div className="p-6 bg-slate-950/90 border border-slate-800 rounded-2xl max-w-lg mx-auto shadow-2xl">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
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

      <p className="mt-2 text-xs text-slate-400">
        {description}
      </p>

      {/* Target Sequence Display Slots */}
      <div className="mt-6 p-4 rounded-xl bg-slate-900/70 border border-slate-800">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono-code">
          <span>ALIGNED HARMONIC ARRAY</span>
          <span>
            {selectedSequence.length} / {targetLength}
          </span>
        </div>

        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${targetLength}, minmax(0, 1fr))` }}>
          {Array.from({ length: targetLength }).map((_, index) => {
            const runeId = selectedSequence[index];
            const rune = runeId ? availableRunes.find((r) => r.id === runeId) : null;

            return (
              <div
                key={index}
                className={`h-16 rounded-xl border flex flex-col items-center justify-center transition-all ${
                  isSolved || successStatus
                    ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 shadow-md shadow-emerald-950'
                    : errorStatus
                    ? 'border-red-500 bg-red-950/40 text-red-400 animate-shake'
                    : rune
                    ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200'
                    : 'border-slate-800 bg-slate-950 text-slate-600 border-dashed'
                }`}
              >
                {rune ? (
                  <>
                    <span className="font-display text-2xl">{rune.glyph}</span>
                    <span className="text-[10px] font-mono-code opacity-80 mt-0.5">{rune.name}</span>
                  </>
                ) : (
                  <span className="text-sm font-mono-code text-slate-700">#{index + 1}</span>
                )}
              </div>
            );
          })}
        </div>

        {errorStatus && (
          <div className="mt-3 text-xs text-red-400 font-mono-code flex items-center justify-center gap-1.5 animate-fade-in">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>HARMONIC MISMATCH · MATRIX PURGED</span>
          </div>
        )}

        {(isSolved || successStatus) && (
          <div className="mt-3 text-xs text-emerald-400 font-mono-code flex items-center justify-center gap-1.5 animate-fade-in">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>HARMONIC RESONANCE ACHIEVED · LOCK RELEASED</span>
          </div>
        )}
      </div>

      {/* Glyph Selection Pad */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono-code">
          <span>AVAILABLE SYMBOLS</span>
          <button
            type="button"
            disabled={isSolved || successStatus || selectedSequence.length === 0}
            onClick={handleReset}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2.5">
          {availableRunes.map((rune) => (
            <button
              key={rune.id}
              type="button"
              disabled={isSolved || successStatus}
              onClick={() => handleSelectRune(rune.id)}
              className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-850 hover:border-cyan-500/50 active:scale-95 transition-all text-slate-200 flex flex-col items-center justify-center group disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="font-display text-2xl group-hover:text-cyan-300 transition-colors">
                {rune.glyph}
              </span>
              <span className="text-[10px] font-mono-code text-slate-400 group-hover:text-slate-300 mt-1">
                {rune.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
