<template>
	<!-- navbar start -->
	<header ref="headerEl" class="site-header" :class="{ 'is-compact': headerCompact, 'is-hidden': headerHidden }" @focusin="headerHidden = false">
		<a class="brand" href="./" aria-label="溫世仁文教基金會｜NXT Fresh 首頁">
			<img :src="img.brand" alt="溫世仁文教基金會｜NXT Fresh" width="353" height="46" />
		</a>
		<a v-if="activityStatus === 'ended'" class="cta sheen-host" :href="learnMoreUrl" target="_blank" rel="noopener">{{ ctaText }}</a>
		<a v-else class="cta sheen-host" href="#apply" @click.prevent="scrollToApply()">{{ ctaText }}</a>
	</header>
	<!-- navbar end -->

	<main>
		<!-- 主視覺區：每層 layer（滑鼠視差）> drift（捲動視差）> float（漂浮）> pop（進場） -->
		<section ref="kvEl" class="kv" :class="`is-${activityStatus}`" aria-label="職場生存模擬考 2026 NXT Fresh 人才培育計畫">
			<canvas v-show="!kvCanvasFailed" ref="kvCanvas" class="kv-canvas" aria-hidden="true"></canvas>
			<div class="stage">
				<div class="layer l-person" data-depth="0.3">
					<div class="drift">
						<div class="float" data-amp="8">
							<div class="pop">
								<picture>
									<source media="(max-width: 1023px)" :srcset="img.kvPersonMobile" />
									<img :src="img.kvPerson" alt="" width="1600" height="2505" fetchpriority="high" />
								</picture>
							</div>
						</div>
					</div>
				</div>

				<div class="layer l-title" data-depth="0.18">
					<div class="drift">
						<div class="float" data-amp="6">
							<div class="pop">
								<h1 class="kv-title">
									<span class="title-face" role="img" aria-label="職場生存模擬考" :style="titleMask"></span>
								</h1>
								<p class="kv-sub">2026 NXT Fresh 人才培育計畫</p>
							</div>
						</div>
					</div>
				</div>

				<div class="layer l-cta" data-depth="0.14">
					<div class="drift">
						<div class="float" data-amp="5">
							<div class="pop">
								<a
									class="kv-cta"
									:href="activityStatus === 'ended' ? learnMoreUrl : '#apply'"
									:target="activityStatus === 'ended' ? '_blank' : null"
									:rel="activityStatus === 'ended' ? 'noopener' : null"
									@click="onKvCta"
								>
									<img class="cta-bar" :src="img.ctaBar" alt="" draggable="false" />
									<span class="cta-label">{{ ctaText }}</span>
									<img class="cta-arrow" :src="img.ctaArrow" alt="" draggable="false" />
									<img class="cta-hand" :src="img.ctaHand" alt="" draggable="false" />
								</a>
							</div>
						</div>
					</div>
				</div>

				<!-- 問句泡泡：文字以 matrix3d 貼合泡泡的透視面 -->
				<div v-for="b in bubbles" :key="b.id" class="layer is-bubble" :class="`l-${b.id}`" :data-depth="b.depth">
					<div class="drift">
						<div class="float" data-amp="12">
							<div class="pop">
								<div :ref="(el) => (bubbleRoots[b.id] = el)" class="bubble" :style="bubbleRootStyle(b.id)">
									<img class="body" :src="img.bubbles[b.id].body" alt="" draggable="false" />
									<p class="sr-only">{{ b.plain }}</p>
									<div class="plane" :style="bubblePlaneStyle(b.id)" aria-hidden="true">
										<div :ref="(el) => (bubbleCopies[b.id] = el)" class="copy" :style="bubbleCopyStyle(b.id)">
											<p v-for="layer in ['depth', 'face']" :key="layer" class="text" :class="layer">
												<span v-for="(line, li) in b.lines" :key="li" class="line">
													<span
														v-for="(seg, si) in line"
														:key="si"
														:class="seg.hl ? 'hl' : 'nm'"
														:style="seg.hl ? { fontSize: `${bubbleHlScale(b.id, seg.i)}em` } : null"
														>{{ seg.t }}</span
													>
												</span>
											</p>
											<p class="label" :style="bubbleLabelStyle(b.id)">
												<img :src="img.bubbles[b.id].label" alt="" draggable="false" />{{ b.label }}
											</p>
										</div>
									</div>
									<img
										v-if="BUBBLE_LAYOUTS[b.id].icon"
										class="icon"
										:src="img.bubbles[b.id].icon"
										:style="bubbleIconStyle(b.id)"
										alt=""
										draggable="false"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div v-if="activityStatus !== 'ended'" class="layer l-badge" data-depth="0.42">
					<div class="drift">
						<div class="float" data-amp="7">
							<div class="pop">
								<p class="badge">
									<span class="badge-top">好評加開 名額有限</span>
									<span class="badge-main">{{ activityStatus === 'open' ? '春季班開放申請中' : '12/1 開放申請' }}</span>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- 計畫簡介區 -->
		<section ref="introEl" class="intro" aria-labelledby="intro-title">
			<div class="decor" aria-hidden="true">
				<div v-for="(d, i) in DECOR.intro" :key="i" class="d-item is-orb" :class="{ 'm-hide': !d.m }" :data-depth="d.depth" :style="decorStyle(d)">
					<div class="d-float"><span class="orb"></span></div>
				</div>
			</div>
			<div class="panel-shadow" aria-hidden="true"></div>
			<div class="panel">
				<header class="intro-head">
					<h2 id="intro-title" class="intro-title"><SplitChars text="2026 NXT Fresh 人才培育計畫" /></h2>
					<p class="intro-tagline">讓最好的你被看見</p>
				</header>
				<div class="intro-grid">
					<div class="alliance">
						<p class="alliance-row">
							<span class="chip">基金會</span>
							<span class="times" aria-hidden="true">×</span>
							<span class="chip">產業</span>
							<span class="times" aria-hidden="true">×</span>
							<span class="chip">學術界</span>
						</p>
						<p class="alliance-suffix">三強聯手</p>
						<p class="pitch">{{ '專為即將步入職場卻仍感迷惘的你\n所打造的實戰型人才培育計畫' }}</p>
					</div>
					<div class="benefits">
						<h3 class="benefits-title">加入NXT Fresh，你會獲得…</h3>
						<ul class="benefit-list">
							<li v-for="b in benefits" :key="b" class="benefit">
								<span class="diamond" aria-hidden="true">
									<svg viewBox="0 0 24 24"><path class="tick" pathLength="1" d="M6 12.5l4 4 8-9" /></svg>
								</span>
								{{ b }}
							</li>
						</ul>
						<a class="btn-sun intro-btn" :href="learnMoreUrl" target="_blank" rel="noopener">
							了解詳細計畫內容
							<PhCaretDoubleRight weight="bold" size="1em" aria-hidden="true" />
						</a>
					</div>
				</div>
			</div>
		</section>

		<!-- 學長姐心得：可拖曳、翻面的考卷輪播 -->
		<section ref="tRoot" class="testimonials" aria-labelledby="t-title">
			<div class="decor" aria-hidden="true">
				<div v-for="(d, i) in DECOR.testimonials" :key="i" class="d-item is-orb" :class="{ 'm-hide': !d.m }" :data-depth="d.depth" :style="decorStyle(d)">
					<div class="d-float"><span class="orb"></span></div>
				</div>
			</div>
			<div class="t-head">
				<h2 id="t-title" class="grad-title is-split">
					<span class="num">{{ testimonialPercent }}</span>
					<SplitChars text="%學員在計畫裡找到職場生存解答" />
				</h2>
				<p class="t-tip">點中間的考卷翻面看解答，左右滑動換下一位學長姐</p>
			</div>

			<div
				ref="tStage"
				class="t-stage"
				tabindex="0"
				role="group"
				aria-roledescription="輪播"
				aria-label="學長姐心得考卷，左右鍵切換，空白鍵翻面"
				@keydown="onTestimonialKeydown"
			>
				<article v-for="item in testimonials" :key="item.q" class="t-card">
					<div class="t-tilt">
						<div class="t-inner">
							<!-- 正面：題目 + 模糊的答案 -->
							<div class="t-face t-front">
								<div class="row">
									<span class="qnum">{{ item.q }}</span>
									<span class="t-stamp">職場生存模擬考</span>
								</div>
								<p class="t-ask">{{ item.ask }}</p>
								<div class="t-draft" aria-hidden="true">
									<span class="ans-mark">答</span>
									<p class="draft-text">{{ item.ans }}</p>
								</div>
								<div class="t-who">
									<span class="ava ava-m" :style="avatarStyle(item)"></span>
									<span class="who-txt">
										<b>{{ item.name }}的解答</b>
										<small>{{ item.school }}</small>
									</span>
									<span class="who-go" aria-hidden="true"><PhArrowsClockwise weight="bold" /></span>
								</div>
							</div>
							<!-- 背面：解答 -->
							<div class="t-face t-back">
								<div class="who">
									<span class="ava ava-l" :style="avatarStyle(item)"></span>
									<div>
										<b>{{ item.name }}</b>
										<span>{{ item.school }}</span>
									</div>
								</div>
								<p class="ans">{{ item.ans }}</p>
								<p class="q-small">{{ item.q }}　{{ item.ask }}</p>
							</div>
						</div>
					</div>
					<div class="t-veil"></div>
				</article>
			</div>

			<div class="t-ctrl">
				<button class="btn-round" type="button" aria-label="上一位" @click="carousel.step(-1)">
					<PhCaretLeft weight="bold" size="22" />
				</button>
				<div ref="tDots" class="t-dots" :class="{ 'is-auto': autoplayOn }">
					<button
						v-for="(item, i) in testimonials"
						:key="item.q"
						type="button"
						:aria-label="`${item.q} ${item.name}`"
						:aria-current="i === activeCard ? 'true' : 'false'"
						@click="carousel.goTo(i)"
					></button>
					<button
						v-if="autoplayOn"
						class="t-play"
						type="button"
						:aria-label="userPaused ? '繼續自動輪播' : '暫停自動輪播'"
						:title="userPaused ? '繼續自動輪播' : '暫停自動輪播'"
						@click="toggleUserPause"
					>
						<PhPlay v-if="userPaused" weight="fill" size="14" />
						<PhPause v-else weight="fill" size="14" />
					</button>
				</div>
				<button class="btn-round" type="button" aria-label="下一位" @click="carousel.step(1)">
					<PhCaretRight weight="bold" size="22" />
				</button>
				<button class="sr-only" type="button" @click="carousel.flip()">{{ cardFlipped ? '看題目' : '翻面看解答' }}</button>
			</div>

			<p class="sr-only" :aria-live="autoplaying ? 'off' : 'polite'">
				{{ testimonials[activeCard].q }} {{ testimonials[activeCard].name }}{{ cardFlipped ? '：' + testimonials[activeCard].ans : '：' + testimonials[activeCard].ask }}
			</p>
		</section>

		<!-- 適合對象／申請資格／申請時間 -->
		<section ref="aboutEl" id="about" class="about" aria-label="計畫資訊">
			<div class="decor" aria-hidden="true">
				<div v-for="(d, i) in DECOR.about" :key="i" class="d-item is-orb" :class="{ 'm-hide': !d.m }" :data-depth="d.depth" :style="decorStyle(d)">
					<div class="d-float"><span class="orb"></span></div>
				</div>
			</div>
			<ul class="about-list wrap">
				<li class="about-item">
					<span class="about-float">
						<span class="icon-tile about-icon" aria-hidden="true"><PhUsers weight="fill" size="1em" /></span>
					</span>
					<h3 class="about-title">適合對象</h3>
					<p class="about-desc">想找到真正適合自己工作的人</p>
				</li>
				<li class="about-item">
					<span class="about-float">
						<span class="icon-tile about-icon" aria-hidden="true"><PhIdentificationBadge weight="fill" size="1em" /></span>
					</span>
					<h3 class="about-title">申請資格</h3>
					<p class="about-desc">{{ '大三(含)以上學生(含碩博士生)或\n兩年(含)以內工作經驗者' }}</p>
				</li>
				<li class="about-item">
					<span class="about-float">
						<span class="icon-tile about-icon" aria-hidden="true"><PhCalendarDots weight="fill" size="1em" /></span>
					</span>
					<h3 class="about-title">申請時間</h3>
					<p class="about-desc">{{ schedule.periodLabel }}</p>
				</li>
			</ul>
		</section>

		<!-- 立即申請 -->
		<section id="apply" ref="applyEl" class="apply" aria-labelledby="apply-title">
			<div class="decor" aria-hidden="true">
				<div v-for="(d, i) in DECOR.apply" :key="i" class="d-item is-orb" :class="{ 'm-hide': !d.m }" :data-depth="d.depth" :style="decorStyle(d)">
					<div class="d-float"><span class="orb"></span></div>
				</div>
			</div>
			<div class="wrap">
				<!-- 開放申請中：表單 -->
				<template v-if="activityStatus === 'open'">
					<div class="apply-head">
						<h2 id="apply-title" class="grad-title is-split"><SplitChars text="立即申請" /></h2>
					</div>

					<form class="apply-form ux-left ux-strong ux-box" novalidate @submit.prevent="submitApply">
						<!-- 申請須知 -->
						<section class="notes-top" aria-labelledby="notes-title">
							<h3 id="notes-title" class="notes-title">申請須知</h3>
							<ol class="notes">
								<li>計畫申請期間：即日起至{{ schedule.deadlineLabel }} 截止。</li>
								<li>此申請表僅需花約1分鐘完成，主要確認申請者是否符合計畫申請資格。</li>
								<li>請務必留下完整且正確資料，以利本會進行審核，並請勿重複填寫申請表。</li>
								<li>如有任何計畫或申請相關問題，歡迎Email至 {{ email }} 詢問。</li>
							</ol>
							<p class="required-note">以下欄位皆為必填。</p>
						</section>

						<div class="grid">
							<!-- 個人資訊 -->
							<fieldset class="group">
								<legend class="g-title">個人資訊填寫</legend>
								<div class="card stack">
									<div class="field-wrap">
										<label class="f-label" for="f-name">姓名</label>
										<input
											id="f-name"
											v-model="form.name"
											class="field"
											:class="{ invalid: errors.name }"
											type="text"
											autocomplete="name"
											placeholder="請輸入真實姓名"
											v-bind="ariaFor('name')"
										/>
										<p v-if="errors.name" id="e-name" class="err"><PhWarningCircle weight="fill" size="16" aria-hidden="true" />{{ errors.name }}</p>
									</div>

									<div class="field-wrap" role="group" aria-labelledby="l-bday">
										<span id="l-bday" class="f-label">生日</span>
										<div class="bday">
											<span class="sel-wrap">
												<select
													id="f-by"
													v-model="birthday.y"
													class="field sel"
													:class="{ ph: !birthday.y, invalid: errors.birthday && !birthday.y }"
													aria-label="出生年"
													autocomplete="bday-year"
													v-bind="ariaFor('birthday')"
												>
													<option value="" disabled>年</option>
													<option v-for="y in birthdayYears" :key="y" :value="String(y)">{{ y }}</option>
												</select>
												<PhCaretDown class="caret" weight="bold" size="16" aria-hidden="true" />
											</span>
											<span class="sel-wrap">
												<select
													v-model="birthday.m"
													class="field sel"
													:class="{ ph: !birthday.m, invalid: errors.birthday && !birthday.m }"
													aria-label="出生月"
													autocomplete="bday-month"
												>
													<option value="" disabled>月</option>
													<option v-for="m in 12" :key="m" :value="String(m)">{{ m }}</option>
												</select>
												<PhCaretDown class="caret" weight="bold" size="16" aria-hidden="true" />
											</span>
											<span class="sel-wrap">
												<select
													v-model="birthday.d"
													class="field sel"
													:class="{ ph: !birthday.d, invalid: errors.birthday && !birthday.d }"
													aria-label="出生日"
													autocomplete="bday-day"
												>
													<option value="" disabled>日</option>
													<option v-for="d in birthdayMaxDay" :key="d" :value="String(d)">{{ d }}</option>
												</select>
												<PhCaretDown class="caret" weight="bold" size="16" aria-hidden="true" />
											</span>
										</div>
										<p v-if="errors.birthday" id="e-birthday" class="err">
											<PhWarningCircle weight="fill" size="16" aria-hidden="true" />{{ errors.birthday }}
										</p>
									</div>

									<div class="field-wrap">
										<label class="f-label" for="f-email">Email</label>
										<input
											id="f-email"
											v-model="form.email"
											class="field"
											:class="{ invalid: errors.email }"
											type="email"
											inputmode="email"
											autocomplete="email"
											placeholder="例如 name@gmail.com"
											:aria-invalid="errors.email ? 'true' : null"
											:aria-describedby="errors.email ? 'e-email f-email-hint' : 'f-email-hint'"
											@blur="checkEmailOnBlur"
										/>
										<p v-if="errors.email" id="e-email" class="err"><PhWarningCircle weight="fill" size="16" aria-hidden="true" />{{ errors.email }}</p>
									</div>
									<p id="f-email-hint" class="hint">建議不要使用公司或學校信箱，以免擋信。請再次確認Email是否正確，確保您可確實收到活動通知。</p>
								</div>
							</fieldset>

							<div class="col">
								<!-- 身分（自訂下拉） -->
								<div class="group">
									<p id="identity-label" class="g-title">請問您目前身分</p>
									<div ref="identitySelectEl" class="card select" @keydown="onIdentityKeydown">
										<button
											id="f-identity"
											type="button"
											class="field select-btn"
											:class="{ ph: !form.identity, invalid: errors.identity }"
											aria-haspopup="listbox"
											:aria-expanded="identityDropdownOpen ? 'true' : 'false'"
											aria-labelledby="identity-label f-identity"
											:aria-invalid="errors.identity ? 'true' : null"
											:aria-describedby="errors.identity ? 'e-identity' : null"
											@click="identityDropdownOpen = !identityDropdownOpen"
										>
											<span>{{ form.identity || '請選擇相符選項' }}</span>
											<PhCaretDown class="caret" :class="{ up: identityDropdownOpen }" weight="bold" size="18" aria-hidden="true" />
										</button>
										<ul v-show="identityDropdownOpen" class="options" role="listbox" aria-labelledby="identity-label">
											<li
												v-for="option in identityOptions"
												:key="option.value"
												role="option"
												:aria-selected="form.identity === option.value ? 'true' : 'false'"
											>
												<button type="button" class="option" @click="selectIdentity(option)">
													<b>{{ option.value }}</b>
													<small v-if="option.desc">{{ option.desc }}</small>
												</button>
											</li>
										</ul>
										<p v-if="errors.identity" id="e-identity" class="err err-gap">
											<PhWarningCircle weight="fill" size="16" aria-hidden="true" />{{ errors.identity }}
										</p>
										<template v-if="form.identity === '其他'">
											<label class="sr-only" for="f-other">請輸入您的身分</label>
											<input
												id="f-other"
												v-model="identityOther"
												class="field other"
												:class="{ invalid: errors.identityOther }"
												type="text"
												placeholder="請輸入您的身分"
												v-bind="ariaFor('identityOther')"
											/>
											<p v-if="errors.identityOther" id="e-identityOther" class="err err-gap">
												<PhWarningCircle weight="fill" size="16" aria-hidden="true" />{{ errors.identityOther }}
											</p>
										</template>
									</div>
								</div>

								<!-- 學校 -->
								<div class="group">
									<label class="g-title" for="f-school">目前就學學校（或畢業學校）</label>
									<div class="card">
										<input
											id="f-school"
											v-model="form.school"
											class="field"
											:class="{ invalid: errors.school }"
											type="text"
											autocomplete="organization"
											placeholder="請輸入學校全名例如：國立臺南大學"
											v-bind="ariaFor('school')"
										/>
										<p v-if="errors.school" id="e-school" class="err err-gap">
											<PhWarningCircle weight="fill" size="16" aria-hidden="true" />{{ errors.school }}
										</p>
									</div>
								</div>
							</div>
						</div>

						<!-- 得知管道（可複選） -->
						<fieldset class="group" :aria-describedby="errors.sources ? 'e-sources' : null">
							<legend class="g-title">請問您是如何得知 NXT Fresh 人才培育計畫？（可複選）</legend>
							<div class="card sources" :class="{ invalid: errors.sources }">
								<label v-for="(source, i) in sourceOptions" :key="source" class="check">
									<input :id="`f-src-${i}`" v-model="form.sources" class="sr-only" type="checkbox" :value="source" />
									<span class="box" aria-hidden="true"><PhCheck weight="bold" size="14" /></span>
									{{ source }}
								</label>
							</div>
							<p v-if="errors.sources" id="e-sources" class="err err-gap">
								<PhWarningCircle weight="fill" size="16" aria-hidden="true" />{{ errors.sources }}
							</p>
						</fieldset>

						<!-- 個資同意 -->
						<div class="consent-wrap">
							<label class="consent check" :class="{ invalid: errors.agree }">
								<input id="f-agree" v-model="form.agree" class="sr-only" type="checkbox" v-bind="ariaFor('agree')" />
								<span class="box" aria-hidden="true"><PhCheck weight="bold" size="14" /></span>
								<span
									>送出申請即代表您同意主辦單位（財團法人溫世仁文教基金會）得於本計畫之執行、聯繫通訊等一切必要範圍內，蒐集、處理及利用本人所提供之個人資料。</span
								>
							</label>
							<p v-if="errors.agree" id="e-agree" class="err err-gap"><PhWarningCircle weight="fill" size="16" aria-hidden="true" />{{ errors.agree }}</p>
						</div>

						<div class="submit-row">
							<button class="btn-sun submit" type="submit" :disabled="holdBtn">送出申請</button>
						</div>
					</form>
				</template>

				<!-- 開放申請前 / 申請截止後：公告卡 -->
				<div v-else class="notice">
					<p v-if="activityStatus === 'ended'" class="notice-kicker">2026 NXT Fresh 人才培育計畫</p>
					<div class="apply-head">
						<h2 id="apply-title" class="grad-title is-split">
							<SplitChars :text="activityStatus === 'before' ? '春季班即將開放申請' : '申請已截止'" />
						</h2>
					</div>
					<template v-if="activityStatus === 'before'">
						<p class="notice-desc">將於{{ schedule.openLabel }}開放申請</p>
						<a class="btn-sun notice-btn" :href="googleCalendarUrl" target="_blank" rel="noopener">
							<PhCalendarPlus weight="bold" size="1.2em" aria-hidden="true" />開啟申請提醒
						</a>
					</template>
					<p class="notice-contact">
						如有任何計畫或申請相關問題，歡迎Email至
						<a :href="`mailto:${email}`">{{ email }}</a>
						詢問。
					</p>
				</div>
			</div>
		</section>
	</main>

	<footer class="site-footer">
		<p>COPYRIGHT © 財團法人溫世仁文教基金會</p>
	</footer>

	<!-- 前往測驗浮動按鈕：可拖曳，點一下前往測驗頁 -->
	<div ref="quizFloatEl" class="quiz-float" role="link" tabindex="0" aria-label="職場生存終極指南，點擊進入" @keydown="onQuizFloatKeydown">
		<img class="qf-inner" :src="img.quizFloat" alt="" draggable="false" />
	</div>

	<!-- 送出中 -->
	<Teleport to="body">
		<div v-if="holdBtn" class="loading" role="status" aria-live="polite">
			<span class="spinner" aria-hidden="true"></span>
			<p>送出中...</p>
		</div>
	</Teleport>

	<!-- 共用提示彈窗 -->
	<Transition name="modal">
		<div v-if="alertState.open" class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-msg" @keydown.esc="closeAlert" @click.self="closeAlert">
			<div class="modal-box">
				<p id="modal-msg" class="msg" v-html="alertState.message"></p>
				<button ref="alertBtn" class="btn-sun" type="button" @click="closeAlert">確定</button>
			</div>
		</div>
	</Transition>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount, nextTick, h } from 'vue'
