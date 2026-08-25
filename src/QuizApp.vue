<template>
	<!-- loading -->
	<div v-if="loading.state" class="loading-view">
		<div class="loading-container">
			<div class="spinner"></div>
			<h2>{{ loading.title }}</h2>
		</div>
	</div>

	<div class="wrapper quiz-wrapper">
		<div class="page page-grid quiz">
			<div class="quiz-bg"></div>

			<!-- navbar start -->
			<header class="quiz-nav navbar navbar-grid m-0">
				<div class="container-fluid d-flex align-items-center justify-content-between">
					<a class="navbar-brand" @click="goHome">
						<img :src="config.images.logo" alt="logo" />
					</a>
					<a class="btn-apply-nav" href="./index.html?openExternalBrowser=1#apply">立即申請</a>
				</div>
			</header>
			<!-- navbar end -->
			<div class="quiz-body quiz-intro">
				<div class="black" :class="{ 'is-hidden': !introHintVisible }" v-show="phase === 'intro' && !introVideoEnded"></div>
				<div class="quiz-body-bg">
					<div class="quiz-bg-video-frame" ref="videoFrameEl">
						<img
							v-if="phase !== 'result' && bgImageSrc"
							class="quiz-bg-video-media"
							:style="videoFrameSizeStyle"
							:src="bgImageSrc"
							alt=""
						/>
						<video
							ref="videoElA"
							class="quiz-bg-video-media video-slot"
							:class="{ 'is-visible': showBufferedVideo && activeIsA }"
							:style="videoFrameSizeStyle"
							:muted="activeIsA ? videoMuted : true"
							playsinline
							@ended="handleBufferedVideoEnded"
						></video>
						<video
							ref="videoElB"
							class="quiz-bg-video-media video-slot"
							:class="{ 'is-visible': showBufferedVideo && !activeIsA }"
							:style="videoFrameSizeStyle"
							:muted="!activeIsA ? videoMuted : true"
							playsinline
							@ended="handleBufferedVideoEnded"
						></video>
						<video
							ref="leadInVideoEl"
							class="quiz-bg-video-media video-slot"
							:class="{ 'is-visible': showIntroVideo }"
							:style="videoFrameSizeStyle"
							:src="resolvedLeadInVideo"
							:muted="videoMuted"
							preload="auto"
							playsinline
							@ended="handleIntroVideoEnded"
						></video>
					</div>
					<div class="light" v-if="phase !== 'result'">
						<img :src="config.images.quiz.light" alt="" />
					</div>

					<div class="btn-group">
						<button type="button" class="voice-btn" v-show="phase !== 'result' && phase !== 'loading'" @click="toggleVideoMute">
							VOICE
							<span v-if="!videoMuted">
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
									<path
										d="M16 9.00003C16.6491 9.86551 17 10.9182 17 12C17 13.0819 16.6491 14.1345 16 15M19.364 18.364C20.1997 17.5283 20.8627 16.5361 21.315 15.4442C21.7673 14.3523 22.0001 13.1819 22.0001 12C22.0001 10.8181 21.7673 9.64779 21.315 8.55585C20.8627 7.46391 20.1997 6.47176 19.364 5.63603M11 4.70203C10.9998 4.56274 10.9583 4.42663 10.8809 4.31088C10.8034 4.19514 10.6934 4.10493 10.5647 4.05166C10.436 3.99838 10.2944 3.98442 10.1577 4.01154C10.0211 4.03866 9.89559 4.10564 9.797 4.20403L6.413 7.58703C6.2824 7.7184 6.12703 7.82256 5.95589 7.89345C5.78475 7.96435 5.60124 8.00057 5.416 8.00003H3C2.73478 8.00003 2.48043 8.10539 2.29289 8.29292C2.10536 8.48046 2 8.73481 2 9.00003V15C2 15.2652 2.10536 15.5196 2.29289 15.7071C2.48043 15.8947 2.73478 16 3 16H5.416C5.60124 15.9995 5.78475 16.0357 5.95589 16.1066C6.12703 16.1775 6.2824 16.2817 6.413 16.413L9.796 19.797C9.8946 19.8958 10.0203 19.9631 10.1572 19.9904C10.2941 20.0177 10.436 20.0037 10.5649 19.9503C10.6939 19.8968 10.804 19.8063 10.8815 19.6902C10.959 19.5741 11.0002 19.4376 11 19.298V4.70203Z"
										stroke="white"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</span>
							<span v-else>
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
									<path
										d="M16 9C16.5044 9.67234 16.8311 10.461 16.95 11.293M19.364 5.636C20.643 6.91426 21.5073 8.54815 21.8442 10.3247C22.1812 12.1013 21.9751 13.9382 21.253 15.596M2 2L22 22M7 7L6.413 7.587C6.2824 7.71838 6.12703 7.82253 5.95589 7.89342C5.78475 7.96432 5.60124 8.00054 5.416 8H3C2.73478 8 2.48043 8.10536 2.29289 8.29289C2.10536 8.48043 2 8.73478 2 9V15C2 15.2652 2.10536 15.5196 2.29289 15.7071C2.48043 15.8946 2.73478 16 3 16H5.416C5.60124 15.9995 5.78475 16.0357 5.95589 16.1066C6.12703 16.1775 6.2824 16.2816 6.413 16.413L9.796 19.797C9.8946 19.8958 10.0203 19.9631 10.1572 19.9904C10.2941 20.0177 10.436 20.0037 10.5649 19.9503C10.6939 19.8968 10.804 19.8063 10.8815 19.6902C10.959 19.5741 11.0002 19.4376 11 19.298V11M9.828 4.172C9.92389 4.07575 10.0462 4.01013 10.1794 3.98348C10.3126 3.95683 10.4508 3.97033 10.5763 4.02228C10.7018 4.07423 10.8091 4.16229 10.8846 4.27529C10.96 4.38829 11.0002 4.52114 11 4.657V5.343"
										stroke="white"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</span>
						</button>
						<div class="hint" :class="{ 'is-hidden': !introHintVisible }">
							<svg xmlns="http://www.w3.org/2000/svg" width="63" height="37" viewBox="0 0 63 37" fill="none">
								<path d="M24.5 7.31676L3.45745 1.88818L1.5 20.8882" stroke="#FDB120" stroke-width="3" stroke-linecap="round" />
								<path d="M4.5 2.88818C12 13.3882 33.8 34.4882 61 34.8882" stroke="#FDB120" stroke-width="3" stroke-linecap="round" stroke-dasharray="6 6" />
							</svg>
							<p>音量開啟</p>
						</div>
						<button type="button" class="skip-btn" v-show="showVideo && phase !== 'loading'" @click="skipVideo">
							SKIP
							<span class=""
								><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
									<path
										d="M15.75 3.00001V15M4.52175 3.21376C4.29413 3.07719 4.03435 3.00347 3.76892 3.00012C3.5035 2.99677 3.24194 3.06392 3.01095 3.1947C2.77996 3.32549 2.58781 3.51523 2.45412 3.74455C2.32044 3.97388 2.25 4.23457 2.25 4.50001V13.5C2.25 13.7655 2.32044 14.0262 2.45412 14.2555C2.58781 14.4848 2.77996 14.6745 3.01095 14.8053C3.24194 14.9361 3.5035 15.0033 3.76892 14.9999C4.03435 14.9966 4.29413 14.9228 4.52175 14.7863L12.0195 10.2878C12.2421 10.1548 12.4264 9.96637 12.5544 9.74092C12.6825 9.51547 12.7499 9.26068 12.7502 9.0014C12.7504 8.74212 12.6834 8.48721 12.5557 8.26154C12.4281 8.03587 12.2441 7.84714 12.0217 7.71376L4.52175 3.21376Z"
										stroke="white"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</span>
						</button>
						<button type="button" class="skip-btn" v-show="phase === 'result'" @click="restartQuiz">
							AGAIN
							<span
								><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
									<path
										d="M1 7.75C1 9.08502 1.39588 10.3901 2.13758 11.5001C2.87928 12.6101 3.93349 13.4753 5.16689 13.9862C6.40029 14.4971 7.75749 14.6308 9.06686 14.3703C10.3762 14.1099 11.579 13.467 12.523 12.523C13.467 11.579 14.1099 10.3762 14.3703 9.06686C14.6308 7.75749 14.4971 6.40029 13.9862 5.16689C13.4753 3.93349 12.6101 2.87928 11.5001 2.13758C10.3901 1.39588 9.08502 1 7.75 1C5.86296 1.0071 4.05173 1.74342 2.695 3.055L1 4.75M4.75 4.75H1V1"
										stroke="white"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</span>
						</button>
					</div>
					<div class="quiz-intro-info" v-show="phase === 'intro' && introVideoEnded && assetsReady">
						<div class="quiz-title"></div>
						<div class="quiz-quote">
							<p>你將穿越到未來進職場的一天...<br />完成情境問答領取指南</p>
						</div>
						<button type="button" class="quiz-cta" @click="startQuiz">
							點擊進入
							<span class="quiz-cta-arrow"></span>
						</button>
					</div>
					<div class="quiz-intro-preparing" v-show="phase === 'intro' && introVideoEnded && !assetsReady">
						<div class="spinner"></div>
						<p>準備中...</p>
					</div>
					<div class="quiz-body quiz-question-layout" v-show="phase === 'video' || phase === 'question'">
						<div class="quiz-top">
							<div class="question-num">
								情境<span>{{ currentQuestion.questionNum }}</span>
							</div>
							<div class="scenario">{{ currentQuestion.scenario }}</div>
						</div>
						<div class="quiz-question" v-show="phase === 'question'">
							<div class="quiz-question-quote" v-html="currentQuestion.title"></div>
							<div class="quiz-options">
								<button
									v-for="option in currentQuestion.options"
									:key="option.value"
									type="button"
									class="quiz-option"
									:class="{ 'is-selected': selectedValue === option.value }"
									:disabled="!!selectedValue"
									@click="selectOption(option.value)"
								>
									<b>{{ option.value }}</b
									>：{{ option.text }}
								</button>
							</div>
						</div>
					</div>
					<!-- 結果頁 -->
					<div class="quiz-body quiz-result animate__animated animate__fadeIn" v-show="phase === 'result'">
						<div class="quiz-result-scroll">
							<div class="quiz-result-cantent">
								<img :src="currentResult.img" alt="結果圖" />

								<div class="quiz-result-actions">
									<button class="download-btn" @click="downloadImg(currentResult.img)">下載圖片</button>
									<p>長按上方圖片可儲存結果，分享給朋友一起來看報告結果</p>
									<a class="quiz-pill" id="quiz-apply" href="./index.html?openExternalBrowser=1#apply">立即申請<span class="quiz-cta-arrow"></span></a>
									<button type="button" class="quiz-pill" @click="shareResult">分享活動<span class="quiz-cta-arrow"></span></button>
								</div>
							</div>
						</div>
					</div>

					<!-- 分享彈窗 -->
					<div class="quiz-share-modal-backdrop" v-if="shareModalVisible" @click.self="shareModalVisible = false">
						<div class="quiz-share-modal">
							<button type="button" class="quiz-share-modal-close" @click="shareModalVisible = false">
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
									<path d="M8 1L1 8L8 15M1 8H15" stroke="#FFB428" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
								</svg>
							</button>
							<div class="quiz-share-modal-line">
								<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="1" viewBox="0 0 346 1" fill="none">
									<path d="M0 0.5H346" stroke="#FFB428" />
								</svg>
							</div>
							<div class="quiz-share-icons">
								<button type="button" class="quiz-share-icon" @click="openShareLink('facebook')">
									<img :src="config.images.quiz.facebook" alt="Facebook" />Facebook
								</button>
								<button type="button" class="quiz-share-icon" @click="openShareLink('instagram')"><img :src="config.images.quiz.instagram" alt="Instagram" />Instagram</button>
								<button type="button" class="quiz-share-icon" @click="openShareLink('line')"><img :src="config.images.quiz.line" alt="LINE" />Line</button>
								<button type="button" class="quiz-share-icon" @click="openShareLink('threads')">
									<img :src="config.images.quiz.threads" alt="Threads" />Threads
								</button>
								<button type="button" class="quiz-share-icon" @click="copyShareLink"><img :src="config.images.quiz.link" alt="連結" />複製連結</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import config from './config.js'

