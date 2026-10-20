/**
 * About Project Modal
 * Academic documentation for the B.Tech Computer Science & Engineering semester project.
 */

import React from 'react';
import { ACADEMIC_PROJECT_INFO } from '../data/gameData';
import { X, GraduationCap, Cpu, Code2, Sparkles, BookOpen, Layers } from 'lucide-react';

interface AboutProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutProjectModal: React.FC<AboutProjectModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl max-w-2xl w-full my-8 shadow-2xl shadow-cyan-950/60 p-6 sm:p-8 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono-code text-cyan-400 uppercase tracking-wider">
                {ACADEMIC_PROJECT_INFO.course} · {ACADEMIC_PROJECT_INFO.semester}
              </span>
              <h2 className="font-display text-lg sm:text-xl font-bold text-white mt-0.5">
                {ACADEMIC_PROJECT_INFO.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="mt-5 space-y-5 max-h-[65vh] overflow-y-auto pr-1">
          {/* Main Statement required by brief */}
          <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-sm text-cyan-100 leading-relaxed font-light">
            &ldquo;{ACADEMIC_PROJECT_INFO.description}&rdquo;
          </div>

          {/* Key Architectural Highlights */}
          <div>
            <h3 className="font-display text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>Core CSE Concepts & Architecture</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {ACADEMIC_PROJECT_INFO.keyFeatures.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                  <span className="text-cyan-400 font-bold font-mono-code">•</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack Specs */}
          <div>
            <h3 className="font-display text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>Technology Stack & Modules</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {ACADEMIC_PROJECT_INFO.techStack.map((tech, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                  <span className="text-[10px] font-mono-code text-slate-500 uppercase block">{tech.name}</span>
                  <span className="font-semibold text-slate-200 mt-0.5 block">{tech.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Credits */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-slate-200">{ACADEMIC_PROJECT_INFO.credits.institution}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{ACADEMIC_PROJECT_INFO.credits.studentName}</p>
            </div>
            <div className="text-right sm:text-right font-mono-code text-[11px] text-cyan-400">
              {ACADEMIC_PROJECT_INFO.credits.year}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
