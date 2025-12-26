import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'leary-tanisha-preeffectually.ngrok-free.dev'
    ],
    hmr: {
      host: 'leary-tanisha-preeffectually.ngrok-free.dev',
      clientPort: 443,
      protocol: 'wss'
    },
    headers: {
      "Content-Security-Policy": "frame-ancestors https://app.contentsquare.com https://*.contentsquare.net",
      //"frame-ancestors https://www.clarity.ms https://*.clarity.ms",
    },
  },
})