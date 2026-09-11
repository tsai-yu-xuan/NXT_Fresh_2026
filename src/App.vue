<template>
	<!-- loading -->
	<div v-if="loading.state" class="loading-view">
		<div class="loading-container">
			<div class="spinner"></div>
			<h2>{{ loading.title }}</h2>
		</div>
	</div>

	<div v-if="holdBtn" class="submit-loading-overlay">
		<div class="submit-loading-container">
			<div class="submit-spinner"></div>
			<p>送出中...</p>
		</div>
	</div>

	<div class="wrapper">
		<!-- navbar start -->
		<header class="navbar navbar-grid m-0">
			<div class="container-fluid d-flex align-items-center justify-content-between">
				<a class="navbar-brand" @click="goHome">
					<img :src="config.images.logo" alt="logo" />
				</a>
				<a class="btn-apply-nav" href="#apply" @click.prevent="scrollToApply()">立即申請</a>
			</div>
		</header>
		<!-- navbar end -->

		<!-- 前往測驗浮動按鈕 -->
		<div class="to-quiz" id="to-quiz" :class="{ 'is-visible': showToQuiz }"><img :src="config.images.home.introBtn" draggable="false" alt="" /></div>

		<!-- 首頁 -->
		<div class="page page-grid home" v-show="currentPage === 'home'">
			<div class="home-top">
				<!-- 主視覺區 -->
				<section class="hero">
					<div class="hero-bg-pc">
						<video ref="heroVideoPc" :src="config.images.home.kv" autoplay muted loop playsinline></video>
					</div>
					<div class="hero-bg-mobile">
						<video ref="heroVideoMobile" :src="config.images.home.kvMobile" autoplay muted loop playsinline></video>
					</div>
					<div class="hero-content">
						<a class="btn-cta" href="#apply" @click.prevent="scrollToApply()">立即申請</a>
					</div>
					<div class="hero-title">
						<img :src="config.images.home.title" alt="職場生存模擬考｜2026 NXT Fresh 人才培育計畫｜" />
					</div>
				</section>
				<!-- 計畫簡介區 -->
				<section class="intro text-center">
					<div class="intro-panel">
						<h2 class="intro-title pc">2026 NXT Fresh 人才培育計畫</h2>
						<h2 class="intro-title mobile">2026 NXT Fresh<br />人才培育計畫</h2>
						<div class="intro-slogan"><img :src="config.images.home.sub" alt="" /></div>

						<div class="feature-list">
							<div class="feature-card">
								<img class="feature-icon" :src="config.images.home.icon1" alt="1" />
								<div class="feature-text">
									<p class="feature-title">個計畫</p>
									<p class="feature-desc">陪伴新鮮人釐清職涯定位，培養進入職場所需的關鍵能力</p>
								</div>
							</div>

							<div class="feature-card">
								<img class="feature-icon" :src="config.images.home.icon2" alt="2" />
								<div class="feature-text">
									<p class="feature-title">大階段</p>
									<div class="feature-sub">
										<div class="feature-sub-item">
											<div class="feature-sub-text">
												<p class="sub-title">基礎培育階段</p>
												<p class="sub-desc">職涯探索與基礎知識培養</p>
											</div>
										</div>
										<div class="feature-sub-item">
											<div class="feature-sub-text">
												<p class="sub-title">進階培育階段</p>
												<p class="sub-desc">團隊協作與職場實戰</p>
											</div>
										</div>
									</div>
								</div>
							</div>

							<div class="feature-card">
								<img class="feature-icon" :src="config.images.home.icon3" alt="3" />
								<div class="feature-text">
									<p class="feature-title">段課程</p>
									<p class="feature-desc">職場即戰力線上課程、職涯發展工作坊及團隊合作工作坊</p>
								</div>
							</div>

							<div class="feature-card">
								<img class="feature-icon" :src="config.images.home.icon4" alt="4" />
								<div class="feature-text">
									<p class="feature-title">C 主題</p>
									<p class="feature-desc">基金會獨創職場新鮮人應具備的四大面向課程</p>
								</div>
							</div>

							<div class="feature-card feature-card-wide">
								<img class="feature-icon" :src="config.images.home.icon5" alt="5" />
								<div class="feature-text">
									<p class="feature-title">大亮點</p>
									<p class="feature-desc">數位實體課程、完整職涯規劃、領新陪伴支持、響應企業交流、學員高度肯定</p>
								</div>
							</div>
							<img class="feature-brand-mark" :src="config.images.home.introBrandMark" alt="NXT Fresh" />
						</div>
					</div>
				</section>
			</div>

			<!-- 適合對象／申請資格／申請時間 -->
			<section class="about text-center" id="about">
				<div class="about-list">
					<div class="about-item">
						<img class="about-icon" :src="config.images.home.iconAudience" alt="" />
						<p class="about-title">適合對象</p>
						<img class="about-divider" :src="config.images.home.divider" alt="" />
						<p class="about-desc">想找到真正適合自己工作的人</p>
					</div>

					<div class="about-item">
						<img class="about-icon" :src="config.images.home.iconQualify" alt="" />
						<p class="about-title">申請資格</p>
						<img class="about-divider" :src="config.images.home.divider" alt="" />
						<p class="about-desc">大三(含)以上學生(含碩博士生)或兩年(含)以內工作經驗者</p>
					</div>

					<div class="about-item">
						<img class="about-icon" :src="config.images.home.iconSchedule" alt="" />
						<p class="about-title">申請時間</p>
						<img class="about-divider" :src="config.images.home.divider" alt="" />
						<p class="about-desc">2026/8/31(一)～2026/9/30(三)</p>
					</div>
				</div>

				<a class="btn-pill" href="https://nxtfresh.saylingwen.org/?utm_source=website&utm_medium=event&utm_campaign=26learnmore" target="_blank">了解更多</a>
			</section>

			<!-- 立即申請表單 -->
			<section class="apply text-center" id="apply" v-if="activityStatus === 'fallSeason' || activityStatus === 'springSeason'">
				<h2 class="apply-title">立即申請</h2>

				<form class="apply-form" @submit.prevent="submitApply">
					<div class="apply-grid">
						<div class="apply-col">
							<p class="apply-label">個人資訊填寫</p>
							<div class="apply-card">
								<input class="apply-input apply-input-name" type="text" v-model="form.name" placeholder="姓名" />
								<div class="apply-birthday-wrap">
									<button type="button" class="apply-input apply-birthday-trigger" @click="openBirthdayPicker">
										<span :class="{ 'is-placeholder': !form.birthday }">{{ form.birthday || '生日' }}</span>
									</button>
									<div class="birthday-picker" v-if="birthdayPickerOpen">
										<div class="birthday-picker-header">
											<select class="birthday-select" v-model.number="birthdayYear">
												<option v-for="y in birthdayYearOptions" :key="y" :value="y">{{ y }}年</option>
											</select>
											<select class="birthday-select" v-model.number="birthdayMonth">
												<option v-for="m in birthdayMonthOptions" :key="m" :value="m">{{ m }}月</option>
											</select>
										</div>
										<div class="birthday-calendar">
											<span class="birthday-weekday" v-for="w in weekDayNames" :key="w">{{ w }}</span>
											<span class="birthday-blank" v-for="n in calendarLeadingBlanks" :key="'blank' + n"></span>
											<span
												class="birthday-day"
												v-for="d in calendarDays"
												:key="d"
												:class="{ 'is-selected': d === birthdayDay }"
												@click="selectBirthdayDay(d)"
												>{{ d }}</span
											>
										</div>
										<div class="birthday-picker-actions">
											<button type="button" class="btn-birthday-cancel" @click="closeBirthdayPicker">取消</button>
										</div>
									</div>
								</div>
								<input class="apply-input apply-input-email" type="email" v-model="form.email" placeholder="Email" />
								<p class="apply-hint">*建議不要使用公司或學校信箱，以免擋信。請再次確認Email是否正確，確保您可確實收到活動通知。</p>
							</div>
							<div>
								<p class="apply-hint-M">*建議不要使用公司或學校信箱，以免擋信。請再次確認Email是否正確，確保您可確實收到活動通知。</p>
							</div>
						</div>

						<div class="apply-col">
							<p class="apply-label identity">請問您目前身分</p>
							<div class="apply-card identity apply-card--select">
								<div class="apply-select-wrap" :class="{ 'is-open': identityDropdownOpen }">
									<button type="button" class="apply-input apply-select" @click="identityDropdownOpen = !identityDropdownOpen">
										<span :class="{ 'is-placeholder': !form.identity }">{{ form.identity || '請選擇相符選項' }}</span>
										<img class="apply-select-arrow" :src="config.images.home.iconChevronDown" alt="" />
									</button>
									<ul class="apply-select-options" v-show="identityDropdownOpen">
										<li
											v-for="option in identityOptions"
											:key="option.value"
											:class="{ 'is-selected': form.identity === option.value }"
											@click="selectIdentity(option)"
										>
											<span class="option-title">{{ option.value }}</span>
											<span class="option-desc" v-if="option.desc">{{ option.desc }}</span>
										</li>
									</ul>
								</div>
								<input v-if="form.identity === '其他'" class="apply-input" type="text" v-model="identityOther" placeholder="請輸入您的身分" />
							</div>

							<p class="apply-label school">目前就學學校（或畢業學校）</p>
							<div class="apply-card">
								<input class="apply-input" type="text" v-model="form.school" placeholder="請輸入學校全名例如：國立臺南大學" />
							</div>
						</div>
					</div>
					<div>
						<p class="apply-label">請問您是如何得知 NXT Fresh 人才培育計畫？（可複選）</p>
						<div class="apply-sources">
							<label class="apply-checkbox" v-for="source in sourceOptions" :key="source">
								<input type="checkbox" :value="source" v-model="form.sources" />
								<span>{{ source }}</span>
							</label>
						</div>
					</div>

					<label class="apply-consent">
						<input type="checkbox" v-model="form.agree" />
						<span
							>送出申請即代表您同意主辦單位（財團法人溫世仁文教基金會）得於本計畫之執行、聯繫通訊等一切必要範圍內，蒐集、處理及利用本人所提供之個人資料。</span
						>
					</label>

					<p class="apply-terms">
						1. 計畫申請期間：即日起至2026/9/30(三)23:59 截止。2. 此申請表僅需花約1分鐘完成，主要確認申請者是否符合計畫申請資格。<br />
						3. 請務必留下完整且正確資料，以利本會進行審核，並請勿重複填寫申請表。4. 如有任何計畫或申請相關問題，歡迎Email至
						<a href="mailto:nxtfresh@saylingwen.org">nxtfresh@saylingwen.org</a> 詢問。
					</p>

					<button type="submit" class="btn-pill submit-btn" :disabled="holdBtn"><span>送出申請</span></button>
				</form>
			</section>

			<!-- 活動尚未開始 敬請期待 -->
			<section class="apply not-started text-center" id="apply" v-if="activityStatus === 'notStarted'">
				<div class="apply-content d-flex justify-content-center align-items-center">
					<div class="gap-4 d-flex justify-content-center align-items-center">
						<svg xmlns="http://www.w3.org/2000/svg" width="222" height="8" viewBox="0 0 222 8" fill="none">
							<path d="M218 8C220.209 8 222 6.20914 222 4C222 1.79086 220.209 0 218 0V4V8ZM0 4V8H218V4V0H0V4Z" fill="#F6AB00" />
						</svg>
						<h1 class="apply-title">敬請期待</h1>
						<svg xmlns="http://www.w3.org/2000/svg" width="222" height="8" viewBox="0 0 222 8" fill="none">
							<path d="M218 8C220.209 8 222 6.20914 222 4C222 1.79086 220.209 0 218 0V4V8ZM0 4V8H218V4V0H0V4Z" fill="#F6AB00" />
						</svg>
					</div>
					<h2>即將於2026/8/31(一)開放申請</h2>
					<p>如有任何計畫或申請相關問題，歡迎Email至<a href="mailto:nxtfresh@saylingwen.org">nxtfresh@saylingwen.org</a>詢問。</p>
				</div>
				<button class="btn-pill" @click="handleGoogleCalendar('fallSeason')" :disabled="holdBtn">開啟申請提醒</button>
			</section>
			<!-- 空窗期 秋季跟春季中間 -->
			<section class="apply break-eriod text-center" id="apply" v-if="activityStatus === 'breakPeriod'">
				<div class="apply-content d-flex justify-content-center align-items-center">
					<div class="gap-4 d-flex justify-content-center align-items-center">
						<svg xmlns="http://www.w3.org/2000/svg" width="222" height="8" viewBox="0 0 222 8" fill="none">
							<path d="M218 8C220.209 8 222 6.20914 222 4C222 1.79086 220.209 0 218 0V4V8ZM0 4V8H218V4V0H0V4Z" fill="#F6AB00" />
						</svg>
						<h1 class="apply-title">申請已截止</h1>
						<svg xmlns="http://www.w3.org/2000/svg" width="222" height="8" viewBox="0 0 222 8" fill="none">
							<path d="M218 8C220.209 8 222 6.20914 222 4C222 1.79086 220.209 0 218 0V4V8ZM0 4V8H218V4V0H0V4Z" fill="#F6AB00" />
						</svg>
					</div>
					<h2>將於2026/12/21(一)開放申請春季班</h2>
					<p>如有任何計畫或申請相關問題，歡迎Email至 <a href="mailto:nxtfresh@saylingwen.org">nxtfresh@saylingwen.org</a> 詢問。</p>
				</div>
				<button class="btn-pill" @click="handleGoogleCalendar('springSeason')" :disabled="holdBtn">開啟申請提醒</button>
			</section>
			<p class="copyright text-center">COPYRIGHT © 財團法人溫世仁文教基金會</p>
			<div class="footer"></div>
		</div>

		<!-- 共用提示 Modal -->
		<div
			class="modal fade"
			id="alertModal"
			tabindex="-1"
			aria-labelledby="alertModalLabel"
			aria-hidden="true"
			data-bs-backdrop="static"
			data-bs-keyboard="false"
		>
			<div class="modal-dialog m-auto">
				<div class="modal-content">
					<div class="modal-body text-center">
						<div v-if="alertModalType == 'eventEnded'">
							<p v-html="alertMessage"></p>
						</div>
						<!-- 預設彈窗（沒有指定 type 時顯示） -->
						<div v-else>
							<p v-html="alertMessage"></p>
							<button type="button" class="btn btn-primary" data-bs-dismiss="modal">確定</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick, handleError } from 'vue'
