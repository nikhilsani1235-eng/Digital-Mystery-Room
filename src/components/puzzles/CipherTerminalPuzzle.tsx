/**
 * Caesar Cipher Decryption Terminal
 * Educational cryptographic puzzle demonstrating substitution cipher reversal.
 */

import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { Terminal, CheckCircle2, HelpCircle, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';

interface CipherTerminalPuzzleProps {
  isSolved: boolean;
  ciphertext?: string;
  shift?: number;
  targetPlaintext?: string;
  title?: string;
  codename?: string;
  description?: string;
  onSolve: () => void;
  onOpenHint: () => void;
}

export const CipherTerminalPuzzle: React.FC<CipherTerminalPuzzleProps> = ({
  isSolved,
  ciphertext = 'FLSHHU',
  shift = 3,
  targetPlaintext = 'CIPHER',
  title = 'Cyber Deck Decryption Terminal',
  codename = 'PUZZLE 03 · MAINFRAME CIPHER',
  description = 'Decrypt the intercepted payload using Caesar cipher shift reversal.',
  onSolve,
  onOpenHint,
}) => {
  const [userInput, setUserInput] = useState<string>('');
  const [testChar, setTestChar] = useState<string>(ciphertext[0] || 'F');
  const [testShift, setTestShift] = useState<number>(-shift);
  const [errorStatus, setErrorStatus] = useState<boolean>(false);
  const [successStatus, setSuccessStatus] = useState<boolean>(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    `SYSTEM LOG: Caesar substitution cipher active.`,
    `INTERCEPTED PAYLOAD: "${ciphertext}"`,
    `KEY PARAMETER: standard shift = +${shift}`,
    'Awaiting decrypted plaintext authorization...',
  ]);

  // Caesar cipher test helper for players to experiment
  const shiftLetter = (char: string, s: number): string => {
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      return String.fromCharCode(((code - 65 + s + 26) % 26) + 65);
    }
    return char;
  };

  const handleDecryptionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSolved || successStatus) return;

    const cleaned = userInput.trim().toUpperCase();
    if (!cleaned) return;

    if (cleaned === targetPlaintext.toUpperCase()) {
      sound.playCorrect();
      setSuccessStatus(true);
      setConsoleLogs((prev) => [
        ...prev,
        `> decrypt ${cleaned}`,
        'STATUS: 200 OK · CRYPTOGRAPHIC MATCH CONFIRMED.',
        'Core mainframe security firewall bypassed.',
      ]);
      setTimeout(() => {
        onSolve();
      }, 900);
    } else {
      sound.playWrong();
      setErrorStatus(true);
      setConsoleLogs((prev) => [
        ...prev,
        `> decrypt ${cleaned}`,
        'ERROR: 403 FORBIDDEN · PLAINTEXT CHECKSUM MISMATCH.',
      ]);
      setTimeout(() => {
        setErrorStatus(false);
      }, 1500);
    }
  };

  return (
    <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl max-w-xl mx-auto shadow-2xl font-mono-code">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs text-cyan-400 uppercase tracking-wider">{codename}</span>
          <h3 className="font-display text-lg font-bold text-slate-100">{title}</h3>
        </div>
        <button
          onClick={onOpenHint}
          className="p-1.5 rounded-lg border border-amber-500/30 bg-amber-950/30 text-amber-300 hover:bg-amber-900/50 transition-colors text-xs flex items-center gap-1 font-sans"
          title="Need a hint?"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Hint</span>
        </button>
      </div>

      <p className="mt-2 text-xs text-slate-400 font-sans">
        {description}
      </p>

      {/* Terminal Display Screen */}
      <div className="mt-4 p-4 rounded-xl bg-black border border-slate-850 shadow-inner text-xs space-y-1.5 max-h-48 overflow-y-auto">
        <div className="flex items-center gap-1.5 text-slate-500 pb-1 border-b border-slate-900">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>secure_shell_v4.19@substation:~#</span>
        </div>

        {consoleLogs.map((log, i) => (
          <div
            key={i}
            className={`leading-relaxed ${
              log.startsWith('ERROR:')
                ? 'text-red-400'
                : log.startsWith('STATUS:')
                ? 'text-emerald-400 font-bold'
                : log.startsWith('>')
                ? 'text-cyan-300'
                : 'text-slate-400'
            }`}
          >
            {log}
          </div>
        ))}
      </div>

      {/* Interactive Cryptographic Workspace Helper */}
      <div className="mt-4 p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 font-sans">
        <div className="flex items-center justify-between text-xs mb-3">
          <span className="font-display font-semibold text-cyan-300 tracking-wide">
            CAESAR CIPHER DECODER BENCH
          </span>
          <span className="text-[11px] text-slate-400 font-mono-code">Shift -{shift} to Reverse</span>
        </div>

        <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-[10px] text-slate-500 block uppercase font-mono-code">Encrypted Token</span>
            <span className="text-base font-mono-code font-bold text-amber-400 tracking-widest">{ciphertext}</span>
          </div>

          <div className="text-slate-600">➔</div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-mono-code">Sample Shift:</span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-cyan-300 font-mono-code">
              {ciphertext[0]} (-{shift}) = {shiftLetter(ciphertext[0] || 'A', -shift)}
            </span>
          </div>
        </div>
      </div>

      {/* Terminal Submission Form */}
      <form onSubmit={handleDecryptionSubmit} className="mt-5">
        <label htmlFor="decrypted-input" className="block text-xs font-semibold text-slate-300 mb-2 font-sans">
          Enter Decrypted Plaintext Password:
        </label>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              id="decrypted-input"
              type="text"
              value={userInput}
              onChange={(e) => {
                setErrorStatus(false);
                setUserInput(e.target.value.toUpperCase());
              }}
              disabled={isSolved || successStatus}
              placeholder={`TYPE ${targetPlaintext.length}-LETTER WORD...`}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-slate-100 font-mono-code text-sm uppercase tracking-widest outline-none disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={isSolved || successStatus || !userInput.trim()}
            className={`px-6 py-3 rounded-xl font-display text-sm font-bold tracking-wider transition-all flex items-center gap-2 font-sans ${
              isSolved || successStatus
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                : userInput.trim()
                ? 'bg-gradient-to-r from-cyan-400 to-teal-300 text-slate-950 hover:from-cyan-300 hover:to-teal-200 shadow-lg shadow-cyan-500/25 active:scale-98'
                : 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>{isSolved || successStatus ? 'AUTHORIZED' : 'DECRYPT'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {errorStatus && (
          <div className="mt-2 text-xs text-red-400 font-mono-code flex items-center gap-1.5 animate-fade-in font-sans">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>DECRYPTION FAILED · CHECK CAESAR SHIFT ARITHMETIC</span>
          </div>
        )}

        {(isSolved || successStatus) && (
          <div className="mt-2 text-xs text-emerald-400 font-mono-code flex items-center gap-1.5 animate-fade-in font-sans">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>PASSWORD ACCEPTED · SYSTEM BYPASS GRANTED</span>
          </div>
        )}
      </form>
    </div>
  );
};
