// src/pages/FriendsPage.jsx
import React from 'react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

// Dane statyczne, w przyszłości mogą pochodzić z API
const friends = [
  { name: "Pjoter", sports: ["Joga", "Bieganie"], online: true },
  { name: "Łysy", sports: ["Rower", "Piłka nożna"], online: false },
  { name: "Rudy", sports: ["Pływanie"], online: true },
  { name: "Szymon", sports: ["Crossfit", "Siatkówka"], online: false },
];

export default function FriendsPage({ showToast }) {
  return (
    <section className="grid gap-4">
      <h2 className="text-xl font-bold">Znajomi</h2>
      <p className="text-[var(--muted)]">Zapraszaj znajomych, twórz drużyny i dołączaj grupowo.</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {friends.map((p) => (
          <Card key={p.name} className="p-4">
            <div className="flex items-center justify-between gap-2">
              <strong>👤 {p.name}</strong>
              <Badge className={p.online ? "bg-emerald-400/30" : "bg-rose-400/30"}>
                {p.online ? "Online" : "Offline"}
              </Badge>
            </div>
            <div className="mt-2 text-[var(--muted)]">Ulubione: {p.sports.join(", ")}</div>
            <div className="mt-3 flex gap-2">
              <Button onClick={() => showToast(`Wysłano zaproszenie do ${p.name}`)}>📨 Zaproś</Button>
              <Button variant="ghost">💬 Napisz</Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}