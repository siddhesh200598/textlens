# TextLens — AI Text Summarizer

A complete Next.js app: React frontend + API backend + AI, ready to deploy on Vercel.
Paste text → get a summary, key points, and sentiment.

## Run locally (≈5 minutes)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Get a free Groq API key at https://console.groq.com
   (sign in → API Keys → Create Key — no credit card needed).
3. Create a file named `.env.local` in the project root:
   ```
   GROQ_API_KEY=your_key_here
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000

## Deploy to Vercel (≈3 minutes)

1. Push this folder to a new GitHub repo.
2. Go to https://vercel.com → New Project → import the repo.
3. Add an Environment Variable: `GROQ_API_KEY` = your key.
4. Deploy → you get a live public URL.

## Project structure

```
├─ app/
│  ├─ api/summarize/route.ts   # Backend + AI (runs server-side)
│  ├─ page.tsx                 # Frontend (React UI)
│  ├─ layout.tsx               # Root layout
│  └─ globals.css              # Tailwind styles
├─ package.json
├─ tsconfig.json
├─ tailwind.config.ts
├─ postcss.config.mjs
├─ next.config.mjs
└─ .env.example
```

## How it works (for the interview)

- **Frontend** (`app/page.tsx`) — React client component. Uses `useState`,
  sends text to our own backend via `fetch`, renders loading / error / result.
- **Backend** (`app/api/summarize/route.ts`) — Next.js route handler. Validates
  input, calls Groq AI, parses the JSON, returns clean data.
- **AI** — Groq running Llama 3.3 70B, in JSON mode for a predictable response.
- **Security** — the API key lives server-side, never shipped to the browser.
- **Deploy** — one Next.js project = frontend + backend in a single deployment.
