// src/components/EventForm.jsx
import React, { useState } from "react";
import { SPORTS, LEVELS } from "../constants";
import Field from "./ui/Field";
import Select from "./ui/Select";
import Input from "./ui/Input";
import Button from "./ui/Button";

export default function EventForm({ onCreate, onCancel, profileName }) {
  const [sport, setSport] = useState(SPORTS[0]);
  const [level, setLevel] = useState(LEVELS[2]); // Średni
  const [city, setCity] = useState("");
  const [place, setPlace] = useState("");
  const [dt, setDt] = useState("");
  const [spots, setSpots] = useState(10);

  function handleCreate() {
    const when = dt ? new Date(dt) : new Date(Date.now() + 86400000);
    const ev = {
      sport,
      level,
      city: city || "Miasto",
      place: place || "Miejsce",
      when,
      spots: Number(spots) || 10,
      host: profileName || "Ty",
    };
    onCreate(ev);
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Sport">
          <Select value={sport} onChange={(e) => setSport(e.target.value)}>
            {SPORTS.map((s) => (<option key={s}>{s}</option>))}
          </Select>
        </Field>
        <Field label="Poziom">
          <Select value={level} onChange={(e) => setLevel(e.target.value)}>
            {LEVELS.filter((l) => l !== "Wszyscy").map((l) => (<option key={l}>{l}</option>))}
          </Select>
        </Field>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Miasto">
          <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="np. Warszawa" />
        </Field>
        <Field label="Miejsce">
          <Input value={place} onChange={(e) => setPlace(e.target.value)} placeholder="np. Orlik, Grochów" />
        </Field>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Data i czas">
          <Input type="datetime-local" value={dt} onChange={(e) => setDt(e.target.value)} />
        </Field>
        <Field label="Liczba miejsc">
          <Input type="number" min={2} value={spots} onChange={(e) => setSpots(e.target.value)} />
        </Field>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="ghost" onClick={onCancel}>Anuluj</Button>
        <Button variant="primary" onClick={handleCreate}>Utwórz</Button>
      </div>
    </div>
  );
}