// Pobieramy bazowy URL naszego API z pliku .env
//const API_URL = import.meta.env.VITE_API_BASE_URL;

const API_URL = '/api';

/**
 * Pobiera wszystkie wydarzenia z serwera backendowego.
 */
export const fetchEvents = async () => {
  try {
    const response = await fetch(`${API_URL}/events`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const events = await response.json();
    return events.map(ev => ({ ...ev, when: new Date(ev.when) }));
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return [];
  }
};

/**
 * Tworzy nowe wydarzenie, wysyłając dane do serwera backendowego.
 * @param {object} eventData - Dane nowego wydarzenia z formularza.
 * @param {string} token - Token JWT zalogowanego użytkownika.
 */
// 1. Dodajemy 'token' jako drugi argument funkcji
export const createEvent = async (eventData, token) => {
  try {
    const response = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 2. Dołączamy token do nagłówka zapytania
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(eventData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create event');
    }
    const newEvent = await response.json();
    return { ...newEvent, when: new Date(newEvent.when) };
  } catch (error) {
    console.error("Failed to create event:", error);
    throw error;
  }
};