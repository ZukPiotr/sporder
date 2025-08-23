// src/pages/BookingsPage.jsx
import React from 'react';
import { useBookings } from '../contexts/BookingsContext.jsx';
import { useEventsContext } from '../contexts/EventsContext.jsx';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { fmtTime } from '../utils/formatters';
import { downloadICS } from '../utils/ics';

export default function BookingsPage() {
  const { bookings, cancelBooking } = useBookings();
  const { allEvents, loading } = useEventsContext();

  const exportSingle = (ev) => {
    if (!ev) return;
    downloadICS(ev, `SPORDER-${ev.id}.ics`);
  }

  const bookedEvents = bookings.map(id => allEvents.find(e => e.id === id)).filter(Boolean);

  if (loading) return <p>Wczytywanie rezerwacji...</p>;
  
  return (
    <section className="grid gap-4">
      <h2 className="text-xl font-bold">Moje rezerwacje</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {bookedEvents.length > 0 ? (
          bookedEvents.map((ev) => (
            <Card key={ev.id} className="p-4">
              <div className="flex items-center justify-between">
                <strong>{ev.cover} {ev.sport}</strong>
                <Badge>{fmtTime(ev.when)}</Badge>
              </div>
              <div className="mt-2 text-[var(--muted)]">{ev.place} · {ev.city} · {ev.level}</div>
              <div className="mt-3 flex gap-2">
                <Button onClick={() => exportSingle(ev)}>📥 Zapisz</Button>
                <Button variant="ghost" onClick={() => cancelBooking(ev.id)}>❌ Anuluj</Button>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-[var(--muted)]">Jeszcze nic nie zarezerwowałeś/aś.</p>
        )}
      </div>
    </section>
  );
}