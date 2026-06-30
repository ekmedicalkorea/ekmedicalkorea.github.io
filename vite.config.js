import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    minify: false,  // 미니파이 끄고 테스트
    sourcemap: false,
  }
})
