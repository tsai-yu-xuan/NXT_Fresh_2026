// useGA.js - Google Analytics 相關功能
// 固定模組，每個新專案都直接複製，不需要重寫
export function pushGA(userId, data = {}) {
	window.dataLayer = window.dataLayer || []
	window.dataLayer.push({
		'event': 'refrear_event',
		'uid': userId,
		'event_name': data.event_name
	})
}
