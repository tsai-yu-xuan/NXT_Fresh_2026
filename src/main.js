import { createApp } from 'vue'
import App from './App.vue'
import { pushGA } from './composables/useGA.js'

window.pushGA = pushGA

createApp(App).mount('#app')
