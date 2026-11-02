
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Configuration pour GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: '/easy-home/',
})

