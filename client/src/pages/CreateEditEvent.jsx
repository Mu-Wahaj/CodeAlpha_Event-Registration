// Shared form for organizers to create or edit an event. Detects edit mode from the URL param.
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

const CATEGORIES = ['Tech', 'Music', 'Business', 'Arts', 'Sports', 'General'];
const COLORS = ['#E8A33D', '#C1443C', '#7FA98F', '#4C7BD9', '#B57BD9'];

const toLocalInput = (isoDate) => {
  const d = new Date(isoDate);
  const offset = d.getTimezoneOffset();
  return new Date(d.getTime() - offset * 60000).toISOString().slice(0, 16);
};

export default function CreateEditEvent() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { show } = useToast();

  const [form, setForm] = useState({
    title: '', description: '', category: 'General', date: '', location: '', capacity: 20, coverColor: COLORS[0]
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/events/${id}`).then(({ data }) => {
      const e = data.data;
      setForm({
        title: e.title, description: e.description, category: e.category,
        date: toLocalInput(e.date), location: e.location, capacity: e.capacity, coverColor: e.coverColor
      });
      setLoading(false);
    });
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = { ...form, date: new Date(form.date).toISOString(), capacity: Number(form.capacity) };
      if (isEdit) {
        await api.put(`/events/${id}`, payload);
        show('Event updated');
      } else {
        await api.post('/events', payload);
        show('Event created');
      }
      navigate('/my-events');
    } catch (err) {
      setError(err.response?.data?.details?.join(', ') || err.response?.data?.message || 'Could not save event');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="max-w-xl mx-auto px-6 py-16 text-paper/50 font-mono text-sm">Loading…</div>;

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-marigold mb-2">
        {isEdit ? 'Edit event' : 'Print a new ticket'}
      </p>
      <h1 className="font-display text-3xl tracking-wide text-paper mb-8">
        {isEdit ? 'Update your event' : 'Create an event'}
      </h1>

      <form onSubmit={handleSubmit} className="ticket-card p-8 space-y-5">
        {error && (
          <p className="text-sm text-stamp bg-stamp/10 border border-stamp/30 rounded-lg px-3 py-2">{error}</p>
        )}

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-pine-900/50 mb-1.5">Title</label>
          <input
            required className="w-full px-3 py-2.5 rounded-lg border border-pine-900/15 bg-white/60 focus:border-marigold outline-none transition"
            value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-pine-900/50 mb-1.5">Description</label>
          <textarea
            required rows={4} className="w-full px-3 py-2.5 rounded-lg border border-pine-900/15 bg-white/60 focus:border-marigold outline-none transition resize-none"
            value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-pine-900/50 mb-1.5">Date & time</label>
            <input
              type="datetime-local" required className="w-full px-3 py-2.5 rounded-lg border border-pine-900/15 bg-white/60 focus:border-marigold outline-none transition"
              value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-pine-900/50 mb-1.5">Capacity</label>
            <input
              type="number" min={1} required className="w-full px-3 py-2.5 rounded-lg border border-pine-900/15 bg-white/60 focus:border-marigold outline-none transition"
              value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-pine-900/50 mb-1.5">Location</label>
          <input
            required className="w-full px-3 py-2.5 rounded-lg border border-pine-900/15 bg-white/60 focus:border-marigold outline-none transition"
            value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-pine-900/50 mb-2">Category</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                type="button" key={c}
                onClick={() => setForm({ ...form, category: c })}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                  form.category === c ? 'bg-pine-900 text-paper' : 'bg-pine-900/5 text-pine-900/60 hover:bg-pine-900/10'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-pine-900/50 mb-2">Accent color</label>
          <div className="flex gap-2">
            {COLORS.map((c) => (
              <button
                type="button" key={c}
                onClick={() => setForm({ ...form, coverColor: c })}
                style={{ backgroundColor: c }}
                className={`w-8 h-8 rounded-full transition ${form.coverColor === c ? 'ring-2 ring-offset-2 ring-pine-900' : ''}`}
              />
            ))}
          </div>
        </div>

        <button
          type="submit" disabled={submitting}
          className="w-full bg-pine-900 text-paper font-semibold py-3 rounded-lg hover:bg-pine-800 transition disabled:opacity-50"
        >
          {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create event'}
        </button>
      </form>
    </div>
  );
}
