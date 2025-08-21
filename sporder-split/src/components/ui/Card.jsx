// src/components/ui/Card.jsx
import React from "react";

export default function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-white/15 bg-[var(--card)] shadow-xl ${className}`}
    >
      {children}
    </div>
  );
}