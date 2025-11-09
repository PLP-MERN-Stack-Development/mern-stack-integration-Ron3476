# MERN Blog Week 4 - Ready Project

This folder contains a runnable MERN starter project (server + client).
Steps to run (local development):
- Install Node.js v18+
- MongoDB running locally or use Atlas and set MONGO_URI in server/.env
- Server:
  cd server
  cp .env.example .env
  npm install
  npm run dev
- Client:
  cd client
  cp .env.example .env
  npm install
  npm run dev

The client uses Vite and assumes the server is at http://localhost:5000
