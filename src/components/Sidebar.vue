<!-- src/components/Sidebar.vue -->
<script setup lang="ts">
// activeMenu နဲ့ emit တွေ မလိုအပ်တော့ပါဘူး။ Router က အလိုအလျောက် လုပ်ပေးပါမယ်။
const menuItems = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id: 'transactions', label: 'Transactions', path: '/transactions', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
  { id: 'budget', label: 'Budget', path: '/budget', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
]
</script>

<template>
  <aside class="w-64 bg-slate-900 flex flex-col justify-between shrink-0">
    <div>
      <!-- Logo Area -->
      <div class="p-6 flex items-center gap-3">
        <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
        </div>
        <div>
          <h1 class="text-white font-bold text-lg leading-tight">Expense Tracker</h1>
          <p class="text-slate-400 text-xs">Personal finance</p>
        </div>
      </div>

      <!-- Navigation Menu -->
      <nav class="px-4 mt-4 space-y-1">
        <!-- 
          Router Link ကို အသုံးပြုပြီး Menu တွေကို ချိတ်ဆက်ထားပါတယ်။
          'active-class' က လက်ရှိ Page ဖြစ်နေရင် အလိုအလျောက် Class ပေးမှာပါ။
        -->
        <router-link 
          v-for="item in menuItems" 
          :key="item.id"
          :to="item.path"
          class="nav-link nav-link-inactive"
          active-class="nav-link-active"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon"></path>
          </svg>
          {{ item.label }}
        </router-link>
      </nav>
    </div>

    <div class="p-6">
      <p class="text-slate-500 text-xs">Data is stored in this browser only.</p>
    </div>
  </aside>
</template>