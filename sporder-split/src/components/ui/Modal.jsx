// src/components/ui/Modal.jsx
import React from "react";
import Button from "./Button";

export default function Modal({ open, title, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/60 p-3">
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-white/15 bg-[var(--panel)] shadow-2xl">
        <header className="sticky top-0 flex items-center gap-3 border-b border-white/15 bg-gradient-to-b from-sky-400/30 to-transparent px-4 py-3 backdrop-blur">
          <strong className="text-white">{title}</strong>
          <div className="ml-auto" />
          <Button onClick={onClose} aria-label="Zamknij">✖ Zamknij</Button>
        </header>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}