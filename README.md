# TalentBridge - Recruitment Platform

A fully self-contained recruitment platform demo. All data is stored in browser's localStorage - no database, no server, no Docker.

## Tech Stack

- **Frontend**: React + TailwindCSS + React Router v6 + Zustand
- **Storage**: Browser localStorage (no backend required)

## Features

- Browse jobs and companies (public)
- User registration and login
- Candidate dashboard with profile, applications
- Admin dashboard with job management
- Apply for jobs (saved to localStorage)
- All data persists in browser

## Quick Start

```bash
cd client
npm install
npm run dev
```

Access at: http://localhost:5173

## Demo Login

- **Admin**: admin@talentbridge.com / Admin@123
- **Candidate**: Register any email to login

## Deploy

Simply deploy the `client/` folder to Vercel, Netlify, or any static host.

## Note

- All data stored in localStorage (clears on browser data wipe)
- No real backend - purely frontend demo
- Perfect for demos and prototypes