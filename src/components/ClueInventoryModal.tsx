/**
 * Clue Inventory Modal
 * Organizes discovered chamber clues with full inspection records and puzzle links.
 * Dynamically presents clues for the currently active room.
 */

import React, { useState } from 'react';
import { ClueItem, RoomId } from '../types/game';
import { getRoomClues, CLUES } from '../data/gameData';
import { KeyRound, X, Lock, FileText } from 'lucide-react';

interface ClueInventoryModalProps {
  isOpen: boolean;
  discoveredClueIds: string[];
  currentRoomId?: RoomId;
  onClose: () => void;
  onSelectObjectForPuzzle?: (targetPuzzleId: number) => void;
}

export const ClueInventoryModal: React.FC<ClueInventoryModalProps> = ({
  isOpen,
  discoveredClueIds,
  currentRoomId = 'cyber-room',
  onClose,
}) => {
  if (!isOpen) return null;

  const roomClues = getRoomClues(currentRoomId) || CLUES;

  const [selectedClue, setSelectedClue] = useState<ClueItem | null>(() => {
    const firstDiscovered = roomClues.find((c) => discoveredClueIds.includes(c.id));
    return firstDiscovered || roomClues[0];
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl max-w-4xl w-full max-h-[85vh] shadow-2xl shadow-cyan-950/60 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-white tracking-wide">
                CLUE INVENTORY & EVIDENCE ARCHIVE
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span>Discovered: {discoveredClueIds.length} of {roomClues.length} Clues</span>
                <span aria-hidden="true">·</span>
                <span className="text-cyan-400 font-mono-code">
                  {roomClues.length > 0 ? Math.round((discoveredClueIds.length / roomClues.length) * 100) : 0}% Complete
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close Inventory"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Split Master-Detail */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Clue List Sidebar */}
          <div className="w-full md:w-5/12 border-r border-slate-800 overflow-y-auto p-4 space-y-2 bg-slate-950/30">
            {roomClues.map((clue) => {
              const isDiscovered = discoveredClueIds.includes(clue.id);
              const isSelected = selectedClue?.id === clue.id;

              return (
                <button
                  key={clue.id}
                  type="button"
                  onClick={() => setSelectedClue(clue)}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'border-cyan-400/80 bg-cyan-950/40 shadow-sm'
                      : isDiscovered
                      ? 'border-slate-800 hover:border-slate-700 bg-slate-900/60'
                      : 'border-slate-850 bg-slate-950/40 opacity-50'
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                    isDiscovered
                      ? 'bg-cyan-950/80 text-cyan-400 border border-cyan-500/30'
                      : 'bg-slate-900 text-slate-600 border border-slate-800'
                  }`}>
                    {isDiscovered ? <FileText className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-mono-code text-cyan-400/90 uppercase truncate">
                        {clue.type}
                      </span>
                      {isDiscovered && (
                        <span className="text-[10px] text-emerald-400 font-semibold shrink-0">
                          Found
                        </span>
                      )}
                    </div>
                    <h4 className={`text-xs font-semibold mt-0.5 truncate ${
                      isDiscovered ? 'text-slate-200' : 'text-slate-500'
                    }`}>
                      {isDiscovered ? clue.title : 'Undiscovered Evidence'}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                      {isDiscovered ? clue.summary : 'Inspect chamber objects to register clue.'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Clue Detail Inspector */}
          <div className="w-full md:w-7/12 p-6 overflow-y-auto flex flex-col justify-between bg-slate-900/40">
            {selectedClue ? (
              <div>
                {discoveredClueIds.includes(selectedClue.id) ? (
                  <div className="space-y-5">
                    <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-mono-code text-cyan-400 mb-1">
                          <span>TYPE: {selectedClue.type.toUpperCase()}</span>
                          <span aria-hidden="true">·</span>
                          <span>LINKED TO PUZZLE #{selectedClue.targetPuzzleId}</span>
                        </div>
                        <h3 className="font-display text-xl font-bold text-white">
                          {selectedClue.title}
                        </h3>
                      </div>

                      <div className="px-3 py-1 rounded-md border border-cyan-500/40 bg-cyan-950/60 font-mono-code text-xs text-cyan-300 shrink-0">
                        {selectedClue.badgeLabel}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-display text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Summary
                      </h4>
                      <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/50 p-3.5 rounded-xl border border-slate-800">
                        {selectedClue.summary}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-display text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Full Decrypted Notes & Evidence
                      </h4>
                      <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/80 p-4 rounded-xl border border-cyan-500/20 shadow-inner font-mono-code text-xs">
                        {selectedClue.content}
                      </p>
                    </div>

                    <div className="text-xs text-slate-400">
                      <span>Source Object: </span>
                      <span className="text-cyan-300 font-semibold capitalize">
                        {selectedClue.associatedObject.replace(/-/g, ' ')}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500">
                    <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-4">
                      <Lock className="w-8 h-8 text-slate-600" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-slate-400 mb-1">
                      Classified Clue Data
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm">
                      Inspect the stations in the chamber to locate and decrypt this piece of evidence.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                Select a clue from the archive list to examine details.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
