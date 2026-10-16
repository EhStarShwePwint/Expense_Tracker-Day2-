<!-- src/components/Navbar.vue -->
<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

// ✅ Route အလိုက် Page Title ကို ပြမယ်
const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/transactions": "Transactions",
    "/budget": "Budget",
  };
  return titles[route.path] || "Expense Tracker";
});
</script>

<template>
  <header
    class="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-40"
  >
    <!-- Left: Page Title -->
    <h1 class="text-lg font-semibold text-gray-900">
      {{ pageTitle }}
    </h1>

    <!-- Right: User Profile -->
    <div class="flex items-center gap-4">
      <!-- User Avatar -->
      <button
        class="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
      >
        E
      </button>
    </div>
  </header>
</template>
