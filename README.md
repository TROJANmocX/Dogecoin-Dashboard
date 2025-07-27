# Dogecoin Dashboard

A modern web dashboard for predicting Dogecoin prices using live AI models. This project features a Next.js frontend and a FastAPI backend, providing both a mock API for development and a real backend for production or advanced use.

## Features

- Live Dogecoin price prediction
- Interactive dashboard UI
- Switchable between mock API and FastAPI backend
- Modern design with React, Next.js, and Tailwind CSS
- Extensible card components and theming support

## Tech Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: FastAPI (Python)
- UI Components: Custom and shadcn/ui

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/TROJANmocX/Dogecoin-Dashboard.git
cd Dogecoin-Dashboard
```

### 2. Install frontend dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Start the FastAPI backend

```bash
uvicorn app:app --reload
```

### 4. Start the Next.js frontend

```bash
npm run dev
```

### 5. Switch between mock API and FastAPI backend

Edit `app/page.tsx` and set `USE_FASTAPI` to `true` to use the FastAPI backend, or `false` to use the mock API.

## Project Structure

- `app.py` — FastAPI backend
- `app/` — Next.js frontend pages and API routes
- `components/` — Reusable UI components
- `app/api/predict/route.ts` — Mock API for development
- `app/page.tsx` — Main dashboard page

## License

MIT

---

**Project Description:**  
Dogecoin Dashboard is a full-stack web application for visualizing and predicting Dogecoin prices. It combines a modern React/Next.js frontend with a FastAPI backend, allowing for both rapid prototyping (with a mock API) and real AI-powered predictions. The dashboard is designed for extensibility, clean UI, and ease of use for both developers and end-users.
