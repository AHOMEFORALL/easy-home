import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  // Vercel et le Preview EazyHome servent l’application à la racine.
  base: '/',
})
