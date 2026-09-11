# 2026 NXT Fresh 人才培育計畫｜職場生存模擬考

財團法人溫世仁文教基金會「NXT Fresh 人才培育計畫」官網。Vue 3 + Vite 的雙頁式靜態網站：

- `index.html` — 首頁，計畫介紹＋線上申請表單
- `quiz.html` — 職場生存模擬考測驗頁，答題後產出分享用的人才類型結果

模板改寫成 `.vue` SFC 交給 Vite 在 build time 編譯成 render function，避免原本 in-DOM template 執行期編譯（`new Function()` / `eval`）在嚴格 CSP（`script-src` 不含 `unsafe-eval`）環境下被擋掉、整個 app 掛載失敗。

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

輸出在 `dist/`，部署時把 `dist/` 整個資料夾內容上傳到主機即可（純靜態站，只是多了一道 build 手續）。`npm run preview` 可以在本機先預覽 build 結果。

## 目錄結構

- `index.html` / `quiz.html` — 兩個頁面各自的進入 HTML（Vite multi-page 設定見 `vite.config.js`）
- `src/main.js` / `src/main-quiz.js` — 對應兩個頁面的進入點，載入 bootstrap / animate.css / `all.css` 後掛載對應的 App
- `src/App.vue` — 首頁：主視覺、計畫簡介、申請表單（生日選擇器、身分下拉選單、多選來源）、依日期判斷目前是否開放申請、跳轉測驗頁的浮動按鈕
- `src/QuizApp.vue` — 測驗頁：職場生存模擬考流程（intro 影片 → 逐題影片/文字作答 → 結果頁）
- `src/composables/useGA.js` — GA 事件推送的固定模組，跨專案共用，不需要重寫
- `src/config.js` — 所有可能因專案而變的值集中管理：申請表單 API 網址、圖片/影片路徑、測驗題目與結果文案
- `src/styles/all.css` — 樣式表，圖片等資源路徑已改成根目錄絕對路徑
- `public/assets/`、`public/fonts/` — 靜態資源，build 時原樣複製到 `dist/`
- `public/.htaccess` — 部署後的快取策略：HTML 不快取、有雜湊檔名的 JS/CSS 長期快取、圖片影片中等長度快取

## 專案相關設定

- **申請開放時間**：寫死在 `src/App.vue` 的 `checkTime()`，依目前時間判斷秋季班／春季班／空窗期／已結束／尚未開始，對應決定首頁顯示申請表單還是提前通知按鈕。每季開放時間異動時記得更新這裡的日期。
- **追蹤標籤**：`quiz.html` 掛 GTM（`GTM-P9KTSHT4`）；申請表單送出時會呼叫 LINE Tag（`window._lt`）與 LINE Point Ads 轉換事件；測驗結果頁的曝光事件透過 `useGA.js` 的 `pushGA()` 推送到 `dataLayer`。這幾處都是外部行銷工具的串接點，改動申請/測驗流程時要留意別漏了觸發時機。
