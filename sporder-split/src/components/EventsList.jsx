// src/components/EventsList.jsx
import React from "react";
import EventCard from "./EventCard";

export default function EventsList({ events, onJoin }) {
  if (events.length === 0) {
    return <p className="text-[var(--muted)] col-span-full">Brak wyników — zmień filtry.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {events.map((ev) => (
        <EventCard key={ev.id} ev={ev} onJoin={onJoin} />
      ))}
    </div>
  );
}