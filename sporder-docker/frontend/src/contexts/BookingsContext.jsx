import React, { createContext, useContext, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { useToast } from "../hooks/useToast.jsx";
import { useAuth } from "./AuthContext";
import * as bookingsApi from "../api/bookings";

const BookingsContext = createContext(null);

export function BookingsProvider({ children }) {
  const [bookings, setBookings] = useLocalStorage("bookings", []);
  const { show: showToast } = useToast();
  const { token } = useAuth(); // Pobieramy token z kontekstu Auth

  // TODO: W przyszłości warto pobierać rezerwacje z API po zalogowaniu
  // useEffect(() => { ... fetch user bookings ... }, [token]);

  const addBooking = async (eventId) => {
    if (!token) {
      showToast("Musisz być zalogowany, aby dołączyć.");
      return;
    }
    try {
      await bookingsApi.joinEvent(eventId, token);
      setBookings(prev => [...prev, eventId]);
      showToast("Dołączono do wydarzenia!");
    } catch (error) {
      showToast(`Błąd: ${error.message}`);
    }
  };

  const cancelBooking = async (eventId) => {
    if (!token) {
      showToast("Błąd autoryzacji.");
      return;
    }
    try {
      await bookingsApi.leaveEvent(eventId, token);
      setBookings(prev => prev.filter(id => id !== eventId));
      showToast("Rezerwacja anulowana.");
    } catch (error) {
      showToast(`Błąd: ${error.message}`);
    }
  };

  const isBooked = (eventId) => bookings.includes(eventId);
  
  const value = { bookings, addBooking, cancelBooking, isBooked };

  return <BookingsContext.Provider value={value}>{children}</BookingsContext.Provider>
}

export const useBookings = () => {
  const context = useContext(BookingsContext);
  if (!context) {
    throw new Error("useBookings must be used within a BookingsProvider");
  }
  return context;
}