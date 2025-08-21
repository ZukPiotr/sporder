// src/api/auth.js

// Helper do zarządzania "bazą danych" użytkowników w localStorage
const getUsers = () => JSON.parse(localStorage.getItem("sporder_users") || "[]");
const setUsers = (users) => localStorage.setItem("sporder_users", JSON.stringify(users));

// Symuluje rejestrację użytkownika
export const register = async ({ email, password, name }) => {
  await new Promise(res => setTimeout(res, 300)); // Symulacja opóźnienia sieci
  
  const users = getUsers();
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("Konto z tym e‑mailem już istnieje");
  }
  
  const user = { email, password, name: name || email.split("@")[0] };
  setUsers([...users, user]);
  
  return { email: user.email, name: user.name }; // Zwraca tylko bezpieczne dane
};

// Symuluje logowanie użytkownika
export const login = async ({ email, password }) => {
  await new Promise(res => setTimeout(res, 300)); // Symulacja opóźnienia sieci

  const users = getUsers();
  const user = users.find((x) => x.email.toLowerCase() === email.toLowerCase());

  if (!user || user.password !== password) {
    throw new Error("Błędny e‑mail lub hasło");
  }

  return { email: user.email, name: user.name }; // Zwraca tylko bezpieczne dane
};