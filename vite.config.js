import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [vue()],
  server: {
    // 讓 ngrok 產生的網域可以連進本機開發伺服器（Vite 預設會擋掉不認得的 Host header）
    allowedHosts: ['.ngrok-free.app', '.ngrok-free.dev', '.ngrok.io', '.ngrok.app', '.ngrok.dev'],
  },
  build: {
    // 多頁應用：首頁 (index.html) 與測驗頁 (quiz.html) 各自是獨立的進入點
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        quiz: fileURLToPath(new URL('./quiz.html', import.meta.url)),
      },
    },
  },
})
