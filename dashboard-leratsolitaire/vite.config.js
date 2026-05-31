import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/app/leratsolitaire/',
  plugins: [react()],
  build: {
    outDir: '../dist/app/leratsolitaire'
  }
})