// src/pages/ProfilePage.jsx
import React from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast.jsx';
import { LEVELS } from '../constants';
import Card from '../components/ui/Card';
import Field from '../components/ui/Field';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useLocalStorage("profile", {});
  const { show: showToast } = useToast();

  const handleProfileChange = (key, value) => {
    setProfile(p => ({...p, [key]: value}));
  }

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <Card className="p-4">
        <h3 className="mb-3 text-lg font-semibold">Dane użytkownika</h3>
        <div className="grid gap-3">
          <Field label="Imię">
            <Input value={profile.name || currentUser?.name || ""} onChange={(e) => handleProfileChange('name', e.target.value)} placeholder="np. Ola"/>
          </Field>
          <Field label="Miasto domowe">
            <Input value={profile.homeCity || ""} onChange={(e) => handleProfileChange('homeCity', e.target.value)} placeholder="np. Kraków" />
          </Field>
          <Field label="Preferowany poziom">
            <Select value={profile.prefLevel || "Średni"} onChange={(e) => handleProfileChange('prefLevel', e.target.value)}>
              {LEVELS.filter((l) => l !== "Wszyscy").map((l) => (<option key={l}>{l}</option>))}
            </Select>
          </Field>
          <Button variant="primary" onClick={() => showToast("Zapisano profil.")}>Zapisz profil</Button>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="mb-3 text-lg font-semibold">Powiadomienia</h3>
        <div className="grid gap-3">
          <label className="inline-flex items-center gap-2"><input type="checkbox" defaultChecked className="size-4 rounded border-white/20 bg-white/10" />Informuj o nowych wydarzeniach w pobliżu</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" defaultChecked className="size-4 rounded border-white/20 bg-white/10" />Gdy znajomy dołączy do wydarzenia</label>
          <Button onClick={() => showToast("To jest przykładowe powiadomienie ✨")}>Przetestuj powiadomienie</Button>
        </div>
      </Card>
    </section>
  );
}