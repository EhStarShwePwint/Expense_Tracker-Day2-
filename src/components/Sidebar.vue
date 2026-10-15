<!-- src/components/Sidebar.vue -->
<script setup lang="ts">
// activeMenu နဲ့ emit တွေ မလိုအပ်တော့ပါဘူး။ Router က အလိုအလျောက် လုပ်ပေးပါမယ်။
const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
    icon: "gauge-high",
  },
  {
    id: "transactions",
    label: "Transactions",
    path: "/transactions",
    icon: "right-left",
  },
  {
    id: "budget",
    label: "Budget",
    path: "/budget",
    icon: "wallet",
  },
];
</script>

<template>
  <aside class="w-64 bg-slate-900 flex flex-col justify-between shrink-0">
    <div>
      <!-- Logo Area -->
      <div class="p-6 flex items-center gap-3">
        <div
          class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg"
        >
          <font-awesome-icon :icon="['fas', 'book']" class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-white font-bold text-lg leading-tight">
            Expense Tracker
          </h1>
          <p class="text-slate-400 text-xs">Personal finance</p>
        </div>
      </div>

      <!-- Navigation Menu -->
      <nav class="text-white px-4 mt-4 space-y-1">
        <router-link
          v-for="item in menuItems"
          :key="item.id"
          :to="item.path"
          class="nav-link"
          :class="{
            'nav-link-active': $route.path === item.path,
            'nav-link-inactive': $route.path !== item.path,
          }"
        >
          <font-awesome-icon :icon="['fas', item.icon]" class="w-5 h-5" />
          {{ item.label }}
        </router-link>
      </nav>
    </div>

    <div class="p-6">
      <p class="text-slate-500 text-xs">Data is stored in this browser only.</p>
    </div>
  </aside>
</template>