import { Modal } from 'bootstrap'
import axios from 'axios'
import config from './config.js'

// ===== UI 狀態 =====
const currentPage = ref('home')
const activityStatus = ref(null)

// ===== 共用彈窗（Alert）狀態 =====
const alertModalType = ref('')
const alertMessage = ref('')
const alertQueue = []

// loading
const loading = ref({
	state: true,
	title: '載入中，請稍候...'
})

// 防連點
const holdBtn = ref(false)

const showToQuiz = ref(false)

const heroVideoPc = ref(null)
const heroVideoMobile = ref(null)

const processAlertQueue = () => {
	if (!alertQueue.length) return

	const { message, type, callback, delay } = alertQueue[0]
	const modalEl = document.getElementById('alertModal')
	const modal = Modal.getOrCreateInstance(modalEl)

	alertModalType.value = type || ''
	alertMessage.value = message

	// 關閉後才 shift，再接力處理下一筆
	modalEl.addEventListener(
		'hidden.bs.modal',
		() => {
			alertQueue.shift()
			callback?.()
			processAlertQueue()
		},
		{ once: true }
	)

	setTimeout(() => modal.show(), 0)

	if (delay) setTimeout(() => modal.hide(), delay)
}

const showAlert = (message, type, callback, delay) => {
	alertQueue.push({ message, type, callback, delay })
	if (alertQueue.length === 1) processAlertQueue()
}

