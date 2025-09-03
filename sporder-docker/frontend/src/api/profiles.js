const API_URL = import.meta.env.VITE_API_BASE_URL;

//const API_URL = '/api';

/**
 * Pobiera dane profilowe zalogowanego użytkownika.
 * @param {string} token - Token JWT użytkownika.
 */
export const getMyProfile = async (token) => {
  const response = await fetch(`${API_URL}/profile/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Nie udało się pobrać danych profilu');
  }
  return response.json();
};

/**
 * Aktualizuje dane profilowe zalogowanego użytkownika.
 * @param {object} profileData - Dane do aktualizacji.
 * @param {string} token - Token JWT użytkownika.
 */
export const updateMyProfile = async (profileData, token) => {
  const response = await fetch(`${API_URL}/profile/me`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Nie udało się zaktualizować profilu');
  }
  return response.json();
};
