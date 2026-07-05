// Organizer view of everyone registered for one of their events.
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import EmptyState from '../components/EmptyState';

export default function Attendees() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get(`/events/${id}`), api.get(`/events/${id}/attendees`)]).then(([eventRes, attRes]) => {
      setEvent(eventRes.data.data);
      setAttendees(attRes.data.data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="max-w-2xl mx-auto px-6 py-16 text-paper/50 font-mono text-sm">Loading…</div>;

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <Link to="/my-events" className="font-mono text-xs text-paper/50 hover:text-paper/80">&larr; My events</Link>
      <p className="font-mono text-xs uppercase tracking-widest text-marigold mt-4 mb-2">Attendee list</p>
      <h1 className="font-display text-3xl tracking-wide text-paper mb-1">{event?.title}</h1>
      <p className="text-paper/50 text-sm mb-8">{attendees.length} registered</p>

      {attendees.length === 0 ? (
        <EmptyState title="No one has registered yet" message="Once attendees reserve a spot, they'll show up here." />
      ) : (
        <div className="ticket-card divide-y divide-pine-900/10">
          {attendees.map((a) => (
            <div key={a._id} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="font-medium text-pine-900">{a.user.name}</p>
                <p className="font-mono text-xs text-pine-900/50">{a.user.email}</p>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-sage">Confirmed</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
