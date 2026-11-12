import { createApp } from 'vue'
import App from './App.vue'
import { pushGA } from './composables/useGA.js'

window.pushGA = pushGA

console.log('[版本]', __APP_VERSION__)

createApp(App).mount('#app')
