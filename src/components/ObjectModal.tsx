/**
 * Interactive Object Investigation Modal
 * Displays visual inspection view, lore details, found clues, and embedded puzzles.
 * Supports all rooms and dynamic puzzle dispatching.
 */

import React, { useState } from 'react';
import { RoomObjectInfo, GameProgress } from '../types/game';
import { getRoomClues, getRoomPuzzles, CLUES } from '../data/gameData';
import { NumericLockPuzzle } from './puzzles/NumericLockPuzzle';
import { SymbolSequencePuzzle } from './puzzles/SymbolSequencePuzzle';
import { CipherTerminalPuzzle } from './puzzles/CipherTerminalPuzzle';
import { LogicGatePuzzle } from './puzzles/LogicGatePuzzle';
import { FinalDoorKeypadPuzzle } from './puzzles/FinalDoorKeypadPuzzle';
import { X, Search, Puzzle, CheckCircle2, KeyRound } from 'lucide-react';

interface ObjectModalProps {
  objectInfo: RoomObjectInfo | null;
  progress: GameProgress;
  onClose: () => void;
  onSolvePuzzle: (puzzleId: number) => void;
  onOpenHint: (puzzleId: number) => void;
  onOpenInventory: () => void;
}

export const ObjectModal: React.FC<ObjectModalProps> = ({
  objectInfo,
  progress,
  onClose,
  onSolvePuzzle,
  onOpenHint,
  onOpenInventory,
}) => {
  if (!objectInfo) return null;

  const [activeTab, setActiveTab] = useState<'inspect' | 'puzzle'>(
    objectInfo.hasPuzzle ? 'puzzle' : 'inspect'
  );

  const roomClues = getRoomClues(progress.currentRoomId);
  const roomPuzzles = getRoomPuzzles(progress.currentRoomId);

  const associatedClue = objectInfo.hasClue && objectInfo.clueId
    ? roomClues.find((c) => c.id === objectInfo.clueId) || CLUES.find((c) => c.id === objectInfo.clueId)
    : null;

  const currentPuzzle = objectInfo.hasPuzzle && objectInfo.puzzleId
    ? roomPuzzles.find((p) => p.id === objectInfo.puzzleId)
    : null;

  const isPuzzleSolved = objectInfo.hasPuzzle && objectInfo.puzzleId
    ? progress.solvedPuzzleIds.includes(objectInfo.puzzleId)
    : false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl max-w-2xl w-full my-8 shadow-2xl shadow-cyan-950/50 overflow-hidden flex flex-col relative">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <span className="text-xs font-mono-code text-cyan-400 uppercase tracking-wider">
              {objectInfo.subtitle}
            </span>
            <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
              {objectInfo.name}
              {isPuzzleSolved && (
                <span className="text-xs font-normal text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Solved
                </span>
              )}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-850 transition-colors"
            aria-label="Close Investigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls (if object has both inspect & puzzle) */}
        {objectInfo.hasPuzzle && (
          <div className="flex border-b border-slate-800 bg-slate-950/30 px-6">
            <button
              onClick={() => setActiveTab('inspect')}
              className={`py-3 px-4 text-xs font-semibold tracking-wider font-display border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'inspect'
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>INSPECT OBJECT</span>
            </button>
            <button
              onClick={() => setActiveTab('puzzle')}
              className={`py-3 px-4 text-xs font-semibold tracking-wider font-display border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'puzzle'
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Puzzle className="w-3.5 h-3.5" />
              <span>INTERACTIVE PUZZLE</span>
              {isPuzzleSolved && <span className="text-[10px] text-emerald-400 font-bold">✓</span>}
            </button>
          </div>
        )}

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto max-h-[75vh]">
          {activeTab === 'inspect' ? (
            <div className="space-y-5">
              {objectInfo.image && (
                <div className="w-full h-56 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                  <img
                    src={objectInfo.image}
                    alt={objectInfo.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              )}

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-sm text-slate-300 leading-relaxed">
                <h4 className="font-display text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Investigation Findings
                </h4>
                <p>{objectInfo.detailedInspection}</p>
              </div>

              {/* Clue Discovery Banner */}
              {associatedClue && (
                <div className="p-4 rounded-xl border border-cyan-500/40 bg-cyan-950/30 text-cyan-200 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-cyan-900/60 border border-cyan-500/40 text-cyan-300">
                      <KeyRound className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono-code text-cyan-400 uppercase">
                        Clue Registered: {associatedClue.badgeLabel}
                      </span>
                      <h4 className="font-display text-sm font-bold text-white mt-0.5">
                        {associatedClue.title}
                      </h4>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {associatedClue.summary}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={onOpenInventory}
                    className="shrink-0 px-3 py-1.5 rounded-lg border border-cyan-500/50 bg-cyan-900/50 text-cyan-200 text-xs font-semibold hover:bg-cyan-800/50 transition-colors"
                  >
                    View in Inventory
                  </button>
                </div>
              )}

              {objectInfo.hasPuzzle && !isPuzzleSolved && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setActiveTab('puzzle')}
                    className="px-6 py-2.5 rounded-xl font-display text-xs font-bold tracking-wider text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 transition-all flex items-center gap-2"
                  >
                    <Puzzle className="w-4 h-4 fill-current" />
                    <span>PROCEED TO PUZZLE</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div>
              {/* Dispatch based on puzzle type or fallback to puzzleId */}
              {((currentPuzzle?.puzzleType === 'numeric') || objectInfo.puzzleId === 1 || objectInfo.puzzleId === 101 || objectInfo.puzzleId === 102 || objectInfo.puzzleId === 302) && (
                <NumericLockPuzzle
                  isSolved={isPuzzleSolved}
                  targetCode={currentPuzzle?.config?.expectedCode || '7349'}
                  title={currentPuzzle?.title}
                  codename={currentPuzzle?.codename}
                  description={currentPuzzle?.instructions}
                  onSolve={() => onSolvePuzzle(objectInfo.puzzleId!)}
                  onOpenHint={() => onOpenHint(objectInfo.puzzleId!)}
                />
              )}

              {((currentPuzzle?.puzzleType === 'symbol') || objectInfo.puzzleId === 2 || objectInfo.puzzleId === 201 || objectInfo.puzzleId === 301) && (
                <SymbolSequencePuzzle
                  isSolved={isPuzzleSolved}
                  availableRunes={currentPuzzle?.config?.availableRunes}
                  targetSequence={currentPuzzle?.config?.expectedSequence}
                  title={currentPuzzle?.title}
                  codename={currentPuzzle?.codename}
                  description={currentPuzzle?.instructions}
                  onSolve={() => onSolvePuzzle(objectInfo.puzzleId!)}
                  onOpenHint={() => onOpenHint(objectInfo.puzzleId!)}
                />
              )}

              {((currentPuzzle?.puzzleType === 'cipher') || objectInfo.puzzleId === 3 || objectInfo.puzzleId === 202) && (
                <CipherTerminalPuzzle
                  isSolved={isPuzzleSolved}
                  ciphertext={currentPuzzle?.config?.ciphertext || 'FLSHHU'}
                  shift={currentPuzzle?.config?.shift || 3}
                  targetPlaintext={currentPuzzle?.config?.plaintext || 'CIPHER'}
                  title={currentPuzzle?.title}
                  codename={currentPuzzle?.codename}
                  description={currentPuzzle?.instructions}
                  onSolve={() => onSolvePuzzle(objectInfo.puzzleId!)}
                  onOpenHint={() => onOpenHint(objectInfo.puzzleId!)}
                />
              )}

              {((currentPuzzle?.puzzleType === 'logic') || objectInfo.puzzleId === 4) && (
                <LogicGatePuzzle
                  isSolved={isPuzzleSolved}
                  onSolve={() => onSolvePuzzle(4)}
                  onOpenHint={() => onOpenHint(4)}
                />
              )}

              {((currentPuzzle?.puzzleType === 'final-code') || objectInfo.puzzleId === 5 || objectInfo.puzzleId === 103 || objectInfo.puzzleId === 203 || objectInfo.puzzleId === 303) && (
                <FinalDoorKeypadPuzzle
                  isSolved={isPuzzleSolved}
                  solvedPuzzleIds={progress.solvedPuzzleIds}
                  targetCodes={
                    currentPuzzle?.config?.expectedCodes ||
                    (currentPuzzle?.config?.expectedCode ? [currentPuzzle.config.expectedCode] : ['7349', '734910'])
                  }
                  title={currentPuzzle?.title}
                  codename={currentPuzzle?.codename}
                  checklistItems={currentPuzzle?.config?.checklistItems}
                  onSolve={() => onSolvePuzzle(objectInfo.puzzleId!)}
                  onOpenHint={() => onOpenHint(objectInfo.puzzleId!)}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
