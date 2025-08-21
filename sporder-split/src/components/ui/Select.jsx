// src/components/ui/Select.jsx
import React from "react";

export default function Select({ children, className = "", ...props }) {
  return (
    <div className={`relative ${className}`}>
      <select
        {...props}
        className={
          "w-full appearance-none rounded-xl border px-3 py-2 text-white outline-none " +
          "border-white/20 bg-[#1a2437] focus:border-sky-400/80 focus:ring-4 focus:ring-sky-400/30 " +
          "pr-9"
        }
      >
        {children}
      </select>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
        width="16"
        height="16"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path d="M5 7l5 6 5-6" stroke="currentColor" strokeWidth="2" />
      </svg>
    </div>
  );
}