import React, { createContext, useContext, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import * as authApi from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useLocalStorage("sporder_current_user", null);
  // Przechowujemy token w localStorage, aby przetrwał odświeżenie strony
  const [token, setToken] = useLocalStorage("sporder_access_token", null);
  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await authApi.login(credentials);
      // Backend zwraca teraz dane użytkownika i token
      setCurrentUser(response.user);
      setToken(response.access_token);
      return response.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      // API rejestracji może również zwracać token od razu po sukcesie
      const response = await authApi.register(userData);
      setCurrentUser(response.user);
      setToken(response.access_token);
      return response.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
  };

  const value = {
    currentUser,
    token, // Udostępniamy token w kontekście
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
