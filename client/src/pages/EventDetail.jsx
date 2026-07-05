// Full event page rendered as a large ticket. Handles register/cancel with
// an ink-stamp confirmation and keeps the spots-left count live.
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Stamp from '../components/Stamp';

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export default function EventDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { show } = useToast();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [myRegistration, setMyRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = () => {
    setLoading(true);
    const requests = [api.get(`/events/${id}`)];
    if (user?.role === 'attendee') requests.push(api.get('/registrations/me'));

    Promise.all(requests)
      .then(([eventRes, regRes]) => {
        setEvent(eventRes.data.data);
        if (regRes) {
          const mine = regRes.data.data.find((r) => r.event?._id === id);
          setMyRegistration(mine || null);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  const handleRegister = async () => {
    if (!user) return navigate('/login');
    setBusy(true);
    try {
      const { data } = await api.post(`/events/${id}/register`);
      setMyRegistration(data.data);
      setEvent((prev) => ({ ...prev, spotsLeft: prev.spotsLeft - 1, registeredCount: prev.registeredCount + 1 }));
      show('You\u2019re confirmed for this event');
    } catch (err) {
      show(err.response?.data?.message || 'Could not register', 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleCancel = async () => {
    setBusy(true);
    try {
      await api.patch(`/registrations/${myRegistration._id}/cancel`);
      setMyRegistration((prev) => ({ ...prev, status: 'cancelled' }));
      setEvent((prev) => ({ ...prev, spotsLeft: prev.spotsLeft + 1, registeredCount: prev.registeredCount - 1 }));
      show('Registration cancelled');
    } catch (err) {
      show(err.response?.data?.message || 'Could not cancel', 'error');
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return <div className="max-w-3xl mx-auto px-6 py-16 text-paper/50 font-mono text-sm">Loading event…</div>;
  }
  if (!event) {
    return <div className="max-w-3xl mx-auto px-6 py-16 text-paper/50 font-mono text-sm">Event not found.</div>;
  }

  const date = new Date(event.date);
  const day = date.getDate();
  const month = MONTHS[date.getMonth()];
  const isFull = event.spotsLeft <= 0;
  const isRegistered = myRegistration?.status === 'registered';

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="ticket-card flex flex-col sm:flex-row">
        <div className="flex-1 p-8 flex flex-col gap-4 min-w-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: event.coverColor }} />
            <span className="font-mono text-xs uppercase tracking-widest text-pine-900/50">{event.category}</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl leading-tight tracking-wide text-pine-900">
            {event.title}
          </h1>
          <p className="text-pine-900/70 leading-relaxed">{event.description}</p>

          <div className="grid grid-cols-2 gap-4 mt-2 pt-4 border-t border-dashed border-pine-900/15">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-pine-900/40 mb-1">Location</p>
              <p className="text-sm font-medium text-pine-900">{event.location}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-pine-900/40 mb-1">Organizer</p>
              <p className="text-sm font-medium text-pine-900">{event.organizer?.name || 'Unknown'}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-pine-900/40 mb-1">Time</p>
              <p className="text-sm font-medium text-pine-900">
                {date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-pine-900/40 mb-1">Capacity</p>
              <p className="text-sm font-medium text-pine-900">
                {event.registeredCount} / {event.capacity} registered
              </p>
            </div>
          </div>

          {myRegistration && (
            <div className="pt-2">
              <Stamp status={myRegistration.status} />
            </div>
          )}
        </div>

        <div className="ticket-perforation sm:w-48 shrink-0 flex flex-col items-center justify-center gap-3 p-6 relative">
          <span className="notch notch-top" />
          <span className="notch notch-bottom hidden sm:block" />
          <span className="font-display text-5xl leading-none text-pine-900">{day}</span>
          <span className="font-mono text-xs tracking-widest text-pine-900/60">{month}</span>

          <div className="w-full mt-2">
            {!user || user.role === 'attendee' ? (
              isRegistered ? (
                <button
                  onClick={handleCancel}
                  disabled={busy}
                  className="w-full bg-stamp/10 text-stamp border border-stamp/30 font-semibold py-2.5 rounded-lg hover:bg-stamp/20 transition disabled:opacity-50 text-sm"
                >
                  {busy ? 'Cancelling…' : 'Cancel spot'}
                </button>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={busy || isFull}
                  className="w-full bg-marigold text-pine-950 font-semibold py-2.5 rounded-lg hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                >
                  {isFull ? 'Sold out' : busy ? 'Reserving…' : 'Reserve spot'}
                </button>
              )
            ) : (
              <p className="font-mono text-[10px] text-center text-pine-900/40 uppercase tracking-wider">
                Organizer view
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
