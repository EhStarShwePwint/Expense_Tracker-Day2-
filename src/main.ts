// src/main.ts
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router' // Router ကို Import လုပ်ပါ

const app = createApp(App)
app.use(router) // Router ကို အသုံးပြုပါ
app.mount('#app')