//const API_URL = import.meta.env.VITE_API_BASE_URL;

const API_URL = '/api';

/**
 * Wysyła zapytanie o dołączenie do wydarzenia.
 * @param {number} eventId - ID wydarzenia.
 * @param {string} token - Token JWT użytkownika.
 */
export const joinEvent = async (eventId, token) => {
  const response = await fetch(`${API_URL}/events/${eventId}/bookings`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Nie udało się dołączyć do wydarzenia');
  }
  return response.json();
};

/**
 * Wysyła zapytanie o opuszczenie wydarzenia.
 * @param {number} eventId - ID wydarzenia.
 * @param {string} token - Token JWT użytkownika.
 */
export const leaveEvent = async (eventId, token) => {
  const response = await fetch(`${API_URL}/events/${eventId}/bookings`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (response.status !== 204) { // 204 No Content
    const errorData = await response.json();
    throw new Error(errorData.message || 'Nie udało się opuścić wydarzenia');
  }
  return true; // Sukces
};
