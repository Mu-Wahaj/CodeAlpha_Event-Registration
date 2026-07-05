import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-40 bg-pine-900/95 backdrop-blur border-b border-paper/10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-display text-2xl tracking-wide text-paper flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-marigold" />
          Gather
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-paper/70 hover:text-paper transition-colors">
            Browse
          </Link>

          {user?.role === 'organizer' && (
            <Link to="/my-events" className="text-sm font-medium text-paper/70 hover:text-paper transition-colors">
              My events
            </Link>
          )}

          {user?.role === 'attendee' && (
            <Link to="/my-tickets" className="text-sm font-medium text-paper/70 hover:text-paper transition-colors">
              My tickets
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3 pl-3 border-l border-paper/15">
              <span className="text-sm text-paper/50 font-mono hidden sm:inline">{user.name}</span>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-paper/70 hover:text-stamp transition-colors"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 pl-3 border-l border-paper/15">
              <Link to="/login" className="text-sm font-medium text-paper/70 hover:text-paper transition-colors">
                Log in
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold bg-marigold text-pine-950 px-4 py-2 rounded-lg hover:brightness-110 transition"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