const SELECT_DELAY = 600 
const SUBMIT_LOADING_DURATION = 1000 
const INTRO_HINT_DURATION = 2000

const questions = config.quiz.questions
const results = config.quiz.results


const supportsWebm = document.createElement('video').canPlayType('video/webm; codecs="vp9,opus"') !== ''
const resolveVideoSrc = (src) => (supportsWebm || !src.endsWith('.webm') ? src : src.slice(0, -'.webm'.length) + '.mp4')
const resolvedLeadInVideo = resolveVideoSrc(config.quiz.leadInVideo)


const loading = ref({
	state: true,
	title: '載入中，請稍候...'
})

// ===== 測驗狀態 =====
// phase: 'intro' | 'video' | 'loading' | 'question' | 'result'
const phase = ref('intro')
const currentQuestionIndex = ref(0)
const answers = ref([])
const resultType = ref('')

const totalQuestions = questions.length
const currentQuestion = computed(() => questions[currentQuestionIndex.value])
const currentResult = computed(() => results[resultType.value] || {})
const selectedValue = ref('') 

const introHintVisible = ref(true)

const videoMuted = ref(true)
const toggleVideoMute = () => {
	videoMuted.value = !videoMuted.value
}

const leadInVideoEl = ref(null)

const videoElA = ref(null)
const videoElB = ref(null)
const activeIsA = ref(true)

