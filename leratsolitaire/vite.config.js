import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/leratsolitaire-wiki/',
  plugins: [react()],
  build: {
    outDir: '../dist/leratsolitaire'
  }
})