import axios from 'axios'
import {
	PhArrowsClockwise,
	PhCalendarDots,
	PhCalendarPlus,
	PhCaretDoubleRight,
	PhCaretDown,
	PhCaretLeft,
	PhCaretRight,
	PhCheck,
	PhIdentificationBadge,
	PhPause,
	PhPlay,
	PhUsers,
	PhWarningCircle
} from '@phosphor-icons/vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import config from './config.js'
import { schedule, learnMoreUrl, getActivityStatus, getForcedState, ctaTextMap } from './composables/useActivityStatus.js'

gsap.registerPlugin(ScrollTrigger, Draggable, InertiaPlugin)

const img = config.images.home
const email = 'nxtfresh@saylingwen.org'
// 有 ?state= 強制狀態時一起帶到測驗頁，讓測驗頁導覽列按鈕狀態跟首頁一致
const quizUrl = `./quiz.html?openExternalBrowser=1${getForcedState() ? `&state=${getForcedState()}` : ''}`
const LINE_TAG_ID = '252c7ad0-6688-49a3-a2b0-6d43fa245ba4'

// 使用者系統設定「減少動態效果」時，關閉大部分動畫
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
// 有滑鼠游標的裝置（桌機）才啟用滑鼠視差 / 傾斜效果
const canHover = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches

// ====================================
// 申請時程 / 活動狀態（設定在 composables/useActivityStatus.js，測驗頁共用）
// ====================================
// before：開放申請前 / open：開放申請中（顯示表單）/ ended：申請截止後
// 網址加 ?state=before|open|ended 可強制切換（給企劃看各狀態）
const activityStatus = ref(getActivityStatus())

const ctaText = computed(() => ctaTextMap[activityStatus.value])

const googleCalendarUrl = (() => {
	const title = encodeURIComponent('NXT Fresh人才培育計畫（春季班）開放申請')
	const details = encodeURIComponent('NXT Fresh人才培育計畫春季班已開放申請，立即點擊下方連結送出申請，踏出第一步，讓你職涯不繞路！\n傳送門： https://bigcc.cc/BWiox8')
	return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261201/20261202&details=${details}`
})()

const scrollToApply = () => {
	const el = document.getElementById('apply')
	if (el) el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })
}

const onKvCta = (e) => {
	if (activityStatus.value === 'ended') return
	e.preventDefault()
	scrollToApply()
}

// ====================================
// 共用提示彈窗
// ====================================
const alertState = reactive({ open: false, message: '', callback: null })
const alertBtn = ref(null)
let alertLastFocus = null

const showAlert = async (message, callback = null) => {
	alertState.message = message
	alertState.callback = callback
	alertState.open = true
	alertLastFocus = document.activeElement
	await nextTick()
	alertBtn.value && alertBtn.value.focus()
}

const closeAlert = () => {
	alertState.open = false
	const cb = alertState.callback
	alertState.callback = null
	cb && cb()
	alertLastFocus && alertLastFocus.focus && alertLastFocus.focus()
}

// ====================================
// 拆字元標題（供 GSAP 逐字進場；英數字整個單字不斷行）
// ====================================
const SplitChars = (props) => {
	const tokens = []
	const re = /([A-Za-z0-9]+)|(\s+)|([\s\S])/gu
	let m
	while ((m = re.exec(props.text))) {
		if (m[1]) tokens.push({ word: [...m[1]] })
		else if (m[2]) tokens.push({ space: true })
		else tokens.push({ ch: m[3] })
	}
	const char = (c) => h('span', { class: 'ch' }, [h('span', { class: 'cg' }, c)])
	return [
		h('span', { class: 'sr-only' }, props.text),
		h(
			'span',
			{ class: 'sc', 'aria-hidden': 'true' },
			tokens.map((t) => (t.word ? h('span', { class: 'sc-w' }, t.word.map(char)) : t.space ? ' ' : char(t.ch)))
		)
	]
}
SplitChars.props = ['text']

// ====================================
// 主視覺：問句泡泡
// ====================================
const titleMask = { WebkitMaskImage: `url("${img.kvTitleMask}")`, maskImage: `url("${img.kvTitleMask}")` }

// [ ] 內的字以橘色強調；depth 為滑鼠視差深度
const bubbles = [
	{ id: 'career', text: '就要[畢業]了,到底\n要找什麼[工作]?', label: '職涯規劃', depth: 0.8 },
	{ id: 'practice', text: '你知道要如何把專業\n發揮在[職場]嗎?', label: '職涯目標', depth: 0.95 },
	{ id: 'ai', text: '你有什麼[技能]是\n不會被[AI]取代？', label: '自我成長', depth: 0.62 },
	{ id: 'hire', text: '為什麼這份\n工作要[錄取]你？', label: '職場價值', depth: 0.55 }
].map((b) => {
	// "就要[畢業]了" → [{ t:'就要' }, { t:'畢業', hl:true }, { t:'了' }]
	let hlIndex = 0
	const lines = b.text.split('\n').map((line) => {
		const segs = []
		const re = /\[([^\]]+)\]|([^[]+)/g
		let m
		while ((m = re.exec(line))) segs.push(m[1] ? { t: m[1], hl: true, i: hlIndex++ } : { t: m[2], hl: false })
		return segs
	})
	return { ...b, lines, plain: b.text.replace(/[[\]]/g, '').replace(/\n/g, '') }
})

// 各泡泡在 1920×1080 設計稿上的尺寸、文字透視四邊形座標
const BUBBLE_LAYOUTS = {
	ai: {
		w: 531,
		h: 453,
		origin: [1479, 364],
		text: { quad: [1479.639, 405.956, 1913.38, 449.405, 1905.883, 678.974, 1476.312, 650.418], sz: [645, 291], x: 56, y: 182, fs: 84, lh: 100.8, ls: 0.03, hl: [1.1], maxW: 684 },
		labelEm: 0.42
	},
	career: {
		w: 257,
		h: 165,
		origin: [1296, 200],
		text: { quad: [1317.831, 221.044, 1506, 235, 1506.621, 298.983, 1316.558, 289.049], sz: [323, 104], x: -0.44, y: 44.41, fs: 42.71, lh: 53.87, ls: 0.03, hl: [1.1], maxW: 312 },
		icon: { x: 210, y: 21, w: 33, h: 40 }
	},
	practice: {
		w: 387,
		h: 247,
		origin: [1629, 109],
		text: { quad: [1667.681, 135.135, 1939.197, 155.976, 1934.598, 256.865, 1664, 229.755], sz: [364, 102], x: -1.44, y: 43.41, fs: 42.71, lh: 53.87, ls: 0.03, hl: [1.1], maxW: 350 },
		icon: { x: 325, y: 43, w: 40, h: 48 }
	},
	hire: {
		w: 305,
		h: 193,
		origin: [1549, 823],
		text: { quad: [1583.242, 859.948, 1799.348, 869.364, 1797.993, 939.386, 1582.969, 928.435], sz: [325, 104], x: -0.44, y: 38.19, fs: 43.01, lh: 54.25, ls: 0.03, hl: [1.1], maxW: 316 },
		icon: { x: 249, y: 29, w: 40, h: 46 }
	}
}
const CAP_HEIGHT = 0.436 // 字身中心到基線的比例
const LABEL_MIN_PX = 13 // 泡泡標籤最小字級

const bubbleRoots = {}
const bubbleCopies = {}
const bubbleScale = reactive({ career: 1, practice: 1, ai: 1, hire: 1 }) // 實際寬度 / 設計稿寬度
const bubbleFit = reactive({ career: 1, practice: 1, ai: 1, hire: 1 }) // 文字超過 maxW 時的縮放

// 文字太長時縮小到 maxW 內
const fitBubbleText = (id) => {
	const el = bubbleCopies[id]
	if (!el) return
	const natural = el.offsetWidth / bubbleFit[id]
	const max = BUBBLE_LAYOUTS[id].text.maxW * bubbleScale[id]
	const next = natural > max ? max / natural : 1
	if (Math.abs(next - bubbleFit[id]) > 0.005) bubbleFit[id] = next
}

const measureBubbles = () => {
	bubbles.forEach(({ id }) => {
		if (bubbleRoots[id]) bubbleScale[id] = bubbleRoots[id].offsetWidth / BUBBLE_LAYOUTS[id].w || 1
	})
	nextTick(() => bubbles.forEach(({ id }) => fitBubbleText(id)))
}

// 由矩形 [w,h] 映射到四邊形 quad 的投影矩陣
const quadToMatrix3d = (quad, [w, hgt], [ox, oy], scale) => {
	const [x0, y0, x1, y1, x2, y2, x3, y3] = quad.map((v, i) => v - (i % 2 ? oy : ox))
	const dx1 = x1 - x2
	const dx2 = x3 - x2
	const sx = x0 - x1 + x2 - x3
	const dy1 = y1 - y2
	const dy2 = y3 - y2
	const sy = y0 - y1 + y2 - y3
	const det = dx1 * dy2 - dx2 * dy1
	const g = (sx * dy2 - dx2 * sy) / det
	const k = (dx1 * sy - sx * dy1) / det
	const a = x1 - x0 + g * x1
	const b = x3 - x0 + k * x3
	const d = y1 - y0 + g * y1
	const e = y3 - y0 + k * y3
	const m = [a / w, d / w, 0, g / (w * scale), b / hgt, e / hgt, 0, k / (hgt * scale), 0, 0, 1, 0, x0 * scale, y0 * scale, 0, 1]
	return `matrix3d(${m.map((n) => +n.toFixed(8)).join(',')})`
}

const bubblePx = (id, v) => `${(v * bubbleScale[id]).toFixed(3)}px`

const bubbleRootStyle = (id) => ({
	width: `calc(var(--k) * ${BUBBLE_LAYOUTS[id].w})`,
	height: `calc(var(--k) * ${BUBBLE_LAYOUTS[id].h})`
})

const bubblePlaneStyle = (id) => {
	const t = BUBBLE_LAYOUTS[id].text
	return {
		width: bubblePx(id, t.sz[0]),
		height: bubblePx(id, t.sz[1]),
		transform: quadToMatrix3d(t.quad, t.sz, BUBBLE_LAYOUTS[id].origin, bubbleScale[id])
	}
}

const bubbleCopyStyle = (id) => {
	const t = BUBBLE_LAYOUTS[id].text
	const fit = bubbleFit[id]
	const fs = t.fs * fit
	return {
		left: bubblePx(id, t.x),
		top: bubblePx(id, t.y - ((t.lh * fit) / 2 + CAP_HEIGHT * fs)),
		fontSize: bubblePx(id, fs),
		lineHeight: bubblePx(id, t.lh * fit),
		letterSpacing: `${t.ls}em`
	}
}

const bubbleHlScale = (id, i) => {
	const arr = BUBBLE_LAYOUTS[id].text.hl
	return arr[Math.min(i, arr.length - 1)] ?? 1.18
}

// 標籤字級不小於 13px
const bubbleLabelStyle = (id) => {
	const t = BUBBLE_LAYOUTS[id].text
	const quadScaleX = (t.quad[2] - t.quad[0] + (t.quad[4] - t.quad[6])) / 2 / t.sz[0]
	const renderedPx = t.fs * bubbleFit[id] * bubbleScale[id] * quadScaleX
	const em = BUBBLE_LAYOUTS[id].labelEm ?? 0.56
	return { fontSize: `${Math.max(em, LABEL_MIN_PX / renderedPx).toFixed(3)}em` }
}

const bubbleIconStyle = (id) => {
	const i = BUBBLE_LAYOUTS[id].icon
	return { left: `calc(var(--k) * ${i.x})`, top: `calc(var(--k) * ${i.y})`, width: `calc(var(--k) * ${i.w})`, height: `calc(var(--k) * ${i.h})` }
}

// ====================================
// 主視覺：WebGL 流動漸層背景（跟著滑鼠微微發光；不支援時隱藏，露出 CSS 漸層）
// ====================================
const kvCanvas = ref(null)
const kvCanvasFailed = ref(false)
const kvPointer = { x: 0.62, y: 0.55, active: false }

const KV_VERT = `
attribute vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`

const KV_FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for(int i = 0; i < 5; i++){ v += a * noise(p); p = p * 2.02 + vec2(1.7, 9.2); a *= 0.5; }
  return v;
}
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * asp, uv.y);
  float t = uTime;
  vec2 q = vec2(fbm(p * 1.1 + vec2(0.0, t * 0.035)), fbm(p * 1.1 + vec2(5.2, -t * 0.03)));
  float n = fbm(p * 1.5 + q * 1.5 + vec2(t * 0.025, 0.0));

  /* 色彩取自原 KV：左上淡奶油黃、中段金黃、右側與下方飽和橘 */
  vec3 light = vec3(0.980, 0.862, 0.610);
  vec3 mid   = vec3(0.984, 0.792, 0.365);
  vec3 deep  = vec3(0.945, 0.655, 0.118);
  vec3 cream = vec3(0.965, 0.855, 0.620);
  vec3 base  = vec3(0.957, 0.682, 0.157);

  vec3 haze  = vec3(0.953, 0.835, 0.600);

  float tl = distance(uv, vec2(0.0, 1.0));
  vec3 col = mix(light, mid, smoothstep(0.08, 0.72, tl));
  float dpt = clamp(smoothstep(0.4, 0.95, uv.x) * 0.95 + smoothstep(0.5, 0.0, uv.y) * 0.5, 0.0, 1.0);
  col = mix(col, deep, dpt);
  col = mix(col, cream, smoothstep(0.58, 0.86, n) * 0.35 * (1.0 - 0.5 * uv.x));
  col = mix(col, deep, smoothstep(0.62, 0.9, 1.0 - n) * 0.15);
  /* 上方的奶油色霧光（原 KV 右上偏淡褐） */
  col = mix(col, haze, smoothstep(0.35, 0.95, uv.y) * smoothstep(0.1, 0.6, uv.x) * 0.6);

  float k = uv.x * 0.9 - uv.y * 0.55;
  float band = exp(-pow(k - (0.12 + 0.2 * sin(t * 0.11)), 2.0) * 28.0);
  col += vec3(0.98, 0.86, 0.62) * band * 0.04;

  vec2 mp = vec2(uMouse.x * asp, uMouse.y);
  float d = distance(p, mp);
  col += vec3(0.96, 0.8, 0.55) * exp(-d * d * 4.5) * 0.05;

  col = mix(col, base, smoothstep(0.2, 0.0, uv.y));
  col += (hash(gl_FragCoord.xy + fract(t)) - 0.5) / 255.0;
  gl_FragColor = vec4(col, 1.0);
}`

let kvStopBackground = () => {}

const initKvBackground = () => {
	const canvas = kvCanvas.value
	let gl, uRes, uTime, uMouse, io
	let raf = 0
	let inView = true
	let pageVisible = true
	const mouse = { x: 0.62, y: 0.55 }
	const t0 = performance.now()

	const compile = (type, src) => {
		const sh = gl.createShader(type)
		gl.shaderSource(sh, src)
		gl.compileShader(sh)
		if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh))
		return sh
	}

	try {
		gl = canvas.getContext('webgl', { antialias: false, alpha: false, premultipliedAlpha: false, powerPreference: 'low-power' })
		if (!gl) throw new Error('no webgl')
		const program = gl.createProgram()
		gl.attachShader(program, compile(gl.VERTEX_SHADER, KV_VERT))
		gl.attachShader(program, compile(gl.FRAGMENT_SHADER, KV_FRAG))
		gl.linkProgram(program)
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program))
		gl.useProgram(program)
		gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
		const aPos = gl.getAttribLocation(program, 'aPos')
		gl.enableVertexAttribArray(aPos)
		gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)
		uRes = gl.getUniformLocation(program, 'uRes')
		uTime = gl.getUniformLocation(program, 'uTime')
		uMouse = gl.getUniformLocation(program, 'uMouse')
	} catch {
		kvCanvasFailed.value = true
		return
	}

	// 以半解析度渲染，省效能
	const resize = () => {
		const scale = 0.5 * Math.min(window.devicePixelRatio || 1, 2)
		const w = Math.max(1, Math.round(canvas.clientWidth * scale))
		const hgt = Math.max(1, Math.round(canvas.clientHeight * scale))
		if (canvas.width !== w || canvas.height !== hgt) {
			canvas.width = w
			canvas.height = hgt
			gl.viewport(0, 0, w, hgt)
		}
	}

	const loop = () => {
		if (!raf && inView && pageVisible) raf = requestAnimationFrame(frame)
	}

	const frame = (now) => {
		raf = 0
		if (!gl) return
		resize()
		const t = (now - t0) / 1000
		// 沒有滑鼠時，光點自己慢慢飄
		const tx = kvPointer.active ? kvPointer.x : 0.6 + 0.18 * Math.sin(t * 0.17)
		const ty = kvPointer.active ? kvPointer.y : 0.55 + 0.14 * Math.cos(t * 0.13)
		mouse.x += (tx - mouse.x) * 0.045
		mouse.y += (ty - mouse.y) * 0.045
		gl.uniform2f(uRes, canvas.width, canvas.height)
		gl.uniform1f(uTime, reducedMotion ? 12 : t)
		gl.uniform2f(uMouse, mouse.x, mouse.y)
		gl.drawArrays(gl.TRIANGLES, 0, 3)
		if (!reducedMotion) loop()
	}

	const onVisibility = () => {
		pageVisible = document.visibilityState === 'visible'
		loop()
	}

	// 離開畫面或分頁切走時暫停
	io = new IntersectionObserver(([entry]) => {
		inView = entry.isIntersecting
		loop()
	})
	io.observe(canvas)
	document.addEventListener('visibilitychange', onVisibility)
	canvas.addEventListener('webglcontextlost', (e) => {
		e.preventDefault()
		kvCanvasFailed.value = true
		gl = null
	})
	loop()

	kvStopBackground = () => {
		raf && cancelAnimationFrame(raf)
		io.disconnect()
		document.removeEventListener('visibilitychange', onVisibility)
	}
}

