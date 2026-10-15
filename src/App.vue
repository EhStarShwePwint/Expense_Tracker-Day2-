<!-- src/App.vue -->
<script setup lang="ts">
import Sidebar from './components/Sidebar.vue'
import ToastNotification from './components/ToastNotification.vue'
import { useToast } from './composables/useToast'

// Toast 
const { toasts, removeToast } = useToast()
</script>

<template>
  <div class="flex h-screen bg-gray-50 font-sans">
    <Sidebar />
    <main class="flex-1 overflow-y-auto">
      <router-view></router-view>
    </main>

    <!-- Toast Notification Container (App) -->
    <ToastNotification :toasts="toasts" @remove="removeToast" />
  </div>
</template>