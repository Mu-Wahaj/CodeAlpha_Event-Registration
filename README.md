# Gather — Event Registration System

A full-stack event registration platform: Node/Express/MongoDB backend, React/Tailwind
frontend, styled around a "box office ticket" design (see below).

Runs on different ports than the URL shortener project so you can run both at once:
backend `5001`, frontend `5174`.

## Features
**Auth**
- Register as an attendee or organizer, login, JWT-protected routes

**Attendees**
- Browse/search/filter events by category
- View event details with live spots-remaining count
- Reserve a spot (blocked automatically if the event is full or already happened)
- View "My tickets" — active and cancelled registrations
- Cancel a registration (frees the spot back up)

**Organizers**
- Create, edit, delete events
- View the attendee list for each of their events
- "My events" dashboard

**Email notifications** (via Gmail SMTP)
- Attendee gets a confirmation email the moment they reserve a spot (event, date, time, location)
- Organizer gets a confirmation email when they create an event
- Organizer gets notified by email every time someone registers for their event
- Emails are fire-and-forget: if not configured, or if sending fails, the API still responds normally — nothing breaks

**Design**
Every event is rendered as a torn-ticket stub — a perforated line with punch-hole
notches separates the event info from a date stub showing spots left. Registering
plays a satisfying ink-stamp "Confirmed" animation. Built with Tailwind, Anton
(display), Inter (body), and IBM Plex Mono (ticket IDs/dates) from Google Fonts.

## Not included (optional in the brief, left out to keep scope tight)
Email notifications to organizers, CSV/PDF export of attendee lists, payment
processing, calendar (.ics) export. Ask if you want any of these added.

## Project structure
```
server/    Express API (models, controllers, routes, middleware, validators)
client/    React + Vite + Tailwind frontend
docker-compose.yml
```

## Getting started (local, no Docker)

### Backend
```bash
cd server
cp .env.example .env      # edit MONGO_URI and JWT secrets
npm install
npm run dev                # http://localhost:5001
```

### Frontend
```bash
cd client
npm install
npm run dev                 # http://localhost:5174, proxies /api to :5001
```

### Tests
```bash
cd server
npm test
```
Note: tests use `mongodb-memory-server`, which downloads a MongoDB binary the first
time you run it — needs an internet connection once.

## Getting started (Docker)
```bash
cp server/.env.example server/.env    # edit secrets
docker compose up --build
```
- Client: http://localhost:5174
- API: http://localhost:5001

## Environment variables (server/.env)
| Variable | Description |
|---|---|
| PORT | API port (default 5001) |
| MONGO_URI | MongoDB connection string |
| JWT_ACCESS_SECRET | JWT signing secret — change this |
| CLIENT_URL | Frontend origin, used for CORS |
| RATE_LIMIT_WINDOW_MS / RATE_LIMIT_MAX | Rate limit config |
| EMAIL_USER | Your Gmail address that will send the emails |
| EMAIL_APP_PASSWORD | A Gmail App Password (see below) — not your regular Gmail password |
| EMAIL_HOST / EMAIL_PORT | SMTP settings, defaults work for Gmail |

### Setting up Gmail to send emails
Google blocks sign-in with your normal password for apps like this one, so you need an "App Password":
1. Turn on 2-Step Verification on your Google account: https://myaccount.google.com/security
2. Go to https://myaccount.google.com/apppasswords
3. Create a new app password (name it anything, e.g. "Gather")
4. Copy the 16-character password Google gives you and paste it into `EMAIL_APP_PASSWORD` in `server/.env`
5. Put your Gmail address in `EMAIL_USER`

If you skip this setup, the app still works fully — it just logs a warning instead of sending the email.

## API endpoints
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

GET    /api/events                    ?search=&category=&upcoming=true&page=&limit=
GET    /api/events/:id
POST   /api/events                    (organizer)
PUT    /api/events/:id                (organizer, own events only)
DELETE /api/events/:id                (organizer, own events only)
GET    /api/events/:id/attendees      (organizer, own events only)
GET    /api/events/mine/list          (organizer)
POST   /api/events/:id/register       (attendee)

GET    /api/registrations/me
PATCH  /api/registrations/:id/cancel
```

## Troubleshooting
- **Mongo connection refused**: make sure MongoDB is running and `MONGO_URI` is correct.
- **CORS errors**: `CLIENT_URL` must exactly match the frontend's origin and port.
- **"Organizer access required" on create event**: you registered as an attendee —
  create a new account and choose "organizer" on sign-up.
