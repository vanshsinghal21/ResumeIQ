# 🚀 ResumeIQ

> AI-Powered Secure Cloud Resume Management System

ResumeIQ is a full-stack cloud-based application that enables users to securely upload, manage, and analyze resumes using Artificial Intelligence. The platform provides ATS scoring, AI-generated feedback, secure cloud storage, and an intuitive dashboard to help users improve their resumes.

---

## 📌 Project Overview

Traditional resume management is often manual, insecure, and lacks intelligent feedback. ResumeIQ solves these problems by combining secure cloud storage with AI-powered resume analysis.

Users can:

- Upload resumes securely
- Store files in AWS S3
- Receive AI-generated ATS scores
- Get personalized improvement suggestions
- Manage all resumes from a modern dashboard

---

## ✨ Features

### 🔐 Authentication

- User Signup
- Email OTP Verification
- Login
- JWT Authentication
- Forgot Password with OTP

### ☁️ Cloud Storage

- Secure AWS S3 Uploads
- Signed Download URLs
- Resume Deletion
- Cloud-based File Management

### 🤖 AI Resume Analysis

- ATS Score
- Resume Summary
- Strengths Detection
- Missing Skills Identification
- AI Improvement Suggestions

### 📊 Dashboard

- ATS Analytics
- Resume Statistics
- Resume Library
- Search Functionality

### 🐳 Docker Support

- Dockerized Frontend
- Dockerized Backend
- Docker Compose Configuration

---

# 🏗️ System Architecture

```
React Frontend
       │
       ▼
Express.js API
       │
       ▼
Authentication (JWT)
       │
 ┌───────────────┐
 │               │
 ▼               ▼
MongoDB Atlas   AWS S3
       │
       ▼
Groq AI Analysis
```

---

# 🛠 Tech Stack

## Frontend

- React
- Vite
- Tailwind CSS
- Axios
- React Router
- Lucide Icons
- Recharts

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose

## AI

- Groq API (Llama Model)

## Cloud

- AWS S3
- MongoDB Atlas

## Security

- JWT Authentication
- bcrypt Password Hashing
- OTP Email Verification
- Signed S3 URLs

## Deployment

- Docker
- Docker Compose

---

# 📂 Project Structure

```
ResumeIQ
│
├── frontend
│   ├── src
│   ├── public
│   ├── Dockerfile
│   └── package.json
│
├── backend
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── utils
│   ├── config
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/vanshsinghal21/ResumeIQ.git

cd ResumeIQ
```

---

## Backend

```bash
cd backend

npm install
```

Create a `.env` file:

```env
PORT=5000

MONGO_URI=your_mongodb_uri

JWT_SECRET=your_secret

AWS_ACCESS_KEY_ID=your_key

AWS_SECRET_ACCESS_KEY=your_secret

AWS_REGION=ap-south-1

AWS_BUCKET_NAME=your_bucket

EMAIL_USER=your_email

EMAIL_PASS=your_password

GROQ_API_KEY=your_groq_key
```

Run backend

```bash
npm start
```

---

## Frontend

```bash
cd frontend

npm install
```

Create `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

Run frontend

```bash
npm run dev
```

---

# 🐳 Docker Setup

Run the complete project using Docker:

```bash
docker compose up --build
```

Frontend

```
http://localhost:5173
```

Backend

```
http://localhost:5000
```

Stop Containers

```bash
docker compose down
```

---

# 📷 Application Screens

- Dashboard
- Resume Library
- AI Resume Analysis
- Authentication
- OTP Verification

---

# 🔒 Security Features

- JWT Authentication
- Password Encryption using bcrypt
- OTP Email Verification
- Secure AWS S3 Storage
- Signed Download URLs
- Environment Variable Protection

---

# 🚀 Future Enhancements

- AI Resume Builder
- Job Description Matching
- Multi-language Resume Analysis
- Resume Version History
- Recruiter Portal
- Admin Dashboard
- AI Interview Preparation

---

# 👨‍💻 Developed By

**Vansh Singhal**

B.Tech CSE (Data Science)

ABES Engineering College

IBM SkillsBuild Project

---

# 📜 License

This project is developed for educational purposes under the IBM SkillsBuild Program.