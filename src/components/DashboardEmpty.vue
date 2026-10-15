<!-- src/components/DashboardEmpty.vue -->
<script setup lang="ts">
defineProps<{
  icon: "expense" | "income" | "transaction";
  title: string;
  description: string;
  buttonText?: string;
}>();

const emit = defineEmits<{
  (e: "action"): void;
}>();

// Icon Path တွေ
const iconPaths = {
  expense: "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6", // Trending down
  income: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", // Trending up
  transaction:
    "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", // File/List
};
</script>

<template>
  <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
    <!-- Icon -->
    <div class="w-14 h-14 mb-4 text-gray-300">
      <svg
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        stroke-width="1.5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          :d="iconPaths[icon]"
        />
      </svg>
    </div>

    <!-- Title -->
    <h4 class="text-sm font-semibold text-gray-700 mb-1">{{ title }}</h4>

    <!-- Description -->
    <p class="text-xs text-gray-500 mb-4 max-w-xs">{{ description }}</p>

    <!-- Button (Optional) -->
    <button
      v-if="buttonText"
      @click="emit('action')"
      class="btn-primary text-xs px-4 py-2"
    >
      <svg
        class="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 4v16m8-8H4"
        ></path>
      </svg>
      {{ buttonText }}
    </button>
  </div>
</template>
