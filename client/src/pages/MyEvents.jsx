// Organizer's list of their own events, with edit/delete and a link to see attendees.
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import EmptyState from '../components/EmptyState';

export default function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { show } = useToast();
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    api.get('/events/mine/list').then(({ data }) => setEvents(data.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event? This cannot be undone.')) return;
    try {
      await api.delete(`/events/${id}`);
      setEvents((prev) => prev.filter((e) => e._id !== id));
      show('Event deleted');
    } catch (err) {
      show(err.response?.data?.message || 'Could not delete event', 'error');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-marigold mb-2">Organizer</p>
          <h1 className="font-display text-3xl tracking-wide text-paper">My events</h1>
        </div>
        <button
          onClick={() => navigate('/my-events/new')}
          className="bg-marigold text-pine-950 font-semibold px-5 py-2.5 rounded-lg text-sm hover:brightness-110 transition"
        >
          + New event
        </button>
      </div>

      {loading ? (
        <p className="text-paper/50 font-mono text-sm">Loading…</p>
      ) : events.length === 0 ? (
        <EmptyState
          title="You haven't created any events"
          message="Create your first event and start collecting registrations."
          action={
            <button
              onClick={() => navigate('/my-events/new')}
              className="mt-2 bg-marigold text-pine-950 font-semibold px-5 py-2.5 rounded-lg text-sm hover:brightness-110 transition"
            >
              Create an event
            </button>
          }
        />
      ) : (
        <div className="space-y-3">
          {events.map((e) => (
            <div key={e._id} className="ticket-card p-5 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h3 className="font-display text-lg tracking-wide text-pine-900 truncate">{e.title}</h3>
                <p className="font-mono text-xs text-pine-900/50">
                  {new Date(e.date).toLocaleDateString()} · {e.location} · Capacity {e.capacity}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link to={`/events/${e._id}/attendees`} className="text-sm font-medium text-sage hover:underline">
                  Attendees
                </Link>
                <Link to={`/my-events/${e._id}/edit`} className="text-sm font-medium text-pine-900/70 hover:underline">
                  Edit
                </Link>
                <button onClick={() => handleDelete(e._id)} className="text-sm font-medium text-stamp hover:underline">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
