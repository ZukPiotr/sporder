// src/pages/TrainingsPage.jsx
import React from "react";
import { useEventsContext } from "../contexts/EventsContext";
import { useFilters } from "../contexts/FiltersContext";
import EventsList from "../components/EventsList";
import Select from "../components/ui/Select";

export default function TrainingsPage({ onJoin }) {
  const { filteredEvents, loading } = useEventsContext();
  const { filters, setFilters } = useFilters();

  return (
    <>
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
    </>
  );
}