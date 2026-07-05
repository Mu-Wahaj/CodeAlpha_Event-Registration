// A friendly, actionable empty state instead of a blank screen.
import React from 'react';

export default function EmptyState({ title, message, action }) {
  return (
    <div className="ticket-card flex flex-col items-center text-center gap-3 py-14 px-6">
      <div className="w-14 h-14 rounded-full border-2 border-dashed border-pine-900/20 flex items-center justify-center">
        <span className="font-display text-2xl text-pine-900/30">?</span>
      </div>
      <h3 className="font-display text-lg tracking-wide text-pine-900">{title}</h3>
      <p className="text-sm text-pine-900/60 max-w-sm">{message}</p>
      {action}
    </div>
  );
}
