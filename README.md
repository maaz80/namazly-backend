# 📡 Namazly Server — Backend API

This repository contains the **Backend API Server** for Namazly, a beautiful, privacy-first Qaza Namaz tracking application. The server is built with Node.js, Express, MongoDB (Mongoose), and handles session-based authentication via Google OAuth.

---

## 🕌 Client Frontend Repository
This is the backend server repository. The frontend client user interface is hosted in a separate repository on GitHub:
👉 **[Namazly Frontend Client Repository](https://github.com/maaz80/namazly)**

*(If your GitHub username or repository is named differently, you can modify the link accordingly).*

---

## ✨ Key Backend Features
- **Secure Google OAuth Login** — Verifies Google ID tokens server-side using Google Auth Library.
- **Session-Based Authentication** — Maintains user sessions using express-session and stores records securely.
- **Qaza Salah CRUD APIs** — Endpoints to retrieve, batch update, and modify single prayer counts with schema validation.
- **Database Schema** — Mongoose schema tracking user credentials, avatars, and 6 daily obligatory salah categories.

---

## 📁 Server Folder Structure
```text
server/
├── index.js                  # Entry point (initializes Express, middleware, & database)
├── package.json              # Server dependencies and scripts
├── .env.example              # Sample environment setup template
├── config/
│   └── db.js                 # MongoDB connection logic using Mongoose
├── models/
│   └── User.js               # Database schema for Users and Qaza Salah totals
├── controllers/
│   ├── authController.js     # Handles Google token verification and session control
│   └── recordsController.js  # Performs database updates for user Qaza salah records
├── middleware/
│   └── auth.js               # Route guard requiring a valid logged-in session
└── routes/
    ├── auth.js               # Routing paths for user login status and logouts
    └── records.js            # Routing paths for Qaza salah modifications
```

---

## 🚀 Environment Variables Config
Create a file named `.env` in the `server/` folder with the following keys:
```env
PORT=5000
MONGODB_URI=mongodb+srv://your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_oauth_client_id_here
SESSION_SECRET=your_super_secret_session_key_here
CLIENT_URL=http://localhost:5173
```

---

## 💻 Installation & Local Running

### 1. Install dependencies
```bash
cd server
npm install
```

### 2. Run the server
For development (with hot-reloading via nodemon):
```bash
npm run dev
```
For production launch:
```bash
npm start
```
The server will start listening on `http://localhost:5000`.

---

## 📡 API Endpoints

### 1. Authentication (`/api/auth`)
| Method | Route | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/google` | No | Verifies Google credentials token and initializes session |
| **GET** | `/api/auth/me` | Yes | Retrieves the profile details of the logged-in user |
| **POST** | `/api/auth/logout` | Yes | Destroys the active session and logs the user out |

### 2. Qaza Salah Records (`/api/records`)
| Method | Route | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/records` | Yes | Retrieves the Qaza salah records of the logged-in user |
| **PUT** | `/api/records` | Yes | Replaces all categories of the user's Qaza salah counts |
| **PATCH** | `/api/records/single` | Yes | Modifies a single prayer field (increment/decrement) |
