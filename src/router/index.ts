// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// Lazy Loading နည်းပညာနဲ့ Page တွေကို ခေါ်ယူခြင်း (Performance အတွက်)
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/dashboard' // Default အနေနဲ့ Dashboard ကို သွားမယ်
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue')
  },
  {
    path: '/transactions',
    name: 'Transactions',
    component: () => import('../views/Transactions.vue')
  },
  {
    path: '/budget',
    name: 'Budget',
    component: () => import('../views/Budget.vue')
  }
]

const router = createRouter({
  history: createWebHistory(), // URL မှာ # မပါဘဲ ပုံမှန် URL အတိုင်း သွားစေရန်
  routes
})

export default router