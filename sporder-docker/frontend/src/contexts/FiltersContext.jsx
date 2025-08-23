// src/contexts/FiltersContext.jsx
import React, { createContext, useContext, useState } from 'react';

const initialFilters = { q: "", sport: "", level: "", city: "", date: "", when: "", quick: new Set(), sortBy: "time" };

const FiltersContext = createContext(null);

export function FiltersProvider({ children }) {
  const [filters, setFilters] = useState(initialFilters);

  const value = { filters, setFilters };

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
}

export const useFilters = () => {
  const context = useContext(FiltersContext);
  if (!context) {
    throw new Error("useFilters must be used within a FiltersProvider");
  }
  return context;
};