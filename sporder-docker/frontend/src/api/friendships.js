const API_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Pobiera listę zaakceptowanych znajomych.
 */
export const getMyFriends = async (token) => {
  const response = await fetch(`${API_URL}/friends`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Nie udało się pobrać listy znajomych');
  return response.json();
};

/**
 * Wysyła zaproszenie do znajomych.
 */
export const sendFriendRequest = async (recipientId, token) => {
  const response = await fetch(`${API_URL}/friends/requests`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ recipientId }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Nie udało się wysłać zaproszenia');
  }
  return response.json();
};

/**
 * Odpowiada na zaproszenie do znajomych (akceptuje lub odrzuca).
 */
export const respondToRequest = async (requesterId, status, token) => {
  const response = await fetch(`${API_URL}/friends/requests/${requesterId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error('Nie udało się odpowiedzieć na zaproszenie');
  return response.json();
};

/**
 * Usuwa znajomego z listy.
 */
export const removeFriend = async (friendId, token) => {
  const response = await fetch(`${API_URL}/friends/${friendId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (response.status !== 204) throw new Error('Nie udało się usunąć znajomego');
  return true;
};

// Uwaga: Poniższe funkcje wymagają dodania odpowiednich endpointów w backendzie
/**
 * Pobiera zaproszenia wysłane przez nas.
 */
export const getSentRequests = async (token) => {
    // const response = await fetch(`${API_URL}/friends/requests/sent`, { headers: { 'Authorization': `Bearer ${token}` }});
    // if (!response.ok) throw new Error('Błąd pobierania wysłanych zaproszeń');
    // return response.json();
    return Promise.resolve([]); // Tymczasowy mock
}

/**
 * Pobiera zaproszenia otrzymane przez nas.
 */
export const getReceivedRequests = async (token) => {
    // const response = await fetch(`${API_URL}/friends/requests/received`, { headers: { 'Authorization': `Bearer ${token}` }});
    // if (!response.ok) throw new Error('Błąd pobierania otrzymanych zaproszeń');
    // return response.json();
    return Promise.resolve([]); // Tymczasowy mock
}