const videoFrameEl = ref(null)
const videoFrameSize = ref({ width: 0, height: 0 })
const videoFrameSizeStyle = computed(() =>
	videoFrameSize.value.width && videoFrameSize.value.height
		? { width: videoFrameSize.value.width + 'px', height: videoFrameSize.value.height + 'px' }
		: {}
)
let videoFrameResizeObserver = null

const introVideoEnded = ref(false)

const showIntroVideo = computed(() => phase.value === 'intro' && !introVideoEnded.value)

const showBufferedVideo = computed(() => phase.value === 'video' || phase.value === 'loading')

const showVideo = computed(() => showIntroVideo.value || showBufferedVideo.value)

const bgImageSrc = computed(() => {
	if (phase.value === 'question' || phase.value === 'loading') {
		return currentQuestion.value.bgImage
	}
	if (phase.value === 'intro' && introVideoEnded.value) {
		return config.images.quiz.introEndImage
	}
	return ''
})

const warmUpStandby = (src) => {
	const el = activeIsA.value ? videoElB.value : videoElA.value
	if (!el) return
	el.src = resolveVideoSrc(src)
	warmUpVideo(el)
}

const activateStandbyVideo = () => {
	activeIsA.value = !activeIsA.value
	const el = activeIsA.value ? videoElA.value : videoElB.value
	el?.play().catch(() => {})
}

