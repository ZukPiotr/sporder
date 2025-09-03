import React, { useEffect, useState } from "react";
import { useAuth } from "./contexts/AuthContext";
import { useToast } from "./hooks/useToast.jsx";
import { useBookings } from "./contexts/BookingsContext.jsx";
import { useEventsContext } from "./contexts/EventsContext.jsx";
import { downloadICS } from "./utils/ics";
import * as eventsApi from "./api/events";
import * as bookingsApi from "./api/bookings"; // <-- 1. DODAJEMY NOWY IMPORT

import { FiltersProvider } from "./contexts/FiltersContext.jsx";
import { EventsProvider } from "./contexts/EventsContext.jsx";
import { BookingsProvider } from "./contexts/BookingsContext.jsx";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Sidebar from "./components/layout/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import TrainingsPage from "./pages/TrainingsPage";
import FriendsPage from "./pages/FriendsPage";
import BookingsPage from "./pages/BookingsPage";
import ProfilePage from "./pages/ProfilePage";
import AuthModal from "./components/auth/AuthModal";
import Modal from "./components/ui/Modal";
import EventForm from "./components/EventForm";
import Button from "./components/ui/Button";
import { fmtTime } from "./utils/formatters";

function AppContent() {
  const { currentUser, isAuthenticated, token } = useAuth();
  const { show: showToast } = useToast();
  const { bookings, addBooking } = useBookings();
  // 2. POBIERAMY FUNKCJĘ `refetchEvents` Z KONTEKSTU
  const { allEvents, addEvent, refetchEvents } = useEventsContext();

  const [view, setView] = useState("dashboard");
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [joinEventDetails, setJoinEventDetails] = useState(null);

  const requireAuth = (action) => {
    if (!isAuthenticated) {
      setAuthMode("login");
      setAuthOpen(true);
      showToast("Zaloguj się, aby kontynuować");
      return false;
    }
    action();
    return true;
  };
  
  const handleCreateEvent = async (eventData) => {
    try {
        const newEvent = await eventsApi.createEvent(eventData, token);
        addEvent(newEvent);
        setCreateOpen(false);
        showToast("Wydarzenie utworzone!");
    } catch (error) {
        showToast(`Błąd: ${error.message}`);
    }
  };

  const exportAllBookings = () => {
    const eventsToExport = bookings.map(id => allEvents.find(e => e.id === id)).filter(Boolean);
    if (!eventsToExport.length) return showToast("Brak rezerwacji do eksportu.");
    eventsToExport.forEach(ev => downloadICS(ev, `SPORDER-${ev.id}.ics`));
    showToast(`Wyeksportowano ${eventsToExport.length} wydarzeń.`);
  };

  const openJoinModal = (id) => {
    const event = allEvents.find(e => e.id === id);
    if (event) {
      setJoinEventDetails(event);
      requireAuth(() => setJoinOpen(true));
    }
  };

  // 3. PRZEPISUJEMY LOGIKĘ `confirmJoin`
  const confirmJoin = async () => {
    if (!joinEventDetails || !token) return;

    try {
      // Krok A: Wyślij zapytanie do API, aby zapisać rezerwację w bazie
      await bookingsApi.joinEvent(joinEventDetails.id, token);
      
      // Krok B: Zaktualizuj lokalny stan rezerwacji
      addBooking(joinEventDetails.id);
      
      // Krok C: Poinformuj EventsContext, aby odświeżył listę wydarzeń z serwera
      await refetchEvents();

      setJoinOpen(false);
      showToast("Dołączono do wydarzenia!");
    } catch (error) {
      showToast(`Błąd: ${error.message}`);
    }
  };

  const renderView = () => {
    switch (view) {
      case "dashboard": return <DashboardPage onCreate={() => requireAuth(() => setCreateOpen(true))} onExportAll={exportAllBookings} onJoin={openJoinModal} />;
      case "trainings": return <TrainingsPage onJoin={openJoinModal} />;
      case "friends": return <FriendsPage />;
      case "bookings": return <BookingsPage />;
      case "profile": return <ProfilePage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <>
      <Header view={view} setView={setView} onLoginClick={() => { setAuthMode("login"); setAuthOpen(true); }} onRegisterClick={() => { setAuthMode("register"); setAuthOpen(true); }} />
      <div className="grid grid-cols-1 gap-4 px-[clamp(14px,3vw,28px)] py-4 lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <main className="grid gap-4 content-start">{renderView()}</main>
      </div>
      <Footer />

      <AuthModal open={authOpen} mode={authMode} onClose={() => setAuthOpen(false)} onSuccess={(type) => showToast(type === 'login' ? 'Zalogowano pomyślnie' : 'Rejestracja zakończona. Witaj!')} />
      
      <Modal open={createOpen} title="Utwórz wydarzenie" onClose={() => setCreateOpen(false)}>
        <EventForm onCancel={() => setCreateOpen(false)} onCreate={handleCreateEvent} profileName={currentUser?.name} />
      </Modal>

      <Modal open={joinOpen} title="Dołącz do wydarzenia" onClose={() => setJoinOpen(false)}>
        {joinEventDetails ? (
          <div className="grid gap-4">
            <h3 className="text-lg font-bold">{joinEventDetails.sport}</h3>
            <p className="text-[var(--muted)]">
              {joinEventDetails.place}, {joinEventDetails.city}
            </p>
            <p className="text-[var(--muted)]">
              🗓️ {fmtTime(joinEventDetails.when)}
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setJoinOpen(false)}>
                Anuluj
              </Button>
              <Button variant="primary" onClick={confirmJoin}>
                Potwierdź zapis
              </Button>
            </div>
          </div>
        ) : (
          <p>Wczytywanie danych wydarzenia...</p>
        )}
      </Modal>
    </>
  );
}

export default function App() {
  const { node: toastNode } = useToast();
  
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

  const appBg = "bg-[radial-gradient(1200px_800px_at_80%_-10%,rgba(46,139,255,.15),transparent_60%),radial-gradient(900px_600px_at_-10%_20%,rgba(90,209,255,.12),transparent_60%)]";

  return (
    <div className={`min-h-dvh text-[var(--text)] ${appBg}`} style={{ backgroundColor: "var(--bg)" }}>
      <FiltersProvider>
        <EventsProvider>
          <BookingsProvider>
            <AppContent />
          </BookingsProvider>
        </EventsProvider>
      </FiltersProvider>
      {toastNode}
      <style>{`:root { color-scheme: dark; }`}</style>
    </div>
  );
}