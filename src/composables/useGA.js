// useGA.js - Google Analytics 相關功能
// 固定模組，每個新專案都直接複製，不需要重寫
export function pushGA(data = {}) {
	window.dataLayer = window.dataLayer || []
	window.dataLayer.push({
		'event': 'view_image_result',
		'image_id': data.image_id,
		'image_name': data.image_name
	})
	console.log('[GA] 進站事件已推送', window.dataLayer[window.dataLayer.length - 1])
}
