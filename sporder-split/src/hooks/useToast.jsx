// src/hooks/useToast.js
import React, { useState, useRef } from "react";

export function useToast() {
  const [msg, setMsg] = useState("");
  const hideRef = useRef(null);

  const show = (m) => {
    setMsg(m);
    clearTimeout(hideRef.current);
    hideRef.current = setTimeout(() => setMsg(""), 2600);
  };

  const node = (
    <div
      className={`fixed bottom-4 right-4 z-[60] rounded-xl border border-sky-400/50 bg-gradient-to-b from-sky-400/40 to-sky-400/20 px-4 py-3 text-white shadow-xl backdrop-blur ${
         msg ? "opacity-100" : "pointer-events-none opacity-0"
      } transition-opacity`}
      role="status"
      aria-live="polite"
    >
      {msg}
    </div>
  );

  return { show, node };
}