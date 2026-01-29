import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // 改为相对路径，这是 Vercel 解决 404 的“万能药”
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})