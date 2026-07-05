import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const { show } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      show('Welcome back');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="ticket-card w-full max-w-sm p-8">
        <p className="font-mono text-xs uppercase tracking-widest text-pine-900/50 mb-1">Admit one</p>
        <h1 className="font-display text-2xl tracking-wide text-pine-900 mb-6">Welcome back</h1>

        {error && (
          <p className="text-sm text-stamp bg-stamp/10 border border-stamp/30 rounded-lg px-3 py-2 mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-pine-900/50 mb-1.5">Email</label>
            <input
              type="email" required autoFocus
              className="w-full px-3 py-2.5 rounded-lg border border-pine-900/15 bg-white/60 focus:border-marigold outline-none transition"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-pine-900/50 mb-1.5">Password</label>
            <input
              type="password" required
              className="w-full px-3 py-2.5 rounded-lg border border-pine-900/15 bg-white/60 focus:border-marigold outline-none transition"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button
            type="submit" disabled={submitting}
            className="w-full bg-pine-900 text-paper font-semibold py-2.5 rounded-lg hover:bg-pine-800 transition disabled:opacity-50"
          >
            {submitting ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="mt-6 text-sm text-pine-900/60 text-center">
          New here? <Link to="/register" className="text-stamp font-medium">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
