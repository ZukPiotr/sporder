// src/components/ui/Field.jsx
import React from "react";

export default function Field({ label, children }) {
  return (
    <div className="grid gap-2">
      {label && <label className="text-sm text-[var(--muted)]">{label}</label>}
      {children}
    </div>
  );
}