const closeAlert = () => {
	Modal.getOrCreateInstance(document.getElementById('alertModal')).hide()
}

const handleGoogleCalendar = (season) => {
	if (holdBtn.value) return
	holdBtn.value = true

	const title = encodeURIComponent('NXT Fresh人才培育計畫開放申請')
	const startDate = ref('')
	const endDate = ref('')
	const details = ref('')
	if (season === 'fallSeason') {
		startDate.value = '20260831'
		endDate.value = '20260901'
		details.value = encodeURIComponent(
			'2026年NXT Fresh人才培育計畫已開放申請，立即點擊下方連結，踏出第一步，讓你職涯不繞路！\n免費申請 https://bigcc.cc/YGpa63'
		)
	} else {
		startDate.value = '20261221'
		endDate.value = '20261222'
		details.value = encodeURIComponent(
			'2026年NXT Fresh人才培育計畫已開放申請，立即點擊下方連結，踏出第一步，讓你職涯不繞路！\n免費申請 https://bigcc.cc/BWiox8'
		)
	}
	try {
		const width = 800
		const height = 700
		const left = (screen.width - width) / 2
		const top = (screen.height - height) / 2

		window.open(
			`https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate.value}/${endDate.value}&details=${details.value}`,
			'google-calendar',
			`width=${width},height=${height},top=${top},left=${left},resizable=no,scrollbars=no,status=no`
		)
	} catch (error) {
	} finally {
		holdBtn.value = false
	}
}

