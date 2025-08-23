// src/components/WeekCalendar.jsx
import React from "react";
import { fmtDay } from "../utils/formatters";
import { sameDate } from "../utils/date";

export default function WeekCalendar({ events = [] }) {
  const now = new Date();
  const day = now.getDay();
  const mondayOffset = (day + 6) % 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - mondayOffset);
  const range = `${monday.toLocaleDateString("pl-PL", {
    day: "2-digit",
    month: "short",
  })} – ${new Date(
    monday.getFullYear(),
    monday.getMonth(),
    monday.getDate() + 6
  ).toLocaleDateString("pl-PL", { day: "2-digit", month: "short" })}`;

  const days = new Array(7).fill(0).map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });

  return (
    <div className="grid gap-3 rounded-2xl border border-white/15 bg-[var(--panel)] p-3">
      <div className="flex items-center justify-between">
        <strong>Bieżący tydzień</strong>
        <div className="text-[var(--muted)]">{range}</div>
      </div>
      <div className="grid grid-cols-7 gap-2 max-sm:grid-cols-2 sm:max-md:grid-cols-4">
        {days.map((d, idx) => (
          <div
            key={idx}
            className="min-h-24 grid content-start gap-1 rounded-xl border border-dashed border-white/20 bg-white/10 p-2"
          >
            <div className="text-sm text-[var(--muted)]">{fmtDay(d)}</div>
            {events
              .filter((e) => sameDate(e.when, d))
              .slice(0, 3)
              .map((e) => (
                <div
                  key={e.id}
                  className="h-2 w-2 rounded-full bg-[var(--accent)]"
                  title={`${e.sport} · ${e.place}`}
                />
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}