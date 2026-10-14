<!-- src/components/EmptyState.vue -->
<script setup lang="ts">
defineEmits<{
  (e: 'clearFilters'): void
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-20 px-4">
    <!-- Empty Icon -->
    <div class="w-20 h-20 mb-6 text-gray-300">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
    </div>
    
    <!-- Text -->
    <h3 class="text-xl font-semibold text-gray-800 mb-2">Nothing to show</h3>
    <p class="text-gray-500 text-sm mb-6">Try a wider date range or clear the filters.</p>
    
    <!-- Clear Filters Button -->
    <button 
      @click="$emit('clearFilters')"
      class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
      </svg>
      Clear filters
    </button>
  </div>
</template>