// ===== 生命週期 =====
onMounted(() => {
	// 確認時間報哪一個班
	const eventTimeStatus = checkTime()
	if (eventTimeStatus.state === false && activityStatus.value == 'ended') {
		showAlert(eventTimeStatus.text, 'eventEnded')
	}

	const isMobileViewport = window.matchMedia('(max-width: 767px)').matches
	const heroVideoEl = isMobileViewport ? heroVideoMobile.value : heroVideoPc.value
	const finishLoading = () => {
		loading.value.state = false
	}
	if (heroVideoEl && heroVideoEl.readyState < 3) {
		heroVideoEl.addEventListener('loadeddata', finishLoading, { once: true })
		heroVideoEl.addEventListener('error', finishLoading, { once: true })
		setTimeout(finishLoading, 5000)
	} else {
		finishLoading()
	}

	if (window.location.hash === '#apply') {
		scrollToApply(false)
		history.replaceState(null, '', window.location.pathname + window.location.search)
	}

	const introEl = document.querySelector('.page.home .intro')
	if (introEl) {
		const introObserver = new IntersectionObserver(
			(entries, observer) => {
				if (entries[0].isIntersecting) {
					showToQuiz.value = true
					observer.disconnect()
				}
			},
			{ threshold: 0, rootMargin: '0px 0px -10% 0px' }
		)
		introObserver.observe(introEl)
	}


	const toQuizEl = document.querySelector('.to-quiz')
	if (toQuizEl) {
		const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
		const CLICK_THRESHOLD = 10
		let dragging = false
		let offsetX = 0
		let offsetY = 0
		let startX = 0
		let startY = 0

		const onPointerDown = (e) => {
			dragging = true
			startX = e.clientX
			startY = e.clientY
			const rect = toQuizEl.getBoundingClientRect()
			offsetX = e.clientX - rect.left
			offsetY = e.clientY - rect.top
			toQuizEl.style.left = rect.left + 'px'
			toQuizEl.style.top = rect.top + 'px'
			toQuizEl.style.right = 'auto'
			toQuizEl.style.transform = 'none'
			toQuizEl.classList.add('is-dragging')
			toQuizEl.setPointerCapture(e.pointerId)
		}

		const onPointerMove = (e) => {
			if (!dragging) return
			const rect = toQuizEl.getBoundingClientRect()
			toQuizEl.style.left = clamp(e.clientX - offsetX, 0, window.innerWidth - rect.width) + 'px'
			toQuizEl.style.top = clamp(e.clientY - offsetY, 0, window.innerHeight - rect.height) + 'px'
		}

		const onPointerUp = (e) => {
			dragging = false
			toQuizEl.classList.remove('is-dragging')
			toQuizEl.releasePointerCapture(e.pointerId)

			const distance = Math.hypot(e.clientX - startX, e.clientY - startY)
			if (distance < CLICK_THRESHOLD) {
				toQuizEl.classList.add('is-clicked')
				setTimeout(() => {
					toQuizEl.classList.remove('is-clicked')
				}, 150)
				setTimeout(() => {
					window.location.href = './quiz.html?openExternalBrowser=1'
				}, 500)
			}
		}

		toQuizEl.addEventListener('pointerdown', onPointerDown)
		toQuizEl.addEventListener('pointermove', onPointerMove)
		toQuizEl.addEventListener('pointerup', onPointerUp)
		toQuizEl.addEventListener('pointercancel', onPointerUp)
	}
})

