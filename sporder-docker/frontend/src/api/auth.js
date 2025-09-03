//const API_URL = import.meta.env.VITE_API_BASE_URL;
//console.log('Wczytany API URL z .env:', import.meta.env.VITE_API_BASE_URL);

const API_URL = '/api';

/**
 * Rejestruje nowego użytkownika, wysyłając dane do backendu.
 * @param {object} userData - dane { email, password, name }
 */
export const register = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Rejestracja nie powiodła się');
  }
  // Backend po rejestracji może od razu zalogować użytkownika i zwrócić jego dane
  return response.json();
};

/**
 * Loguje użytkownika, wysyłając dane do backendu.
 * @param {object} credentials - dane { email, password }
 */
export const login = async (credentials) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Logowanie nie powiodło się');
  }
  // Backend po zalogowaniu powinien zwrócić dane użytkownika i token
  return response.json();
}; 