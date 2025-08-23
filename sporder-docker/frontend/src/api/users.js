const API_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Wyszukuje użytkowników po imieniu lub emailu.
 * @param {string} query - Fraza do wyszukania.
 * @param {string} token - Token JWT.
 */
export const findUsers = async (query, token) => {
  if (!query) return [];
  const response = await fetch(`${API_URL}/users?search=${query}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Błąd podczas wyszukiwania użytkowników');
  }
  return response.json();
};
