import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Force localhost (not 127.0.0.1) so it matches Google OAuth Authorized JavaScript origins.
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: true,
    open: true,
  },
})
