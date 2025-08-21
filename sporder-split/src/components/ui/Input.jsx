// src/components/ui/Input.jsx
import React from "react";

export default function Input(props) {
  return (
    <input
      {...props}
      className={
        "w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-white/70 outline-none " +
        "focus:border-sky-400/80 focus:ring-4 focus:ring-sky-400/30 " +
        (props.className || "")
      }
    />
  );
}