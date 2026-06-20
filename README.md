# 🎯 Job Application Tracker

A full-stack web application to track job applications, manage interview pipelines, and generate AI-powered cover letters — built to solve a real problem during my own job search.

🔗 **Live Demo:** [job-application-tracker-one-pi.vercel.app](https://job-application-tracker-one-pi.vercel.app)

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure register/login system
- 📊 **Analytics Dashboard** — Interview rate, offer rate, and status breakdown with charts
- 🗂️ **Kanban Board** — Visual pipeline from Applied → Screening → Interview → Offer → Rejected
- 📋 **List View** — Search, filter, and manage all applications
- 🗓️ **Interview Reminders** — Track upcoming interview dates
- 🎯 **Monthly Goal Tracker** — Set and track application goals
- ✨ **AI Cover Letter Generator** — Generate personalized cover letters using LLaMA 3.1 via Groq API
- 📁 **CSV Export** — Download all application data anytime

---

## 🛠️ Tech Stack

**Frontend:**
- React JS
- React Router DOM
- Axios
- Recharts (data visualization)
- React Hot Toast

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (Authentication)
- Bcrypt (Password hashing)

**AI Integration:**
- Groq API (LLaMA 3.1) for cover letter generation

**Deployment:**
- Frontend → Vercel
- Backend → Railway
- Database → MongoDB Atlas

---

## 🚀 Getting Started

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

App will run on `http://localhost:3000`

---

## 💡 Why I Built This

While applying to jobs, I found myself losing track of applications across spreadsheets and notes. So I built a tool to solve my own problem — combining a clean UI with practical features like interview reminders, analytics, and AI-assisted cover letter writing.

---

## 👤 Author

**Praveen Shah**
- Frontend Developer
- 📧 praveenshah7002@gmail.com
- 🔗 [LinkedIn](https://www.linkedin.com/in/praveen-shah-12589a307)
- 💻 [GitHub](https://github.com/praveenshah7)
- 🌐 [Portfolio](https://praveen-shah-portfolio.vercel.app)
