import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast.jsx';
import * as friendsApi from '../api/friendships';
import * as usersApi from '../api/users';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function FriendsPage() {
  const { token } = useAuth();
  const { show: showToast } = useToast();
  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFriends = async () => {
    if (token) {
      try {
        setLoading(true);
        const friendsData = await friendsApi.getMyFriends(token);
        setFriends(friendsData);
      } catch (error) {
        showToast(`Błąd: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchFriends();
  }, [token]);

  useEffect(() => {
    const search = setTimeout(async () => {
      if (searchQuery.length > 2) {
        const users = await usersApi.findUsers(searchQuery, token);
        setSearchResults(users);
      } else {
        setSearchResults([]);
      }
    }, 500); // Debounce
    return () => clearTimeout(search);
  }, [searchQuery, token]);

  const handleSendRequest = async (recipientId) => {
    try {
      await friendsApi.sendFriendRequest(recipientId, token);
      showToast('Zaproszenie zostało wysłane!');
      setSearchQuery(''); // Wyczyść wyszukiwanie po wysłaniu
    } catch (error) {
      showToast(`Błąd: ${error.message}`);
    }
  };

  const handleRemoveFriend = async (friendId) => {
    try {
        await friendsApi.removeFriend(friendId, token);
        showToast('Znajomy został usunięty.');
        fetchFriends(); // Odśwież listę
    } catch (error) {
        showToast(`Błąd: ${error.message}`);
    }
  }

  if (loading) {
    return <p>Wczytywanie znajomych...</p>;
  }

  return (
    <section className="grid gap-4">
      <h2 className="text-xl font-bold">Znajomi</h2>
      
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <h3 className="mb-3 text-lg font-semibold">Dodaj znajomego</h3>
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Wpisz imię lub email..."
          />
          <div className="mt-3 grid gap-2">
            {searchResults.map(user => (
              <div key={user.id} className="flex items-center justify-between rounded-lg bg-white/10 p-2">
                <span>{user.name} ({user.email})</span>
                <Button onClick={() => handleSendRequest(user.id)}>Zaproś</Button>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="mb-3 text-lg font-semibold">Otrzymane zaproszenia</h3>
          <p className="text-[var(--muted)]">Brak nowych zaproszeń. (Funkcjonalność do zaimplementowania)</p>
        </Card>
      </div>

      <div>
        <h3 className="mb-3 text-lg font-semibold">Twoi znajomi ({friends.length})</h3>
        {friends.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {friends.map((friend) => (
              <Card key={friend.id} className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <strong>👤 {friend.name}</strong>
                  <Badge>Online</Badge>
                </div>
                <div className="mt-2 text-[var(--muted)]">Email: {friend.email}</div>
                <div className="mt-3 flex gap-2">
                  <Button variant="ghost">💬 Napisz</Button>
                  <Button variant="ghost" className="text-rose-400" onClick={() => handleRemoveFriend(friend.id)}>Usuń</Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-[var(--muted)]">Nie masz jeszcze żadnych znajomych.</p>
        )}
      </div>
    </section>
  );
}
