import React, { createContext, useContext, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import * as authApi from "../api/auth";

// Tworzymy kontekst, który będzie przechowywał wszystkie dane i funkcje
const AuthContext = createContext(null);

// Komponent Provider, którym "opakujesz" całą aplikację
export function AuthProvider({ children }) {
  // Używamy Twojego hooka `useLocalStorage` do automatycznego zapisu i odczytu
  // danych użytkownika i tokenu. To utrzymuje sesję po odświeżeniu strony.
  const [currentUser, setCurrentUser] = useLocalStorage("sporder_current_user", null);
  const [token, setToken] = useLocalStorage("sporder_access_token", null);
  
  // Stany do obsługi ładowania i błędów
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Loguje użytkownika na podstawie jego danych uwierzytelniających.
   */
  const login = async (credentials) => {
    setLoading(true);
    setError(null); // Czyścimy poprzedni błąd
    try {
      const response = await authApi.login(credentials);
      // Backend zwraca dane użytkownika i token
      setCurrentUser(response.user);
      setToken(response.access_token);
    } catch (err) {
      setError(err); // Zapisujemy błąd w stanie globalnym
      throw err; // Przekazujemy błąd dalej, aby formularz mógł go też obsłużyć
    } finally {
      setLoading(false);
    }
  };

  /**
   * Rejestruje nowego użytkownika i automatycznie go loguje.
   */
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.register(userData);
      // Po udanej rejestracji od razu logujemy użytkownika
      setCurrentUser(response.user);
      // Zakładamy, że API rejestracji również może zwrócić token
      // Jeśli nie, to pole będzie undefined, co jest OK
      setToken(response.access_token);
      
      // Zwracamy odpowiedź, aby modal mógł wyświetlić wiadomość o sukcesie
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Wylogowuje aktualnego użytkownika.
   */
  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    setError(null);
  };

  // Obiekt `value` zawiera wszystkie dane i funkcje,
  // które będą dostępne w całej aplikacji przez hook `useAuth`
  const value = {
    currentUser,
    token,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser, // Wygodna zmienna do sprawdzania, czy ktoś jest zalogowany
    setCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Customowy hook do łatwego dostępu do kontekstu autoryzacji.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};