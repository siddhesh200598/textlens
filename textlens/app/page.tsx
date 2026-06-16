"use client";

import { useState } from "react";

type Result = {
  summary: string;
  keyPoints: string[];
  sentiment: string;
};

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAnalyze() {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      // Frontend talks to OUR backend, not Groq directly
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Failed to analyze.");
      else setResult(data);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const sentimentColor =
    result?.sentiment?.toLowerCase() === "positive"
      ? "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30"
      : result?.sentiment?.toLowerCase() === "negative"
      ? "bg-rose-500/15 text-rose-300 ring-rose-500/30"
      : "bg-slate-500/15 text-slate-300 ring-slate-500/30";

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-indigo-950 text-slate-100 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Text<span className="text-indigo-400">Lens</span>
          </h1>
          <p className="mt-2 text-slate-400">
            Paste any text — get an AI summary, key points, and sentiment.
          </p>
        </header>

        {/* Input card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={7}
            placeholder="Paste an article, email, review, or notes here..."
            className="w-full resize-none rounded-xl border border-white/10 bg-slate-900/60 p-4 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/20"
          />
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {text.trim().length} characters
            </span>
            <button
              onClick={handleAnalyze}
              disabled={loading || text.trim().length < 20}
              className="rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="mt-6 space-y-5 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Summary</h2>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${sentimentColor}`}
              >
                {result.sentiment}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-300">
              {result.summary}
            </p>

            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-200">
                Key Points
              </h3>
              <ul className="space-y-2">
                {result.keyPoints.map((point, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-300">
                    <span className="mt-0.5 text-indigo-400">▸</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <footer className="mt-10 text-center text-xs text-slate-600">
          Built with Next.js · Groq AI
        </footer>
      </div>
    </main>
  );
}
