import React from 'react';
import { useEventsContext } from '../contexts/EventsContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import WeekCalendar from '../components/WeekCalendar';

export default function DashboardPage({ onJoin, onCreate, onExportAll }) {
  // !! KLUCZOWA ZMIANA: Dodajemy wartości domyślne `= []` !!
  // Jeśli useEventsContext() zwróci undefined dla którejś z tablic,
  // zostanie tu użyta pusta tablica, co zapobiegnie błędowi.
  const { allEvents = [], filteredEvents = [] } = useEventsContext(); 
  
  // Ten kod jest teraz bezpieczny. Nawet jeśli filteredEvents to [],
  // .length i .reduce zadziałają poprawnie (zwrócą 0).
  const kpiEvents = filteredEvents.length;
  const kpiPeople = filteredEvents.reduce((a, e) => a + (e.taken || 0), 0);
  const kpiFriends = filteredEvents.reduce((a, e) => a + (e.friends?.length || 0), 0);

  const handleRandomJoin = () => {
    const list = filteredEvents.filter((e) => e.taken < e.spots);
    if (!list.length) {
      alert("Brak wydarzeń z wolnymi miejscami.");
      return;
    }
    onJoin(list[Math.floor(Math.random() * list.length)].id);
  }

  return (
      <section className="overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-sky-400/20 to-white/10 shadow-xl">
        <div className="grid gap-4 p-6 md:grid-cols-[1.3fr_1fr]">
          <div>
            <h1 className="mb-1 text-[clamp(1.4rem,2.2vw+.6rem,2.4rem)] font-bold">Umów się na wspólny trening — szybko i wygodnie</h1>
            <p className="text-[var(--muted)]">SPORDER łączy ludzi, którzy chcą razem trenować. Wybierz sport, poziom, lokalizację i dołącz do ekipy. Twórz też własne wydarzenia!</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button variant="primary" onClick={onCreate}>➕ Utwórz wydarzenie</Button>
              <Button onClick={handleRandomJoin}>⚡ Losowe dołączenie</Button>
              <Button variant="ghost" onClick={onExportAll}>📥 Eksport do kalendarza (.ics)</Button>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              <Card className="p-3"><div className="text-xl font-extrabold">{kpiEvents}</div><div className="text-sm text-[var(--muted)]">Wydarzeń wg filtrów</div></Card>
              <Card className="p-3"><div className="text-xl font-extrabold">{kpiPeople}</div><div className="text-sm text-[var(--muted)]">Uczestników</div></Card>
              <Card className="p-3"><div className="text-xl font-extrabold">{kpiFriends}</div><div className="text-sm text-[var(--muted)]">Znajomych gra dziś</div></Card>
            </div>
          </div>
          <WeekCalendar events={allEvents} />
        </div>
      </section>
  )
}