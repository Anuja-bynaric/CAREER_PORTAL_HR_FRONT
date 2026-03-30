import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,         // Allows the Docker container to be accessed outside
    port: 5173,         // Matches your docker-compose port
    watch: {
      usePolling: true, // <--- THIS IS THE FIX for Windows/Docker sync
      interval: 100,    // Check for changes every 100ms
    },
    hmr: {
      clientPort: 5173, // Ensures the browser talks back to the right port
    },
  },
})