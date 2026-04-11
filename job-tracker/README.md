# Job Tracker — Praveen Shah

Full Stack Job Application Tracker built with React + Node.js + MongoDB.

## Tech Stack
- **Frontend:** React, React Router, Axios, Recharts, React Hot Toast
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Bcrypt
- **Database:** MongoDB Atlas (free)

## Features
- Register/Login with JWT Auth
- Add, Edit, Delete job applications
- Kanban board view (Applied → Screening → Interview → Offer → Rejected)
- List view with search & filter
- Dashboard with charts & analytics
- Status update inline

## Setup Instructions

### Step 1 — MongoDB Atlas (Free Database)
1. Go to https://mongodb.com/atlas
2. Sign up free
3. Create a cluster (free tier)
4. Get connection string
5. Replace in backend/.env file

### Step 2 — Backend Setup
```bash
cd backend
npm install
npm run dev
```
Server runs on http://localhost:5000

### Step 3 — Frontend Setup
```bash
cd frontend
npm install
npm start
```
App runs on http://localhost:3000

### Step 4 — Environment Variables
Edit `backend/.env`:
```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
```

## Project Structure
```
job-tracker/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Job.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── jobs.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── .env
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── Layout.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Dashboard.js
    │   │   └── Jobs.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    └── package.json
```
