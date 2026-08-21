# NXT_Fresh_2026

`nxt-workplace-exam-liff` 的 Vite 重製版：解決原專案在嚴格 CSP（`script-src` 不含 `unsafe-eval`）下，Vue 用 in-DOM template 執行期編譯會被擋掉、整個 app 掛載失敗的問題。

- Vue 模板改寫成 `.vue` SFC，交給 Vite 在 build time 編譯成 render function，瀏覽器不需要 `new Function()`／`eval`
- 原本的 `vendor/` 手動放置的 bootstrap / axios / animate.css / vue，改成用 npm 套件管理
- `js/*.js` 的邏輯搬進 `src/composables/`，`window.APP_CONFIG` 改成 `src/config.js` 的 ES module export
- 圖片/影片/字型放在 `public/`，用根目錄絕對路徑（`/assets/...`、`/fonts/...`）引用，build 時原樣複製，不經過 Vite 的 hash 處理

## 開發

```bash
npm install
npm run dev
```

會同時提供 `index.html`（首頁）與 `quiz.html`（測驗頁）兩個入口。

## 建置 / 部署

```bash
npm run build
```

輸出在 `dist/`，部署時把 `dist/` 整個資料夾內容上傳到主機即可（跟原專案一樣是純靜態站，只是多了一道 build 手續）。`npm run preview` 可以在本機先預覽 build 結果。

## 目錄結構

- `index.html` / `quiz.html` — 兩個頁面各自的進入 HTML（Vite multi-page 設定見 `vite.config.js`）
- `src/App.vue` / `src/QuizApp.vue` — 對應兩個頁面的模板 + 組裝邏輯
- `src/composables/` — `useApply.js`（首頁申請表單）、`useQuiz.js`（測驗流程）、`useGA.js`（GA 固定模組，維持全域可呼叫）
- `src/config.js` — 所有可能因專案而變的值（API 網址、圖片路徑、測驗題目與結果文案）
- `src/styles/all.css` — 原專案的樣式表，資源路徑已改成根目錄絕對路徑
- `public/assets/`、`public/fonts/` — 靜態資源，build 時原樣複製到 `dist/`

## 跟原專案的已知差異

- 原 `all.css` 裡 `.about-bg` 跟 `.hero .hero-bg-pc`（`kv-bg.png`）有兩處網址少了 `https://lineevent` 前綴（`url('.s3.ap-northeast-1.amazonaws.com/...')`），本來就是壞的、圖片顯示不出來——這次一併修正指向本地檔案。
- `quiz.html` 點 logo 原本沒有綁定 `goHome`（點了沒反應），這裡補上導回首頁的行為。
