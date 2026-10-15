// src/main.ts
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router' // import Router 

const app = createApp(App)
app.use(router) //use Router
app.mount('#app')