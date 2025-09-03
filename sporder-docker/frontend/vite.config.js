import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Dodaj tę sekcję, aby włączyć mapy źródeł dla builda produkcyjnego
  build: {
    sourcemap: true,
  },
})