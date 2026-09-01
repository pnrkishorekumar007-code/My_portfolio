import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Split large vendor libs into cacheable chunks that rarely change
        // across app-code deploys.
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('gsap') || id.includes('@gsap')) return 'gsap-vendor';
            if (
              id.includes('three') ||
              id.includes('@react-three')
            ) {
              return 'three-vendor';
            }
          }
        },
      },
    },
  },
})