const startQuiz = () => {
	const el = activeIsA.value ? videoElA.value : videoElB.value
	el?.play().catch(() => {})
	phase.value = 'video'
}

const restartQuiz = () => {
	currentQuestionIndex.value = 0
	answers.value = []
	resultType.value = ''
	selectedValue.value = ''
	activateStandbyVideo()
	phase.value = 'video'
}

const handleIntroVideoEnded = () => {
	leadInVideoEl.value?.pause()
	introVideoEnded.value = true
}

const handleBufferedVideoEnded = (event) => {
	const activeEl = activeIsA.value ? videoElA.value : videoElB.value
	if (event.target !== activeEl) return
	if (phase.value !== 'video') return

	phase.value = 'question'
}

const skipVideo = () => {
	if (phase.value === 'intro') {
		handleIntroVideoEnded()
		return
	}

	const activeEl = activeIsA.value ? videoElA.value : videoElB.value
	activeEl?.pause()
	phase.value = 'question'
}

const calcResult = () => {
	const counts = { A: 0, B: 0, C: 0 }
	answers.value.forEach((value) => counts[value]++)

	let best = answers.value[0]
	let bestCount = -1
	answers.value.forEach((value) => {
		if (counts[value] > bestCount) {
			best = value
			bestCount = counts[value]
		}
	})

	return best
}


const submitQuiz = async () => {
	resultType.value = calcResult()

	activateStandbyVideo() 
	phase.value = 'loading'

	const minDelay = new Promise((resolve) => setTimeout(resolve, SUBMIT_LOADING_DURATION))

	await minDelay
	phase.value = 'result'
}

