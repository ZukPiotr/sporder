import React, { useEffect, useMemo, useRef, useState } from "react";

// ==========================
// SPORDER — React (Tailwind)
// + Logowanie i Rejestracja (localStorage, demo-only)
// ==========================

// Helper: formatters (PL)
const fmtTime = (d) =>
  new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
const fmtDay = (d) =>
  new Intl.DateTimeFormat("pl-PL", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(d);

const SPORTS = [
  "Piłka nożna",
  "Siatkówka",
  "Koszykówka",
  "Tenis",
  "Bieganie",
  "Rower",
  "Pływanie",
  "Joga",
  "Crossfit",
];
const LEVELS = ["Wszyscy", "Nowicjusz", "Średni", "Zaawansowany", "Pro"];

const sampleEventsSeed = () => {
  const base = new Date();
  const plus = (d, h = 18) =>
    new Date(base.getFullYear(), base.getMonth(), base.getDate() + d, h, 0, 0);
  return [
    {
      id: 1,
      sport: "Piłka nożna",
      level: "Średni",
      city: "Warszawa",
      place: "Boisko Orlik, Mokotów",
      when: plus(0, 19),
      spots: 10,
      taken: 6,
      km: 3.2,
      host: "Kuba",
      friends: ["Ania"],
      cover: "⚽",
    },
    {
      id: 2,
      sport: "Bieganie",
      level: "Nowicjusz",
      city: "Warszawa",
      place: "Park Skaryszewski",
      when: plus(1, 7),
      spots: 20,
      taken: 9,
      km: 2.1,
      host: "Ola",
      friends: [],
      cover: "🏃",
    },
    {
      id: 3,
      sport: "Tenis",
      level: "Zaawansowany",
      city: "Kraków",
      place: "Korty Pychowice",
      when: plus(2, 18),
      spots: 4,
      taken: 3,
      km: 1.4,
      host: "Marek",
      friends: ["Piotr", "Ewa"],
      cover: "🎾",
    },
    {
      id: 4,
      sport: "Siatkówka",
      level: "Średni",
      city: "Gdańsk",
      place: "Plaża Stogi",
      when: plus(3, 16),
      spots: 12,
      taken: 8,
      km: 5.7,
      host: "Karolina",
      friends: [],
      cover: "🏐",
    },
    {
      id: 5,
      sport: "Joga",
      level: "Wszyscy",
      city: "Wrocław",
      place: "Studio Namaste",
      when: plus(1, 18),
      spots: 15,
      taken: 12,
      km: 1.1,
      host: "Aga",
      friends: ["Magda"],
      cover: "🧘",
    },
    {
      id: 6,
      sport: "Koszykówka",
      level: "Średni",
      city: "Warszawa",
      place: "Hala Ochota",
      when: plus(5, 20),
      spots: 10,
      taken: 2,
      km: 7.3,
      host: "Bartek",
      friends: [],
      cover: "🏀",
    },
    {
      id: 7,
      sport: "Rower",
      level: "Średni",
      city: "Poznań",
      place: "Malta — pętla",
      when: plus(6, 10),
      spots: 8,
      taken: 5,
      km: 12.2,
      host: "Iza",
      friends: ["Kamil"],
      cover: "🚴",
    },
    {
      id: 8,
      sport: "Pływanie",
      level: "Nowicjusz",
      city: "Warszawa",
      place: "Basen Inflancka",
      when: plus(4, 18),
      spots: 6,
      taken: 3,
      km: 4.4,
      host: "Tomek",
      friends: [],
      cover: "🏊",
    },
    {
      id: 9,
      sport: "Crossfit",
      level: "Zaawansowany",
      city: "Łódź",
      place: "Box Centrum",
      when: plus(2, 19),
      spots: 12,
      taken: 10,
      km: 2.8,
      host: "Kasia",
      friends: ["Olek"],
      cover: "🏋️",
    },
  ];
};

function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);
  return [value, setValue];
}

