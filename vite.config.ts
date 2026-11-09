import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Served by GitHub Pages as a project site: https://aliqb.github.io/invitationCard/
  // Must match the repo name. Reference public/ files through asset() in src/config.ts.
  base: '/invitationCard/',
  plugins: [react(), tailwindcss()],
})
