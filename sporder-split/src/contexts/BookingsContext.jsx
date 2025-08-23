// src/contexts/BookingsContext.jsx
import React, { createContext, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { useToast } from "../hooks/useToast.jsx";

const BookingsContext = createContext(null);

export function BookingsProvider({ children }) {
  const [bookings, setBookings] = useLocalStorage("bookings", []);
  const { show: showToast } = useToast(); // Hook `useToast` jest używany wewnętrznie

  const addBooking = (eventId) => {
    if (!bookings.includes(eventId)) {
      setBookings(prev => [...prev, eventId]);
      showToast("Dołączono do wydarzenia!");
    } else {
      showToast("Już jesteś zapisany/a na to wydarzenie.");
    }
  };

  const cancelBooking = (eventId) => {
    setBookings(prev => prev.filter(id => id !== eventId));
    showToast("Rezerwacja anulowana.");
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