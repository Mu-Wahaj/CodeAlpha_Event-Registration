// Loading placeholder shaped like a TicketCard, so the layout doesn't jump when data arrives.
import React from 'react';

export default function TicketSkeleton() {
  return (
    <div className="ticket-card flex animate-pulse">
      <div className="flex-1 p-5 flex flex-col gap-3">
        <div className="h-2.5 w-16 bg-pine-900/10 rounded" />
        <div className="h-5 w-3/4 bg-pine-900/10 rounded" />
        <div className="h-3 w-full bg-pine-900/10 rounded" />
        <div className="h-3 w-2/3 bg-pine-900/10 rounded" />
        <div className="mt-auto h-2.5 w-1/2 bg-pine-900/10 rounded" />
      </div>
      <div className="ticket-perforation w-24 shrink-0 flex flex-col items-center justify-center gap-2 py-4">
        <div className="h-7 w-7 bg-pine-900/10 rounded" />
        <div className="h-2 w-8 bg-pine-900/10 rounded" />
      </div>
    </div>
  );
}
