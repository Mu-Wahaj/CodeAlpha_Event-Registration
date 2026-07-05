import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import MyTickets from './pages/MyTickets';
import MyEvents from './pages/MyEvents';
import CreateEditEvent from './pages/CreateEditEvent';
import Attendees from './pages/Attendees';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-pine-900">
            <Navbar />
            <Routes>
              <Route path="/" element={<Events />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/my-tickets" element={
                <ProtectedRoute role="attendee"><MyTickets /></ProtectedRoute>
              } />

              <Route path="/my-events" element={
                <ProtectedRoute role="organizer"><MyEvents /></ProtectedRoute>
              } />
              <Route path="/my-events/new" element={
                <ProtectedRoute role="organizer"><CreateEditEvent /></ProtectedRoute>
              } />
              <Route path="/my-events/:id/edit" element={
                <ProtectedRoute role="organizer"><CreateEditEvent /></ProtectedRoute>
              } />
              <Route path="/events/:id/attendees" element={
                <ProtectedRoute role="organizer"><Attendees /></ProtectedRoute>
              } />
            </Routes>
          </div>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
