import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast.jsx';
import * as profilesApi from '../api/profiles';
import { LEVELS, SPORTS } from '../constants';
import Card from '../components/ui/Card';
import Field from '../components/ui/Field';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';

export default function ProfilePage() {
  const { currentUser, token, setCurrentUser } = useAuth();
  const { show: showToast } = useToast();
  
  const [profile, setProfile] = useState(currentUser);
  const [isSaving, setIsSaving] = useState(false);

  // Bezpiecznie pobieramy tablicę sportów. Jeśli nie istnieje, używamy pustej tablicy.
  const userSports = profile?.sports || [];

  const handleProfileChange = (key, value) => {
    setProfile(p => ({ ...p, [key]: value }));
  };
  
  const handleSportChange = (index, key, value) => {
    const newSports = [...userSports];
    newSports[index] = { ...newSports[index], [key]: value };
    setProfile(p => ({ ...p, sports: newSports }));
  };

  const addSport = () => {
    const newSports = [...userSports];
    if (!newSports.some(s => s.sportName === SPORTS[0])) {
        newSports.push({ sportName: SPORTS[0], skillLevel: 'Nowicjusz' });
        setProfile(p => ({ ...p, sports: newSports }));
    } else {
        showToast("Ten sport jest już na liście.");
    }
  };
  
  const removeSport = (index) => {
      const newSports = userSports.filter((_, i) => i !== index);
      setProfile(p => ({ ...p, sports: newSports }));
  }

  const handleSave = async () => {
    if (!token) return;
    setIsSaving(true);
    showToast("Trwa zapisywanie...");
    try {
      const updatedProfile = await profilesApi.updateMyProfile(profile, token);
      setCurrentUser(updatedProfile);
      showToast("Zmiany zostały zapisane!");
    } catch (error) {
      showToast(`Błąd zapisu: ${error.message}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (!profile) {
    return <p>Nie jesteś zalogowany. Zaloguj się, aby zobaczyć swój profil.</p>;
  }

  return (
    <section className="grid gap-4">
      <h2 className="text-xl font-bold">Mój profil</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <h3 className="mb-3 text-lg font-semibold">Dane podstawowe</h3>
          <div className="grid gap-3">
            <Field label="Imię"><Input value={profile.name || ''} onChange={(e) => handleProfileChange('name', e.target.value)} /></Field>
            <Field label="Email"><Input value={profile.email || ''} disabled /></Field>
            <Field label="Miasto domowe"><Input value={profile.homeCity || ''} onChange={(e) => handleProfileChange('homeCity', e.target.value)} placeholder="np. Kraków" /></Field>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="mb-3 text-lg font-semibold">Moje sporty</h3>
          <div className="grid gap-4">
            {/* Mapujemy po bezpiecznej zmiennej userSports */}
            {userSports.map((sport, index) => (
              <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end">
                <Field label="Sport">
                  <Select value={sport.sportName} onChange={(e) => handleSportChange(index, 'sportName', e.target.value)}>
                    {SPORTS.map(s => <option key={s}>{s}</option>)}
                  </Select>
                </Field>
                <Field label="Poziom">
                  <Select value={sport.skillLevel} onChange={(e) => handleSportChange(index, 'skillLevel', e.target.value)}>
                    {LEVELS.filter(l => l !== 'Wszyscy').map(l => <option key={l}>{l}</option>)}
                  </Select>
                </Field>
                <Button variant="ghost" onClick={() => removeSport(index)} className="text-rose-400">Usuń</Button>
              </div>
            ))}
            <Button onClick={addSport}>➕ Dodaj sport</Button>
          </div>
        </Card>
      </div>
      <div className="flex justify-end">
        <Button variant="primary" onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Zapisywanie...' : 'Zapisz zmiany'}
        </Button>
      </div>
    </section>
  );
}