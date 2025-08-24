import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  base: './',        // important pour Electron en prod
  server: { port: 5173 }
})