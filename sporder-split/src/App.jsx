// src/App.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "./contexts/AuthContext";
import { useToast } from "./hooks/useToast";
import useLocalStorage from "./hooks/useLocalStorage";
import * as eventsApi from "./api/events";
import { downloadICS } from "./utils/ics";
import { useEvents } from "./hooks/useEvents";

// Komponenty Layoutu i Stron
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import DashboardPage from "./pages/DashboardPage";
import TrainingsPage from "./pages/TrainingsPage";
import FriendsPage from "./pages/FriendsPage";
import BookingsPage from "./pages/BookingsPage";
import ProfilePage from "./pages/ProfilePage";

// Komponenty Modali
import AuthModal from "./components/auth/AuthModal";
import Modal from "./components/ui/Modal";
import EventForm from "./components/EventForm";
// Logika dołączania do wydarzenia została przeniesiona do pliku TrainingsPage,
// ale modal może zostać tutaj dla globalnego dostępu.

export default function App() {
  // Globalne hooki i stany
  const { currentUser, isAuthenticated } = useAuth();
  const { show: showToast, node: toastNode } = useToast();
  const [view, setView] = useState("dashboard");

  // Stany dla modali
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false); // Można uprościć
  const [joinId, setJoinId] = useState(null);

  // Używamy hooka do pobrania wydarzeń, aby mieć do nich dostęp globalnie (np. dla eksportu)
  const { allEvents, addEvent } = useEvents();
  const [bookings] = useLocalStorage("bookings", []);

  // Efekt do ustawiania zmiennych CSS
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

  // Funkcje pomocnicze, które będą przekazywane do komponentów
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
      const newEvent = await eventsApi.createEvent(eventData);
      addEvent(newEvent); // Aktualizujemy stan w hooku
      setCreateOpen(false);
      showToast("Wydarzenie utworzone!");
    } catch (error) {
      showToast("Błąd podczas tworzenia wydarzenia.");
    }
  }
  
  const exportAllBookings = () => {
    const eventsToExport = bookings
      .map(id => allEvents.find(e => e.id === id))
      .filter(Boolean);

    if (eventsToExport.length === 0) {
      showToast("Brak rezerwacji do wyeksportowania.");
      return;
    }
    
    eventsToExport.forEach(ev => downloadICS(ev, `SPORDER-${ev.id}.ics`));
    showToast(`Wyeksportowano ${eventsToExport.length} wydarzeń.`);
  }

  // Renderowanie odpowiedniej strony na podstawie stanu 'view'
  const renderView = () => {
    switch (view) {
      case "dashboard":
        return <DashboardPage onCreate={() => requireAuth(() => setCreateOpen(true))} onExportAll={exportAllBookings} showToast={showToast} onJoin={(id) => requireAuth(() => { setJoinId(id); setJoinOpen(true); })} />;
      case "trainings":
        return <TrainingsPage onJoin={(id) => requireAuth(() => { setJoinId(id); setJoinOpen(true); })} />;
      case "friends":
        return <FriendsPage showToast={showToast} />;
      case "bookings":
        return <BookingsPage showToast={showToast} />;
      case "profile":
        return <ProfilePage showToast={showToast} />;
      default:
        return <DashboardPage />;
    }
  };

  const appBg = "bg-[radial-gradient(1200px_800px_at_80%_-10%,rgba(46,139,255,.15),transparent_60%),radial-gradient(900px_600px_at_-10%_20%,rgba(90,209,255,.12),transparent_60%)]";

  return (
    <div className={`min-h-dvh text-[var(--text)] ${appBg}`} style={{ backgroundColor: "var(--bg)" }}>
      <Header
        view={view}
        setView={setView}
        onLoginClick={() => { setAuthMode("login"); setAuthOpen(true); }}
        onRegisterClick={() => { setAuthMode("register"); setAuthOpen(true); }}
      />
      
      <div className="px-[clamp(14px,3vw,28px)] py-4">
        {renderView()}
      </div>

      <Footer />

      {/* Globalne modale i powiadomienia */}
      <AuthModal
        open={authOpen}
        mode={authMode}
        onClose={() => setAuthOpen(false)}
        onSuccess={(type) => {
          showToast(type === 'login' ? 'Zalogowano pomyślnie' : 'Rejestracja zakończona. Witaj!');
        }}
      />
      
       <Modal open={createOpen} title="Utwórz wydarzenie" onClose={() => setCreateOpen(false)}>
        <EventForm 
          onCancel={() => setCreateOpen(false)}
          onCreate={handleCreateEvent}
          profileName={currentUser?.name}
        />
      </Modal>

      {/* TODO: Uprościć logikę modala dołączania */}
      <Modal open={joinOpen} title="Dołącz do wydarzenia" onClose={() => setJoinOpen(false)}>
        <div>Dołączanie do wydarzenia o ID: {joinId} (logika do zaimplementowania)</div>
      </Modal>

      {toastNode}

      <style>{`:root { color-scheme: dark; }`}</style>
    </div>
  );
}