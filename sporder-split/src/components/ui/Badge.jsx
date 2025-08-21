// src/components/ui/Badge.jsx
import React from "react";

export default function Badge({ children, className = "" }) {
  return (
    <span
      className={
        "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-sm/none " +
        "border-white/25 bg-white/10 " +
        className
      }
    >
      {children}
    </span>
  );
}