// src/components/layout/Footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-white/15 bg-white/10 px-[clamp(14px,3vw,28px)] py-4 text-[var(--muted)]">
      © {new Date().getFullYear()} SPORDER · SP ZOO BOBO💙 ·{" "}
      <a className="underline decoration-dotted" href="#">
        O aplikacji
      </a>
    </footer>
  );
}