// ====================================
// 計畫簡介
// ====================================
const benefits = ['適合自己的職涯方向與職缺機會', '學校沒有教，但企業需要的職場軟實力', '溝通技巧與團隊協作實戰經驗', '求職履歷輔導及專業導師陪伴']

// ====================================
// 各區塊背景光球（x/y 為百分比，負 x 代表靠右；m 開頭為手機版位置，m: true 才在手機顯示）
// ====================================
const DECOR = {
	intro: [
		{ x: 5, y: 22, w: 150, depth: 0.8, blur: 6, op: 0.8, m: true, mx: -10, my: 2, mw: 110 },
		{ x: 2, y: 60, w: 110, depth: 0.5, blur: 5, op: 0.6 },
		{ x: -6, y: 72, w: 110, depth: -0.3, blur: 2, op: 0.9, m: true, mx: -8, my: 90, mw: 80 }
	],
	testimonials: [
		{ x: -8, y: 58, w: 150, depth: 0.9, blur: 8, op: 0.55 },
		{ x: 10, y: 78, w: 90, depth: -0.4, blur: 2, op: 0.7, m: true, mx: 4, my: 86, mw: 70 }
	],
	about: [
		{ x: -4, y: 10, w: 130, depth: 0.7, blur: 6, op: 0.55 },
		{ x: -14, y: 64, w: 120, depth: 0.4, blur: 3, m: true, mx: -6, my: 34, mw: 90 },
		{ x: 16, y: 6, w: 80, depth: -0.3, m: true, mx: 3, my: 72, mw: 60 }
	],
	apply: [
		{ x: -3, y: 24, w: 130, depth: 0.6, blur: 5, op: 0.6, m: true, mx: -8, my: 2, mw: 80 },
		{ x: -5, y: 72, w: 150, depth: -0.4, blur: 2, m: true, mx: -8, my: 90, mw: 90 },
		{ x: 9, y: 32, w: 100, depth: 1, blur: 7, op: 0.7 }
	]
}

const decorSide = (x) => (x < 0 ? { l: 'auto', r: `${-x}%` } : { l: `${x}%`, r: 'auto' })

const decorStyle = (d) => {
	const s = decorSide(d.x)
	const style = {
		'--l': s.l,
		'--r': s.r,
		'--t': `${d.y}%`,
		'--w': `clamp(${Math.round(d.w * 0.5)}px, ${(d.w / 14.4).toFixed(2)}vw, ${Math.round(d.w * 1.3)}px)`,
		'--rot': `${d.rot || 0}deg`,
		'--blur': `${d.blur || 0}px`,
		opacity: d.op ?? 1
	}
	if (d.mx !== undefined) {
		const m = decorSide(d.mx)
		style['--ml'] = m.l
		style['--mr'] = m.r
	}
	if (d.my !== undefined) style['--mt'] = `${d.my}%`
	if (d.mw !== undefined) style['--mw'] = `${d.mw}px`
	return style
}

// ====================================
// 學長姐心得輪播
// ====================================
const testimonialPercent = 90
// photo 對應 public/assets/images/v2/students/{photo}.webp；fx/fy 為頭像裁切焦點（0~1）
const testimonials = [
	{ q: 'Q1', ask: '計畫中的哪一階段讓你更認識自己？', ans: '職涯發展工作坊，透過各種工具來檢測自己的特質，除了找出組員的技能，還能從中更了解自己！', name: '張學員', school: '國立臺灣師範大學', photo: 'zhang', fx: 0.48, fy: 0.4 },
	{ q: 'Q2', ask: '4C課程中哪一項是在學校沒學到的？', ans: 'CSW完整幕僚作業和正確當責心態，讓我有更具體的行動目標。', name: '謝學員', school: '國立臺灣師範大學', photo: 'xie', fx: 0.47, fy: 0.45 },
	{ q: 'Q3', ask: '你認為職場上必備技能是什麼？', ans: '透過不同遊戲，教會我們在實際工作中如何提升團隊效能，並加強溝通與協作能力。', name: '葉學員', school: '國立虎尾科技大學', photo: 'ye', fx: 0.48, fy: 0.35 },
	{ q: 'Q4', ask: '計畫對你的職涯有哪些幫助？', ans: '基金會提供的課程與各項資源讓我不只在職場上更能呈現專業性，也有獨立解決問題的能力！', name: '呂學員', school: '世新大學', photo: 'lu', fx: 0.5, fy: 0.47 },
	{ q: 'Q5', ask: '身為社會新鮮人，參加計畫後最大的變化？', ans: '原本對自己的職涯和能力都還在探索中，除了培養軟實力之外，更是為迷惘的職涯照亮方向。', name: '楊學員', school: '國立中正大學', photo: 'yang', fx: 0.52, fy: 0.34 },
	{ q: 'Q6', ask: '對基金會的導師和夥伴有什麼想說的？', ans: '領新陪伴是充滿用心與溫暖的照顧，讓我在探索職涯的路上走得更加踏實且收穫豐碩。', name: '梁學員', school: '私立東吳大學', photo: 'liang', fx: 0.57, fy: 0.33 }
]
const AUTOPLAY_SECONDS = 5

// 頭像：照片放大 2.1 倍，以 fx/fy 為焦點裁切
const focusPos = (f, zoom) => Math.min(1, Math.max(0, (f * zoom - 0.5) / (zoom - 1))) * 100
const avatarStyle = (item) => ({
	backgroundImage: `url(${img.student(item.photo)})`,
	backgroundSize: '210%',
	backgroundPosition: `${focusPos(item.fx, 2.1)}% ${focusPos(item.fy + 0.06, 2.1)}%`
})

const tRoot = ref(null)
const tStage = ref(null)
const tDots = ref(null)
const activeCard = ref(0)
const cardFlipped = ref(false)
let carousel = { flip: () => {}, step: () => {}, goTo: () => {} }

// 自動輪播：任何一個暫停原因存在就暫停
const autoplayOn = ref(false)
const autoplaying = ref(false)
const userPaused = ref(false)
const pauseReasons = new Set(['offscreen'])
let autoTween

const syncAutoplay = () => {
	if (!autoTween) return
	const run = pauseReasons.size === 0
	run ? autoTween.resume() : autoTween.pause()
	autoplaying.value = run
}
const setPause = (reason, on) => {
	on ? pauseReasons.add(reason) : pauseReasons.delete(reason)
	syncAutoplay()
}
const restartAutoplay = () => {
	if (!autoTween) return
	autoTween.restart()
	syncAutoplay()
}
const toggleUserPause = () => {
	userPaused.value = !userPaused.value
	setPause('user', userPaused.value)
}

watch(cardFlipped, (v) => {
	setPause('flip', v)
	if (!v) restartAutoplay()
})

const onTestimonialKeydown = (e) => {
	if (e.key === 'ArrowRight') {
		e.preventDefault()
		carousel.step(1)
	} else if (e.key === 'ArrowLeft') {
		e.preventDefault()
		carousel.step(-1)
	} else if (e.key === ' ' || e.key === 'Enter') {
		e.preventDefault()
		carousel.flip()
	}
}

// ====================================
// 首頁「立即申請」表單
// ====================================
const form = ref({
	name: '',
	birthday: '',
	email: '',
	identity: '',
	school: '',
	sources: [],
	agree: false
})

// 防連點 / 送出中
const holdBtn = ref(false)

// 生日：年 / 月 / 日 三個下拉，選完組成 YYYY/MM/DD
const birthday = reactive({ y: '', m: '', d: '' })
// 年份固定 1990-2011（新到舊排列），開放資格年齡異動時改這兩個數字
const BIRTH_YEAR_MIN = 1990
const BIRTH_YEAR_MAX = 2011
const birthdayYears = Array.from({ length: BIRTH_YEAR_MAX - BIRTH_YEAR_MIN + 1 }, (_, i) => BIRTH_YEAR_MAX - i)
const birthdayMaxDay = computed(() => (birthday.y && birthday.m ? new Date(Number(birthday.y), Number(birthday.m), 0).getDate() : 31))
const pad2 = (n) => String(n).padStart(2, '0')

watch(birthday, () => {
	// 換月份後日期超過當月天數（例如 2 月沒有 30 日）就清掉
	if (birthday.d && Number(birthday.d) > birthdayMaxDay.value) birthday.d = ''
	form.value.birthday = birthday.y && birthday.m && birthday.d ? `${birthday.y}/${pad2(birthday.m)}/${pad2(birthday.d)}` : ''
})

// 身分選單選「其他」時，另外填寫的說明文字，送出時會取代 identity 的值
const identityOther = ref('')
const identityDropdownOpen = ref(false)
const identitySelectEl = ref(null)

const identityOptions = [
	{ value: '大學在學學生', desc: '大三(含)以上及碩博士生者' },
	{ value: '社會新鮮人', desc: '已畢業，0-2年內工作經驗者' },
	{ value: '職場工作者', desc: '已畢業，2年以上工作經驗者' },
	{ value: '其他', desc: '' }
]

const sourceOptions = ['網路廣告', '基金會社群', '廣播', '新聞', '師長親友', '學校公告', '校園說明會', '線上說明會']

const focusIdentityBtn = () => identitySelectEl.value?.querySelector('#f-identity')?.focus()

const selectIdentity = (option) => {
	form.value.identity = option.value
	identityDropdownOpen.value = false
	focusIdentityBtn()
}

const handleOutsideClick = (event) => {
	if (identitySelectEl.value && !identitySelectEl.value.contains(event.target)) identityDropdownOpen.value = false
}

