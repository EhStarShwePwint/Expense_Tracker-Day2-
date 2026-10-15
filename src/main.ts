// src/main.ts
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router' // import Router 
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Solid Icons (အပြည့် Icon တွေ)
import {
  faPlus,          // Add transaction
  faTrash,         // Delete
  faPen,           // Edit
  faMagnifyingGlass, // Search
  faXmark,         // Close
  faFilter,        // Filter
  faChevronLeft,   // Prev
  faChevronRight,  // Next
  faCircleCheck,   // Success
  faCircleExclamation, // Error
  faCircleInfo,    // Info
  faWallet,        // Balance
  faArrowTrendUp,  // Income
  faArrowTrendDown,// Expense
  faTags,          // Categories
  faRotateLeft     // Clear/Reset
} from '@fortawesome/free-solid-svg-icons'

// Library ထဲ ထည့်မယ်
library.add(
  faPlus,
  faTrash,
  faPen,
  faMagnifyingGlass,
  faXmark,
  faFilter,
  faChevronLeft,
  faChevronRight,
  faCircleCheck,
  faCircleExclamation,
  faCircleInfo,
  faWallet,
  faArrowTrendUp,
  faArrowTrendDown,
  faTags,
  faRotateLeft
)

const app = createApp(App)
app.use(router) //use Router
app.mount('#app')