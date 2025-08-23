// src/components/layout/Header.jsx
import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../ui/Button";
import Badge from "../ui/Badge";

const navItems = [
  { k: "dashboard", t: "🏠 Pulpit" },
  { k: "trainings", t: "🏃 Treningi" },
  { k: "friends", t: "👥 Znajomi" },
  { k: "bookings", t: "🗓️ Rezerwacje" },
  { k: "profile", t: "⚙️ Profil" },
];

export default function Header({ view, setView, onLoginClick, onRegisterClick }) {
  const { currentUser, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[linear-gradient(180deg,rgba(10,15,26,.85),rgba(10,15,26,.6))] backdrop-blur">
      <div className="flex items-center gap-3 px-[clamp(14px,3vw,28px)] py-3">
        <div className="flex items-center gap-3 font-extrabold tracking-wide">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] shadow-xl">
            <svg width="22" height="22" viewBox="0 0 100 100" aria-label="SPORDER" role="img">
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#2e8bff" />
                  <stop offset="1" stopColor="#5ad1ff" />
                </linearGradient>
              </defs>
              <g transform="skewX(-15)">
                <path d="M70 20c0-8-9-12-20-12C35 8 25 13 19 22l10 7c4-6 12-10 21-10 7 0 10 2 10 5 0 5-7 7-18 10C27 38 16 44 16 57c0 12 11 21 28 21 13 0 24-5 30-13l-10-7c-5 6-13 9-20 9-8 0-12-3-12-7 0-5 6-7 18-10 16-4 30-9 30-25z" fill="url(#g1)" />
              </g>
            </svg>
          </div>
          <span className="text-xl">SPORDER</span>
        </div>

        <nav className="ml-auto flex flex-wrap gap-2">
          {navItems.map((it) => (
            <button
              key={it.k}
              onClick={() => setView(it.k)}
              aria-current={view === it.k ? "page" : undefined}
              className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 transition ${
                view === it.k
                  ? "border-sky-400/60 bg-gradient-to-b from-sky-400/30 to-white/5"
                  : "border-white/20 bg-white/10 hover:border-sky-400/60 hover:bg-gradient-to-b hover:from-sky-400/20 hover:to-white/5"
              }`}
            >
              {it.t}
            </button>
          ))}
        </nav>

        <div className="ml-2 flex items-center gap-2">
          {!currentUser ? (
            <>
              <Button onClick={onLoginClick}>Zaloguj</Button>
              <Button variant="primary" onClick={onRegisterClick}>Zarejestruj</Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Badge>👋 {currentUser.name}</Badge>
              <Button variant="ghost" onClick={logout}>Wyloguj</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}