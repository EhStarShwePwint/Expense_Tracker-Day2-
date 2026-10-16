<!-- src/components/ConfirmModal.vue -->
<script setup lang="ts">
defineProps<{
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  count?: number;
}>();

const emit = defineEmits<{
  (e: "confirm"): void;
  (e: "cancel"): void;
}>();
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
  >
    <div
      class="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200"
    >
      <!-- Header -->
      <div
        class="flex justify-between items-center px-6 py-4 border-b border-gray-100"
      >
        <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
        <button
          @click="emit('cancel')"
          class="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <font-awesome-icon :icon="['fas', 'xmark']" class="w-5 h-5" />
        </button>
      </div>

      <!-- Body -->
      <div class="p-6">
        <p class="text-gray-600 leading-relaxed">{{ message }}</p>
      </div>

      <!-- Footer -->
      <div
        class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3"
      >
        <button
          @click="emit('cancel')"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {{ cancelText || "Cancel" }}
        </button>
        <button
          @click="emit('confirm')"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
        >
          <!-- <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg> -->
          <font-awesome-icon :icon="['fas', 'trash']" class="w-4 h-4" />
          {{ confirmText || "Delete" }}<span v-if="count"> {{ count }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
