import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { execSync } from 'node:child_process'

// 版本號：build 當下的台灣時間 + git commit 短碼，例如 2026.11.12-1530-1754633
// 上傳後可用「檢視原始碼」看 <meta name="build-version">，或打開 Console 看 [版本]，確認線上是不是最新版
const buildTime = new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false
}).format(new Date()).replace(/-/g, '.').replace(' ', '-').replace(':', '')
let gitHash = 'nogit'
try { gitHash = execSync('git rev-parse --short HEAD').toString().trim() } catch {}
const APP_VERSION = `${buildTime}-${gitHash}`

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    {
      name: 'inject-build-version',
      transformIndexHtml: (html) => html.replace('<head>', `<head>\n    <meta name="build-version" content="${APP_VERSION}">`)
    }
  ],
  define: {
    __APP_VERSION__: JSON.stringify(APP_VERSION)
  },
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
