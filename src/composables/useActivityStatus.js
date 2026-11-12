// useActivityStatus.js - 申請時程與活動狀態（首頁 App.vue、測驗頁 QuizApp.vue 共用）
// 每季開放時間異動時只要改這裡的 schedule，兩個頁面會一起更新

// 春季班申請階段 2026/12/1 - 2027/1/13
export const schedule = {
	openAt: '2026/12/01 00:00:00',
	closeAt: '2027/01/13 23:59:59',
	openLabel: '2026/12/1(二)',
	periodLabel: '2026/12/1(二)-2027/1/13(三)',
	deadlineLabel: '2027/1/13(三)23:59'
}

// 申請截止後導去的計畫官網
export const learnMoreUrl = 'https://nxtfresh.saylingwen.org/?utm_source=website&utm_medium=event&utm_campaign=26learnmore'

const STATES = ['before', 'open', 'ended']

// 網址上強制指定的狀態（?state=before|open|ended，給企劃看各狀態或特別開放用），沒有就回傳 null
export function getForcedState() {
	const forced = new URLSearchParams(window.location.search).get('state')
	return STATES.includes(forced) ? forced : null
}

// before：開放申請前 / open：開放申請中（顯示表單）/ ended：申請截止後
export function getActivityStatus() {
	const forced = getForcedState()
	if (forced) return forced

	const nowTime = new Date()
	if (nowTime < new Date(schedule.openAt)) return 'before'
	if (nowTime <= new Date(schedule.closeAt)) return 'open'
	return 'ended'
}

// 導覽列按鈕文字
export const ctaTextMap = { before: '開啟申請提醒', open: '立即申請', ended: '前往計畫官網' }
