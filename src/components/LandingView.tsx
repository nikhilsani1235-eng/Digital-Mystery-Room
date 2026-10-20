/**
 * Landing Page Component
 * Showcases Project Title, Tagline, Primary CTA buttons, Mystery Room Overview, and Academic Credits
 */

import React from 'react';
import { GameProgress } from '../types/game';
import { GAME_IMAGES, ACADEMIC_PROJECT_INFO } from '../data/gameData';
import { Play, RotateCcw, BookOpen, GraduationCap, Sparkles, LayoutGrid, Shield, Cpu, Terminal, Clock } from 'lucide-react';

interface LandingViewProps {
  progress: GameProgress;
  hasSavedGame: boolean;
  onStartNewGame: () => void;
  onContinueGame: () => void;
  onOpenHowToPlay: () => void;
  onOpenAbout: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  progress,
  hasSavedGame,
  onStartNewGame,
  onContinueGame,
  onOpenHowToPlay,
  onOpenAbout,
}) => {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden">
      {/* Background Graphic with Scrim */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <img
          src={GAME_IMAGES.roomBackground}
          alt="Digital Mystery Room Interior"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-30 filter blur-xs scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.15),transparent_70%)]" />
      </div>

      {/* Main Hero Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-16 w-full flex-1 flex flex-col items-center justify-center text-center">
        {/* Academic Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-semibold tracking-wide uppercase mb-6 backdrop-blur-md">
          <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
          <span>B.Tech CSE Semester Project · Mystery Game Hub</span>
        </div>

        {/* Title & Tagline */}
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl text-balance">
          DIGITAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400">MYSTERY</span> ROOM
        </h1>

        <p className="mt-4 sm:mt-6 text-lg sm:text-2xl font-light text-slate-300 max-w-2xl text-balance">
          Can you solve the mystery before time runs out?
        </p>

        {/* Call to Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-5 w-full max-w-xl">
          {hasSavedGame && (
            <button
              onClick={onContinueGame}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-display text-base font-bold tracking-wider text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <RotateCcw className="w-5 h-5 text-slate-950" />
              <span>CONTINUE GAME</span>
            </button>
          )}

          <button
            onClick={onStartNewGame}
            className={`w-full sm:w-auto px-8 py-4 rounded-xl font-display text-base font-bold tracking-wider transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
              hasSavedGame
                ? 'bg-slate-900/90 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-950/50 hover:border-cyan-400'
                : 'text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-teal-300 hover:from-cyan-300 hover:to-teal-200 shadow-xl shadow-cyan-500/30'
            }`}
          >
            <Play className="w-5 h-5 fill-current" />
            <span>START MYSTERY</span>
          </button>

          <button
            onClick={onStartNewGame}
            className="w-full sm:w-auto px-7 py-4 rounded-xl font-display text-base font-semibold tracking-wide text-cyan-300 bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/40 hover:border-cyan-400 transition-all flex items-center justify-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <LayoutGrid className="w-5 h-5 text-cyan-400" />
            <span>CHOOSE ROOM</span>
          </button>

          <button
            onClick={onOpenHowToPlay}
            className="w-full sm:w-auto px-6 py-4 rounded-xl font-display text-base font-semibold tracking-wide text-slate-200 bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700 hover:border-purple-500/50 transition-all flex items-center justify-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
          >
            <BookOpen className="w-5 h-5 text-purple-400" />
            <span>HOW TO PLAY</span>
          </button>
        </div>

        {/* 4 Mystery Rooms Preview Quick Bar */}
        <div className="mt-14 w-full max-w-4xl p-5 rounded-2xl bg-slate-900/40 border border-slate-800 backdrop-blur-md text-left">
          <div className="flex items-center justify-between mb-3 text-xs font-mono-code text-cyan-400">
            <span className="flex items-center gap-1.5 uppercase font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              AVAILABLE MYSTERY ROOMS IN THE HUB
            </span>
            <span className="text-slate-500 hidden sm:inline">Play any room independently</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2.5">
              <span className="text-lg">🔐</span>
              <div>
                <span className="font-bold text-white block">THE VAULT</span>
                <span className="text-[10px] text-slate-400">Unlock the vault</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2.5">
              <span className="text-lg">🧪</span>
              <div>
                <span className="font-bold text-white block">SECRET LAB</span>
                <span className="text-[10px] text-slate-400">Airlock escape</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2.5">
              <span className="text-lg">💻</span>
              <div>
                <span className="font-bold text-white block">CYBER ROOM</span>
                <span className="text-[10px] text-slate-400">Digital puzzles</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2.5">
              <span className="text-lg">👻</span>
              <div>
                <span className="font-bold text-white block">HAUNTED ROOM</span>
                <span className="text-[10px] text-slate-400">Manor curse</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Bento Row */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl text-left">
          <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-sm hover:border-cyan-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-display text-base font-bold text-slate-100">4 Mystery Chambers</h3>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Explore the Bank Vault, Secret Bio Lab, Cyber Chamber, and Haunted Ravenwood Manor.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-sm hover:border-purple-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="font-display text-base font-bold text-slate-100">Multi-Stage Puzzles</h3>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Caesar cipher decryption, rune matrices, numeric combinations, and Boolean circuit switchboards.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-sm hover:border-amber-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-display text-base font-bold text-slate-100">Independent Timers</h3>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Custom countdown clocks and tiered hints per difficulty setting with procedural Web Audio alarms.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-sm hover:border-teal-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-teal-950/60 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-3">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-display text-base font-bold text-slate-100">Per-Room Persistence</h3>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Progress for each room is isolated in localStorage so resetting one room never affects the others.
            </p>
          </div>
        </div>
      </main>

      {/* About Project & Academic Credits Section */}
      <footer className="w-full border-t border-slate-900 bg-slate-950/80 backdrop-blur-md py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="text-center md:text-left">
            <p className="font-display text-sm font-semibold text-slate-200">
              {ACADEMIC_PROJECT_INFO.title} · {ACADEMIC_PROJECT_INFO.course}
            </p>
            <p className="mt-1 text-slate-400 max-w-xl">
              Developed as an interactive computer science semester project demonstrating DOM manipulation, finite state machines, cryptography, and responsive UI engineering.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={onOpenAbout}
              className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 font-medium transition-colors"
            >
              Academic Documentation
            </button>
            <span className="text-slate-700">|</span>
            <span className="text-slate-500">{ACADEMIC_PROJECT_INFO.credits.year}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
