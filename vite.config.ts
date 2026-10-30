import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('node_modules/@mui') || id.includes('node_modules/@emotion')) return 'mui'
          if (
            id.includes('node_modules/@firebase/firestore') ||
            id.includes('node_modules/@firebase/storage') ||
            id.includes('node_modules/firebase/firestore') ||
            id.includes('node_modules/firebase/storage')
          ) {
            return 'firebase-data'
          }
          if (id.includes('node_modules/@firebase') || id.includes('node_modules/firebase')) return 'firebase-core'
          if (id.includes('node_modules/react') || id.includes('node_modules/scheduler')) return 'react'
        },
      },
    },
  },
})
