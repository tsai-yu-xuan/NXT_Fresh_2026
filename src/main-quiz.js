import { createApp } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'animate.css'
import './styles/all.css'
import 'bootstrap'
import QuizApp from './QuizApp.vue'
import { pushGA } from './composables/useGA.js'

window.pushGA = pushGA

createApp(QuizApp).mount('#app')
