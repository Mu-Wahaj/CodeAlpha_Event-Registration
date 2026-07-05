import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'attendee' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const { show } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      show('Account created');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="ticket-card w-full max-w-sm p-8">
        <p className="font-mono text-xs uppercase tracking-widest text-pine-900/50 mb-1">New account</p>
        <h1 className="font-display text-2xl tracking-wide text-pine-900 mb-6">Join Gather</h1>

        {error && (
          <p className="text-sm text-stamp bg-stamp/10 border border-stamp/30 rounded-lg px-3 py-2 mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-pine-900/50 mb-1.5">Name</label>
            <input
              type="text" required autoFocus
              className="w-full px-3 py-2.5 rounded-lg border border-pine-900/15 bg-white/60 focus:border-marigold outline-none transition"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-pine-900/50 mb-1.5">Email</label>
            <input
              type="email" required
              className="w-full px-3 py-2.5 rounded-lg border border-pine-900/15 bg-white/60 focus:border-marigold outline-none transition"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-pine-900/50 mb-1.5">Password</label>
            <input
              type="password" required minLength={6}
              className="w-full px-3 py-2.5 rounded-lg border border-pine-900/15 bg-white/60 focus:border-marigold outline-none transition"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-pine-900/50 mb-2">I am joining as</label>
            <div className="grid grid-cols-2 gap-2">
              {['attendee', 'organizer'].map((role) => (
                <button
                  type="button" key={role}
                  onClick={() => setForm({ ...form, role })}
                  className={`py-2.5 rounded-lg text-sm font-semibold capitalize border transition ${
                    form.role === role
                      ? 'bg-marigold border-marigold text-pine-950'
                      : 'border-pine-900/15 text-pine-900/60 hover:border-pine-900/30'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit" disabled={submitting}
            className="w-full bg-pine-900 text-paper font-semibold py-2.5 rounded-lg hover:bg-pine-800 transition disabled:opacity-50"
          >
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-sm text-pine-900/60 text-center">
          Already have an account? <Link to="/login" className="text-stamp font-medium">Log in</Link>
        </p>
      </div>
    </div>
  );
}
