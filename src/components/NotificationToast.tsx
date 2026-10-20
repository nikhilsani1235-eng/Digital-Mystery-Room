/**
 * In-Game Notification Toast
 * Emits glowing cyber alerts for clue discoveries, puzzle clears, and hints.
 */

import React from 'react';
import { Sparkles } from 'lucide-react';

interface NotificationToastProps {
  notification: { title: string; message: string } | null;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ notification }) => {
  if (!notification) return null;

  return (
    <aside
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-bounce-subtle pointer-events-none"
    >
      <div className="bg-slate-900/95 border border-cyan-500/50 rounded-xl p-4 shadow-2xl shadow-cyan-950/80 backdrop-blur-lg flex items-start gap-3">
        <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 shrink-0">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-display text-sm font-bold text-cyan-300 tracking-wide">
            {notification.title}
          </h4>
          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed break-words">
            {notification.message}
          </p>
        </div>
      </div>
    </aside>
  );
};
