# ♟️ Realtime Online Chess Game

A full-stack **real-time multiplayer chess game** where players can
instantly find opponents, play live matches, and see updates
synchronized in real time. Built with **Next.js**, **Node.js**, and
**Socket.IO**, with server-authoritative game logic powered by
**chess.js**.

------------------------------------------------------------------------

## 🚀 Features

-   ♞ Real-time multiplayer chess using WebSockets (Socket.IO)
-   🔍 Instant matchmaking (auto-pairs waiting players)
-   ✅ Server-side move validation with `chess.js`
-   🔄 Live move synchronization for both players
-   🏁 Game end detection (checkmate, draw, stalemate, etc.)
-   🚪 Disconnect handling with opponent notifications
-   📊 Real-time analytics (games played & players currently playing)
-   🎨 Clean and modern UI inspired by popular chess platforms

------------------------------------------------------------------------

## 🛠 Tech Stack

### Frontend

-   Next.js (App Router)
-   React
-   Tailwind CSS
-   Socket.IO Client

### Backend

-   Node.js
-   Express
-   Socket.IO
-   chess.js

------------------------------------------------------------------------

## 🏗 Architecture Overview

    Frontend (Next.js)
       │
       │ WebSocket (Socket.IO)
       ▼
    Backend (Node.js + Express)
       │
       │ Server-authoritative game logic
       ▼
    chess.js (move validation & game state)

------------------------------------------------------------------------

## 📦 Project Structure

    root
    │
    ├── frontend
    │   ├── app
    │   ├── components
    │   ├── hooks
    │   └── utils
    │
    ├── backend
    │   ├── src
    │   │   ├── Game.ts
    │   │   ├── GameManager.ts
    │   │   └── index.ts
    │   └── package.json
    │
    └── README.md

------------------------------------------------------------------------

## ⚙️ Environment Variables

### Frontend (`.env.local`)

``` env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

### Backend (`.env`)

``` env
PORT=8080
FRONTEND_URL=http://localhost:3000
```

------------------------------------------------------------------------

## ▶️ Running Locally

### 1️⃣ Clone the repository

``` bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2️⃣ Start the backend

``` bash
cd backend
npm install
npm run dev
```

Backend runs on: `http://localhost:8080`

### 3️⃣ Start the frontend

``` bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:3000`

------------------------------------------------------------------------

## 🌐 Deployment

-   **Frontend**: Vercel
-   **Backend**: Railway (WebSocket-friendly)

------------------------------------------------------------------------

## 📈 Real-time Analytics

The homepage displays live analytics using Socket.IO: - Total games
played - Players currently in active matches


------------------------------------------------------------------------

## 👤 Author

Built with ❤️ by Mahtab