function sameDate(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// =============== UI PRIMS ===============
function Badge({ children, className = "" }) {
  return (
    <span
      className={
        "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-sm/none " +
        "border-white/25 bg-white/10 " +
        className
      }
    >
      {children}
    </span>
  );
}

function Button({ variant = "default", className = "", ...props }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium shadow transition-transform";
  const map = {
    default:
      "border-white/20 bg-white/10 hover:-translate-y-0.5 hover:border-sky-400/80 hover:bg-sky-400/30",
    primary:
      "border-transparent bg-gradient-to-b from-sky-500 to-sky-400 text-sky-950 font-semibold hover:brightness-110",
    ghost: "border-transparent bg-transparent hover:bg-white/5",
  };
  return <button className={`${base} ${map[variant]} ${className}`} {...props} />;
}

function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-white/15 bg-[var(--card)] shadow-xl ${className}`}
    >
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="grid gap-2">
      {label && <label className="text-sm text-[var(--muted)]">{label}</label>}
      {children}
    </div>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className={
        "w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-white/70 outline-none " +
        "focus:border-sky-400/80 focus:ring-4 focus:ring-sky-400/30 " +
        (props.className || "")
      }
    />
  );
}

// ---- Zmieniony komponent SELECT (ciemne tło + custom strzałka) ----
function Select({ children, className = "", ...props }) {
  return (
    <div className={`relative ${className}`}>
      <select
        {...props}
        className={
          "w-full appearance-none rounded-xl border px-3 py-2 text-white outline-none " +
          "border-white/20 bg-[#1a2437] focus:border-sky-400/80 focus:ring-4 focus:ring-sky-400/30 " +
          "pr-9" // miejsce na strzałkę
        }
      >
        {children}
      </select>

      {/* strzałka */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
        width="16"
        height="16"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path d="M5 7l5 6 5-6" stroke="currentColor" strokeWidth="2" />
      </svg>
    </div>
  );
}

// =============== TOAST ===============
function useToast() {
  const [msg, setMsg] = useState("");
  const hideRef = useRef(null);
  const show = (m) => {
    setMsg(m);
    clearTimeout(hideRef.current);
    hideRef.current = setTimeout(() => setMsg(""), 2600);
  };
  const node = (
    <div
      className={`fixed bottom-4 right-4 z-[60] rounded-xl border border-sky-400/50 bg-gradient-to-b from-sky-400/40 to-sky-400/20 px-4 py-3 text-white shadow-xl backdrop-blur ${{
        } msg ? "opacity-100" : "pointer-events-none opacity-0"
      } transition-opacity`}
      role="status"
      aria-live="polite"
    >
      {msg}
    </div>
  );
  return { show, node };
}

// =============== MODAL ===============
function Modal({ open, title, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/60 p-3">
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-white/15 bg-[var(--panel)] shadow-2xl">
        <header className="sticky top-0 flex items-center gap-3 border-b border-white/15 bg-gradient-to-b from-sky-400/30 to-transparent px-4 py-3 backdrop-blur">
          <strong className="text-white">{title}</strong>
          <div className="ml-auto" />
          <Button onClick={onClose}>✖ Zamknij</Button>
        </header>
        <div className="grid gap-3 p-4">{children}</div>
      </div>
    </div>
  );
}

// =============== AUTH ===============
function useAuth() {
  const [users, setUsers] = useLocalStorage("sporder_users", []); // [{email, password, name}]
  const [currentUser, setCurrentUser] = useLocalStorage("sporder_current_user", null);

  const register = ({ email, password, name }) => {
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("Konto z tym e‑mailem już istnieje");
    }
    const user = { email, password, name: name || email.split("@")[0] };
    setUsers((u) => [...u, user]);
    setCurrentUser({ email: user.email, name: user.name });
    return user;
  };

  const login = ({ email, password }) => {
    const u = users.find((x) => x.email.toLowerCase() === email.toLowerCase());
    if (!u || u.password !== password) throw new Error("Błędny e‑mail lub hasło");
    setCurrentUser({ email: u.email, name: u.name });
    return u;
  };

  const logout = () => setCurrentUser(null);

  return { users, currentUser, register, login, logout };
}

function AuthModal({ open, mode = "login", onClose, onSuccess }) {
  const { register, login } = useAuth();
  const [authMode, setAuthMode] = useState(mode); // "login" | "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setAuthMode(mode);
    setError("");
    setEmail("");
    setPassword("");
    setName("");
  }, [mode, open]);

  function handleSubmit(e) {
    e.preventDefault();
    try {
      if (authMode === "register") {
        register({ email, password, name });
        onSuccess?.("register");
      } else {
        login({ email, password });
        onSuccess?.("login");
      }
      onClose();
    } catch (err) {
      setError(err.message || "Wystąpił błąd");
    }
  }

  return (
    <Modal
      open={open}
      title={authMode === "login" ? "Zaloguj się" : "Utwórz konto"}
      onClose={onClose}
    >
      <form className="grid gap-3" onSubmit={handleSubmit}>
        {authMode === "register" && (
          <Field label="Imię / nick">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="np. Ola" />
          </Field>
        )}
        <Field label="E‑mail">
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="np. ola@example.com" required />
        </Field>
        <Field label="Hasło">
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="min. 6 znaków" required />
        </Field>
        {error && (
          <div className="rounded-xl border border-rose-400/40 bg-rose-400/10 px-3 py-2 text-sm text-rose-200">
            {error}
          </div>
        )}
        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            type="button"
            className="text-sm text-[var(--muted)] underline decoration-dotted"
            onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
          >
            {authMode === "login" ? "Nie masz konta? Zarejestruj się" : "Masz już konto? Zaloguj się"}
          </button>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>Anuluj</Button>
            <Button type="submit" variant="primary">
              {authMode === "login" ? "Zaloguj" : "Zarejestruj"}
            </Button>
          </div>
        </div>
        <p className="text-xs text-[var(--muted)]">
          Demo: dane są zapisywane lokalnie w przeglądarce (localStorage). Nie używaj prawdziwych haseł.
        </p>
      </form>
    </Modal>
  );
}

// =============== CALENDAR ===============
function WeekCalendar({ events }) {
  const now = new Date();
  const day = now.getDay();
  const mondayOffset = (day + 6) % 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - mondayOffset);
  const range = `${monday.toLocaleDateString("pl-PL", {
    day: "2-digit",
    month: "short",
  })} – ${new Date(
    monday.getFullYear(),
    monday.getMonth(),
    monday.getDate() + 6
  ).toLocaleDateString("pl-PL", { day: "2-digit", month: "short" })}`;

  const days = new Array(7).fill(0).map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });

  return (
    <div className="grid gap-3 rounded-2xl border border-white/15 bg-[var(--panel)] p-3">
      <div className="flex items-center justify-between">
        <strong>Bieżący tydzień</strong>
        <div className="text-[var(--muted)]">{range}</div>
      </div>
      <div className="grid grid-cols-7 gap-2 max-sm:grid-cols-2 sm:max-md:grid-cols-4">
        {days.map((d, idx) => (
          <div
            key={idx}
            className="min-h-24 grid content-start gap-1 rounded-xl border border-dashed border-white/20 bg-white/10 p-2"
          >
            <div className="text-sm text-[var(--muted)]">{fmtDay(d)}</div>
            {events
              .filter((e) => sameDate(e.when, d))
              .slice(0, 3)
              .map((e) => (
                <div
                  key={e.id}
                  className="h-2 w-2 rounded-full bg-[var(--accent)]"
                  title={`${e.sport} · ${e.place}`}
                />
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// =============== CARDS ===============
function EventCard({ ev, onJoin }) {
  return (
    <Card className="overflow-hidden">
      <div className="flex h-36 items-end bg-[radial-gradient(600px_230px_at_0%_100%,rgba(90,209,255,.22),transparent_60%),linear-gradient(135deg,rgba(46,139,255,.5),rgba(46,139,255,.15))] p-3">
        <Badge>
          <span className="text-lg">{ev.cover}</span> {ev.sport}
        </Badge>
      </div>
      <div className="grid gap-3 p-4">
        <div className="flex items-center justify-between gap-3">
          <strong className="truncate">{ev.place}</strong>
          <Badge className="text-xs">{ev.level}</Badge>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[var(--muted)]">
          <span>📍 {ev.city}</span>
          <span>🗓️ {fmtTime(ev.when)}</span>
          <span>👥 {ev.taken}/{ev.spots}</span>
          <span>📏 {ev.km} km</span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-[var(--muted)]">
            Organizator: {ev.host}
            {ev.friends?.length ? ` · Znajomi: ${ev.friends.join(", ")}` : ""}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost">☆ Obserwuj</Button>
            <Button variant="primary" onClick={() => onJoin(ev.id)}>
              Dołącz
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

// =============== ICS EXPORT ===============
function toICS(ev) {
  const pad = (n) => String(n).padStart(2, "0");
  const dt = (d) =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(
      d.getUTCDate()
    )}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
  const end = new Date(ev.when);
  end.setHours(end.getHours() + 2);
  const body = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//SPORDER//PL\nBEGIN:VEVENT\nUID:sporder-${
    ev.id
  }@local\nDTSTAMP:${dt(new Date())}\nDTSTART:${dt(ev.when)}\nDTEND:${dt(
    end
  )}\nSUMMARY:${ev.sport} — ${ev.place}\nLOCATION:${ev.city}\nDESCRIPTION:SPORDER\nEND:VEVENT\nEND:VCALENDAR`;
  return new Blob([body], { type: "text/calendar" });
}

