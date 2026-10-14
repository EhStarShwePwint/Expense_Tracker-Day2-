import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Transaction } from '../types'

export const useExpenseStore = defineStore('expense', () => {
  // ============================
  // State
  // ============================
  const transactions = ref<Transaction[]>([])
//   const budgets = ref<Budget[]>([])

  // ============================
  // localStorage
  // ============================
  const loadFromStorage = () => {
    const savedTx = localStorage.getItem('transactions')
    // const savedBg = localStorage.getItem('budgets')
    if (savedTx) transactions.value = JSON.parse(savedTx)
    // if (savedBg) budgets.value = JSON.parse(savedBg)
  }

  const saveToStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions.value))
    // localStorage.setItem('budgets', JSON.stringify(budgets.value))
  }

  // ============================
  // Transaction CRUD
  // ============================
  const addTransaction = (t: Transaction) => {
    transactions.value.push(t)
    saveToStorage()
  }

  const removeTransaction = (id: string | number) => {
    transactions.value = transactions.value.filter(t => t.id !== id)
    saveToStorage()
  }

  // ============================
  // Budget CRUD
  // ============================
//   const addBudget = (b: Budget) => {
//     // category တူတာ ရှိရင် အသစ် မထည့်ဘဲ update လုပ်
//     const existing = budgets.value.find(x => x.category === b.category)
//     if (existing) {
//       existing.limitAmount = b.limitAmount
//     } else {
//       budgets.value.push(b)
//     }
//     saveToStorage()
//   }

//   const removeBudget = (category: string) => {
//     budgets.value = budgets.value.filter(b => b.category !== category)
//     saveToStorage()
//   }

  // ============================
  // Computed — Totals
  // ============================
  const totalIncome = computed(() =>
    transactions.value
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
  )

  const totalExpense = computed(() =>
    transactions.value
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
  )

  const balance = computed(() => totalIncome.value - totalExpense.value)

  // ============================
  // Computed — Category Expense (Budget အတွက်)
  // ============================
  // const expenseByCategory = computed(() => {
  //   // console.log(expenseByCategory.value)
  //   const result: Record<string, number> = {}
  //   transactions.value
  //     .filter(t => t.type === 'expense')
  //     .forEach(t => {
  //       result[t.category] = (result[t.category] || 0) + t.amount
  //     })
  //   return result
  // })

  return {
    // state
    transactions,
    // budgets,
    // methods
    loadFromStorage,
    addTransaction,
    removeTransaction,
    // addBudget,
    // removeBudget,
    // computed
    totalIncome,
    totalExpense,
    balance,
    // expenseByCategory,
  }
})