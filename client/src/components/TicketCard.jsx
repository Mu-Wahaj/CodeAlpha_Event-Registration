// The signature visual element of the app: an event rendered as a ticket stub.
// Left panel carries event info; right stub carries the date and spots remaining,
// separated by a perforated tear-line with punch notches top and bottom.
import React from 'react';
import { Link } from 'react-router-dom';

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export default function TicketCard({ event, index = 0 }) {
  const date = new Date(event.date);
  const day = date.getDate();
  const month = MONTHS[date.getMonth()];
  const time = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const isFull = event.spotsLeft <= 0;
  const isSoon = event.spotsLeft > 0 && event.spotsLeft <= 5;

  return (
    <Link
      to={`/events/${event._id}`}
      style={{ animationDelay: `${index * 60}ms` }}
      className="ticket-card group flex opacity-0 animate-riseIn hover:-translate-y-1 transition-transform duration-200 will-change-transform"
    >
      <div className="flex-1 p-5 flex flex-col gap-2 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: event.coverColor || '#E8A33D' }}
          />
          <span className="font-mono text-[11px] uppercase tracking-widest text-pine-900/50">
            {event.category}
          </span>
        </div>
        <h3 className="font-display text-xl leading-tight text-pine-900 tracking-wide truncate group-hover:text-marigold transition-colors">
          {event.title}
        </h3>
        <p className="text-sm text-pine-900/60 line-clamp-2">{event.description}</p>
        <div className="mt-auto pt-2 flex items-center gap-1.5 text-sm text-pine-900/70">
          <span className="font-mono text-xs">{event.location}</span>
          <span className="text-pine-900/30">·</span>
          <span className="font-mono text-xs">{time}</span>
        </div>
      </div>

      <div className="ticket-perforation w-24 shrink-0 flex flex-col items-center justify-center gap-1 py-4 relative">
        <span className="notch notch-top" />
        <span className="notch notch-bottom" />
        <span className="font-display text-3xl leading-none text-pine-900">{day}</span>
        <span className="font-mono text-[10px] tracking-widest text-pine-900/60">{month}</span>
        <div className="mt-2 text-center">
          {isFull ? (
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-stamp">Full</span>
          ) : isSoon ? (
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-stamp">
              {event.spotsLeft} left
            </span>
          ) : (
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-sage">
              {event.spotsLeft} open
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
