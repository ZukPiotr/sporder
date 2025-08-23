// src/contexts/EventsContext.jsx
import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import * as eventsApi from "../api/events";
import { sameDate } from "../utils/date";
import { useFilters } from "./FiltersContext"; // <-- IMPORT

const EventsContext = createContext(null);

export function EventsProvider({ children }) {
  const { filters } = useFilters(); // <-- POBIERA FILTRY Z KONTEKSTU
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const events = await eventsApi.fetchEvents();
        setAllEvents(events);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    // ... cała logika filtrowania pozostaje bez zmian
    const { q, sport, level, city, date, when, quick, sortBy } = filters;
    let list = [...allEvents];
    if (q) list = list.filter((e) => [e.sport, e.city, e.place].join(" ").toLowerCase().includes(q.toLowerCase()));
    if (sport) list = list.filter((e) => e.sport === sport);
    if (level) list = list.filter((e) => e.level === level);
    if (city) list = list.filter((e) => e.city.toLowerCase().includes(city.toLowerCase()));
    if (date) { const d = new Date(date); list = list.filter((e) => sameDate(e.when, d)); }
    if (when) {
        const now = new Date();
        if (when === "today") list = list.filter((e) => sameDate(e.when, now));
        if (when === "tomorrow") { const t = new Date(now); t.setDate(now.getDate() + 1); list = list.filter((e) => sameDate(e.when, t)); }
        if (when === "weekend") list = list.filter((e) => [0, 6].includes(e.when.getDay()));
        if (when === "next7") { const lim = new Date(now); lim.setDate(now.getDate() + 7); list = list.filter((e) => e.when <= lim); }
    }
    if (quick?.has("free")) list = list.filter((e) => e.taken < e.spots);
    if (quick?.has("friends")) list = list.filter((e) => e.friends.length > 0);
    if (sortBy === "distance" || quick?.has("near")) list.sort((a, b) => a.km - b.km);
    else if (sortBy === "popular") list.sort((a, b) => b.taken / b.spots - a.taken / a.spots);
    else list.sort((a, b) => a.when - b.when);
    return list;
  }, [allEvents, filters]);

  const addEvent = (event) => {
    setAllEvents(prev => [...prev, event]);
  }

  const value = { allEvents, filteredEvents, loading, error, addEvent };

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
}

export const useEventsContext = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error("useEventsContext must be used within an EventsProvider");
  }
  return context;
};