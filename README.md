# Codiz – Full-Stack Quiz Application

Codiz is a modern, full-stack quiz application built with the **MERN stack** (MongoDB, Express.js, React, Node.js) and **Vite**.  
It provides administrators with tools to create and manage quizzes, while users can take quizzes, track scores, and manage their profiles.

---

## Features

### For Users (Professionals)
- **User Authentication** – Secure registration and login system with JWT  
- **Profile Management** – Update name, bio, skills, and upload a profile picture  
- **Quiz Taking** – Clean and intuitive interface for answering quizzes  
- **Quiz History** – View past quizzes, scores, and completion dates  
- **Modern UI** – Responsive and professional interface for seamless use across devices  

### For Admins
- **Full User Privileges** – All standard user features included  
- **Question Set Management** – Create, view, and manage quizzes  
- **Direct Question Creation** – Add questions and multiple-choice options directly  
- **Role-Based Access Control** – Distinction between administrator and professional roles  

---

## Tech Stack

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, Multer  
**Frontend:** React, Vite, TypeScript, React Router, Axios, Custom CSS  

---

## Setup and Installation

### Prerequisites
- Node.js and npm (or yarn) installed  
- MongoDB (local or hosted, e.g., MongoDB Atlas)  

### Backend Setup
cd backend
npm install

### Create a .env file in the backend root directory:
MONGO_URI=your_mongodb_connection_string

AUTH_SECRET_KEY=your_super_secret_jwt_key

### Start the backend server:
npm start

The backend will run at: http://localhost:3000

### Frontend Setup
cd frontend
npm install
npm run dev
The frontend will run at: http://localhost:5173

Codiz/
├── backend/    # Express.js server, models, controllers, routes
└── frontend/   # React app, pages, components, styles
