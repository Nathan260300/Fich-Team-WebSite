import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/app/fich/',
  plugins: [react()],
  build: {
    outDir: '../dist/app/fich'
  }
})