/**
 * Puzzle 4: Logic Gate Circuit Switchboard
 * B.Tech CSE digital logic simulator implementing XOR, AND, and OR Boolean gates.
 */

import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { CheckCircle2, Zap, HelpCircle, ToggleLeft, ToggleRight, Cpu } from 'lucide-react';

interface LogicGatePuzzleProps {
  isSolved: boolean;
  onSolve: () => void;
  onOpenHint: () => void;
}

export const LogicGatePuzzle: React.FC<LogicGatePuzzleProps> = ({
  isSolved,
  onSolve,
  onOpenHint,
}) => {
  const [s1, setS1] = useState<boolean>(false);
  const [s2, setS2] = useState<boolean>(false);
  const [s3, setS3] = useState<boolean>(false);
  const [s4, setS4] = useState<boolean>(false);

  const [errorStatus, setErrorStatus] = useState<boolean>(false);
  const [successStatus, setSuccessStatus] = useState<boolean>(false);

  // Boolean computations
  const outXOR = s1 !== s2 ? 1 : 0; // XOR gate
  const outAND = s3 && s4 ? 1 : 0; // AND gate
  const finalOR = outXOR === 1 || outAND === 1 ? 1 : 0; // OR gate
  // Balanced excitation requires both upper & lower safety relays active
  const isTargetAchieved = outXOR === 1 && outAND === 1;

  const handleToggle = (sw: 's1' | 's2' | 's3' | 's4') => {
    if (isSolved || successStatus) return;
    sound.playClick();
    if (sw === 's1') setS1(!s1);
    if (sw === 's2') setS2(!s2);
    if (sw === 's3') setS3(!s3);
    if (sw === 's4') setS4(!s4);
  };

  const handleEnergizeRelay = () => {
    if (isSolved) return;
    if (isTargetAchieved) {
      sound.playCorrect();
      setSuccessStatus(true);
      setTimeout(() => {
        onSolve();
      }, 700);
    } else {
      sound.playWrong();
      setErrorStatus(true);
      setTimeout(() => {
        setErrorStatus(false);
      }, 1400);
    }
  };

  return (
    <div className="p-6 bg-slate-950/90 border border-slate-800 rounded-2xl max-w-lg mx-auto shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono-code text-teal-400">PUZZLE 04 · DIGITAL CIRCUIT RELAY</span>
          <h3 className="font-display text-lg font-bold text-slate-100">Logic Gate Switchboard</h3>
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

      <p className="mt-3 text-xs text-slate-300 leading-relaxed">
        Route voltage to the blast door power bus. The dual safety lock requires <span className="text-cyan-300 font-semibold">both Branch A (XOR) and Branch B (AND)</span> to output <span className="font-mono-code text-cyan-300">HIGH (1)</span> simultaneously.
      </p>

      {/* Interactive Circuit Schematic Visualizer */}
      <div className="mt-5 p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
        {/* Branch A: XOR Gate */}
        <div className="p-3 rounded-lg border border-slate-800/80 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleToggle('s1')}
                className="flex items-center gap-2 text-xs font-mono-code px-2 py-1 rounded bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-200 transition-colors"
              >
                {s1 ? <ToggleRight className="w-4 h-4 text-cyan-400" /> : <ToggleLeft className="w-4 h-4 text-slate-500" />}
                <span>S1: {s1 ? '1 (ON)' : '0 (OFF)'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleToggle('s2')}
                className="flex items-center gap-2 text-xs font-mono-code px-2 py-1 rounded bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-200 transition-colors"
              >
                {s2 ? <ToggleRight className="w-4 h-4 text-cyan-400" /> : <ToggleLeft className="w-4 h-4 text-slate-500" />}
                <span>S2: {s2 ? '1 (ON)' : '0 (OFF)'}</span>
              </button>
            </div>
            <span className="text-xs text-slate-500">➔</span>
            <div className="px-2.5 py-1.5 rounded bg-purple-950/50 border border-purple-500/40 text-purple-300 text-xs font-bold font-mono-code">
              XOR GATE
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Output:</span>
            <span className={`px-2 py-0.5 rounded font-mono-code text-xs font-bold ${outXOR ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40' : 'bg-slate-800 text-slate-500'}`}>
              {outXOR}
            </span>
          </div>
        </div>

        {/* Branch B: AND Gate */}
        <div className="p-3 rounded-lg border border-slate-800/80 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleToggle('s3')}
                className="flex items-center gap-2 text-xs font-mono-code px-2 py-1 rounded bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-200 transition-colors"
              >
                {s3 ? <ToggleRight className="w-4 h-4 text-cyan-400" /> : <ToggleLeft className="w-4 h-4 text-slate-500" />}
                <span>S3: {s3 ? '1 (ON)' : '0 (OFF)'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleToggle('s4')}
                className="flex items-center gap-2 text-xs font-mono-code px-2 py-1 rounded bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-200 transition-colors"
              >
                {s4 ? <ToggleRight className="w-4 h-4 text-cyan-400" /> : <ToggleLeft className="w-4 h-4 text-slate-500" />}
                <span>S4: {s4 ? '1 (ON)' : '0 (OFF)'}</span>
              </button>
            </div>
            <span className="text-xs text-slate-500">➔</span>
            <div className="px-2.5 py-1.5 rounded bg-blue-950/50 border border-blue-500/40 text-blue-300 text-xs font-bold font-mono-code">
              AND GATE
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Output:</span>
            <span className={`px-2 py-0.5 rounded font-mono-code text-xs font-bold ${outAND ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40' : 'bg-slate-800 text-slate-500'}`}>
              {outAND}
            </span>
          </div>
        </div>

        {/* Master Output Bus */}
        <div className={`p-3 rounded-lg border flex items-center justify-between transition-colors ${
          isTargetAchieved || isSolved
            ? 'border-emerald-500/50 bg-emerald-950/30 text-emerald-300'
            : 'border-slate-800 bg-slate-950/80 text-slate-400'
        }`}>
          <div className="flex items-center gap-2">
            <Zap className={`w-4 h-4 ${isTargetAchieved || isSolved ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            <span className="font-display text-xs font-bold">PRIMARY DOOR POWER RELAY</span>
          </div>
          <span className="font-mono-code text-xs font-bold">
            {isTargetAchieved || isSolved ? 'ENERGIZED (HIGH · 5V)' : 'INSUFFICIENT VOLTAGE (LOW · 0V)'}
          </span>
        </div>
      </div>

      {/* Action Footer */}
      {!isSolved && !successStatus ? (
        <button
          type="button"
          onClick={handleEnergizeRelay}
          className="mt-5 w-full py-3 rounded-xl font-display text-sm font-bold tracking-wider text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-300 hover:from-teal-300 hover:to-cyan-200 transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>COMMIT CIRCUIT LOGIC</span>
        </button>
      ) : (
        <div className="mt-5 p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/30 text-emerald-300 text-xs flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <p className="font-semibold text-emerald-200">Circuit Bus Energized</p>
            <p className="text-[11px] text-emerald-300/80 mt-0.5">
              Power grid active. Blast door magnetic seals are primed for final override code.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