const selectOption = (value) => {
	if (phase.value !== 'question' || selectedValue.value) return

	selectedValue.value = value
	answers.value[currentQuestionIndex.value] = value

	setTimeout(() => {
		selectedValue.value = ''

		if (currentQuestionIndex.value < totalQuestions - 1) {
			currentQuestionIndex.value++
			activateStandbyVideo() 
			phase.value = 'video'
		} else {
			submitQuiz()
		}
	}, SELECT_DELAY)
}

watch(phase, (newPhase) => {
	if (newPhase === 'question') {
		const isLastQuestion = currentQuestionIndex.value >= totalQuestions - 1
		const nextSrc = isLastQuestion ? config.images.quiz.loadingVideo : questions[currentQuestionIndex.value + 1].video
		warmUpStandby(nextSrc)
	} else if (newPhase === 'result') {
		warmUpStandby(questions[0].video)
	}
})

// 分享結果：不論行動裝置或桌機，都用自己做的分享彈窗（FB / LINE / Threads / 複製連結）
const shareModalVisible = ref(false)
const isMobileDevice = () => /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)

const shareLinkBuilders = {
	facebook: (url) => `https://www.facebook.com/sharer/sharer.php?u=${url}`,
	line: (url) => `https://social-plugins.line.me/lineit/share?url=${url}`,
	threads: (url) => `https://www.threads.com/intent/post?text=${url}`
}

const shareResult = () => {
	shareModalVisible.value = true
}

const getShareUrl = () => {
	const href = window.location.href
	if (href.indexOf('openExternalBrowser=1') !== -1) return href

	const hashIndex = href.indexOf('#')
	const base = hashIndex === -1 ? href : href.slice(0, hashIndex)
	const hash = hashIndex === -1 ? '' : href.slice(hashIndex)
	const separator = base.indexOf('?') > -1 ? '&' : '?'
	return `${base}${separator}openExternalBrowser=1${hash}`
}

const copyLinkToClipboard = async (message) => {
	try {
		await navigator.clipboard.writeText(getShareUrl())
		window.alert(message)
	} catch (error) {
		console.error('複製連結失敗:', error)
	}
	shareModalVisible.value = false
}

const openShareLink = (type) => {
	if (type === 'instagram') {
		copyLinkToClipboard('Instagram 不支援直接分享連結，連結已複製，貼到限時動態或貼文分享吧！').then(() => {
			if (isMobileDevice()) {
				window.location.href = 'instagram://app'
			}
		})
		return
	}

	if (type === 'facebook' && isMobileDevice() && navigator.share) {
		navigator.share({ title: document.title, url: getShareUrl() }).catch(() => {})
		shareModalVisible.value = false
		return
	}

	const link = shareLinkBuilders[type](encodeURIComponent(getShareUrl()))

	window.open(link, '_blank')
	shareModalVisible.value = false
}

const copyShareLink = () => copyLinkToClipboard('連結已複製，快分享給朋友吧！')

// ====== 下載圖片 ====
const isIOSDevice = () => /iPad|iPhone|iPod/i.test(navigator.userAgent)

const downloadImg = async (img) => {
	if (!img) return

	if (isIOSDevice() || !isMobileDevice()) {
		try {
			const response = await fetch(img)
			const blob = await response.blob()
			const blobUrl = URL.createObjectURL(blob)

			const link = document.createElement('a')
			link.href = blobUrl
			link.download = img.split('/').pop() || 'result.jpg'
			document.body.appendChild(link)
			link.click()
			link.remove()

			URL.revokeObjectURL(blobUrl)
		} catch (error) {
			console.error('下載圖片失敗:', error)
		}
		return
	}

	const imgUrl = new URL(img, window.location.href).href
	const newWindow = window.open('', '_blank')
	if (!newWindow) return

	newWindow.document.title = '下載圖片'
	newWindow.document.body.style.cssText = "margin:0;background:#000;color:#fff;font-family:'Noto Sans CJK TC',sans-serif;text-align:center;"

	const hint = newWindow.document.createElement('p')
	hint.style.cssText = 'padding:1rem;margin:0;ㄧ color: #f6ab00;'
	hint.textContent = '請長按圖片並選擇「儲存圖片」即可下載'

	const image = newWindow.document.createElement('img')
	image.src = imgUrl
	image.style.cssText = 'max-width:100%;display:block;margin:0 auto;'

	newWindow.document.body.appendChild(hint)
	newWindow.document.body.appendChild(image)
}

