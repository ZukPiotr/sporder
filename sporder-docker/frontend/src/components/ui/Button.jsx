// src/components/ui/Button.jsx
import React from "react";

export default function Button({ variant = "default", className = "", ...props }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium shadow transition-transform";
  const map = {
    default:
      "border-white/20 bg-white/10 hover:-translate-y-0.5 hover:border-sky-400/80 hover:bg-sky-400/30",
    primary:
      "border-transparent bg-gradient-to-b from-sky-500 to-sky-400 text-sky-950 font-semibold hover:brightness-110",
    ghost: "border-transparent bg-transparent hover:bg-white/5",
  };
  return <button className={`${base} ${map[variant]} ${className}`} {...props} />;
}