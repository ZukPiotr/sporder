// src/App.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "./contexts/AuthContext";
import { useToast } from "./hooks/useToast.jsx";
import { useBookings } from "./contexts/BookingsContext.jsx";
import { useEventsContext } from "./contexts/EventsContext.jsx";
import { downloadICS } from "./utils/ics";
import * as eventsApi from "./api/events";

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

function AppContent() {
  const { currentUser, isAuthenticated } = useAuth();
  const { show: showToast } = useToast();
  const { bookings } = useBookings();
  const { allEvents, addEvent } = useEventsContext();

  const [view, setView] = useState("dashboard");
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [joinId, setJoinId] = useState(null);

  const requireAuth = (action) => {
    if (!isAuthenticated) { setAuthMode("login"); setAuthOpen(true); showToast("Zaloguj się, aby kontynuować"); return false; }
    action();
    return true;
  };
  
  const handleCreateEvent = async (eventData) => {
    const newEvent = await eventsApi.createEvent(eventData);
    addEvent(newEvent);
    setCreateOpen(false);
    showToast("Wydarzenie utworzone!");
  };

  const exportAllBookings = () => {
    const eventsToExport = bookings.map(id => allEvents.find(e => e.id === id)).filter(Boolean);
    if (!eventsToExport.length) return showToast("Brak rezerwacji do eksportu.");
    eventsToExport.forEach(ev => downloadICS(ev, `SPORDER-${ev.id}.ics`));
    showToast(`Wyeksportowano ${eventsToExport.length} wydarzeń.`);
  };

  const openJoinModal = (id) => requireAuth(() => { setJoinId(id); setJoinOpen(true); });

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

      <AuthModal open={authOpen} mode={authMode} onClose={() => setAuthOpen(false)} onSuccess={(type) => showToast(type === 'login' ? 'Zalogowano' : 'Zarejestrowano')} />
      <Modal open={createOpen} title="Utwórz wydarzenie" onClose={() => setCreateOpen(false)}>
        <EventForm onCancel={() => setCreateOpen(false)} onCreate={handleCreateEvent} profileName={currentUser?.name} />
      </Modal>
      <Modal open={joinOpen} title="Dołącz do wydarzenia" onClose={() => setJoinOpen(false)}>
        <div>Dołączanie do wydarzenia o ID: {joinId} (logika do zaimplementowania)</div>
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