// 確認活動時間（選用，依專案需求開啟）
const checkTime = () => {
	const nowTime = new Date()
	// 	開放申請時間
	// 秋季班申請階段2026/8/31-2026/9/30
	// 春季班申請階段2026/12/21-2027/1/20
	const autumnStartTime = new Date('2026/08/31 00:00:00') // 秋季班
	const autumnEndTime = new Date('2026/09/30 23:59:59') // 秋季班
	const springStartTime = new Date('2026/12/21 00:00:00') // 春季班
	const springEndTime = new Date('2027/01/20 23:59:59') // 春季班

	if (nowTime < autumnStartTime) {
		activityStatus.value = 'notStarted'
		return { state: false, text: '活動尚未開始' }
	} else {
		if (nowTime > autumnEndTime && nowTime < springStartTime) {
			activityStatus.value = 'breakPeriod'
			return { state: true, text: '空窗期' }
		} else if (nowTime > autumnStartTime && nowTime < autumnEndTime) {
			activityStatus.value = 'fallSeason'
			return { state: true, text: '秋季班' }
		} else if (nowTime > springStartTime && nowTime < springEndTime) {
			activityStatus.value = 'springSeason'
			return { state: true, text: '春季班' }
		} else {
			activityStatus.value = 'ended'
			return { state: false, text: '活動已結束' }
		}
	}
}

