// Attendee's "wallet" of registrations — active and past, with cancel support.
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import Stamp from '../components/Stamp';
import EmptyState from '../components/EmptyState';

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export default function MyTickets() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { show } = useToast();

  const load = () => {
    setLoading(true);
    api.get('/registrations/me').then(({ data }) => setRegistrations(data.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCancel = async (id) => {
    try {
      await api.patch(`/registrations/${id}/cancel`);
      setRegistrations((prev) => prev.map((r) => (r._id === id ? { ...r, status: 'cancelled' } : r)));
      show('Registration cancelled');
    } catch (err) {
      show(err.response?.data?.message || 'Could not cancel', 'error');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-marigold mb-2">Your wallet</p>
      <h1 className="font-display text-3xl tracking-wide text-paper mb-8">My tickets</h1>

      {loading ? (
        <p className="text-paper/50 font-mono text-sm">Loading…</p>
      ) : registrations.length === 0 ? (
        <EmptyState
          title="No tickets yet"
          message="Once you reserve a spot at an event, it'll show up here."
          action={
            <Link to="/" className="mt-2 bg-marigold text-pine-950 font-semibold px-5 py-2.5 rounded-lg text-sm hover:brightness-110 transition">
              Browse events
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {registrations.map((r) => {
            if (!r.event) return null;
            const date = new Date(r.event.date);
            return (
              <div key={r._id} className="ticket-card flex">
                <div className="flex-1 p-5 flex flex-col gap-1.5 min-w-0">
                  <h3 className="font-display text-lg tracking-wide text-pine-900 truncate">{r.event.title}</h3>
                  <p className="font-mono text-xs text-pine-900/60">{r.event.location}</p>
                  <div className="mt-1">
                    <Stamp status={r.status} />
                  </div>
                </div>
                <div className="ticket-perforation w-28 shrink-0 flex flex-col items-center justify-center gap-1.5 py-4 relative">
                  <span className="notch notch-top" />
                  <span className="notch notch-bottom" />
                  <span className="font-display text-2xl leading-none text-pine-900">{date.getDate()}</span>
                  <span className="font-mono text-[10px] tracking-widest text-pine-900/60">{MONTHS[date.getMonth()]}</span>
                  {r.status === 'registered' && (
                    <button
                      onClick={() => handleCancel(r._id)}
                      className="mt-2 font-mono text-[10px] uppercase tracking-wider text-stamp hover:underline"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