// 鍵盤操作：上下鍵選擇、Esc 關閉
const onIdentityKeydown = (e) => {
	if (e.key === 'Escape') {
		identityDropdownOpen.value = false
		focusIdentityBtn()
		return
	}
	if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
	e.preventDefault()
	const focusOption = (i) => identitySelectEl.value?.querySelectorAll('.option')[i]?.focus()
	if (!identityDropdownOpen.value) {
		identityDropdownOpen.value = true
		nextTick(() => focusOption(0))
		return
	}
	const opts = [...identitySelectEl.value.querySelectorAll('.option')]
	const cur = opts.indexOf(document.activeElement)
	focusOption(e.key === 'ArrowDown' ? Math.min(opts.length - 1, cur + 1) : Math.max(0, cur - 1))
}

// 驗證：錯誤訊息顯示在各欄位下方，依畫面順序檢查
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const FIELD_ORDER = ['name', 'birthday', 'email', 'identity', 'identityOther', 'school', 'sources', 'agree']
const FIELD_IDS = { name: 'f-name', birthday: 'f-by', email: 'f-email', identity: 'f-identity', identityOther: 'f-other', school: 'f-school', sources: 'f-src-0', agree: 'f-agree' }
const errors = reactive({})

const validateField = (key) => {
	const f = form.value
	switch (key) {
		case 'name':
			return f.name.trim() ? '' : '請填寫姓名'
		case 'birthday':
			return f.birthday ? '' : '請填寫生日'
		case 'email':
			if (!f.email.trim()) return '請填寫 Email'
			return EMAIL_RE.test(f.email.trim()) ? '' : '請確認 Email 格式是否正確'
		case 'identity':
			return f.identity ? '' : '請選擇目前身分'
		case 'identityOther':
			return f.identity === '其他' && !identityOther.value.trim() ? '請填寫您的身分說明' : ''
		case 'school':
			return f.school.trim() ? '' : '請填寫目前就學（或畢業）學校'
		case 'sources':
			return f.sources.length ? '' : '請選擇您是如何得知 NXT Fresh人才培育計畫？'
		case 'agree':
			return f.agree ? '' : '請勾選同意蒐集個人資料'
		default:
			return ''
	}
}

// 修正後即時拿掉錯誤
watch(
	[form, identityOther],
	() => {
		Object.keys(errors).forEach((k) => {
			if (!validateField(k)) delete errors[k]
		})
	},
	{ deep: true }
)

const checkEmailOnBlur = () => {
	if (!form.value.email.trim()) return
	const msg = validateField('email')
	if (msg) errors.email = msg
}

const ariaFor = (key) => (errors[key] ? { 'aria-invalid': 'true', 'aria-describedby': `e-${key}` } : {})

// 捲到第一個錯誤欄位並聚焦
const focusField = (key) => {
	const el = document.getElementById(FIELD_IDS[key])
	if (!el) return
	const target = ((key === 'sources' || key === 'agree') && el.closest('.group, .consent-wrap')) || el
	target.scrollIntoView({ block: 'center', behavior: reducedMotion ? 'auto' : 'smooth' })
	el.focus({ preventScroll: true })
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
	Object.assign(birthday, { y: '', m: '', d: '' })
	identityOther.value = ''
	Object.keys(errors).forEach((k) => delete errors[k])
}

// 依 UTF-8 位元組數截斷字串，避免切到多位元組字元中間（English/數字 1 byte，全形字元 2~3 bytes）
const truncateByBytes = (str, maxBytes) => {
	const encoder = new TextEncoder()
	let bytes = 0
	let result = ''
	for (const char of str) {
		bytes += encoder.encode(char).length
		if (bytes > maxBytes) break
		result += char
	}
	return result
}

const submitApply = async () => {
	if (holdBtn.value) return

	const failed = FIELD_ORDER.map((k) => [k, validateField(k)]).filter(([, msg]) => msg)
	if (failed.length) {
		Object.keys(errors).forEach((k) => delete errors[k])
		failed.forEach(([k, msg]) => (errors[k] = msg))
		await nextTick()
		focusField(failed[0][0])
		return
	}

	holdBtn.value = true
	// 資料送出 送line tag（送不出去也不影響後續申請流程）
	try {
		window._lt('send', 'cv', { type: 'InitiateCheckOut' }, [LINE_TAG_ID])
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

		fromData.sources = form.value.sources.join(',')

		const payload = {
			name: fromData.name,
			birthday: fromData.birthday,
			job: fromData.identity,
			school: fromData.school,
			email: fromData.email,
			how: fromData.sources
		}

		// 實際送給後端的資料
		console.log('[申請表單] 送出資料：', payload)
		console.table(payload)

		const res = await axios.post(config.api.applyForm, payload)
		console.log('[申請表單] 後端回應：', res.data)

		if (res.data.status == '200') {
			try {
				window._lt(
					'send',
					'cv',
					{
						type: 'Purchase',
						value: 1,
						currency: 'TWD'
					},
					[LINE_TAG_ID]
				)
			} catch (error) {
				console.error('LINE Tag 送出失敗:', error)
			}
			try {
				window.freecoins_cvq = [
					{
						app: 'FREECOINS_51808',
						domain: '.saylingwen.org',
						cv: [
							{
								action: 'REGISTRATION',
								order: truncateByBytes(payload.email.split('@')[0], 128),
								item: 'submit',
								t_price: '1',
								quantity: '1',
								memo: payload.name
							}
						]
					}
				]
				const freecoinsScript = document.createElement('script')
				freecoinsScript.src = 'https://point-ads.line-apps.com/lfc5.js'
				freecoinsScript.async = true
				freecoinsScript.nonce = 'NXTFresh'
				document.head.appendChild(freecoinsScript)
			} catch (error) {
				console.error('LINE Point Ads CV Tag 送出失敗:', error)
			}

			showAlert('申請成功<br>感謝您的申請，並請留意信件！', resetForm)
		} else {
			showAlert(res.data.message || '送出失敗，請稍後再試', resetForm)
		}
	} catch (error) {
		console.error('送出申請失敗:', error)
		showAlert('送出失敗，請稍後再試', resetForm)
	} finally {
		holdBtn.value = false
	}
}

// ====================================
// 前往測驗浮動按鈕
// ====================================
const quizFloatEl = ref(null)
const goQuiz = () => {
	window.location.href = quizUrl
}
const onQuizFloatKeydown = (e) => {
	if (e.key === 'Enter' || e.key === ' ') {
		e.preventDefault()
		goQuiz()
	}
}

// ====================================
// 動畫（GSAP）
// ====================================
const headerEl = ref(null)
const headerCompact = ref(false)
const headerHidden = ref(false)
const kvEl = ref(null)
const introEl = ref(null)
const aboutEl = ref(null)
const applyEl = ref(null)

// 導覽列：捲動超過 60px 縮小；離開主視覺後往下捲隱藏、往上捲出現
const initHeader = () => {
	let last = window.scrollY
	ScrollTrigger.create({
		start: 0,
		end: 'max',
		onUpdate: (self) => {
			const y = self.scroll()
			headerCompact.value = y > 60
			const pastKv = y > (kvEl.value ? kvEl.value.offsetHeight * 0.75 : 600)
			const delta = y - last
			if (Math.abs(delta) < 6) return
			last = y
			const focusedInside = headerEl.value && headerEl.value.contains(document.activeElement)
			headerHidden.value = pastKv && delta > 0 && !focusedInside
		}
	})
}

// 主視覺：進場、漂浮、掃光、捲動視差、滑鼠視差
const initHero = (cleanups) => {
	const q = gsap.utils.selector(kvEl.value)
	const vw = window.innerWidth
	const isMobile = vw < 1024
	const unit = isMobile ? (Math.min(vw, 560) / 428) * 0.75 : (q('.stage')[0].offsetHeight / 1080) * 1.25 // 位移量依畫面尺寸等比

	const intro = gsap.timeline({ defaults: { ease: 'power3.out' } })
	intro
		.from(q('.kv-canvas'), { autoAlpha: 0, duration: 1.2 }, 0)
		.from(q('.l-person .pop'), { autoAlpha: 0, y: 70 * unit, duration: 1.1 }, 0)
		.from(q('.l-title .pop'), { autoAlpha: 0, x: -60 * unit, skewX: -6, duration: 0.9 }, 0.15)
		.from(q('.kv-sub'), { autoAlpha: 0, y: 16 * unit, duration: 0.6 }, 0.45)
		.from(q('.l-cta .pop'), { autoAlpha: 0, y: 26 * unit, duration: 0.7 }, 0.6)
		.from(q('.l-ai .pop, .l-hire .pop'), { autoAlpha: 0, scale: 0.35, transformOrigin: '14% 96%', ease: 'back.out(1.8)', duration: 0.75, stagger: 0.15 }, 0.55)
		.from(q('.l-career .pop, .l-practice .pop'), { autoAlpha: 0, y: 26 * unit, filter: 'blur(10px)', duration: 0.8, stagger: 0.12, clearProps: 'filter' }, 1)
	if (q('.l-badge .pop').length) {
		intro
			.from(q('.badge-top'), { autoAlpha: 0, y: 14 * unit, duration: 0.45, ease: 'back.out(2)' }, 1.25)
			.from(q('.badge-main'), { autoAlpha: 0, x: -24 * unit, duration: 0.55, ease: 'power3.out' }, 1.15)
	}

	q('.float').forEach((el, i) => {
		gsap.to(el, {
			y: Number(el.dataset.amp || 10) * unit,
			rotation: i % 2 ? 0.7 : -0.7,
			duration: 2.4 + (i % 4) * 0.45,
			ease: 'sine.inOut',
			yoyo: true,
			repeat: -1,
			delay: (i % 5) * 0.3
		})
	})

	gsap.fromTo(q('.face .hl'), { '--sx': '130%' }, { '--sx': '-30%', duration: 1.4, ease: 'power2.inOut', stagger: 0.18, repeat: -1, repeatDelay: 4.5, delay: 2.2 })
	gsap.fromTo(q('.badge-main'), { '--sx': '130%' }, { '--sx': '-30%', duration: 1.2, ease: 'power2.inOut', repeat: -1, repeatDelay: 3.8, delay: 2.6 })

	const kvH = () => kvEl.value.offsetHeight
	const factor = isMobile ? 0.6 : 1
	const scrollDepth = { person: 0.14, title: 0.24, cta: 0.18, badge: 0.3, career: -0.2, practice: -0.28, ai: -0.14, hire: -0.1 }
	const scroll = gsap.timeline({
		defaults: { ease: 'none', duration: 1 },
		scrollTrigger: { trigger: kvEl.value, start: 'top top', end: 'bottom top', scrub: 0.5, invalidateOnRefresh: true }
	})
	scroll.to(q('.kv-canvas'), { y: () => kvH() * 0.3 * factor }, 0)
	Object.entries(scrollDepth).forEach(([key, d]) => {
		const els = q(`.l-${key} .drift`)
		if (els.length) scroll.to(els, { y: () => kvH() * d * factor }, 0)
	})
	scroll
		.to(q('.l-title .drift, .l-badge .drift'), { autoAlpha: 0, duration: 0.7 }, 0.1)
		.to(q('.is-bubble .drift'), { scale: 1.08 }, 0)
		.to(q('.l-cta .drift'), { autoAlpha: 0, duration: 0.5 }, 0.45)

	gsap.to(q('.cta-hand'), { x: -4 * unit, y: -8 * unit, duration: 0.55, ease: 'sine.inOut', yoyo: true, repeat: -1 })

	if (!canHover()) return
	const layers = q('.layer').map((el) => {
		const d = Number(el.dataset.depth || 0.3)
		const isBubble = el.classList.contains('is-bubble')
		if (isBubble) gsap.set(el, { transformPerspective: 900 })
		const to = (prop) => gsap.quickTo(el, prop, { duration: 1, ease: 'power3' })
		return { d, isBubble, x: to('x'), y: to('y'), rx: isBubble ? to('rotationX') : null, ry: isBubble ? to('rotationY') : null }
	})
	const range = 40 * unit
	const onMove = (e) => {
		const rect = kvEl.value.getBoundingClientRect()
		const fx = (e.clientX - rect.left) / rect.width
		const fy = (e.clientY - rect.top) / rect.height
		kvPointer.x = fx
		kvPointer.y = 1 - fy
		kvPointer.active = true
		const nx = fx * 2 - 1
		const ny = fy * 2 - 1
		layers.forEach((l) => {
			l.x(-nx * l.d * range)
			l.y(-ny * l.d * range * 0.6)
			if (l.isBubble) {
				l.rx(ny * 8 * l.d)
				l.ry(-nx * 10 * l.d)
			}
		})
	}
	const onLeave = () => {
		kvPointer.active = false
		layers.forEach((l) => {
			l.x(0)
			l.y(0)
			if (l.isBubble) {
				l.rx(0)
				l.ry(0)
			}
		})
	}
	const onBubbleEnter = (e) => gsap.to(e.currentTarget, { scale: 1.06, duration: 0.45, ease: 'back.out(2)', overwrite: 'auto' })
	const onBubbleLeave = (e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.5, ease: 'power2.out', overwrite: 'auto' })
	listen(cleanups, kvEl.value, 'pointermove', onMove)
	listen(cleanups, kvEl.value, 'pointerleave', onLeave)
	q('.is-bubble .bubble').forEach((b) => {
		listen(cleanups, b, 'mouseenter', onBubbleEnter)
		listen(cleanups, b, 'mouseleave', onBubbleLeave)
	})
}

// 背景光球：捲動視差 + 區塊可見時漂浮
const initDecor = () => {
	const isMobile = window.innerWidth < 768
	const travel = isMobile ? 60 : 150
	document.querySelectorAll('.decor').forEach((decor) => {
		const section = decor.parentElement
		const tl = gsap.timeline({ scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 0.6, invalidateOnRefresh: true } })
		decor.querySelectorAll('.d-item').forEach((el) => {
			const d = Number(el.dataset.depth)
			tl.fromTo(el, { y: () => -d * travel }, { y: () => d * travel, ease: 'none', duration: 1 }, 0)
		})
		const floats = [...decor.querySelectorAll('.d-float')].map((el, i) =>
			gsap.to(el, {
				y: (i % 2 ? -1 : 1) * (isMobile ? 8 : 14),
				rotation: (i % 2 ? 1 : -1) * 3,
				duration: 3.2 + (i % 3) * 0.8,
				ease: 'sine.inOut',
				yoyo: true,
				repeat: -1,
				delay: (i % 4) * 0.4,
				paused: true
			})
		)
		ScrollTrigger.create({
			trigger: section,
			start: 'top bottom',
			end: 'bottom top',
			onToggle: (self) => floats.forEach((t) => (self.isActive ? t.play() : t.pause()))
		})
	})
}

// 逐字進場（標題 .ch）
const charsFrom = (targets, vars = {}) => ({
	autoAlpha: 0,
	yPercent: 70,
	scale: 0.4,
	rotation: () => gsap.utils.random(-18, 18),
	duration: 0.6,
	stagger: 0.03,
	ease: 'back.out(2.4)',
	...vars
})

// 計畫簡介
const initIntro = () => {
	const q = gsap.utils.selector(introEl.value)
	const isMobile = window.innerWidth < 1024
	// 面板從主視覺底下往上推
	gsap.fromTo(
		q('.panel, .panel-shadow'),
		{ y: isMobile ? 50 : 110 },
		{ y: 0, ease: 'none', scrollTrigger: { trigger: introEl.value, start: 'top bottom', end: 'top 30%', scrub: 0.6 } }
	)
	gsap.timeline({ scrollTrigger: { trigger: q('.panel')[0], start: 'top 80%', once: true } })
		.from(q('.intro-title .ch'), charsFrom())
		.from(q('.intro-tagline'), { autoAlpha: 0, y: 14, duration: 0.5, ease: 'power3.out' }, '-=0.35')
		.fromTo(q('.intro-tagline'), { backgroundSize: '0% 100%' }, { backgroundSize: '100% 100%', duration: 0.7, ease: 'power2.inOut' }, '-=0.15')
		.fromTo(q('.intro-grid'), { '--dash': 0 }, { '--dash': 1, duration: 0.8, ease: 'power2.out' }, '<')
		.from(q('.chip'), { autoAlpha: 0, scale: 0.4, y: 20, duration: 0.6, stagger: 0.14, ease: 'back.out(2.2)' }, '-=0.5')
		.from(q('.times'), { autoAlpha: 0, rotation: -180, scale: 0.3, duration: 0.45, stagger: 0.14, ease: 'back.out(2)' }, '<0.1')
		.from(q('.alliance-suffix'), { autoAlpha: 0, scale: 1.6, duration: 0.55, ease: 'back.out(1.6)' }, '-=0.15')
		.from(q('.pitch'), { autoAlpha: 0, y: 16, duration: 0.6, ease: 'power3.out' }, '-=0.25')
		.from(q('.benefits-title'), { autoAlpha: 0, y: 16, duration: 0.5 }, 0.5)
		.from(q('.benefit'), { autoAlpha: 0, x: 48, duration: 0.6, stagger: 0.12, ease: 'power3.out' }, 0.6)
		.from(q('.diamond'), { scale: 0, rotation: -135, duration: 0.55, stagger: 0.12, ease: 'back.out(2.2)' }, 0.75)
		.from(q('.tick'), { strokeDashoffset: 1, duration: 0.35, stagger: 0.12, ease: 'power2.out' }, 1.05)
		.from(q('.intro-btn'), { opacity: 0, y: 18, duration: 0.5, ease: 'power3.out', clearProps: 'transform' }, 1.2)
}

