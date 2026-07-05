// Homepage: hero, a horizontally scrolling "now showing" strip of soonest events,
// and a searchable/filterable grid of all events rendered as ticket cards.
import React, { useEffect, useMemo, useState } from 'react';
import api from '../api/axios';
import TicketCard from '../components/TicketCard';
import TicketSkeleton from '../components/TicketSkeleton';
import EmptyState from '../components/EmptyState';

const CATEGORIES = ['All', 'Tech', 'Music', 'Business', 'Arts', 'Sports', 'General'];

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true);
      const params = { upcoming: true, limit: 24 };
      if (search) params.search = search;
      if (category !== 'All') params.category = category;

      api
        .get('/events', { params })
        .then(({ data }) => setEvents(data.data))
        .finally(() => setLoading(false));
    }, 250); // debounce search input

    return () => clearTimeout(timeout);
  }, [search, category]);

  const nowShowing = useMemo(() => events.slice(0, 6), [events]);

  return (
    <div>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-10">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-marigold mb-4">Box office open</p>
        <h1 className="font-display text-5xl sm:text-6xl leading-[1.05] tracking-wide text-paper max-w-2xl">
          Find something worth showing up for.
        </h1>
        <p className="mt-4 text-paper/60 max-w-lg">
          Browse events, grab a spot, and manage your tickets — all in one place.
        </p>
      </section>

      {/* Now showing strip */}
      {nowShowing.length > 0 && (
        <section className="mb-10">
          <div className="max-w-6xl mx-auto px-6 mb-3 flex items-center justify-between">
            <h2 className="font-mono text-xs uppercase tracking-widest text-paper/50">Now showing soon</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide px-6 pb-2 max-w-6xl mx-auto">
            {nowShowing.map((event, i) => (
              <div key={event._id} className="min-w-[320px] max-w-[320px] shrink-0">
                <TicketCard event={event} index={i} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Filters + grid */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search events, locations…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-lg bg-paper/95 border border-transparent focus:border-marigold outline-none transition"
          />
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                  category === c ? 'bg-marigold text-pine-950' : 'bg-paper/10 text-paper/70 hover:bg-paper/20'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <TicketSkeleton key={i} />)}
          </div>
        ) : events.length === 0 ? (
          <EmptyState
            title="No events match yet"
            message="Try a different search term or category — or check back soon, new events are added often."
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((event, i) => <TicketCard key={event._id} event={event} index={i} />)}
          </div>
        )}
      </section>
    </div>
  );
}
