import React from "react";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import Button from "./ui/Button";
import { fmtTime } from "../utils/formatters";

export default function EventCard({ ev, onJoin }) {
  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="flex h-36 items-end bg-[radial-gradient(600px_230px_at_0%_100%,rgba(90,209,255,.22),transparent_60%),linear-gradient(135deg,rgba(46,139,255,.5),rgba(46,139,255,.15))] p-3">
        <Badge>
          <span className="text-lg">{ev.cover}</span> {ev.sport}
        </Badge>
      </div>
      <div className="grid gap-3 p-4 flex-grow">
        <div className="flex items-center justify-between gap-3">
          <strong className="truncate">{ev.place}</strong>
          <Badge className="text-xs flex-shrink-0">{ev.level}</Badge>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[var(--muted)]">
          <span>📍 {ev.city}</span>
          <span>🗓️ {fmtTime(ev.when)}</span>
          <span>👥 {ev.taken}/{ev.spots}</span>
          <span>📏 {ev.km} km</span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 mt-auto">
          <div className="text-sm text-[var(--muted)]">
            {/* !! TUTAJ JEST POPRAWKA !! */}
            Organizator: {ev.host?.name}
            {ev.friends?.length ? ` · Znajomi: ${ev.friends.join(", ")}` : ""}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost">☆ Obserwuj</Button>
            <Button variant="primary" onClick={() => onJoin(ev.id)}>
              Dołącz
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}