# TalentBridge - Recruitment Platform

A full-stack local recruitment marketplace connecting companies and job candidates.

## Tech Stack

- **Frontend**: React + TailwindCSS + React Router v6 + Zustand
- **Backend**: Node.js + Express.js + Prisma ORM
- **Database**: PostgreSQL
- **Auth**: JWT (access + refresh tokens) + bcrypt
- **File Storage**: Local disk
- **Email**: Nodemailer

## Features

- Role-based authentication (Admin + Candidate)
- Job listings with advanced filters
- Application tracking system
- Admin dashboard with analytics
- Candidate dashboard with profile management
- Company profiles
- Email notifications

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Docker (optional)

### Option 1: Docker

```bash
docker-compose up
```

Access:
- App: http://localhost:3000
- API: http://localhost:5000

### Option 2: Manual Setup

1. **Clone and install**
```bash
cd client && npm install
cd ../server && npm install
```

2. **Setup database**
```bash
cd server
cp .env.example .env
# Edit .env with your PostgreSQL credentials
npx prisma generate
npx prisma db push
npm run db:seed
```

3. **Start servers**
```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

## Demo Credentials

**Admin**: admin@talentbridge.com / Admin@123

**Candidate**: candidate accounts created via registration (password: Candidate@123 for seeded accounts)

## API Endpoints

### Auth
- `POST /api/auth/register` - Register candidate
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Jobs
- `GET /api/jobs` - List jobs (public)
- `GET /api/jobs/:id` - Job detail
- `GET /api/jobs/featured` - Featured jobs

### Companies
- `GET /api/companies` - List companies
- `GET /api/companies/:id` - Company detail

### Applications (candidate)
- `POST /api/applications` - Apply
- `GET /api/applications/mine` - My applications
- `DELETE /api/applications/:id` - Withdraw

### Profile
- `GET /api/profile` - Get profile
- `PUT /api/profile` - Update profile
- `POST /api/profile/photo` - Upload photo
- `POST /api/profile/resume` - Upload resume

### Admin Routes
- `/api/admin/jobs` - Manage jobs
- `/api/admin/companies` - Manage companies
- `/api/admin/applications` - Manage applications
- `/api/admin/candidates` - View candidates
- `/api/analytics/*` - Analytics data

## Project Structure

```
├── client/                   # React frontend
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── store/
│   │   ├── services/
│   │   └── utils/
├── server/                   # Express API
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── services/
│   │   └── prisma/
├── docker-compose.yml
└── README.md
```

## Environment Variables

See `.env.example` in server directory.

## License

MIT
