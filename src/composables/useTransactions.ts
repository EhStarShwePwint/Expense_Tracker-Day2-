// src/composables/useTransactions.ts
import { ref, watch } from 'vue'
import type { Transaction } from '../types'
import { getFromStorage, saveToStorage } from '../utils/storage'

// Local Storage Key
const STORAGE_KEY = 'expense-tracker-transactions'

// Local Storage ထဲက Data ကို အရင် ဖတ်မယ်၊ မရှိရင် Default Data ထည့်မယ်
const savedTransactions = getFromStorage<Transaction[]>(STORAGE_KEY)

// Reactive State
const transactions = ref<Transaction[]>(savedTransactions || [
  {
    id: 1,
    type: 'income',
    amount: 10000,
    category: 'Salary',
    date: '2026-10-14',
    note: 'work'
  }
])

// Data တွေ ပြောင်းလဲတိုင်း Local Storage ထဲ အလိုအလျောက် သိမ်းမယ်
watch(transactions, (newVal) => {
  saveToStorage(STORAGE_KEY, newVal)
}, { deep: true }) // deep: true က Array အတွင်းက Item တွေ ပြောင်းလဲမှုကို စောင့်ကြည့်ဖို့

/**
 * Transaction အသစ် ထည့်ခြင်း
 */
const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
  const newTransaction: Transaction = {
    id: Date.now(), // Unique ID
    ...transaction
  }
  transactions.value.push(newTransaction)
}

/**
 * Transaction ဖျက်ခြင်း
 */
const deleteTransaction = (id: string | number) => {
  transactions.value = transactions.value.filter(t => t.id !== id)
}

/**
 * Transaction ပြင်ဆင်ခြင်း
 */
const updateTransaction = (updatedTransaction: Transaction) => {
  const index = transactions.value.findIndex(t => t.id === updatedTransaction.id)
  if (index !== -1) {
    transactions.value[index] = updatedTransaction
  }
}

// ဒီ Function တွေကို Component တွေမှာ သုံးလို့ရအောင် Export လုပ်မယ်
export const useTransactions = () => {
  return {
    transactions,
    addTransaction,
    deleteTransaction,
    updateTransaction
  }
}