// ===== 首頁「立即申請」表單 =====
const form = ref({
	name: '',
	birthday: '',
	email: '',
	identity: '',
	school: '',
	sources: [],
	agree: false
})

// ===== 生日選擇器：年/月下拉選單 + 日期格子 =====
const birthdayPickerOpen = ref(false)
const birthdayYear = ref(null)
const birthdayMonth = ref(null)
const birthdayDay = ref(null)

const nowYear = new Date().getFullYear()
const birthdayYearOptions = []
for (let y = nowYear - 100; y <= nowYear; y++) birthdayYearOptions.push(y)
const birthdayMonthOptions = Array.from({ length: 12 }, (_, i) => i + 1)

const weekDayNames = ['日', '一', '二', '三', '四', '五', '六']

const daysInMonth = (year, month) => new Date(year, month, 0).getDate()

// 該月 1 號是星期幾，用來在格子前面補空白，讓日期對齊正確的星期欄位
const calendarLeadingBlanks = computed(() => {
	if (!birthdayYear.value || !birthdayMonth.value) return 0
	return new Date(birthdayYear.value, birthdayMonth.value - 1, 1).getDay()
})

const calendarDays = computed(() => {
	const max = daysInMonth(birthdayYear.value || nowYear, birthdayMonth.value || 1)
	return Array.from({ length: max }, (_, i) => i + 1)
})

const pad2 = (n) => String(n).padStart(2, '0')

const openBirthdayPicker = () => {
	let y = nowYear - 20
	let m = 1
	let d = 1
	if (form.value.birthday) {
		const parts = form.value.birthday.split('/').map(Number)
		;[y, m, d] = parts
	}
	birthdayYear.value = y
	birthdayMonth.value = m
	birthdayDay.value = d
	birthdayPickerOpen.value = true
}

const closeBirthdayPicker = () => {
	birthdayPickerOpen.value = false
}

// 點選日期格子後直接寫回並關閉選擇器
const selectBirthdayDay = (day) => {
	birthdayDay.value = day
	form.value.birthday = `${birthdayYear.value}/${pad2(birthdayMonth.value)}/${pad2(day)}`
	birthdayPickerOpen.value = false
}

// 年/月變動時，若原本選的日超過當月天數（例如 2 月沒有 30 日），自動修正
watch([birthdayYear, birthdayMonth], () => {
	const max = daysInMonth(birthdayYear.value, birthdayMonth.value)
	if (birthdayDay.value > max) birthdayDay.value = max
})

// 身分選單選「其他」時，另外填寫的說明文字，送出時會取代 identity 的值
const identityOther = ref('')

// 自訂身分下拉選單開合狀態
const identityDropdownOpen = ref(false)

const identityOptions = [
	{ value: '大學在學學生', desc: '大三(含)以上及碩博士生者' },
	{ value: '社會新鮮人', desc: '已畢業，0-2年內工作經驗者' },
	{ value: '職場工作者', desc: '已畢業，2年以上工作經驗者' },
	{ value: '其他', desc: '' }
]

const sourceOptions = ['網路廣告', '基金會社群', '廣播', '新聞', '師長親友', '學校公告']

const selectIdentity = (option) => {
	form.value.identity = option.value
	identityDropdownOpen.value = false
}

const handleOutsideClick = (event) => {
	if (!event.target.closest('.apply-select-wrap')) {
		identityDropdownOpen.value = false
	}
	if (!event.target.closest('.apply-birthday-wrap')) {
		birthdayPickerOpen.value = false
	}
}

onMounted(() => document.addEventListener('click', handleOutsideClick))
onUnmounted(() => document.removeEventListener('click', handleOutsideClick))

