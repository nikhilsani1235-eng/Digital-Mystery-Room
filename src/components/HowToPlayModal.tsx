/**
 * How to Play Guide Modal
 * Explains mechanics: Mystery Game Hub, room navigation, clue inventory, puzzles, hint system, and scoring.
 */

import React from 'react';
import { X, Search, KeyRound, Puzzle, HelpCircle, LayoutGrid, CheckCircle2 } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      icon: <LayoutGrid className="w-5 h-5 text-cyan-400" />,
      title: '1. Choose Your Mystery in Game Hub',
      desc: 'Select from 4 independent escape chambers: The Vault (🔐), Secret Lab (🧪), Cyber Room (💻), and Haunted Room (👻). All rooms are unlocked and playable independently from the beginning.',
    },
    {
      icon: <Search className="w-5 h-5 text-sky-400" />,
      title: '2. Investigate Chamber Stations',
      desc: 'Hover and click interactive objects (doors, safes, terminals, paintings, clocks, curio drawers, test tubes, altars) to examine lore, find hidden numbers, and reveal encrypted clues.',
    },
    {
      icon: <KeyRound className="w-5 h-5 text-purple-400" />,
      title: '3. Collect Clues in Inventory',
      desc: 'Inspecting items registers evidence into your Clue Inventory. Access Clues anytime from the top bar to review cipher texts, numerical tags, and circuit diagrams.',
    },
    {
      icon: <Puzzle className="w-5 h-5 text-emerald-400" />,
      title: '4. Crack Multi-Stage Puzzles',
      desc: 'Solve each room’s interconnected puzzles: numeric tumbler codes, ancient rune alignment matrices, Caesar substitution ciphers, and digital Boolean circuit switches.',
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-teal-400" />,
      title: '5. Execute Final Escape Code',
      desc: 'Synthesize clues to punch the final override code into the primary exit door. Escape to view your score breakdown, time bonus, rank honor, and earn the COMPLETED badge in the Hub.',
    },
    {
      icon: <HelpCircle className="w-5 h-5 text-amber-400" />,
      title: '6. Tactical Hints & Independent Timers',
      desc: 'Each room maintains independent localStorage save states and countdown clocks. Resetting or playing one room never erases the progress of your other rooms.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl max-w-2xl w-full my-8 shadow-2xl shadow-cyan-950/60 p-6 sm:p-8 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono-code text-cyan-400 uppercase tracking-wider">
              PLAYER BRIEFING & INSTRUCTIONS
            </span>
            <h2 className="font-display text-xl font-bold text-white mt-0.5">
              How to Play Digital Mystery Room
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps List */}
        <div className="mt-6 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/50 flex items-start gap-4"
            >
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-750 shrink-0 mt-0.5">
                {step.icon}
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-slate-100">
                  {step.title}
                </h3>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-display text-xs font-bold tracking-wider text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 transition-all shadow-md shadow-cyan-500/20"
          >
            UNDERSTOOD · COMMENCE
          </button>
        </div>
      </div>
    </div>
  );
};
