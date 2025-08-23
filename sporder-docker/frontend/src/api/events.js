// Pobieramy bazowy URL naszego API z pliku .env
const API_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Pobiera wszystkie wydarzenia z serwera backendowego.
 */
export const fetchEvents = async () => {
  try {
    // Wykonuje zapytanie GET do endpointu /events
    const response = await fetch(`${API_URL}/events`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const events = await response.json();
    // Backend najczęściej zwraca daty jako stringi w formacie ISO.
    // Musimy je z powrotem przekonwertować na obiekty Date, aby reszta aplikacji działała poprawnie.
    return events.map(ev => ({ ...ev, when: new Date(ev.when) }));
  } catch (error) {
    console.error("Failed to fetch events:", error);
    // W przypadku błędu zwracamy pustą tablicę, aby UI aplikacji się nie zepsuło.
    return [];
  }
};

/**
 * Tworzy nowe wydarzenie, wysyłając dane do serwera backendowego.
 * @param {object} eventData - Dane nowego wydarzenia z formularza.
 */
export const createEvent = async (eventData) => {
  try {
    // Wykonuje zapytanie POST do endpointu /events
    const response = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Tutaj w przyszłości dołączymy token autoryzacyjny
        // 'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(eventData),
    });
    if (!response.ok) {
      throw new Error('Failed to create event');
    }
    const newEvent = await response.json();
    // Konwertujemy datę w odpowiedzi
    return { ...newEvent, when: new Date(newEvent.when) };
  } catch (error) {
    console.error("Failed to create event:", error);
    // Rzucamy błąd dalej, aby można go było obsłużyć w komponencie (np. pokazać toast)
    throw error;
  }
};