// 學長姐心得：拖曳輪播、翻面、自動播放（減少動態時保留功能、拿掉過場）
let carouselDraggable
let carouselResizeTimer
const initTestimonials = (cleanups) => {
	const dur = (d) => (reducedMotion ? 0 : d)
	const count = testimonials.length
	const cards = gsap.utils.toArray('.t-card', tStage.value)
	const tilts = cards.map((c) => c.querySelector('.t-tilt'))
	const inners = cards.map((c) => c.querySelector('.t-inner'))
	const veils = cards.map((c) => c.querySelector('.t-veil'))
	const proxy = document.createElement('div') // Draggable 拖曳的虛擬目標，x 換算成目前位置
	const wrapOffset = gsap.utils.wrap(-count / 2, count / 2)
	const mod = (n, m) => ((n % m) + m) % m
	let spacing = 300

	const measure = () => {
		const w = tStage.value.offsetWidth
		const cardW = w < 640 ? Math.min(320, w * 0.78) : Math.min(400, Math.max(320, w * 0.24))
		spacing = w < 640 ? cardW * 0.86 : cardW * 0.76
		tStage.value.style.setProperty('--w', `${cardW}px`)
		tStage.value.style.setProperty('--s', (cardW / 360).toFixed(3))
	}

	const isFlipped = (i) => gsap.getProperty(inners[i], 'rotationY') > 90

	// 依 proxy 位置排列卡片（扇形、縮放、層級）
	const layout = () => {
		const pos = -gsap.getProperty(proxy, 'x') / spacing
		cards.forEach((card, i) => {
			const off = wrapOffset(i - pos)
			const dist = Math.abs(off)
			gsap.set(card, {
				x: off * spacing,
				y: Math.pow(dist, 1.2) * 28,
				scale: 1 - Math.min(dist, 1) * 0.22 - Math.max(0, Math.min(dist, 2) - 1) * 0.1,
				rotation: off * 3.2,
				zIndex: 100 - Math.round(dist * 10),
				autoAlpha: dist >= 1.8 ? 0 : Math.min(1, (1.8 - dist) / 0.5)
			})
			veils[i].style.opacity = (Math.min(dist, 1) * 0.62).toFixed(3)
			card.setAttribute('aria-hidden', dist > 0.5 ? 'true' : 'false')
			card.classList.toggle('is-main', dist < 0.5)
		})
		const idx = mod(Math.round(pos), count)
		if (idx !== activeCard.value) {
			const prev = activeCard.value
			if (isFlipped(prev)) gsap.to(inners[prev], { rotationY: 0, duration: dur(0.5), ease: 'power2.inOut' })
			gsap.to(tilts[prev], { rotationX: 0, rotationY: 0, duration: dur(0.4) })
			activeCard.value = idx
			cardFlipped.value = false
		}
	}

	const flip = () => {
		const f = isFlipped(activeCard.value)
		gsap.to(inners[activeCard.value], { rotationY: f ? 0 : 180, duration: dur(0.75), ease: 'power3.inOut' })
		cardFlipped.value = !f
	}
	const slideTo = (slot) => gsap.to(proxy, { x: -slot * spacing, duration: dur(0.8), ease: 'power3.inOut', onUpdate: layout, overwrite: true })
	const currentSlot = () => Math.round(-gsap.getProperty(proxy, 'x') / spacing)
	const stepBy = (n) => slideTo(currentSlot() + n)
	const goToIndex = (i) => {
		let diff = mod(i - activeCard.value, count)
		if (diff > count / 2) diff -= count
		slideTo(currentSlot() + diff)
	}

	carousel = {
		flip,
		step: (n) => {
			stepBy(n)
			restartAutoplay()
		},
		goTo: (i) => {
			goToIndex(i)
			restartAutoplay()
		}
	}

	measure()
	layout()

	carouselDraggable = Draggable.create(proxy, {
		type: 'x',
		trigger: tStage.value,
		inertia: !reducedMotion,
		zIndexBoost: false,
		snap: { x: (v) => Math.round(v / spacing) * spacing },
		onPress() {
			gsap.killTweensOf(proxy)
			setPause('drag', true)
		},
		onDrag: layout,
		onThrowUpdate: layout,
		onRelease() {
			if (reducedMotion) slideTo(Math.round(-this.x / spacing))
			setPause('drag', false)
			restartAutoplay()
		},
		// 點中間卡片翻面，點旁邊卡片切過去
		onClick(e) {
			const card = e.target.closest('.t-card')
			if (!card) return
			const i = cards.indexOf(card)
			i === activeCard.value ? flip() : goToIndex(i)
		}
	})[0]

	// 滑鼠在主卡片上時 3D 傾斜
	const insideMain = (e) => {
		const r = cards[activeCard.value].getBoundingClientRect()
		return e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom
	}
	if (!reducedMotion && canHover()) {
		listen(cleanups, tStage.value, 'pointermove', (e) => {
			if (carouselDraggable.isPressed) return
			const r = cards[activeCard.value].getBoundingClientRect()
			const inside = insideMain(e)
			const nx = inside ? (e.clientX - r.left) / r.width - 0.5 : 0
			const ny = inside ? (e.clientY - r.top) / r.height - 0.5 : 0
			gsap.to(tilts[activeCard.value], { rotationY: nx * 10, rotationX: -ny * 8, duration: 0.5, ease: 'power2.out', overwrite: 'auto' })
		})
		listen(cleanups, tStage.value, 'pointerleave', () => gsap.to(tilts[activeCard.value], { rotationX: 0, rotationY: 0, duration: 0.6 }))
	}

	if (autoplayOn.value) {
		const prog = { v: 0 }
		const paint = () => tDots.value && tDots.value.style.setProperty('--prog', prog.v.toFixed(3))
		autoTween = gsap.to(prog, { v: 1, duration: AUTOPLAY_SECONDS, ease: 'none', repeat: -1, paused: true, onUpdate: paint, onRepeat: () => stepBy(1) })
		paint()
		ScrollTrigger.create({ trigger: tStage.value, start: 'top 85%', end: 'bottom 15%', onToggle: (self) => setPause('offscreen', !self.isActive) })
		if (canHover()) {
			listen(cleanups, tStage.value, 'pointermove', (e) => {
				if (e.pointerType === 'mouse') setPause('hover', insideMain(e))
			})
			listen(cleanups, tStage.value, 'pointerleave', () => setPause('hover', false))
		}
		listen(cleanups, tRoot.value, 'focusin', (e) => {
			let visible = true
			try {
				visible = e.target.matches(':focus-visible')
			} catch {}
			visible && setPause('focus', true)
		})
		listen(cleanups, tRoot.value, 'focusout', (e) => {
			if (!tRoot.value.contains(e.relatedTarget)) setPause('focus', false)
		})
	}

	if (!reducedMotion) {
		// 標題：數字跳動 + 逐字進場
		const num = tRoot.value.querySelector('.num')
		const counter = { v: 0 }
		gsap.timeline({ scrollTrigger: { trigger: tRoot.value.querySelector('.t-head'), start: 'top 85%', once: true } })
			.from(num, { autoAlpha: 0, scale: 0.3, rotation: -12, duration: 0.7, ease: 'back.out(2.2)' })
			.to(counter, { v: testimonialPercent, duration: 1.4, ease: 'power2.out', onUpdate: () => (num.textContent = Math.round(counter.v)) }, 0)
			.from(gsap.utils.toArray('.t-head .ch', tRoot.value), charsFrom(), 0.15)
			.from(tRoot.value.querySelector('.t-tip'), { autoAlpha: 0, y: 12, duration: 0.5, ease: 'power3.out' }, '-=0.3')

		gsap.from(gsap.utils.toArray('.t-ctrl > :not(.sr-only)', tRoot.value), {
			opacity: 0,
			y: 20,
			duration: 0.6,
			stagger: 0.08,
			ease: 'back.out(1.8)',
			clearProps: 'transform',
			scrollTrigger: { trigger: tRoot.value.querySelector('.t-ctrl'), start: 'top 92%', once: true }
		})

		// 進場時輕推一下，提示可以左右滑
		gsap.timeline({ scrollTrigger: { trigger: tStage.value, start: 'top 70%', once: true }, delay: 0.3 })
			.to(proxy, { x: -spacing * 0.22, duration: 0.5, ease: 'power2.out', onUpdate: layout })
			.to(proxy, { x: 0, duration: 0.9, ease: 'elastic.out(1, .5)', onUpdate: layout })
	}

	listen(cleanups, window, 'resize', () => {
		clearTimeout(carouselResizeTimer)
		carouselResizeTimer = setTimeout(() => {
			const slot = currentSlot()
			measure()
			gsap.set(proxy, { x: -slot * spacing })
			layout()
		}, 120)
	})
}

// 適合對象／申請資格／申請時間
const initAbout = () => {
	const q = gsap.utils.selector(aboutEl.value)
	gsap.timeline({ scrollTrigger: { trigger: aboutEl.value, start: 'top 75%', once: true } })
		.from(q('.about-icon'), { autoAlpha: 0, y: 40, scale: 0.4, rotationY: -160, duration: 0.9, stagger: 0.15, ease: 'back.out(1.7)' })
		.from(q('.about-icon svg'), { rotation: -25, scale: 0.6, duration: 0.7, stagger: 0.15, ease: 'elastic.out(1.2, .4)' }, 0.45)
		.from(q('.about-title'), { autoAlpha: 0, y: 18, duration: 0.6, stagger: 0.15, ease: 'power3.out' }, 0.35)
		.fromTo(q('.about-title'), { '--ul': 0 }, { '--ul': 1, duration: 0.5, stagger: 0.15, ease: 'power2.out' }, 0.7)
		.from(q('.about-desc'), { autoAlpha: 0, y: 14, duration: 0.6, stagger: 0.15, ease: 'power3.out' }, 0.6)
	const floats = q('.about-float').map((el, i) =>
		gsap.to(el, { y: -8, duration: 1.8 + i * 0.25, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.4 + i * 0.3, paused: true })
	)
	ScrollTrigger.create({
		trigger: aboutEl.value,
		start: 'top bottom',
		end: 'bottom top',
		onToggle: (self) => floats.forEach((t) => (self.isActive ? t.play() : t.pause()))
	})
}

// 立即申請：標題逐字、表單區塊依序進場（桌機左右兩欄從兩側滑入）
const initApply = () => {
	const q = gsap.utils.selector(applyEl.value)
	const isMobile = window.innerWidth < 768
	gsap.from(q('.apply-head .ch'), charsFrom(null, { stagger: 0.05, scrollTrigger: { trigger: q('.apply-head')[0], start: 'top 85%', once: true } }))

	const blocks = q(
		'.apply-form > .notes-top, .apply-form .grid > *, .apply-form > .group, .apply-form > .consent-wrap, .apply-form > .notes, .apply-form > .submit-row, .notice'
	)
	blocks.forEach((el) => {
		const inGrid = el.parentElement.classList.contains('grid')
		const x = inGrid && !isMobile ? (el === el.parentElement.firstElementChild ? -60 : 60) : 0
		gsap.set(el, { opacity: 0, x, y: inGrid && !isMobile ? 0 : 44 })
	})
	ScrollTrigger.batch(blocks, {
		start: 'top 90%',
		once: true,
		onEnter: (els) => gsap.to(els, { opacity: 1, x: 0, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out', clearProps: 'transform,opacity' })
	})

	const checks = q('.sources .check')
	if (checks.length) {
		gsap.from(checks, {
			opacity: 0,
			y: 14,
			scale: 0.85,
			duration: 0.45,
			stagger: 0.05,
			ease: 'back.out(2)',
			clearProps: 'transform',
			scrollTrigger: { trigger: q('.sources')[0], start: 'top 85%', once: true }
		})
	}
}

// 前往測驗浮動按鈕：手機捲過主視覺 70% 才出現；可拖曳，移動小於 8px 視為點擊
let quizFloatDraggable
const initQuizFloat = () => {
	const el = quizFloatEl.value
	if (window.matchMedia('(max-width: 899px)').matches) {
		gsap.set(el, { autoAlpha: 0, scale: 0.6 })
		ScrollTrigger.create({
			start: () => window.innerHeight * 0.7,
			end: 'max',
			onEnter: () => gsap.to(el, { autoAlpha: 1, scale: 1, duration: reducedMotion ? 0 : 0.5, ease: 'back.out(2)' }),
			onLeaveBack: () => gsap.to(el, { autoAlpha: 0, scale: 0.6, duration: reducedMotion ? 0 : 0.3 })
		})
	} else if (!reducedMotion) {
		gsap.from(el, { autoAlpha: 0, scale: 0.4, duration: 0.8, ease: 'back.out(2)', delay: 1.6 })
	}
	if (!reducedMotion) gsap.to(el.querySelector('.qf-inner'), { y: -8, rotation: 2, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1 })
	quizFloatDraggable = Draggable.create(el, { type: 'x,y', bounds: window, zIndexBoost: false, minimumMovement: 8, onClick: goQuiz })[0]
}

// .btn-sun 按鈕捲動進畫面時掃過一道光
const initButtonSheen = () => {
	const sheen = (el) => {
		el.classList.remove('is-sheen')
		void el.offsetWidth // 強制 reflow，讓動畫可以重播
		el.classList.add('is-sheen')
		el.addEventListener('animationend', () => el.classList.remove('is-sheen'), { once: true })
	}
	ScrollTrigger.batch('.btn-sun', {
		start: 'top 88%',
		once: true,
		interval: 0.15,
		onEnter: (els) => els.forEach((el, i) => setTimeout(() => sheen(el), 450 + i * 160))
	})
}

const listen = (cleanups, el, type, fn) => {
	el.addEventListener(type, fn)
	cleanups.push(() => el.removeEventListener(type, fn))
}

// ===== 生命週期 =====
let gsapCtx
let bubbleObserver
const cleanups = []

onMounted(() => {
	document.addEventListener('click', handleOutsideClick)

	// 泡泡尺寸隨容器縮放
	measureBubbles()
	bubbleObserver = new ResizeObserver(measureBubbles)
	Object.values(bubbleRoots).forEach((el) => el && bubbleObserver.observe(el))
	document.fonts?.ready?.then(() => nextTick(() => bubbles.forEach(({ id }) => fitBubbleText(id))))

	initKvBackground()
	autoplayOn.value = !reducedMotion

	gsapCtx = gsap.context(() => {
		if (!reducedMotion) {
			initHeader()
			initHero(cleanups)
			initDecor()
			initIntro()
			initAbout()
			initApply()
			initButtonSheen()
		}
		initTestimonials(cleanups)
		initQuizFloat()
	})

	// 廣告網址帶 #apply 時直接捲到申請區
	if (window.location.hash === '#apply') requestAnimationFrame(scrollToApply)

	// 字型、圖片載入後版面高度會變，重新計算捲動觸發點
	document.fonts?.ready?.then(() => ScrollTrigger.refresh())
	window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true })
})

onBeforeUnmount(() => {
	document.removeEventListener('click', handleOutsideClick)
	bubbleObserver && bubbleObserver.disconnect()
	kvStopBackground()
	clearTimeout(carouselResizeTimer)
	cleanups.forEach((fn) => fn())
	carouselDraggable && carouselDraggable.kill()
	quizFloatDraggable && quizFloatDraggable.kill()
	gsapCtx && gsapCtx.revert()
})
</script>