const goHome = () => {
	window.location.href = './index.html?openExternalBrowser=1'
}

const PRELOAD_TIMEOUT = 20000 

const preloadImage = (src) =>
	new Promise((resolve) => {
		const start = performance.now()
		const img = new Image()
		img.onload = () => {
			resolve({ src, ok: true })
		}
		img.onerror = () => {
			console.warn(`[預載][圖片][失敗] ${src}`)
			resolve({ src, ok: false })
		}
		img.src = src
	})

const preloadVideo = (src) => {
	const start = performance.now()
	return fetch(src)
		.then((res) => res.blob())
		.then((blob) => {
			const seconds = ((performance.now() - start) / 1000).toFixed(1)
			const mb = (blob.size / 1024 / 1024).toFixed(2)
			return { src, ok: true }
		})
		.catch((error) => {
			console.warn(`[預載][影片][失敗] ${src}`, error)
			return { src, ok: false }
		})
}

const withTimeout = (promise, ms) => Promise.race([promise, new Promise((resolve) => setTimeout(resolve, ms))])

const restAssetImages = [config.images.quiz.introEndImage, config.images.quiz.light, ...questions.map((q) => q.bgImage)]
const restAssetVideos = [config.images.quiz.loadingVideo, ...questions.slice(1).map((q) => q.video)].map(resolveVideoSrc)

const warmUpVideo = (el) => {
	if (!el) return Promise.resolve(true)

	const ready =
		el.readyState >= 2
			? Promise.resolve(true)
			: new Promise((resolve) => {
					const onReady = () => {
						el.removeEventListener('loadeddata', onReady)
						resolve(true)
					}
					el.addEventListener('loadeddata', onReady)
				})

	el.play()
		.then(() => {
			el.pause()
			el.currentTime = 0 
		})
		.catch(() => {

		})

	return ready
}


const preloadIntroVideo = () => withTimeout(warmUpVideo(leadInVideoEl.value), PRELOAD_TIMEOUT)

const criticalImages = ['/assets/images/home/home-bg.png', config.images.logo, config.images.quiz.light]
const preloadCriticalImages = () => withTimeout(Promise.all(criticalImages.map(preloadImage)), PRELOAD_TIMEOUT)

const assetsReady = ref(false)
const preloadRestAssets = () => {

	const preloadDone = Promise.all([...restAssetImages.map(preloadImage), ...restAssetVideos.map(preloadVideo)])
	withTimeout(preloadDone, PRELOAD_TIMEOUT).then((results) => {
		assetsReady.value = true

		if (!results) {
			console.warn(`[預載][背景][逾時] 超過 ${PRELOAD_TIMEOUT / 1000} 秒仍未全部完成，assetsReady 已強制設為 true，可能有影片還沒真的快取好`)
			return
		}

		const failed = results.filter((r) => !r.ok)
	
	})
}

onMounted(async () => {
	if (videoFrameEl.value) {
		videoFrameResizeObserver = new ResizeObserver(([entry]) => {
			const { width, height } = entry.contentRect
			videoFrameSize.value = { width, height }
		})
		videoFrameResizeObserver.observe(videoFrameEl.value)
	}

	if (videoElA.value) {
		videoElA.value.src = resolveVideoSrc(questions[0].video)
		warmUpVideo(videoElA.value)
	}

	const [introResult, imagesResult] = await Promise.all([preloadIntroVideo(), preloadCriticalImages()])
	loading.value.state = false
	preloadRestAssets()

	setTimeout(() => {
		introHintVisible.value = false
		playIntroVideoWithRetry()
	}, INTRO_HINT_DURATION)
})

onUnmounted(() => {
	videoFrameResizeObserver?.disconnect()
})


const playIntroVideoWithRetry = () => {
	const el = leadInVideoEl.value
	if (!el) return

	el.play().catch(() => {
		el.play().catch(() => {})
	})

	setTimeout(() => {
		if (phase.value === 'intro' && !introVideoEnded.value && el.paused) {
			el.play().catch(() => {})
		}
	}, 500)
}
</script>