function downloadICS(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// =============== APP ===============
export default function App() {
  // theme vars as inline CSS
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--bg", "#0a0f1a");
    root.style.setProperty("--panel", "#0f1726");
    root.style.setProperty("--card", "#121b2e");
    root.style.setProperty("--muted", "#c8d6ef");
    root.style.setProperty("--text", "#f5fbff");
    root.style.setProperty("--accent", "#2e8bff");
    root.style.setProperty("--accent-2", "#5ad1ff");
  }, []);

  const [events, setEvents] = useState(sampleEventsSeed());
  const [view, setView] = useState("dashboard");

  const [favSports, setFavSports] = useLocalStorage("favSports", []);
  const [bookings, setBookings] = useLocalStorage("bookings", []);
  const [profile, setProfile] = useLocalStorage("profile", {});

  const [q, setQ] = useState("");
  const [sport, setSport] = useState("");
  const [level, setLevel] = useState("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");
  const [when, setWhen] = useState("");
  const [quick, setQuick] = useState(new Set());
  const [sortBy, setSortBy] = useState("time");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalKind, setModalKind] = useState("create"); // "create" | "join"
  const [joinId, setJoinId] = useState(null);

  const { show: showToast, node: toastNode } = useToast();

  // ===== AUTH =====
  const { currentUser, logout } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // "login" | "register"

  const requireAuth = (desiredAction) => {
    if (!currentUser) {
      setAuthMode("login");
      setAuthOpen(true);
      showToast("Zaloguj się, aby kontynuować");
      return false;
    }
    return true;
  };

  const filteredEvents = useMemo(() => {
    let list = [...events];
    if (q)
      list = list.filter((e) =>
        [e.sport, e.city, e.place].join(" ").toLowerCase().includes(q.toLowerCase())
      );
    if (sport) list = list.filter((e) => e.sport === sport);
    if (level)
      list = list.filter(
        (e) => e.level === level || (level === "Wszyscy" && e.level === "Wszyscy")
      );
    if (city) list = list.filter((e) => e.city.toLowerCase().includes(city.toLowerCase()));
    if (date) {
      const d = new Date(date);
      list = list.filter((e) => sameDate(e.when, d));
    }
    if (when) {
      const now = new Date();
      if (when === "today") list = list.filter((e) => sameDate(e.when, now));
      if (when === "tomorrow") {
        const t = new Date(now);
        t.setDate(now.getDate() + 1);
        list = list.filter((e) => sameDate(e.when, t));
      }
      if (when === "weekend") list = list.filter((e) => [0, 6].includes(e.when.getDay()));
      if (when === "next7") {
        const lim = new Date(now);
        lim.setDate(now.getDate() + 7);
        list = list.filter((e) => e.when <= lim);
      }
    }
    if (quick.has("free")) list = list.filter((e) => e.taken < e.spots);
    if (quick.has("friends")) list = list.filter((e) => e.friends.length > 0);

    if (sortBy === "distance" || quick.has("near")) list.sort((a, b) => a.km - b.km);
    else if (sortBy === "popular")
      list.sort((a, b) => b.taken / b.spots - a.taken / a.spots);
    else list.sort((a, b) => a.when - b.when);

    return list;
  }, [events, q, sport, level, city, date, when, quick, sortBy]);

  const kpiEvents = filteredEvents.length;
  const kpiPeople = filteredEvents.reduce((a, e) => a + e.taken, 0);
  const kpiFriends = filteredEvents.reduce((a, e) => a + e.friends.length, 0);

  // actions
  function openJoin(id) {
    if (!requireAuth()) return; // wymaga zalogowania
    setJoinId(id);
    setModalKind("join");
    setModalOpen(true);
  }
  function openCreate() {
    if (!requireAuth()) return; // wymaga zalogowania
    setModalKind("create");
    setModalOpen(true);
  }
  function confirmJoin() {
    if (joinId == null) return;
    if (!bookings.includes(joinId)) setBookings((b) => [...b, joinId]);
    setModalOpen(false);
    showToast("Dołączono do wydarzenia!");
  }
  function cancelBooking(id) {
    setBookings((b) => b.filter((x) => x !== id));
    showToast("Rezerwacja anulowana.");
  }
  function exportSingle(id) {
    const ev = events.find((e) => e.id === id);
    if (!ev) return;
    downloadICS(toICS(ev), `SPORDER-${id}.ics`);
  }
  function exportAll() {
    bookings.forEach(exportSingle);
  }

  // friends (static)
  const friends = [
    { name: "Pjoter", sports: ["Joga", "Bieganie"], online: true },
    { name: "Łysy", sports: ["Rower", "Piłka nożna"], online: false },
    { name: "Rudy", sports: ["Pływanie"], online: true },
    { name: "Szymon", sports: ["Crossfit", "Siatkówka"], online: false },
  ];

  // UI helpers
  const Chip = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-2 text-sm ${
        active
          ? "border-sky-400/70 bg-sky-400/80 text-sky-950"
          : "border-white/20 bg-white/10 hover:border-sky-400/70 hover:bg-sky-400/20"
      }`}
    >
      {children}
    </button>
  );

  // styles (background gradients) — applied on wrapper
  const appBg =
    "bg-[radial-gradient(1200px_800px_at_80%_-10%,rgba(46,139,255,.15),transparent_60%),radial-gradient(900px_600px_at_-10%_20%,rgba(90,209,255,.12),transparent_60%)]";

  return (
    <div
      className={`min-h-dvh text-[var(--text)] ${appBg}`}
      style={{ backgroundColor: "var(--bg)" }}
    >
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[linear-gradient(180deg,rgba(10,15,26,.85),rgba(10,15,26,.6))] backdrop-blur">
        <div className="flex items-center gap-3 px-[clamp(14px,3vw,28px)] py-3">
          <div className="flex items-center gap-3 font-extrabold tracking-wide">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] shadow-xl">
              {/* slanted S */}
              <svg width="22" height="22" viewBox="0 0 100 100" aria-label="SPORDER" role="img">
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#2e8bff" />
                    <stop offset="1" stopColor="#5ad1ff" />
                  </linearGradient>
                </defs>
                <g transform="skewX(-15)">
                  <path
                    d="M70 20c0-8-9-12-20-12C35 8 25 13 19 22l10 7c4-6 12-10 21-10 7 0 10 2 10 5 0 5-7 7-18 10C27 38 16 44 16 57c0 12 11 21 28 21 13 0 24-5 30-13l-10-7c-5 6-13 9-20 9-8 0-12-3-12-7 0-5 6-7 18-10 16-4 30-9 30-25z"
                    fill="url(#g1)"
                  />
                </g>
              </svg>
            </div>
            <span className="text-xl">SPORDER</span>
          </div>

          <nav className="ml-auto flex flex-wrap gap-2">
            {[
              { k: "dashboard", t: "🏠 Pulpit" },
              { k: "trainings", t: "🏃 Treningi" },
              { k: "friends", t: "👥 Znajomi" },
              { k: "bookings", t: "🗓️ Rezerwacje" },
              { k: "profile", t: "⚙️ Profil" },
            ].map((it) => (
              <button
                key={it.k}
                onClick={() => setView(it.k)}
                aria-current={view === it.k ? "page" : undefined}
                className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 transition ${
                  view === it.k
                    ? "border-sky-400/60 bg-gradient-to-b from-sky-400/30 to-white/5"
                    : "border-white/20 bg-white/10 hover:border-sky-400/60 hover:bg-gradient-to-b hover:from-sky-400/20 hover:to-white/5"
                }`}
              >
                {it.t}
              </button>
            ))}
          </nav>

          {/* Auth area */}
          <div className="ml-2 flex items-center gap-2">
            {!currentUser ? (
              <>
                <Button onClick={() => { setAuthMode("login"); setAuthOpen(true); }}>Zaloguj</Button>
                <Button variant="primary" onClick={() => { setAuthMode("register"); setAuthOpen(true); }}>Zarejestruj</Button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Badge>👋 {currentUser.name}</Badge>
                <Button variant="ghost" onClick={logout}>Wyloguj</Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Content wrapper */}
      <div className="grid grid-cols-1 gap-4 px-[clamp(14px,3vw,28px)] py-4 lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <aside className="rounded-2xl border border-white/15 bg-[linear-gradient(180deg,rgba(18,27,46,.8),rgba(18,27,46,.5))] p-4 shadow-xl">
          <h3 className="mb-3 mt-1 text-xs font-bold uppercase tracking-[0.15em] text-[var(--muted)]">
            Filtry
          </h3>
          <Field label="Szukaj wydarzeń">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Piłka, bieganie, joga…" />
          </Field>

          <div className="grid gap-3 py-2">
            <div className="text-sm text-white">Kiedy</div>
            <div className="flex flex-wrap gap-2">
              {[
                { k: "today", t: "Dziś" },
                { k: "tomorrow", t: "Jutro" },
                { k: "weekend", t: "Weekend" },
                { k: "next7", t: "7 dni" },
              ].map((c) => (
                <Chip key={c.k} active={when === c.k} onClick={() => setWhen(c.k)}>
                  {c.t}
                </Chip>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Sport">
              <Select value={sport} onChange={(e) => setSport(e.target.value)}>
                <option value="">Dowolny</option>
                {SPORTS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </Select>
            </Field>
            <Field label="Poziom">
              <Select value={level} onChange={(e) => setLevel(e.target.value)}>
                <option value="">Wszyscy</option>
                {LEVELS.filter((l) => l !== "Wszyscy").map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </Select>
            </Field>
          </div>

          <Field label="Miasto / lokalizacja">
            <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="np. Warszawa" />
          </Field>

          <Field label="Data">
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>

          <div className="grid gap-2 py-2">
            <div className="text-sm text-white">Szybkie filtry</div>
            <div className="flex flex-wrap gap-2">
              {[
                { k: "near", t: "Blisko mnie" },
                { k: "free", t: "Wolne miejsca" },
                { k: "friends", t: "Ze znajomymi" },
              ].map((c) => (
                <Chip
                  key={c.k}
                  active={quick.has(c.k)}
                  onClick={() => {
                    setQuick((qset) => {
                      const n = new Set(qset);
                      n.has(c.k) ? n.delete(c.k) : n.add(c.k);
                      return n;
                    });
                  }}
                >
                  {c.t}
                </Chip>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              onClick={() => {
                setQ("");
                setSport("");
                setLevel("");
                setCity("");
                setDate("");
                setWhen("");
                setQuick(new Set());
                setSortBy("time");
              }}
            >
              Wyczyść
            </Button>
            <Button variant="primary" onClick={() => {}}>
              Zastosuj
            </Button>
          </div>

          <hr className="my-4 border-white/20" />

          <h3 className="mb-3 mt-1 text-xs font-bold uppercase tracking-[0.15em] text-[var(--muted)]">
            Twoje skróty
          </h3>
          <div className="flex flex-wrap gap-2">
            {favSports.length ? (
              favSports.map((s, i) => (
                <span
                  key={s + i}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm"
                >
                  💙 {s}
                  <button
                    className="text-[var(--muted)]"
                    onClick={() => setFavSports((arr) => arr.filter((_, idx) => idx !== i))}
                    aria-label="Usuń"
                  >
                    ✖
                  </button>
                </span>
              ))
            ) : (
              <p className="text-sm text-[var(--muted)]">Brak ulubionych. Dodaj swoje najczęstsze sporty.</p>
            )}
          </div>
          <div className="pt-3">
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                const pick = prompt("Dodaj ulubiony sport:", SPORTS[0]);
                if (pick && !favSports.includes(pick)) setFavSports((s) => [...s, pick]);
              }}
            >
              ➕ Dodaj ulubiony sport
            </Button>
          </div>
        </aside>

        {/* Main */}
        <main className="grid gap-4">
          {/* Dashboard */}
          {view === "dashboard" && (
            <section className="overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-sky-400/20 to-white/10 shadow-xl">
              <div className="grid gap-4 p-6 md:grid-cols-[1.3fr_1fr]">
                <div>
                  <h1 className="mb-1 text-[clamp(1.4rem,2.2vw+.6rem,2.4rem)] font-bold">
                    Umów się na wspólny trening — szybko i wygodnie
                  </h1>
                  <p className="text-[var(--muted)]">
                    SPORDER łączy ludzi, którzy chcą razem trenować. Wybierz sport, poziom, lokalizację i dołącz do ekipy. Twórz też
                    własne wydarzenia!
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button variant="primary" onClick={openCreate}>
                      ➕ Utwórz wydarzenie
                    </Button>
                    <Button
                      onClick={() => {
                        const list = filteredEvents.filter((e) => e.taken < e.spots);
                        if (!list.length) return showToast("Brak wydarzeń z wolnymi miejscami.");
                        openJoin(list[0].id);
                      }}
                    >
                      ⚡ Losowe dołączenie
                    </Button>
                    <Button variant="ghost" onClick={exportAll}>
                      📥 Eksport do kalendarza (.ics)
                    </Button>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                    <Card className="p-3">
                      <div className="text-xl font-extrabold">{kpiEvents}</div>
                      <div className="text-sm text-[var(--muted)]">Wydarzeń w okolicy</div>
                    </Card>
                    <Card className="p-3">
                      <div className="text-xl font-extrabold">{kpiPeople}</div>
                      <div className="text-sm text-[var(--muted)]">Uczestników</div>
                    </Card>
                    <Card className="p-3">
                      <div className="text-xl font-extrabold">{kpiFriends}</div>
                      <div className="text-sm text-[var(--muted)]">Znajomych gra dziś</div>
                    </Card>
                  </div>
                </div>
                <WeekCalendar events={events} />
              </div>
            </section>
          )}

          {/* Trainings */}
          {view === "trainings" && (
            <section className="grid gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-bold">Treningi</h2>
                <div className="flex items-center gap-2 text-[var(--muted)]">
                  Sortuj:
                  <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="min-w-40">
                    <option value="time">Najbliższy termin</option>
                    <option value="distance">Najbliżej</option>
                    <option value="popular">Najpopularniejsze</option>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredEvents.length ? (
                  filteredEvents.map((ev) => <EventCard key={ev.id} ev={ev} onJoin={openJoin} />)
                ) : (
                  <p className="text-[var(--muted)]">Brak wyników — zmień filtry.</p>
                )}
              </div>
            </section>
          )}

          {/* Friends */}
          {view === "friends" && (
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
          )}

          {/* Bookings */}
          {view === "bookings" && (
            <section className="grid gap-4">
              <h2 className="text-xl font-bold">Moje rezerwacje</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {bookings.length ? (
                  bookings
                    .map((id) => events.find((e) => e.id === id))
                    .filter(Boolean)
                    .map((ev) => (
                      <Card key={ev.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <strong>
                            {ev.cover} {ev.sport}
                          </strong>
                          <Badge>{fmtTime(ev.when)}</Badge>
                        </div>
                        <div className="mt-2 text-[var(--muted)]">
                          {ev.place} · {ev.city} · {ev.level}
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Button onClick={() => exportSingle(ev.id)}>📥 Zapisz do kalendarza</Button>
                          <Button variant="ghost" onClick={() => cancelBooking(ev.id)}>
                            ❌ Anuluj
                          </Button>
                        </div>
                      </Card>
                    ))
                ) : (
                  <p className="text-[var(--muted)]">Jeszcze nic nie zarezerwowałeś/aś.</p>
                )}
              </div>
            </section>
          )}

          {/* Profile */}
          {view === "profile" && (
            <section className="grid gap-4 lg:grid-cols-2">
              <Card className="p-4">
                <h3 className="mb-3 text-lg font-semibold">Dane użytkownika</h3>
                <div className="grid gap-3">
                  <Field label="Imię">
                    <Input
                      value={profile.name || currentUser?.name || ""}
                      onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                      placeholder="np. Ola"
                    />
                  </Field>
                  <Field label="Miasto domowe">
                    <Input
                      value={profile.homeCity || ""}
                      onChange={(e) => setProfile((p) => ({ ...p, homeCity: e.target.value }))}
                      placeholder="np. Kraków"
                    />
                  </Field>
                  <Field label="Preferowany poziom">
                    <Select
                      value={profile.prefLevel || "Średni"}
                      onChange={(e) => setProfile((p) => ({ ...p, prefLevel: e.target.value }))}
                    >
                      {LEVELS.filter((l) => l !== "Wszyscy").map((l) => (
                        <option key={l}>{l}</option>
                      ))}
                    </Select>
                  </Field>
                  <Button variant="primary" onClick={() => showToast("Zapisano profil.")}>
                    Zapisz profil
                  </Button>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="mb-3 text-lg font-semibold">Powiadomienia</h3>
                <div className="grid gap-3">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="size-4 rounded border-white/20 bg-white/10" />
                    Informuj o nowych wydarzeniach w pobliżu
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="size-4 rounded border-white/20 bg-white/10" />
                    Gdy znajomy dołączy do wydarzenia
                  </label>
                  <Button onClick={() => showToast("To jest przykładowe powiadomienie ✨")}>
                    Przetestuj powiadomienie
                  </Button>
                </div>
              </Card>
            </section>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/15 bg-white/10 px-[clamp(14px,3vw,28px)] py-4 text-[var(--muted)]">
        © {new Date().getFullYear()} SPORDER · SP ZOO BOBO💙 ·{" "}
        <a className="underline decoration-dotted" href="#">
          O aplikacji
        </a>
      </footer>

      {/* Modals */}
      <Modal open={modalOpen && modalKind === "join"} title="Dołącz do wydarzenia" onClose={() => setModalOpen(false)}>
        {(() => {
          const ev = events.find((e) => e.id === joinId);
          if (!ev) return <div>Nie znaleziono wydarzenia.</div>;
          return (
            <>
              <div className="text-[var(--muted)]">
                {ev.place} · {ev.city} · {fmtTime(ev.when)}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Rola">
                  <div className="flex flex-wrap gap-2">
                    <Chip active>✅ Zawodnik</Chip>
                    <Chip>Rezerwowy</Chip>
                  </div>
                </Field>
                <Field label="Twój poziom">
                  <Select defaultValue={ev.level}>
                    {LEVELS.filter((l) => l !== "Wszyscy").map((l) => (
                      <option key={l}>{l}</option>
                    ))}
                  </Select>
                </Field>
              </div>
              <Field label="Wiadomość do organizatora">
                <Input placeholder="np. spóźnię się 5 min" />
              </Field>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" onClick={() => setModalOpen(false)}>
                  Anuluj
                </Button>
                <Button variant="primary" onClick={confirmJoin}>
                  Potwierdź zapis
                </Button>
              </div>
            </>
          );
        })()}
      </Modal>

      <Modal open={modalOpen && modalKind === "create"} title="Utwórz wydarzenie" onClose={() => setModalOpen(false)}>
        <CreateForm
          onCreate={(ev) => {
            setEvents((arr) => [...arr, ev]);
            setModalOpen(false);
            showToast("Wydarzenie utworzone!");
          }}
          profileName={profile?.name || currentUser?.name || "Ty"}
        />
      </Modal>

      {/* Auth modal */}
      <AuthModal
        open={authOpen}
        mode={authMode}
        onClose={() => setAuthOpen(false)}
        onSuccess={(type) => {
          setAuthOpen(false);
          if (type === "register") showToast("Rejestracja zakończona. Witaj!");
          if (type === "login") showToast("Zalogowano pomyślnie");
        }}
      />

      {/* Toast */}
      {toastNode}

      {/* Global CSS: wymuszenie dark look dla natywnych elementów gdzie to możliwe */}
      <style>{`
        :root { color-scheme: dark; }
        /* Pomaga na niektórych przeglądarkach/OS: tło listy opcji */
        select, option {
          background-color: #1a2437 !important;
          color: #f5fbff !important;
        }
        /* iOS Safari zwykle nie pozwala wystylować menu opcji — w takim wypadku i tak działa ciemny control + nasza strzałka */
      `}</style>
    </div>
  );
}

function CreateForm({ onCreate, profileName }) {
  const [sport, setSport] = useState(SPORTS[0]);
  const [level, setLevel] = useState(LEVELS[1]);
  const [city, setCity] = useState("");
  const [place, setPlace] = useState("");
  const [dt, setDt] = useState("");
  const [spots, setSpots] = useState(10);

  function handleCreate() {
    const id = Math.floor(Math.random() * 1e9);
    const when = dt ? new Date(dt) : new Date(Date.now() + 86400000);
    const ev = {
      id,
      sport,
      level,
      city: city || "Miasto",
      place: place || "Miejsce",
      when,
      spots: Number(spots) || 10,
      taken: 1,
      km: (Math.random() * 8 + 1).toFixed(1),
      host: profileName || "Ty",
      friends: [],
      cover: "⭐",
    };
    onCreate(ev);
  }

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Sport">
          <Select value={sport} onChange={(e) => setSport(e.target.value)}>
            {SPORTS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
        </Field>
        <Field label="Poziom">
          <Select value={level} onChange={(e) => setLevel(e.target.value)}>
            {LEVELS.filter((l) => l !== "Wszyscy").map((l) => (
              <option key={l}>{l}</option>
            ))}
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
        <Button variant="ghost" onClick={() => history.back?.()}>
          Anuluj
        </Button>
        <Button variant="primary" onClick={handleCreate}>
          Utwórz
        </Button>
      </div>
    </>
  );
}