<!-- 全站共用樣式：色票變數、基本設定、按鈕 -->
<style>
:root {
	--sun: #f6ab00;
	--sun-light: #ffc23a;
	--sun-deep: #e27a00;
	--orange-text: #a35200;
	--ink: #231f1a;
	--ink-soft: #5e554a;
	--cream: #fff6e2;
	--cream-deep: #ffebc0;
	--kv-base: #f4ae28;
	--kv-overlap: 140px;
	--card-top: #ffffff;
	--card-bot: #fff4da;
	--line: rgba(226, 122, 0, 0.16);
	--shadow-warm: 0 22px 44px -18px rgba(205, 120, 0, 0.45);
	--f-tc: "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif;
	--f-num: "Roboto", "Noto Sans TC", Arial, sans-serif;
	--header-h: max(56px, calc(min(100vw, 1920px) / 1920 * 86));
	--gutter-l: max(16px, env(safe-area-inset-left, 0px));
	--gutter-r: max(16px, env(safe-area-inset-right, 0px));
	color-scheme: light;
}
*,
*:before,
*:after {
	box-sizing: border-box;
}
html {
	scroll-padding-top: var(--header-h);
	-webkit-text-size-adjust: 100%;
}
body {
	margin: 0;
	background: var(--cream);
	color: var(--ink);
	font: 400 16px/1.7 var(--f-tc);
	-webkit-font-smoothing: antialiased;
	overflow-x: hidden;
}
img {
	max-width: 100%;
	display: block;
}
button,
input,
select,
textarea {
	font: inherit;
	color: inherit;
}
h1,
h2,
h3,
h4,
p,
ul,
ol {
	margin: 0;
}
ul,
ol {
	padding: 0;
}
a {
	color: inherit;
}
:focus-visible {
	outline: 3px solid var(--sun-deep);
	outline-offset: 3px;
	border-radius: 10px;
}
.sr-only {
	position: absolute !important;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border: 0;
}
.wrap {
	max-width: 1200px;
	margin-inline: auto;
	padding-left: var(--gutter-l);
	padding-right: var(--gutter-r);
}
.grad-title {
	font: 900 italic clamp(24px, 3.2vw, 46px) / 1.3 var(--f-tc);
	letter-spacing: 0.02em;
	text-align: center;
	text-wrap: balance;
	background: linear-gradient(180deg, #ffb21a 10%, #e06f00 90%);
	-webkit-background-clip: text;
	background-clip: text;
	color: transparent;
	filter: drop-shadow(0 2px 0 rgba(255, 255, 255, 0.9));
	padding-inline: 0.1em;
}
.grad-title .num {
	font-family: var(--f-num);
	font-size: 1.25em;
	padding-right: 0.04em;
}
.sc-w {
	display: inline-block;
	white-space: nowrap;
}
.ch {
	display: inline-block;
	will-change: transform;
}
.grad-title.is-split {
	background: none;
}
.grad-title.is-split .cg,
.grad-title.is-split .num {
	display: inline-block;
	background: linear-gradient(180deg, #ffb21a 10%, #e06f00 90%);
	-webkit-background-clip: text;
	background-clip: text;
	color: transparent;
}
.grad-title.is-split .cg {
	padding: 0 0.26em 0 0.06em;
	margin: 0 -0.26em 0 -0.06em;
}
.grad-title.is-split .num {
	padding-right: 0.2em;
	margin-right: -0.16em;
}
.btn-sun {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 0.5em;
	min-height: 56px;
	padding: 0 2em;
	border: 0;
	border-radius: 999px;
	background: linear-gradient(180deg, #ffc131, #f29200);
	color: #fff;
	font-weight: 700;
	font-size: 18px;
	letter-spacing: 0.06em;
	text-decoration: none;
	white-space: nowrap;
	cursor: pointer;
	position: relative;
	overflow: hidden;
	isolation: isolate;
	box-shadow:
		0 14px 26px -12px #cd7800e6,
		inset 0 2px #ffffff59;
	transition:
		transform 0.25s cubic-bezier(0.16, 1, 0.3, 1),
		box-shadow 0.25s;
}
.btn-sun:hover {
	transform: translateY(-3px);
	box-shadow:
		0 20px 32px -12px #cd7800f2,
		inset 0 2px #ffffff59;
}
.btn-sun:active {
	transform: translateY(0) scale(0.98);
}
.btn-sun:after,
.sheen-host:after {
	content: "";
	position: absolute;
	z-index: 1;
	top: -20%;
	bottom: -20%;
	left: 0;
	width: 38%;
	background: linear-gradient(100deg, #fff0, #fff9, #fff0);
	transform: translate(-160%) skew(-18deg);
	pointer-events: none;
}
.btn-sun:hover:after,
.btn-sun.is-sheen:after,
.sheen-host:hover:after,
.sheen-host.is-sheen:after {
	animation: sheen 0.9s cubic-bezier(0.3, 0.6, 0.3, 1);
}
@keyframes sheen {
	0% {
		transform: translate(-160%) skew(-18deg);
	}
	to {
		transform: translate(380%) skew(-18deg);
	}
}
.btn-round {
	width: 52px;
	height: 52px;
	border-radius: 50%;
	border: 0;
	cursor: pointer;
	display: grid;
	place-items: center;
	background: linear-gradient(180deg, #fff, #fff3d3);
	color: var(--sun-deep);
	box-shadow:
		0 10px 22px -10px #cd7800b3,
		inset 0 -2px #e27a0026;
	transition: transform 0.15s;
}
.btn-round:active {
	transform: scale(0.94);
}
.icon-tile {
	display: grid;
	place-items: center;
	flex: none;
	border-radius: 28%;
	color: #fff;
	background: linear-gradient(150deg, #ffc74a, #f6a400 45%, #ee8e00);
	box-shadow:
		inset 0 0 0 2px #ffffff8c,
		inset 0 -4px 8px #be5a0040,
		0 8px 18px -8px #cd6e00cc;
}
@media (prefers-reduced-motion: reduce) {
	html {
		scroll-behavior: auto;
	}
	.btn-sun:after,
	.sheen-host:after {
		display: none;
	}
}
</style>

<style scoped>
/* ===== 導覽列 ===== */
.site-header {
	position: fixed;
	inset: 0 0 auto;
	z-index: 50;
	height: calc(var(--header-h) + env(safe-area-inset-top, 0px));
	padding-top: env(safe-area-inset-top, 0px);
	padding-left: max(20px, env(safe-area-inset-left, 0px), 1.25vw);
	padding-right: max(20px, env(safe-area-inset-right, 0px), 1.25vw);
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
	background: #fffffff5;
	box-shadow: 0 6px 24px -14px #a05a0073;
	-webkit-backdrop-filter: saturate(140%) blur(8px);
	backdrop-filter: saturate(140%) blur(8px);
	transition:
		transform 0.45s cubic-bezier(0.16, 1, 0.3, 1),
		height 0.35s cubic-bezier(0.16, 1, 0.3, 1),
		background-color 0.35s;
}
.site-header.is-compact {
	height: calc(var(--header-h) * 0.8 + env(safe-area-inset-top, 0px));
	background: #ffffffeb;
}
.site-header.is-hidden {
	transform: translateY(-110%);
}
.brand {
	display: block;
	height: 52%;
	min-width: 0;
}
.brand img {
	height: 100%;
	width: auto;
}
.cta {
	flex: none;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	height: 52%;
	min-height: 34px;
	padding: 0 1.4em;
	border-radius: 999px;
	text-decoration: none;
	white-space: nowrap;
	background: linear-gradient(180deg, #ffc131, #f29200);
	color: #fff;
	font-weight: 700;
	font-size: clamp(15px, 1vw, 18px);
	letter-spacing: 0.06em;
	box-shadow:
		0 8px 16px -8px #cd7800e6,
		inset 0 2px #ffffff59;
	position: relative;
	overflow: hidden;
	transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.cta:hover {
	transform: translateY(-1px);
}
@media (max-width: 767px) {
	.site-header {
		padding-right: 0;
	}
	.brand {
		height: 46%;
	}
	.cta {
		height: 100%;
		min-height: 0;
		border-radius: 0;
		padding: 0 18px;
		padding-right: max(18px, env(safe-area-inset-right, 0px));
		font-size: 16px;
		box-shadow: none;
	}
}

/* ===== 主視覺背景 ===== */
.kv-canvas {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: block;
}

/* ===== 主視覺問句泡泡 ===== */
.bubble {
	--k: calc(var(--u) * var(--bs, 1));
	position: relative;
	will-change: transform;
	-webkit-user-select: none;
	user-select: none;
}
.body {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 100%;
	pointer-events: none;
}
.icon {
	position: absolute;
	pointer-events: none;
}
.plane {
	position: absolute;
	left: 0;
	top: 0;
	transform-origin: 0 0;
	pointer-events: none;
}
.copy {
	position: absolute;
	isolation: isolate;
	font-weight: 900;
	font-feature-settings: "palt" 1;
	white-space: nowrap;
	transform: scaleX(0.99);
	transform-origin: 0 0;
}
.text {
	margin: 0;
}
.face {
	position: relative;
	z-index: 1;
}
.depth {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 0;
}
.line {
	display: block;
	height: 1lh;
}
.hl {
	letter-spacing: 0;
}
.face .nm {
	background: linear-gradient(180deg, #3a3530, #1c1814 45%, #0e0b08);
	-webkit-background-clip: text;
	background-clip: text;
	color: transparent;
}
.face .hl {
	--sx: 130%;
	background:
		linear-gradient(105deg, transparent 38%, rgba(255, 246, 220, 0.8) 50%, transparent 62%) var(--sx) 0 / 260% 100% no-repeat,
		linear-gradient(180deg, #f7a01a, #e57e06, #c85a00);
	-webkit-background-clip: text;
	background-clip: text;
	color: transparent;
}
.depth span {
	color: transparent;
}
.depth .nm {
	text-shadow:
		0.012em 0.03em 0 rgba(40, 28, 16, 0.28),
		0.03em 0.08em 0.12em rgba(140, 76, 0, 0.22);
}
.depth .hl {
	text-shadow:
		0.012em 0.03em 0 rgba(150, 70, 0, 0.45),
		0.03em 0.08em 0.12em rgba(160, 80, 0, 0.25);
}
@media (max-width: 1023px) {
	.copy {
		font-weight: 700;
	}
}
.label {
	position: relative;
	z-index: 1;
	display: flex;
	align-items: center;
	gap: 0.25em;
	margin: 0.3em 0 0;
	font-weight: 700;
	letter-spacing: 0.08em;
	white-space: nowrap;
	color: #676666;
	text-shadow: 0 0.05em 0 rgba(255, 255, 255, 0.7);
}
.label img {
	height: 1.2em;
	width: auto;
	display: block;
}

/* ===== 主視覺 ===== */
.kv {
	--uw: calc(min(100vw, 1920px) / 1920);
	--uh: calc(100vh / 1080);
	--uh: calc(100svh / 1080);
	--u: min(var(--uw), max(var(--uh), calc(var(--uw) * 0.7)));
	--vh: 100vh;
	--kh: calc(var(--u) * 1080);
	--kvh: clamp(var(--kh), var(--vh), calc(var(--kh) * 1.4));
	--ts: 0.902;
	--tu: calc(var(--u) * var(--ts));
	position: relative;
	height: calc(var(--kvh) + var(--kv-overlap));
	overflow: hidden;
	background: radial-gradient(60% 70% at 8% 6%, #fcdf9d, #fcdf9d00 70%), linear-gradient(115deg, #fcd37a, #fbc95a 35%, #f2aa1f 75%, #f4ae28);
}
@supports (height: 100svh) {
	.kv {
		--vh: 100svh;
	}
}
.stage {
	position: absolute;
	top: calc((var(--kvh) - var(--kh)) / 2);
	left: 50%;
	width: calc(var(--u) * 1920);
	height: var(--kh);
	transform: translate(-50%);
}
.layer {
	position: absolute;
	will-change: transform;
}
.l-person {
	left: calc(var(--u) * 493.3);
	top: calc(var(--u) * 232);
	width: calc(var(--u) * 850.8);
}
.l-person img {
	width: 100%;
	height: auto;
	--m1: calc((var(--kvh) + var(--kh)) / 2 - var(--u) * 232);
	-webkit-mask-image: linear-gradient(180deg, #000 var(--m1), transparent calc(var(--m1) + var(--kv-overlap) * 0.85));
	mask-image: linear-gradient(180deg, #000 var(--m1), transparent calc(var(--m1) + var(--kv-overlap) * 0.85));
}
.l-title {
	left: calc(var(--u) * 249.6);
	top: calc(var(--u) * 426.6);
	width: calc(var(--tu) * 528);
}
.kv-title {
	margin: 0;
	filter: drop-shadow(calc(var(--tu) * 1) calc(var(--tu) * 2) 0 rgba(226, 168, 92, 0.55))
		drop-shadow(0 calc(var(--tu) * 8) calc(var(--tu) * 10) rgba(200, 112, 0, 0.45));
}
.title-face {
	display: block;
	width: 100%;
	aspect-ratio: 233.2 / 111.7;
	background: linear-gradient(180deg, #fff, #fff 48%, #f2e8da);
	-webkit-mask-size: 100% 100%;
	mask-size: 100% 100%;
	-webkit-mask-repeat: no-repeat;
	mask-repeat: no-repeat;
}
.kv-sub {
	position: absolute;
	left: calc(var(--tu) * -4);
	top: calc(var(--tu) * 250);
	width: calc(var(--tu) * 503);
	height: calc(var(--tu) * 63);
	display: grid;
	place-items: center;
	margin: 0;
	border-radius: calc(var(--tu) * 10);
	background: linear-gradient(180deg, #fff, #fff 60%, #f4eee6);
	box-shadow:
		0 calc(var(--tu) * 3) 0 #ecdec8e6,
		0 calc(var(--tu) * 10) calc(var(--tu) * 18) #be640059;
	color: #eb8b0b;
	font: italic 900 calc(var(--tu) * 31) / 1 var(--f-num);
	letter-spacing: 0.02em;
	white-space: nowrap;
}
.l-cta {
	left: calc(var(--u) * 290.2);
	top: calc(var(--u) * 765.7);
	--cs: var(--ts);
}
.kv-cta {
	--c: calc(var(--u) * var(--cs, 1));
	position: relative;
	display: block;
	width: calc(var(--c) * 388);
	height: calc(var(--c) * 125);
	text-decoration: none;
	-webkit-tap-highlight-color: transparent;
	transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.kv-cta:hover {
	transform: scale(1.04);
}
.kv-cta:active {
	transform: scale(0.98);
}
.kv-cta:focus-visible {
	outline-offset: calc(var(--c) * -6);
	border-radius: 999px;
}
.cta-bar {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 100%;
}
.cta-label {
	position: absolute;
	left: calc(var(--c) * 40);
	top: calc(var(--c) * 53.5);
	transform: translateY(-50%);
	color: #e8890a;
	font-size: calc(var(--c) * 37);
	font-weight: 900;
	letter-spacing: 0.08em;
	white-space: nowrap;
}
.cta-arrow {
	position: absolute;
	left: calc(var(--c) * 295);
	top: calc(var(--c) * 19);
	width: calc(var(--c) * 68.5);
	height: auto;
}
.cta-hand {
	position: absolute;
	left: calc(var(--c) * 322);
	top: calc(var(--c) * 52);
	width: calc(var(--c) * 76);
	height: auto;
}
.l-career {
	left: calc(var(--u) * 1056);
	top: calc(var(--u) * 135);
}
.l-practice {
	left: calc(var(--u) * 1344);
	top: calc(var(--u) * 180);
}
.l-ai {
	left: calc(var(--u) * 1184);
	top: calc(var(--u) * 427);
	--bs: 0.7258;
}
.l-hire {
	left: calc(var(--u) * 1215);
	top: calc(var(--u) * 795);
}
.l-badge {
	left: calc(var(--u) * 248.7);
	top: calc(var(--u) * 340);
}
.badge {
	position: relative;
	margin: 0;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	white-space: nowrap;
}
.badge-top,
.badge-main {
	display: block;
}
.badge-top {
	position: relative;
	z-index: 1;
	margin-left: calc(var(--tu) * 14);
	padding: calc(var(--tu) * 4) calc(var(--tu) * 14) calc(var(--tu) * 3);
	border-radius: calc(var(--tu) * 8) calc(var(--tu) * 8) 0 0;
	background: linear-gradient(180deg, #ffb61f, #f08a00);
	box-shadow: inset 0 calc(var(--tu) * 2) 0 #ffffff73;
	color: #fff;
	font-size: max(13px, calc(var(--tu) * 16));
	font-weight: 900;
	font-style: italic;
	letter-spacing: 0.14em;
	line-height: 1.25;
}
.badge-main {
	--sx: 130%;
	padding: calc(var(--tu) * 7) calc(var(--tu) * 22) calc(var(--tu) * 8);
	border-radius: calc(var(--tu) * 10);
	background:
		linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.95) 50%, transparent 60%) var(--sx) 0 / 260% 100% no-repeat,
		linear-gradient(180deg, #ffb21a, #e06f00),
		linear-gradient(180deg, #fff, #fff 60%, #f4eee6);
	-webkit-background-clip: text, text, padding-box;
	background-clip: text, text, padding-box;
	color: transparent;
	box-shadow:
		0 calc(var(--tu) * 3) 0 #ecdec8f2,
		0 calc(var(--tu) * 8) calc(var(--tu) * 16) #be64004d;
	font-size: calc(var(--tu) * 28);
	font-weight: 900;
	font-style: italic;
	letter-spacing: 0.06em;
	line-height: 1.2;
}
@media (min-width: 1024px) and (max-width: 1279px) {
	.kv {
		--uw: calc(100vw / 1640);
	}
	.stage {
		transform: translate(calc(-50% - var(--u) * 20));
	}
}
@media (max-width: 1023px) {
	.kv {
		--ts: 1;
		--u: calc(min(100vw, 560px) / 428);
		height: calc(var(--header-h) + var(--u) * 816);
		background: radial-gradient(80% 50% at 20% 10%, #fce0a0, #fce0a000 70%),
			linear-gradient(160deg, #fcd879, #fbc44c 45%, #f2ac0a 80%, #f7be3a);
	}
	.stage {
		top: var(--header-h);
		width: calc(var(--u) * 428);
		height: calc(var(--u) * 816);
	}
	.l-person {
		left: calc(var(--u) * -22);
		top: calc(var(--u) * 360);
		width: calc(var(--u) * 270);
	}
	.l-person img {
		-webkit-mask-image: linear-gradient(180deg, #000 73.3%, transparent 96.7%);
		mask-image: linear-gradient(180deg, #000 73.3%, transparent 96.7%);
	}
	.l-badge {
		left: 0;
		right: 0;
		top: calc(var(--u) * 14);
		display: flex;
		justify-content: center;
	}
	.badge-top {
		font-size: 13px;
		margin-left: calc(var(--u) * 10);
		padding: calc(var(--u) * 3) calc(var(--u) * 10);
	}
	.badge-main {
		font-size: calc(var(--u) * 17);
		padding: calc(var(--u) * 5) calc(var(--u) * 14) calc(var(--u) * 6);
		border-radius: calc(var(--u) * 7);
	}
	.l-title {
		left: 0;
		right: 0;
		top: calc(var(--u) * 92);
		width: auto;
		display: flex;
		justify-content: center;
	}
	.l-title .pop {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.kv-title {
		width: calc(var(--u) * 292);
	}
	.kv-sub {
		position: static;
		width: calc(var(--u) * 286);
		height: calc(var(--u) * 38);
		margin-top: calc(var(--u) * 10);
		border-radius: calc(var(--u) * 7);
		font-size: calc(var(--u) * 18);
	}
	.l-cta {
		left: 0;
		right: 0;
		top: calc(var(--u) * 700);
		display: flex;
		justify-content: center;
	}
	.kv-cta {
		--cs: 0.72;
	}
	.l-career {
		left: calc(var(--u) * 14);
		top: calc(var(--u) * 286);
		--bs: 0.72;
	}
	.l-practice {
		left: calc(var(--u) * 220);
		top: calc(var(--u) * 290);
		--bs: 0.5;
	}
	.l-ai {
		left: calc(var(--u) * 182);
		top: calc(var(--u) * 426);
		--bs: 0.367;
	}
	.l-hire {
		left: calc(var(--u) * 212);
		top: calc(var(--u) * 574);
		--bs: 0.62;
	}
}

/* ===== 背景光球 ===== */
.decor {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: -1;
	overflow: hidden;
	pointer-events: none;
}
.d-item {
	position: absolute;
	will-change: transform;
	left: var(--l);
	right: var(--r);
	top: var(--t);
	width: var(--w);
}
.d-float {
	transform: rotate(var(--rot));
}
.d-item img {
	display: block;
	width: 100%;
	height: auto;
	filter: blur(var(--blur)) drop-shadow(0 18px 24px rgba(200, 110, 0, 0.22));
}
.d-item img.flip {
	transform: scaleX(-1);
}
.orb {
	display: block;
	width: 100%;
	aspect-ratio: 1;
	border-radius: 50%;
	background: radial-gradient(circle at 34% 30%, #fffffff2 0, #fffffff2 10%, #fff0 34%),
		radial-gradient(circle, #fff6dcd9, #ffd88273 46%, #ffc45000 70%);
	filter: blur(var(--blur));
}
@media (min-width: 768px) and (max-width: 1199px) {
	.d-float {
		opacity: 0.55;
	}
}
@media (max-width: 767px) {
	.m-hide {
		display: none;
	}
	.d-item {
		left: var(--ml, var(--l));
		right: var(--mr, var(--r));
		top: var(--mt, var(--t));
		width: var(--mw, var(--w));
	}
}

/* ===== 計畫簡介 ===== */
.intro {
	--u: calc(min(100vw, 1920px) / 1920);
	position: relative;
	z-index: 2;
	isolation: isolate;
	margin-top: calc(-1 * var(--kv-overlap));
	padding-bottom: clamp(56px, 6vw, 110px);
	padding-left: var(--gutter-l);
	padding-right: var(--gutter-r);
	background: linear-gradient(
		180deg,
		rgba(244, 174, 40, 0) 0,
		rgba(244, 174, 40, 0) var(--kv-overlap),
		var(--kv-base) var(--kv-overlap),
		#f7bc45 45%,
		#fbd78f 80%,
		var(--cream) 100%
	);
}
.panel {
	position: relative;
	max-width: 1180px;
	margin-inline: auto;
	padding: clamp(32px, 4vw, 64px) clamp(20px, 4.5vw, 72px) clamp(36px, 4vw, 60px);
	border-radius: clamp(28px, 3vw, 48px);
	background: linear-gradient(180deg, #fffbeef0, #fff3d4f0 70%, #ffe4a0f0);
	border: 3px solid rgba(255, 255, 255, 0.9);
	box-shadow:
		0 40px 80px -40px #be640099,
		inset 0 0 50px #ffffff8c;
	-webkit-backdrop-filter: blur(12px);
	backdrop-filter: blur(12px);
}
.panel-shadow {
	display: none;
}
@media (min-width: 1024px) {
	.panel-shadow {
		--sf: clamp(110px, 12vh, 150px);
		display: block;
		position: absolute;
		z-index: -2;
		left: 0;
		right: 0;
		top: calc(-1 * var(--sf));
		height: calc(var(--sf) + var(--kv-overlap) + 10px);
		background: linear-gradient(
			180deg,
			rgba(244, 174, 40, 0) 0,
			rgba(244, 174, 40, 0.2) calc(var(--sf) * 0.35),
			rgba(244, 174, 40, 0.65) calc(var(--sf) * 0.7),
			var(--kv-base) var(--sf),
			var(--kv-base) 100%
		);
		pointer-events: none;
		will-change: transform;
	}
}
.intro-head {
	text-align: center;
}
.intro-title {
	font-size: clamp(24px, 2.6vw, 40px);
	font-weight: 900;
	letter-spacing: 0.03em;
	color: #e68a00;
	line-height: 1.35;
	text-wrap: balance;
}
.intro-tagline {
	display: inline-block;
	margin-top: 6px;
	font-size: clamp(20px, 2vw, 30px);
	font-weight: 900;
	letter-spacing: 0.1em;
	color: var(--ink);
	background: linear-gradient(transparent 70%, #ffbe328c 70%) no-repeat 0 0 / 100% 100%;
	padding-inline: 0.2em;
}
.intro-grid {
	display: grid;
	grid-template-columns: 1fr 1.1fr;
	gap: clamp(28px, 4vw, 72px);
	align-items: center;
	margin-top: clamp(28px, 3.4vw, 52px);
	padding-top: clamp(28px, 3.4vw, 48px);
	position: relative;
}
.intro-grid:before {
	content: "";
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	border-top: 2px dashed rgba(226, 122, 0, 0.25);
	transform: scaleX(var(--dash, 1));
}
.alliance {
	text-align: center;
	min-width: 0;
}
.alliance-row {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	gap: 8px 10px;
}
.chip {
	display: inline-grid;
	place-items: center;
	padding: 0.4em 0.9em;
	border-radius: 999px;
	background: linear-gradient(180deg, #ffc740, #f29600);
	color: #fff;
	font-size: clamp(17px, 1.45vw, 23px);
	font-weight: 900;
	letter-spacing: 0.06em;
	white-space: nowrap;
	box-shadow:
		0 10px 20px -10px #cd6e00e6,
		inset 0 2px #ffffff59;
}
.times {
	font: 700 clamp(20px, 1.8vw, 28px) / 1 var(--f-num);
	color: var(--sun-deep);
}
.alliance-suffix {
	margin-top: 14px;
	font-size: clamp(28px, 3vw, 46px);
	font-weight: 900;
	letter-spacing: 0.14em;
	color: var(--ink);
}
.pitch {
	margin-top: 10px;
	font-size: clamp(16px, 1.25vw, 19px);
	color: var(--ink-soft);
	line-height: 1.8;
	max-width: 26em;
	margin-inline: auto;
	text-wrap: balance;
	white-space: pre-line;
}
.benefits {
	min-width: 0;
}
.benefits-title {
	font-size: clamp(18px, 1.5vw, 22px);
	font-weight: 700;
	color: var(--orange-text);
	letter-spacing: 0.06em;
}
.benefit-list {
	list-style: none;
	margin-top: 14px;
	display: grid;
	gap: 12px;
}
.benefit {
	display: flex;
	align-items: center;
	gap: 16px;
	padding: 14px 20px;
	border-radius: 18px;
	background: #ffffffb8;
	box-shadow:
		inset 0 0 0 1px #ffffffe6,
		0 8px 18px -14px #be640099;
	font-size: clamp(16px, 1.3vw, 20px);
	font-weight: 700;
	line-height: 1.5;
}
.diamond {
	flex: none;
	width: 20px;
	height: 20px;
	border-radius: 4px;
	display: grid;
	place-items: center;
	background: linear-gradient(135deg, #ffc740, #f08a00);
	transform: rotate(45deg);
	box-shadow: 0 3px 6px #cd6e0073;
}
.diamond svg {
	width: 15px;
	height: 15px;
	transform: rotate(-45deg);
	overflow: visible;
}
.tick {
	fill: none;
	stroke: #fff;
	stroke-width: 3.4;
	stroke-linecap: round;
	stroke-linejoin: round;
	stroke-dasharray: 1;
	stroke-dashoffset: 0;
}
.intro-btn {
	margin-top: 22px;
}
@media (max-width: 1023px) {
	.intro {
		--u: calc(min(100vw, 560px) / 428);
		margin-top: calc(var(--u) * -24);
		background: linear-gradient(
			180deg,
			rgba(244, 174, 40, 0) 0,
			var(--kv-base) calc(var(--u) * 24),
			#f7bc45 45%,
			#fbd78f 80%,
			var(--cream) 100%
		);
	}
}
@media (max-width: 899px) {
	.intro-grid {
		grid-template-columns: 1fr;
	}
	.intro-btn {
		width: 100%;
	}
}

/* ===== 學長姐心得輪播 ===== */
.testimonials {
	position: relative;
	overflow: hidden;
	isolation: isolate;
	padding-block: clamp(56px, 6vw, 96px) clamp(56px, 6vw, 88px);
	background: radial-gradient(45% 40% at 12% 55%, #ffe4a0b3, #ffe4a000 70%), radial-gradient(45% 40% at 88% 60%, #ffd58a8c, #ffd58a00 70%),
		linear-gradient(180deg, var(--cream) 0%, #ffedc6 100%);
}
.t-head {
	text-align: center;
	padding-left: var(--gutter-l);
	padding-right: var(--gutter-r);
}
.t-tip {
	margin-top: 10px;
	color: var(--orange-text);
	font-size: 16px;
	font-weight: 500;
	text-wrap: balance;
}
.t-stage {
	--w: 360px;
	--s: 1;
	position: relative;
	height: calc(var(--w) * 1.3 + 80px);
	margin-top: 36px;
	cursor: grab;
	touch-action: pan-y;
	outline: none;
	-webkit-mask-image: linear-gradient(90deg, transparent 0, #000 7%, #000 93%, transparent 100%);
	mask-image: linear-gradient(90deg, transparent 0, #000 7%, #000 93%, transparent 100%);
}
.t-stage:active {
	cursor: grabbing;
}
.t-stage:focus-visible {
	outline: 3px solid var(--sun-deep);
	outline-offset: -3px;
}
.t-card {
	position: absolute;
	left: 50%;
	top: 24px;
	width: var(--w);
	height: calc(var(--w) * 1.3);
	margin-left: calc(var(--w) / -2);
	perspective: 1600px;
	will-change: transform;
	-webkit-user-select: none;
	user-select: none;
}
.t-tilt,
.t-inner {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	transform-style: preserve-3d;
}
.t-face {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	padding: calc(var(--s) * 28px);
	border-radius: calc(var(--s) * 28px);
	backface-visibility: hidden;
	-webkit-backface-visibility: hidden;
	background: linear-gradient(165deg, var(--card-top) 0%, var(--card-bot) 100%);
	box-shadow:
		0 26px 48px -22px #cd78008c,
		inset 0 0 0 2px #fffffff2;
}
.t-front {
	background:
		repeating-linear-gradient(180deg, rgba(0, 0, 0, 0) 0 calc(var(--s) * 37px), var(--line) calc(var(--s) * 37px) calc(var(--s) * 38px)) 0
			calc(var(--s) * 132px) / 100% calc(100% - var(--s) * 132px) no-repeat,
		linear-gradient(165deg, var(--card-top) 0%, var(--card-bot) 100%);
}
.row {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 12px;
}
.qnum {
	font: italic 900 calc(var(--s) * 76px) / 1 var(--f-num);
	color: #f09000;
	text-shadow: 0 calc(var(--s) * 3px) 0 #ffd27a;
	padding-right: 0.06em;
}
.t-stamp {
	margin-top: calc(var(--s) * 10px);
	padding: calc(var(--s) * 4px) calc(var(--s) * 10px);
	border: 2px solid var(--sun-deep);
	border-radius: 10px;
	color: var(--sun-deep);
	font-size: max(13px, calc(var(--s) * 14px));
	font-weight: 900;
	letter-spacing: 0.08em;
	white-space: nowrap;
	transform: rotate(6deg);
}
.t-ask {
	margin-top: calc(var(--s) * 24px);
	font-size: calc(var(--s) * 27px);
	font-weight: 900;
	line-height: calc(var(--s) * 38px);
	letter-spacing: 0.02em;
}
.t-draft {
	position: relative;
	flex: 1;
	min-height: 0;
	overflow: hidden;
	margin-top: calc(var(--s) * 4px);
	-webkit-mask-image: linear-gradient(180deg, #000 55%, transparent 100%);
	mask-image: linear-gradient(180deg, #000 55%, transparent 100%);
}
.ans-mark {
	position: absolute;
	left: 0;
	top: calc(var(--s) * 5px);
	z-index: 1;
	display: grid;
	place-items: center;
	width: calc(var(--s) * 30px);
	height: calc(var(--s) * 30px);
	border-radius: 50%;
	background: transparent;
	color: var(--sun-deep);
	box-shadow: inset 0 0 0 2px currentColor;
	font-size: max(14px, calc(var(--s) * 16px));
	font-weight: 900;
	line-height: 1;
}
.t-card.is-main {
	--card-top: #ffffff;
	--card-bot: #fffdf8;
}
.t-draft,
.t-stamp,
.who-go,
.t-who {
	transition:
		opacity 0.35s,
		background 0.35s,
		box-shadow 0.35s;
}
.t-card:not(.is-main) .t-draft,
.t-card:not(.is-main) .t-stamp,
.t-card:not(.is-main) .who-go {
	opacity: 0;
}
.t-card:not(.is-main) .t-who {
	background: transparent;
	box-shadow: none;
}
.draft-text {
	text-indent: calc(var(--s) * 40px);
	font-size: calc(var(--s) * 20px);
	line-height: calc(var(--s) * 38px);
	font-weight: 500;
	color: #6b5a45;
	opacity: 0.5;
	filter: blur(calc(var(--s) * 4.5px));
	transition: filter 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.t-card.is-main:hover .draft-text {
	filter: blur(calc(var(--s) * 3px));
}
.t-who {
	flex: none;
	display: flex;
	align-items: center;
	gap: calc(var(--s) * 12px);
	margin-top: calc(var(--s) * 10px);
	padding: calc(var(--s) * 8px) calc(var(--s) * 8px) calc(var(--s) * 8px) calc(var(--s) * 8px);
	border-radius: 999px;
	background: linear-gradient(180deg, #ffe7a6, #ffcf66);
	box-shadow:
		inset 0 0 0 2px #ffffffb3,
		0 calc(var(--s) * 10px) calc(var(--s) * 18px) calc(var(--s) * -8px) #cd6e00a6;
	transition:
		transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
		box-shadow 0.35s;
}
.who-txt {
	flex: 1;
	min-width: 0;
	display: flex;
	flex-direction: column;
	line-height: 1.3;
}
.who-txt b {
	font-size: max(16px, calc(var(--s) * 19px));
	font-weight: 900;
	color: var(--ink);
	letter-spacing: 0.04em;
}
.who-txt small {
	font-size: max(14px, calc(var(--s) * 14px));
	font-weight: 700;
	color: #7a4300;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.who-go {
	flex: none;
	display: grid;
	place-items: center;
	width: calc(var(--s) * 44px);
	height: calc(var(--s) * 44px);
	border-radius: 50%;
	background: linear-gradient(180deg, #f29200, #d96a00);
	color: #fff;
	font-size: calc(var(--s) * 22px);
	box-shadow:
		0 calc(var(--s) * 6px) calc(var(--s) * 12px) calc(var(--s) * -4px) #be5a00cc,
		inset 0 2px #ffffff4d;
	transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.t-card.is-main:hover .t-who {
	transform: translateY(calc(var(--s) * -2px));
}
.t-card.is-main:hover .who-go {
	transform: rotate(180deg);
}
.t-back {
	transform: rotateY(180deg);
	gap: calc(var(--s) * 18px);
}
.who {
	display: flex;
	align-items: center;
	gap: 14px;
}
.who b {
	display: block;
	font-size: max(16px, calc(var(--s) * 18px));
	font-weight: 700;
	line-height: 1.3;
}
.who span {
	display: block;
	font-size: max(14px, calc(var(--s) * 14px));
	font-weight: 500;
	color: var(--orange-text);
	line-height: 1.4;
}
.ans {
	flex: 1;
	font-size: max(16px, calc(var(--s) * 20px));
	font-weight: 500;
	line-height: 1.85;
}
.ans:before {
	content: "“";
	display: block;
	height: calc(var(--s) * 30px);
	font: 900 calc(var(--s) * 64px) / 0.6 var(--f-num);
	color: var(--sun);
}
.q-small {
	padding-top: 12px;
	border-top: 1px dashed rgba(226, 122, 0, 0.35);
	font-size: max(14px, calc(var(--s) * 14px));
	color: var(--ink-soft);
	line-height: 1.6;
}
.ava {
	flex: none;
	border-radius: 50%;
	background-repeat: no-repeat;
	box-shadow:
		0 0 0 3px #fff,
		0 0 0 5px var(--sun),
		0 8px 18px -6px #cd780099;
}
.ava-m {
	width: calc(var(--s) * 56px);
	height: calc(var(--s) * 56px);
	box-shadow:
		0 0 0 3px #fff,
		0 6px 14px -6px #cd7800b3;
}
.ava-l {
	width: calc(var(--s) * 64px);
	height: calc(var(--s) * 64px);
}
.t-veil {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	border-radius: calc(var(--s) * 28px);
	background: #fff1d2;
	opacity: 0;
	pointer-events: none;
}
.t-ctrl {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 22px;
	margin-top: 8px;
}
.t-dots {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 8px;
}
.t-dots button[aria-current] {
	position: relative;
	overflow: hidden;
	width: 9px;
	height: 9px;
	padding: 0;
	border: 0;
	border-radius: 999px;
	background: #e27a0047;
	cursor: pointer;
	transition:
		width 0.3s,
		background 0.3s;
}
.t-dots button[aria-current="true"] {
	width: 26px;
	background: var(--sun-deep);
}
.t-dots.is-auto button[aria-current="true"] {
	width: 34px;
	background: #e27a004d;
}
.t-dots.is-auto button[aria-current="true"]:after {
	content: "";
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	border-radius: inherit;
	background: var(--sun-deep);
	transform-origin: left center;
	transform: scaleX(var(--prog, 1));
}
.t-play {
	flex: none;
	display: grid;
	place-items: center;
	width: 32px;
	height: 32px;
	margin-left: 6px;
	padding: 0;
	border: 0;
	border-radius: 50%;
	background: #ffffffb3;
	color: var(--sun-deep);
	box-shadow: inset 0 0 0 1.5px #e27a0059;
	cursor: pointer;
	transition:
		background 0.2s,
		box-shadow 0.2s;
}
.t-play:hover {
	background: #fff;
	box-shadow: inset 0 0 0 1.5px var(--sun-deep);
}
.t-play:focus-visible {
	outline: 3px solid var(--sun-deep);
	outline-offset: 2px;
}

/* ===== 計畫資訊 ===== */
.about {
	position: relative;
	isolation: isolate;
	padding-block: clamp(56px, 6vw, 100px);
	background: radial-gradient(50% 70% at 50% 40%, #ffe9aab3, #ffe9aa00 70%), linear-gradient(180deg, #ffedc6 0%, var(--cream) 100%);
}
.about-list {
	list-style: none;
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: clamp(24px, 4vw, 64px);
	max-width: 1080px;
}
.about-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	min-width: 0;
	perspective: 800px;
}
.about-float {
	display: block;
}
.about-icon {
	width: clamp(96px, 9vw, 150px);
	height: clamp(96px, 9vw, 150px);
	font-size: clamp(54px, 5vw, 84px);
	border-radius: 26%;
}
.about-icon :deep(svg) {
	filter: drop-shadow(4px 4px 0 rgba(214, 110, 0, 0.45));
}
.about-title {
	margin-top: 22px;
	font-size: clamp(20px, 1.8vw, 28px);
	font-weight: 900;
	letter-spacing: 0.1em;
}
.about-title:after {
	content: "";
	display: block;
	width: 36px;
	height: 4px;
	margin: 10px auto 0;
	border-radius: 4px;
	background: var(--sun);
	transform: scaleX(var(--ul, 1));
}
.about-desc {
	margin-top: 12px;
	font-size: clamp(15px, 1.15vw, 18px);
	color: var(--ink-soft);
	line-height: 1.75;
	white-space: pre-line;
	font-weight: 500;
}
@media (max-width: 767px) {
	.about-list {
		grid-template-columns: 1fr;
		gap: 40px;
	}
	.about-desc {
		white-space: normal;
	}
}

/* ===== 申請表單 ===== */
.apply-form {
	max-width: 920px;
	margin: clamp(28px, 3vw, 44px) auto 0;
	display: grid;
	gap: clamp(20px, 2.4vw, 32px);
}
.grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: clamp(20px, 2.4vw, 32px);
	align-items: start;
}
.col {
	display: grid;
	gap: clamp(20px, 2.4vw, 28px);
	min-width: 0;
}
.group {
	border: 0;
	margin: 0;
	padding: 0;
	min-width: 0;
}
.g-title {
	display: block;
	width: 100%;
	padding: 0;
	margin-bottom: 10px;
	text-align: center;
	font-size: clamp(17px, 1.4vw, 20px);
	font-weight: 900;
	color: #c96a00;
	letter-spacing: 0.06em;
}
.card {
	position: relative;
	padding: clamp(16px, 1.8vw, 24px);
	border-radius: 22px;
	background: linear-gradient(180deg, #ffc64a, #f6a51c);
	box-shadow:
		0 18px 34px -20px #be5f00cc,
		inset 0 2px #ffffff73,
		inset 0 -4px 10px #c8640040;
}
.stack {
	display: grid;
	gap: 12px;
}
.field {
	width: 100%;
	height: 48px;
	padding: 0 16px;
	border: 2px solid transparent;
	border-radius: 12px;
	background: #fff;
	color: var(--ink);
	font-size: 16px;
	box-shadow: inset 0 2px 4px #a05a001f;
	transition:
		border-color 0.2s,
		box-shadow 0.2s;
}
.field::placeholder {
	color: #857561;
}
.field:focus {
	outline: none;
	border-color: #c96a00;
	box-shadow: 0 0 0 4px #ffffffb3;
}
.date-wrap {
	position: relative;
}
.date.empty::-webkit-datetime-edit {
	color: transparent;
}
.date.empty:focus::-webkit-datetime-edit {
	color: var(--ink);
}
.date-ph {
	position: absolute;
	left: 18px;
	top: 50%;
	transform: translateY(-50%);
	color: #857561;
	pointer-events: none;
}
.date:focus + .date-ph {
	display: none;
}
.hint {
	font-size: 14px;
	line-height: 1.6;
	color: #4a2c00;
}
.select-btn {
	display: flex;
	align-items: center;
	justify-content: space-between;
	text-align: left;
	cursor: pointer;
}
.select-btn.ph span {
	color: #857561;
}
.caret {
	color: #c96a00;
	transition: transform 0.25s;
}
.caret.up {
	transform: rotate(180deg);
}
.options {
	list-style: none;
	position: absolute;
	z-index: 5;
	left: clamp(16px, 1.8vw, 24px);
	right: clamp(16px, 1.8vw, 24px);
	top: calc(clamp(16px, 1.8vw, 24px) + 54px);
	padding: 6px;
	border-radius: 14px;
	background: #fff;
	box-shadow: 0 20px 40px -16px #9650008c;
}
.option {
	width: 100%;
	display: grid;
	gap: 2px;
	text-align: left;
	padding: 10px 12px;
	border: 0;
	border-radius: 10px;
	background: transparent;
	cursor: pointer;
}
.option:hover,
.option:focus-visible {
	background: #fff3d6;
}
.option b {
	font-size: 16px;
}
.option small {
	font-size: 14px;
	color: var(--ink-soft);
}
[aria-selected="true"] > .option {
	background: #ffebc2;
}
.other {
	margin-top: 12px;
}
.sources {
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: 14px 18px;
}
.check {
	display: flex;
	align-items: center;
	gap: 10px;
	cursor: pointer;
	font-size: 16px;
	font-weight: 700;
	color: #3a2400;
	min-width: 0;
}
.box {
	flex: none;
	width: 24px;
	height: 24px;
	border-radius: 7px;
	display: grid;
	place-items: center;
	background: #fff;
	color: transparent;
	box-shadow: inset 0 2px 4px #a05a0033;
	transition:
		background 0.2s,
		color 0.2s,
		transform 0.2s;
}
.check input:checked + .box {
	background: #c96a00;
	color: #fff;
	transform: scale(1.06);
}
.check input:focus-visible + .box {
	outline: 3px solid #fff;
	outline-offset: 2px;
}
.consent {
	align-items: flex-start;
	padding: 16px 20px;
	border-radius: 18px;
	background: #fffc;
	box-shadow:
		inset 0 0 0 1px #ffffffe6,
		0 10px 22px -18px #96500099;
	font-size: 15px;
	font-weight: 500;
	line-height: 1.7;
	color: var(--ink);
}
.consent .box {
	margin-top: 1px;
	box-shadow: inset 0 0 0 2px #e8a23a;
}
.notes {
	padding-left: 1.4em;
	display: grid;
	gap: 4px;
	font-size: 15px;
	line-height: 1.7;
	color: var(--ink-soft);
}
.submit-row {
	display: flex;
	justify-content: center;
	margin-top: 6px;
}
.submit {
	min-width: 280px;
	min-height: 64px;
	font-size: 20px;
}
.submit:disabled {
	opacity: 0.6;
	cursor: progress;
}
.loading {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 90;
	display: grid;
	place-content: center;
	justify-items: center;
	gap: 14px;
	background: #fff6e2d1;
	-webkit-backdrop-filter: blur(3px);
	backdrop-filter: blur(3px);
	font-weight: 700;
	color: var(--orange-text);
}
.spinner {
	width: 44px;
	height: 44px;
	border-radius: 50%;
	border: 4px solid rgba(226, 122, 0, 0.25);
	border-top-color: var(--sun-deep);
	animation: spin 0.8s linear infinite;
}
@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}
.field-wrap {
	display: grid;
	gap: 6px;
	min-width: 0;
}
.f-label {
	font-size: 15px;
	font-weight: 700;
	color: #4a2c00;
	letter-spacing: 0.04em;
	padding-left: 2px;
}
.field.invalid {
	border-color: #d92d20;
	background: #fff8f6;
}
.err {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	justify-self: start;
	margin: 0;
	padding: 4px 10px;
	border-radius: 8px;
	background: #fff4f0;
	color: #b42318;
	font-size: 14px;
	font-weight: 700;
	line-height: 1.5;
	box-shadow: 0 4px 10px -6px #96280080;
}
.err-gap {
	margin-top: 8px;
}
.card.invalid {
	box-shadow:
		0 0 0 3px #d92d20,
		0 18px 34px -20px #be5f00cc;
}
.consent.invalid {
	box-shadow: 0 0 0 3px #d92d20;
}
.bday {
	display: grid;
	grid-template-columns: 1.3fr 1fr 1fr;
	gap: 8px;
}
.sel-wrap {
	position: relative;
	min-width: 0;
}
.sel {
	-moz-appearance: none;
	appearance: none;
	-webkit-appearance: none;
	padding-right: 34px;
	cursor: pointer;
}
.sel.ph {
	color: #857561;
}
.sel option {
	color: var(--ink);
}
.sel-wrap .caret {
	position: absolute;
	right: 12px;
	top: 50%;
	transform: translateY(-50%);
	pointer-events: none;
}
.notes-top {
	padding: 18px 24px 16px;
	border-radius: 18px;
	background: #ffffffb8;
	box-shadow:
		inset 0 0 0 1px #ffffffe6,
		0 10px 22px -18px #96500099;
}
.notes-title {
	font-size: 17px;
	font-weight: 900;
	color: #9a4a00;
	letter-spacing: 0.06em;
	margin-bottom: 6px;
}
.required-note {
	margin-top: 10px;
	padding-top: 10px;
	border-top: 1px dashed rgba(226, 122, 0, 0.35);
	font-size: 15px;
	font-weight: 700;
	color: var(--ink);
}
.ux-left .g-title {
	text-align: left;
	padding-left: 4px;
	color: #9a4a00;
}
.ux-strong .submit {
	min-width: 320px;
	min-height: 68px;
	font-size: 22px;
	letter-spacing: 0.12em;
}
.ux-dark .submit {
	background: linear-gradient(180deg, #d96a00, #b35400);
	box-shadow:
		0 18px 30px -12px #964600e6,
		inset 0 2px #ffffff4d;
}
.ux-dark .submit:hover {
	box-shadow:
		0 22px 34px -12px #964600f2,
		inset 0 2px #ffffff4d;
}
.ux-box .box,
.ux-box .consent .box {
	box-shadow: inset 0 0 0 2px #8a3f00;
}
.ux-box .check input:checked + .box {
	box-shadow: none;
}
@media (max-width: 767px) {
	.notes-top {
		padding: 14px 16px;
	}
	.ux-strong .submit {
		min-width: 0;
	}
}
@media (max-width: 767px) {
	.grid {
		grid-template-columns: 1fr;
	}
	.sources {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
	.submit {
		width: 100%;
		min-width: 0;
	}
}
@media (prefers-reduced-motion: reduce) {
	.spinner {
		animation-duration: 2.4s;
	}
}

/* ===== 立即申請區塊 ===== */
.apply {
	position: relative;
	isolation: isolate;
	padding-block: clamp(56px, 6vw, 100px) clamp(64px, 7vw, 120px);
	background: linear-gradient(180deg, var(--cream) 0, rgba(255, 246, 226, 0) 140px),
		radial-gradient(70% 60% at 50% 0%, #ffecbee6, #ffecbe00 70%), linear-gradient(180deg, var(--cream) 0%, #ffe7b4 100%);
}
.notice {
	max-width: 760px;
	margin-inline: auto;
	text-align: center;
	padding: clamp(36px, 5vw, 64px) clamp(20px, 5vw, 64px);
	border-radius: clamp(28px, 3vw, 44px);
	background: linear-gradient(180deg, #fffcf2f2, #fff0cdf2);
	border: 3px solid rgba(255, 255, 255, 0.9);
	box-shadow: 0 30px 60px -34px #be64008c;
}
.notice-kicker {
	margin: 0 0 6px;
	font-size: clamp(18px, 1.7vw, 24px);
	font-weight: 900;
	letter-spacing: 0.04em;
	color: var(--orange-text);
}
.notice-desc {
	margin-top: 14px;
	font-size: clamp(18px, 1.6vw, 24px);
	font-weight: 700;
	letter-spacing: 0.06em;
}
.notice-btn {
	margin-top: 28px;
}
.notice-contact {
	margin-top: 24px;
	font-size: 16px;
	color: var(--ink-soft);
	line-height: 1.8;
}
.notice-contact a {
	color: var(--orange-text);
	font-weight: 700;
	white-space: nowrap;
}

/* ===== 頁尾 ===== */
.site-footer {
	background: linear-gradient(90deg, #f6a300, #ffbe3b 50%, #f6a300);
	color: #fff;
	text-align: center;
	font-size: 15px;
	letter-spacing: 0.08em;
	padding-block: 18px calc(18px + env(safe-area-inset-bottom, 0px));
	padding-left: var(--gutter-l);
	padding-right: var(--gutter-r);
}

/* ===== 前往測驗浮動按鈕 ===== */
.quiz-float {
	--d: clamp(112px, 10vw, 190px);
	position: fixed;
	z-index: 40;
	right: max(14px, 2vw, env(safe-area-inset-right, 0px));
	bottom: max(18px, 5vh, env(safe-area-inset-bottom, 0px));
	width: var(--d);
	height: var(--d);
	cursor: grab;
	touch-action: none;
}
.quiz-float:focus-visible {
	outline: 3px solid var(--sun-deep);
	outline-offset: 4px;
	border-radius: 50%;
}
.qf-inner {
	width: 100%;
	height: 100%;
	display: block;
	filter: drop-shadow(0 14px 22px rgba(160, 75, 0, 0.35));
}

/* ===== 提示彈窗 ===== */
.modal {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 100;
	display: grid;
	place-items: center;
	padding: 24px;
	background: #3c230061;
	-webkit-backdrop-filter: blur(3px);
	backdrop-filter: blur(3px);
}
.modal-box {
	width: min(420px, 100%);
	display: grid;
	gap: 24px;
	justify-items: center;
	text-align: center;
	padding: 36px 28px 28px;
	border-radius: 28px;
	background: linear-gradient(170deg, #fff, #fff3d6);
	box-shadow:
		0 30px 60px -20px #9650008c,
		inset 0 0 0 2px #ffffffe6;
}
.msg {
	font-size: 18px;
	font-weight: 700;
	line-height: 1.7;
	color: var(--ink);
}
.modal-enter-active,
.modal-leave-active {
	transition: opacity 0.25s;
}
.modal-enter-active .modal-box,
.modal-leave-active .modal-box {
	transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-enter-from,
.modal-leave-to {
	opacity: 0;
}
.modal-enter-from .modal-box {
	transform: translateY(16px) scale(0.96);
}
</style>
