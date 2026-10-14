// src/composables/useToast.ts
import { ref } from 'vue'

// Toast Item ရဲ့ Type
interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

// Toast တွေကို သိမ်းထားမယ့် Array
const toasts = ref<Toast[]>([])

// Auto Increment ID
let toastId = 0

/**
 * Toast အသစ် ထည့်ခြင်း
 * @param message ပြသမယ့် စာသား
 * @param type Toast အမျိုးအစား (success, error, info)
 * @param duration ဘယ်လောက်ကြာကြာ ပြမလဲ (milliseconds)
 */
const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success', duration = 3000) => {
  const id = ++toastId
  toasts.value.push({ id, message, type })

  // သတ်မှတ်ထားတဲ့ အချိန်ပြည့်ရင် အလိုအလျောက် ဖျက်မယ်
  setTimeout(() => {
    removeToast(id)
  }, duration)
}

/**
 * Toast ဖျက်ခြင်း
 * @param id ဖျက်မယ့် Toast ရဲ့ ID
 */
const removeToast = (id: number) => {
  toasts.value = toasts.value.filter(t => t.id !== id)
}

export const useToast = () => {
  return {
    toasts,
    showToast,
    removeToast
  }
}