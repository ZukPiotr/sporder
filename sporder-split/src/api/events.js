// src/api/events.js

// --- MOCK DATA ---
const sampleEventsSeed = () => {
  const base = new Date();
  const plus = (d, h = 18) =>
    new Date(base.getFullYear(), base.getMonth(), base.getDate() + d, h, 0, 0);
  return [
    { id: 1, sport: "Piłka nożna", level: "Średni", city: "Warszawa", place: "Boisko Orlik, Mokotów", when: plus(0, 19), spots: 10, taken: 6, km: 3.2, host: "Kuba", friends: ["Ania"], cover: "⚽" },
    { id: 2, sport: "Bieganie", level: "Nowicjusz", city: "Warszawa", place: "Park Skaryszewski", when: plus(1, 7), spots: 20, taken: 9, km: 2.1, host: "Ola", friends: [], cover: "🏃" },
    { id: 3, sport: "Tenis", level: "Zaawansowany", city: "Kraków", place: "Korty Pychowice", when: plus(2, 18), spots: 4, taken: 3, km: 1.4, host: "Marek", friends: ["Piotr", "Ewa"], cover: "🎾" },
    { id: 4, sport: "Siatkówka", level: "Średni", city: "Gdańsk", place: "Plaża Stogi", when: plus(3, 16), spots: 12, taken: 8, km: 5.7, host: "Karolina", friends: [], cover: "🏐" },
    { id: 5, sport: "Joga", level: "Wszyscy", city: "Wrocław", place: "Studio Namaste", when: plus(1, 18), spots: 15, taken: 12, km: 1.1, host: "Aga", friends: ["Magda"], cover: "🧘" },
    { id: 6, sport: "Koszykówka", level: "Średni", city: "Warszawa", place: "Hala Ochota", when: plus(5, 20), spots: 10, taken: 2, km: 7.3, host: "Bartek", friends: [], cover: "🏀" },
    { id: 7, sport: "Rower", level: "Średni", city: "Poznań", place: "Malta — pętla", when: plus(6, 10), spots: 8, taken: 5, km: 12.2, host: "Iza", friends: ["Kamil"], cover: "🚴" },
    { id: 8, sport: "Pływanie", level: "Nowicjusz", city: "Warszawa", place: "Basen Inflancka", when: plus(4, 18), spots: 6, taken: 3, km: 4.4, host: "Tomek", friends: [], cover: "🏊" },
    { id: 9, sport: "Crossfit", level: "Zaawansowany", city: "Łódź", place: "Box Centrum", when: plus(2, 19), spots: 12, taken: 10, km: 2.8, host: "Kasia", friends: ["Olek"], cover: "🏋️" },
  ].map(ev => ({ ...ev, when: new Date(ev.when) })); // Upewnij się, że daty są obiektami Date
};

let events = sampleEventsSeed();

// --- MOCK API FUNCTIONS ---

// Symuluje pobieranie wydarzeń z serwera
export const fetchEvents = async () => {
  console.log("API: Fetching events...");
  await new Promise(res => setTimeout(res, 300)); // Symulacja opóźnienia sieci
  return [...events];
};

// Symuluje tworzenie wydarzenia na serwerze
export const createEvent = async (eventData) => {
  console.log("API: Creating event...", eventData);
  await new Promise(res => setTimeout(res, 300));
  const newEvent = {
    ...eventData,
    id: Math.floor(Math.random() * 1e9),
    taken: 1,
    km: (Math.random() * 8 + 1).toFixed(1),
    friends: [],
    cover: "⭐",
  };
  events.push(newEvent);
  return newEvent;
};