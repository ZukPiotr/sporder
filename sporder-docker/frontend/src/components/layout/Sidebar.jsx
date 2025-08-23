import React from "react";
import useLocalStorage from "../../hooks/useLocalStorage";
import { useFilters } from "../../contexts/FiltersContext";
import { SPORTS, LEVELS } from "../../constants";
import Field from "../ui/Field";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";

const Chip = ({ active, onClick, children }) => ( <button onClick={onClick} className={`rounded-full border px-3 py-2 text-sm ${ active ? "border-sky-400/70 bg-sky-400/80 text-sky-950" : "border-white/20 bg-white/10 hover:border-sky-400/70 hover:bg-sky-400/20" }`}>{children}</button> );

export default function Sidebar() {
  const { filters, setFilters } = useFilters();
  const [favSports, setFavSports] = useLocalStorage("favSports", []);

  const handleFilterChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
  const handleQuickFilterToggle = (key) => {
    setFilters(prev => {
      const newQuick = new Set(prev.quick);
      newQuick.has(key) ? newQuick.delete(key) : newQuick.add(key);
      return { ...prev, quick: newQuick };
    });
  };
  
  // Ta funkcja jest podpięta pod przycisk i resetuje stan
  const clearFilters = () => {
      setFilters({ 
      q: "", 
      sport: "", 
      level: "", 
      city: "", 
      date: "", 
      when: "", 
      quick: new Set(), 
      sortBy: "time" 
    });
  };

  return (
    <aside className="rounded-2xl border border-white/15 bg-[linear-gradient(180deg,rgba(18,27,46,.8),rgba(18,27,46,.5))] p-4 shadow-xl">
      <div className="grid gap-3">
        <h3 className="mb-1 mt-1 text-xs font-bold uppercase tracking-[0.15em] text-[var(--muted)]">Filtry</h3>
        <Field label="Szukaj wydarzeń"><Input value={filters.q} onChange={(e) => handleFilterChange('q', e.target.value)} placeholder="Piłka, bieganie, joga…" /></Field>
        <div className="grid gap-2 py-1">
          <div className="text-sm text-white">Kiedy</div>
          <div className="flex flex-wrap gap-2">
            {[{ k: "today", t: "Dziś" }, { k: "tomorrow", t: "Jutro" }, { k: "weekend", t: "Weekend" }, { k: "next7", t: "7 dni" }].map((c) => (
              <Chip key={c.k} active={filters.when === c.k} onClick={() => handleFilterChange('when', filters.when === c.k ? "" : c.k)}>{c.t}</Chip>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Sport"><Select value={filters.sport} onChange={(e) => handleFilterChange('sport', e.target.value)}><option value="">Dowolny</option>{SPORTS.map((s) => (<option key={s}>{s}</option>))}</Select></Field>
          <Field label="Poziom"><Select value={filters.level} onChange={(e) => handleFilterChange('level', e.target.value)}><option value="">Wszyscy</option>{LEVELS.filter((l) => l !== "Wszyscy").map((l) => (<option key={l}>{l}</option>))}</Select></Field>
        </div>
        <Field label="Miasto / lokalizacja"><Input value={filters.city} onChange={(e) => handleFilterChange('city', e.target.value)} placeholder="np. Warszawa" /></Field>
        <Field label="Data"><Input type="date" value={filters.date} onChange={(e) => handleFilterChange('date', e.target.value)} /></Field>
        <div className="grid gap-2 py-1">
            <div className="text-sm text-white">Szybkie filtry</div>
            <div className="flex flex-wrap gap-2">{[{ k: "near", t: "Blisko mnie" }, { k: "free", t: "Wolne miejsca" }, { k: "friends", t: "Ze znajomymi" }].map((c) => (<Chip key={c.k} active={filters.quick.has(c.k)} onClick={() => handleQuickFilterToggle(c.k)}>{c.t}</Chip>))}</div>
        </div>
        <div className="pt-2"><Button onClick={clearFilters} className="w-full">Wyczyść filtry</Button></div>
      </div>
      <hr className="my-4 border-white/20" />
      <div>
        <h3 className="mb-3 mt-1 text-xs font-bold uppercase tracking-[0.15em] text-[var(--muted)]">Twoje skróty</h3>
        <div className="flex flex-wrap gap-2">{favSports.length > 0 ? (favSports.map((s, i) => (<span key={s + i} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm">💙 {s}<button className="text-[var(--muted)]" onClick={() => setFavSports((arr) => arr.filter((_, idx) => idx !== i))} aria-label="Usuń">✖</button></span>))) : ( <p className="text-sm text-[var(--muted)]">Brak ulubionych sportów.</p> )}</div>
        <div className="pt-3"><Button variant="ghost" className="w-full" onClick={() => {const pick = prompt("Dodaj ulubiony sport:", SPORTS[0]); if (pick && !favSports.includes(pick)) setFavSports((s) => [...s, pick]);}}>➕ Dodaj ulubiony sport</Button></div>
      </div>
    </aside>
  );
}