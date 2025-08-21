// src/pages/TrainingsPage.jsx
import React, { useState } from "react";
import { useEvents } from "../hooks/useEvents";
import EventsList from "../components/EventsList";
import Select from "../components/ui/Select";
import Sidebar from "../components/layout/Sidebar";

const initialFilters = { q: "", sport: "", level: "", city: "", date: "", when: "", quick: new Set(), sortBy: "time" };

export default function TrainingsPage({ onJoin }) {
  const [filters, setFilters] = useState(initialFilters);
  const { filteredEvents, loading } = useEvents(filters);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
      <Sidebar filters={filters} setFilters={setFilters} />
      <main className="grid gap-4 content-start">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold">Treningi ({filteredEvents.length})</h2>
          <div className="flex items-center gap-2 text-[var(--muted)]">
            Sortuj:
            <Select 
              value={filters.sortBy} 
              onChange={(e) => setFilters(f => ({...f, sortBy: e.target.value}))} 
              className="min-w-40"
            >
              <option value="time">Najbliższy termin</option>
              <option value="distance">Najbliżej</option>
              <option value="popular">Najpopularniejsze</option>
            </Select>
          </div>
        </div>
        {loading ? <p>Wczytywanie treningów...</p> : <EventsList events={filteredEvents} onJoin={onJoin} />}
      </main>
    </div>
  );
}