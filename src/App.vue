<!-- src/App.vue -->
<script setup lang="ts">
import Sidebar from "./components/Sidebar.vue";
import Navbar from "./components/Navbar.vue";
import ToastNotification from "./components/ToastNotification.vue";
import { useToast } from "./composables/useToast";

// Toast
const { toasts, removeToast } = useToast();
</script>
<template>
  <div class="flex h-screen bg-gray-50 font-sans">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- ✅ Navbar (အပေါ်ဆုံး) -->
      <Navbar />

      <!-- Page Content (Scrollable) -->
      <main class="flex-1 overflow-y-auto">
        <router-view></router-view>
      </main>
    </div>

    <!-- Toast Notification -->
    <ToastNotification :toasts="toasts" @remove="removeToast" />
  </div>
</template>
