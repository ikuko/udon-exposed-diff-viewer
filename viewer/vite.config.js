import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  define: {
    'import.meta.env.VITE_APP_BUILD_TIMESTAMP': JSON.stringify(new Date().toISOString()),
  }
})
