import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    // 确保打包产物符合 Vercel 预期
    outDir: 'dist',
    assetsDir: 'assets',
    // 自动注入 CSS
    cssCodeSplit: true,
  }
})