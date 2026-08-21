// ====================================
// 配置檔案
// 所有可能因專案而變的值都集中在這裡，其他元件 / composable 不要寫死
// ====================================

export default {
	// API 配置（依專案 API 文件填入）
	api: {
		applyForm: 'https://nxtfresh26.saylingwen.org/AI2026_form/api/post/submit',
	},

	// 圖片資源
	images: {
		logo: 'assets/images/logo.png',

		home: {
			title: 'assets/images/home/title.png',
			ctaBg: 'assets/images/home/btn-apply-bg.png',
			ctaArrow: 'assets/images/home/icon-arrow.png',
			finger: 'assets/images/home/finger.png',
			icon1: 'assets/images/home/icon-1.png',
			icon2: 'assets/images/home/icon-2.png',
			icon3: 'assets/images/home/icon-3.png',
			icon4: 'assets/images/home/icon-4.png',
			icon5: 'assets/images/home/icon-5.png',
			dot: 'assets/images/home/dot.svg',
			introBrandMark: 'assets/images/home/intro-brand-mark.png',
			sub: 'assets/images/home/sub.png',
			introBtn: 'assets/images/home/intro-btn.png',
			iconChevronDown: 'assets/images/home/icon-chevron-down.svg',
			kv: 'assets/images/home/kv.mp4',
			kvMobile: 'assets/images/home/kv_M.mp4',

			iconAudience: 'assets/images/home/about-icon-audience.png',
			iconQualify: 'assets/images/home/about-icon-qualify.png',
			iconSchedule: 'assets/images/home/about-icon-schedule.png',
			divider: 'assets/images/home/divider.svg'
		},

		quiz: {
			logo: 'assets/images/quiz/logo-white.png',
			title: 'assets/images/quiz/title.png',
			introEndImage: 'assets/images/quiz/intro.jpg',
			light: 'assets/images/quiz/light.png',
			loadingVideo: 'assets/images/quiz/loading.mp4',
			facebook: 'assets/images/quiz/facebook.png',
			instagram: 'assets/images/quiz/instagram.png',
			line: 'assets/images/quiz/line.png',
			threads: 'assets/images/quiz/threads.png',
			link: 'assets/images/quiz/link.png'
		}
	},

	// 職場生存模擬考：題目、選項、結果類型
	quiz: {
		leadInVideo: 'https://lineevent.s3.ap-northeast-1.amazonaws.com/202608_saylingwen_NXT_Fresh/quiz/video/intro.webm',
		questions: [
			{
				questionNum: '1',
				scenario: '報到時主管詢問',
				video: 'https://lineevent.s3.ap-northeast-1.amazonaws.com/202608_saylingwen_NXT_Fresh/quiz/video/Q1.webm',
				bgImage: 'https://lineevent.s3.ap-northeast-1.amazonaws.com/202608_saylingwen_NXT_Fresh/quiz/video/Q1.png',
				title: '你當初如何準備履歷的？',
				options: [
					{ value: 'A', text: '對照職缺條件逐項製作' },
					{ value: 'B', text: '根據企業風格準備內容' },
					{ value: 'C', text: '把經歷跟作品寫好寫滿' }
				]
			},
			{
				questionNum: '2',
				scenario: '專案小組討論會議',
				video: 'https://lineevent.s3.ap-northeast-1.amazonaws.com/202608_saylingwen_NXT_Fresh/quiz/video/Q2.webm',
				bgImage: 'https://lineevent.s3.ap-northeast-1.amazonaws.com/202608_saylingwen_NXT_Fresh/quiz/video/Q2.png',
				title: '專案沒有範例可以參考，<br>大家意見都不同，該怎麼做？',
				options: [
					{ value: 'A', text: '規劃待辦事項和時間排程' },
					{ value: 'B', text: '聽主管安排的為主' },
					{ value: 'C', text: '臨場反應隨機應變' }
				]
			},
			{
				questionNum: '3',
				scenario: '第一次收到主管交辦的任務',
				video: 'https://lineevent.s3.ap-northeast-1.amazonaws.com/202608_saylingwen_NXT_Fresh/quiz/video/Q3.webm',
				bgImage: 'https://lineevent.s3.ap-northeast-1.amazonaws.com/202608_saylingwen_NXT_Fresh/quiz/video/Q3.png',
				title: '我的直覺反應是？',
				options: [
					{ value: 'A', text: '我準備好迎接全新挑戰' },
					{ value: 'B', text: '我需要前輩帶領我執行' },
					{ value: 'C', text: '我好緊張該怎麼做' }
				]
			},
			{
				questionNum: '4',
				scenario: 'HR主管詢問工作狀況',
				video: 'https://lineevent.s3.ap-northeast-1.amazonaws.com/202608_saylingwen_NXT_Fresh/quiz/video/Q4.webm',
				bgImage: 'https://lineevent.s3.ap-northeast-1.amazonaws.com/202608_saylingwen_NXT_Fresh/quiz/video/Q4.png',
				title: '現在大家都用 AI 工作，<br>你認為自己哪一點不會被取代？',
				options: [
					{ value: 'A', text: '我有承擔決策結果的勇氣' },
					{ value: 'B', text: '我具備與各部門溝通的技巧' },
					{ value: 'C', text: '我擅長製作並優化提案簡報' }
				]
			}
		],
		results: {
			A: {
				img: 'assets/images/quiz/result-A.jpg',
				name: 'A型人才',
				description: '（佔位文案，之後換成正式內容）'
			},
			B: {
				img: 'assets/images/quiz/result-B.jpg',
				name: 'B型人才',
				description: '（佔位文案，之後換成正式內容）'
			},
			C: {
				img: 'assets/images/quiz/result-C.jpg',
				name: 'C型人才',
				description: '（佔位文案，之後換成正式內容）'
			}
		}
	}
}
