# DevJobs — Full Stack Job Board with AI Resume Matching

A production-ready MERN stack job board where job seekers upload resumes, get AI-powered job match scores, and track applications — while recruiters post jobs and manage applicants.

📦 **Live demo:** https://dev-jobs-tau-seven.vercel.app
📦 **Backend API:** https://devjobs-api-xd3w.onrender.com

> ⚠️ Backend is hosted on Render free tier — first request may take 20–30 seconds to wake up after inactivity.

---



## Features

### Job Seeker
- Browse and filter jobs by skills, location, type, and salary range
- Upload PDF resume — skills and experience auto-extracted using keyword matching
- AI-powered job match scoring with missing skills and improvement suggestions (Google Gemini API)
- Track all applications and view real-time status updates (applied → shortlisted → hired / rejected)
- Personalized job recommendations on homepage based on resume skills

### Recruiter
- Post, edit, and delete job listings
- View all applicants per job with their extracted skills and resume link
- Update application statuses — shortlist, reject, or hire applicants

### Admin
- Platform stats dashboard — total users, jobs, and applications
- User management — change roles and ban/unban accounts
- Job moderation — delete any listing regardless of who posted it

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Redux Toolkit, React Router v6, Tailwind CSS, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Authentication | JWT (Bearer token), bcryptjs |
| File Storage | Cloudinary (PDF resume hosting) |
| AI Integration | Google Gemini API (`gemini-2.5-flash`) |
| Resume Parsing | pdf-parse (text extraction) + custom keyword extractor |
| Deployment | Vercel (frontend), Render (backend) |

---

## Architecture Highlights

- **Role-based access control** — seeker, recruiter, and admin roles enforced via Express middleware on every protected route
- **Ownership-based authorization** — recruiters can only edit/delete their own job postings and view applicants for their own jobs only
- **Resume pipeline** — PDF upload → Cloudinary storage → text extraction → regex + keyword matching → AI scoring
- **Match score caching** — Gemini API scores cached on the Application document to avoid repeated API calls for the same user/job pair
- **Rate limiting** — AI match endpoint rate-limited to 10 requests/hour per IP to prevent abuse and control API costs
- **Client-side skill matching** — homepage job recommendations use fast client-side overlap scoring; expensive AI call only runs on deliberate user action (match score page)
- **MVC architecture** — controllers, models, routes, middlewares, and utilities fully separated throughout

---

## Screenshots

> Add screenshots here

---

## Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free) — [mongodb.com/atlas](https://mongodb.com/atlas)
- Cloudinary account (free) — [cloudinary.com](https://cloudinary.com)
- Google AI Studio API key (free) — [aistudio.google.com](https://aistudio.google.com)

---

### Backend

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_long_random_secret_key
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

```bash
npm run dev
```

Backend runs at `http://localhost:5000`

---

### Frontend

```bash
cd client
npm install
```

Create `client/.env.local`:

```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`

---

### Creating an Admin Account

1. Register a normal account via the UI
2. Go to MongoDB Atlas → Browse Collections → `users`
3. Find your user → edit the `role` field from `"seeker"` to `"admin"`
4. Login with that account — you now have admin access

---

## Project Structure
DevJobs/
├── server/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.js     # Register, login, logout, getMe
│   │   ├── job.controller.js      # CRUD + filters + text search
│   │   ├── application.controller.js  # Apply, track, update status
│   │   ├── resume.controller.js   # Upload, parse, manual skills
│   │   ├── match.controller.js    # Gemini AI scoring + caching
│   │   └── admin.controller.js    # Stats, user/job management
│   ├── middlewares/
│   │   ├── auth.middleware.js     # JWT verification (Bearer token)
│   │   ├── role.middleware.js     # RBAC — restrictTo()
│   │   ├── upload.middleware.js   # Multer memory storage, PDF only
│   │   └── rateLimiter.middleware.js  # 10 req/hr on AI endpoint
│   ├── models/
│   │   ├── user.model.js          # User schema (seeker/recruiter/admin)
│   │   ├── job.model.js           # Job schema with text index
│   │   └── application.model.js   # Application with unique compound index
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── job.routes.js
│   │   ├── application.routes.js
│   │   ├── resume.routes.js
│   │   ├── match.routes.js
│   │   └── admin.routes.js
│   └── utils/
│       ├── jwt.js                 # Token generation
│       ├── cloudinary.js          # Cloudinary config
│       ├── uploadBuffer.js        # Buffer → Cloudinary stream upload
│       ├── pdfParser.js           # Text extraction from PDF buffer
│       ├── skillExtractor.js      # Keyword + regex parser
│       ├── skillsList.js          # 80+ tech skills reference list
│       └── gemini.js              # Gemini API prompt + response handler
├── client/
│   └── src/
│       ├── api/
│       │   ├── axios.js           # Axios instance with Bearer token interceptor
│       │   ├── authApi.js
│       │   ├── jobApi.js
│       │   ├── applicationApi.js
│       │   ├── resumeApi.js
│       │   ├── matchApi.js
│       │   └── adminApi.js
│       ├── components/
│       │   ├── Navbar.jsx         # Responsive with mobile hamburger menu
│       │   ├── JobCard.jsx
│       │   ├── FilterSidebar.jsx
│       │   ├── StatusBadge.jsx
│       │   ├── SkillTag.jsx
│       │   ├── ResumeUpload.jsx   # Drag-and-drop PDF uploader
│       │   ├── MatchScoreRing.jsx # SVG radial progress ring
│       │   ├── RecommendedJobs.jsx
│       │   ├── ProtectedRoute.jsx
│       │   ├── Skeleton.jsx
│       │   └── ErrorBoundary.jsx
│       ├── hooks/
│       │   └── useAuth.js         # Session check on app load
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── BrowseJobs.jsx
│       │   ├── JobDetail.jsx
│       │   ├── SeekerProfile.jsx
│       │   ├── MyApplications.jsx
│       │   ├── MatchScore.jsx
│       │   ├── PostJob.jsx
│       │   ├── RecruiterDashboard.jsx
│       │   ├── JobApplicants.jsx
│       │   └── AdminPanel.jsx
│       └── store/
│           ├── store.js
│           ├── authSlice.js
│           └── jobSlice.js
└── README.md

---

## API Reference

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/auth/me` | Auth | Get current user |
| GET | `/api/jobs` | Public | Browse jobs with filters + pagination |
| POST | `/api/jobs` | Recruiter | Create job listing |
| PUT | `/api/jobs/:id` | Recruiter (owner) | Update own job |
| DELETE | `/api/jobs/:id` | Recruiter (owner) | Delete own job |
| POST | `/api/applications/:jobId` | Seeker | Apply to job |
| GET | `/api/applications/mine` | Seeker | View own applications |
| GET | `/api/applications/job/:jobId` | Recruiter (owner) | View job applicants |
| PATCH | `/api/applications/:id/status` | Recruiter (owner) | Update applicant status |
| POST | `/api/resume/upload` | Seeker | Upload + parse PDF resume |
| GET | `/api/resume/info` | Seeker | Get parsed resume data |
| POST | `/api/match/:jobId` | Seeker | Generate AI match score |
| GET | `/api/match/:jobId` | Seeker | Get cached match score |
| GET | `/api/admin/stats` | Admin | Platform statistics |
| GET | `/api/admin/users` | Admin | List all users |
| PATCH | `/api/admin/users/:id` | Admin | Update user role/ban status |
| DELETE | `/api/admin/jobs/:id` | Admin | Delete any job listing |

---

## Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel | https://dev-jobs-tau-seven.vercel.app |
| Backend | Render | https://devjobs-api-xd3w.onrender.com |
| Database | MongoDB Atlas | Cloud hosted |
| File Storage | Cloudinary | Cloud hosted |

---

## Author

**Vipin Kumar**

[![GitHub](https://img.shields.io/badge/GitHub-Vipin4712-black?logo=github)](https://github.com/Vipin4712)

---

## License

MIT