import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
    build: {
    outDir: 'build',

  },
  // server.proxy is for local dev only — disabled for production builds
  // server: {
  //   proxy: {
  //     "/api": "http://localhost:5000",
  //   },
  // },
})