const validateApply = () => {
	if (!form.value.name) return '請填寫姓名'
	if (!form.value.birthday) return '請填寫生日'
	if (!form.value.email) return '請填寫 Email'
	if (!form.value.identity) return '請選擇目前身分'
	if (!form.value.sources.length) return '請選擇您是如何得知 NXT Fresh人才培育計畫？'
	if (form.value.identity === '其他' && !identityOther.value.trim()) return '請填寫您的身分說明'
	if (!form.value.school) return '請填寫<br>目前就學（或畢業）學校'
	if (!form.value.agree) return '請勾選同意蒐集個人資料'
	return ''
}

const resetForm = () => {
	form.value = {
		name: '',
		birthday: '',
		email: '',
		identity: '',
		school: '',
		sources: [],
		agree: false
	}
	identityOther.value = ''
}

const submitApply = async () => {
	if (holdBtn.value) return

	const errorMessage = validateApply()
	if (errorMessage) {
		showAlert(errorMessage)
		return
	}

	holdBtn.value = true
	// 資料送出成功 送line tag（送不出去也不影響後續申請流程）
	try {
		window._lt('send', 'cv', { type: 'InitiateCheckOut' }, ['252c7ad0-6688-49a3-a2b0-6d43fa245ba4'])
	} catch (error) {
		console.error('LINE Tag 送出失敗:', error)
	}
	try {
		const fromData = { ...form.value }
		if (fromData.identity === '其他' && identityOther.value.trim()) {
			fromData.identity = identityOther.value.trim()
		} else {
			const matched = identityOptions.find((option) => option.value === fromData.identity)
			if (matched && matched.desc) {
				fromData.identity = `${matched.value}-${matched.desc}`
			}
		}
		// sources 為多選陣列，送出時轉成逗號分隔的純文字，例如「網路廣告,學校公告」
		fromData.sources = form.value.sources.join(',')
		console.log('表單資料：', fromData)

		const payload = {
			name: fromData.name,
			birthday: fromData.birthday,
			job: fromData.identity,
			school: fromData.school,
			email: fromData.email,
			how: fromData.sources
		}

		const res = await axios.post(config.api.applyForm, payload)

		if (res.data.status == '200') {
			showAlert('申請成功<br>感謝您的申請，並請留意信件！', '', () => {
				try {
					window._lt(
						'send',
						'cv',
						{
							type: 'Purchase',
							value: 1,
							currency: 'TWD'
						},
						['252c7ad0-6688-49a3-a2b0-6d43fa245ba4']
					)
				} catch (error) {
					console.error('LINE Tag 送出失敗:', error)
				}
				try {
					window.freecoins_cvq = [
						{
							app: 'FREECOINS_51392',
							domain: '.horyuken.com',
							cv: [
								{
									action: 'REGISTRATION',
									order: `${payload.email}_${Date.now()}`
								}
							]
						}
					]
					const freecoinsScript = document.createElement('script')
					freecoinsScript.src = 'https://point-ads.line-apps.com/lfc5.js'
					freecoinsScript.async = true
					document.head.appendChild(freecoinsScript)
				} catch (error) {
					console.error('LINE Point Ads CV Tag 送出失敗:', error)
				}
				// 清除表單
				resetForm()
			})
		} else {
			showAlert(res.data.message || '送出失敗，請稍後再試', '', () => {
				// 清除表單
				resetForm()
			})
		}
	} catch (error) {
		console.error('送出申請失敗:', error)
		showAlert('送出失敗，請稍後再試', '', () => {
			// 清除表單
			resetForm()
		})
	} finally {
		holdBtn.value = false
	}
}

// ===== 通用方法 =====
const goHome = () => {
	currentPage.value = 'home'
}

const scrollToApply = (smooth = true) => {
	nextTick(() => {
		const applyEl = document.getElementById('apply')
		const scrollEl = document.querySelector('.wrapper')
		if (!applyEl || !scrollEl) return

		// 手機版額外多捲一段距離，讓畫面停在標題往下一點的位置
		const isMobile = window.matchMedia('(max-width: 767px)').matches
		const extraOffset = isMobile ? 60 : 0
		const top = applyEl.getBoundingClientRect().top - scrollEl.getBoundingClientRect().top + scrollEl.scrollTop + extraOffset
		scrollEl.scrollTo({ top, behavior: smooth ? 'smooth' : 'auto' })
	})
}
</script>
