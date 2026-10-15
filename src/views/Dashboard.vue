<!-- src/views/Dashboard.vue -->
<!-- src/views/Dashboard.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { useTransactions } from '../composables/useTransactions'

// Data ကို ယူမယ်
const { transactions } = useTransactions()

// ==================== Summary Cards ====================
const totalIncome = computed(() => 
  transactions.value.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
)

const totalExpense = computed(() => 
  transactions.value.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
)

const balance = computed(() => totalIncome.value - totalExpense.value)

// Categories Used (Expense + Income ရဲ့ Unique Categories အရေအတွက်)
const categoriesUsed = computed(() => {
  const incomeCats = new Set(transactions.value.filter(t => t.type === 'income').map(t => t.category))
  const expenseCats = new Set(transactions.value.filter(t => t.type === 'expense').map(t => t.category))
  return incomeCats.size + expenseCats.size
})

// Total Categories (Constant ထဲက စုစုပေါင်း)
const totalCategories = 13 // Expense 8 + Income 5

// Top Spending (အများဆုံး သုံးထားတဲ့ Category)
const topSpending = computed(() => {
  const expenseByCategory = transactions.value
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {} as Record<string, number>)
  
  const entries = Object.entries(expenseByCategory)
  if (entries.length === 0) return 0
  return Math.max(...entries.map(([_, amount]) => amount))
})

// ==================== Expense by Category ====================
const expenseByCategory = computed(() => {
  const grouped = transactions.value
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {} as Record<string, number>)
  
  const total = totalExpense.value
  
  return Object.entries(grouped)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0
    }))
    .sort((a, b) => b.amount - a.amount)
})

// Expense Category အရေအတွက်
const expenseCategoryCount = computed(() => expenseByCategory.value.length)

// ==================== Income by Category ====================
const incomeByCategory = computed(() => {
  const grouped = transactions.value
    .filter(t => t.type === 'income')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {} as Record<string, number>)
  
  const total = totalIncome.value
  
  return Object.entries(grouped)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0
    }))
    .sort((a, b) => b.amount - a.amount)
})

const incomeCategoryCount = computed(() => incomeByCategory.value.length)

// ==================== Recent Transactions ====================
const recentTransactions = computed(() => {
  // ရက်စွဲအလိုက် အသစ်ဆုံး ၅ ခုကို ယူမယ်
  return [...transactions.value]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
})

// ==================== Format Currency ====================
const formatCurrency = (value: number) => new Intl.NumberFormat('en-US').format(value)
</script>

<template>
  <div class="p-8 max-w-7xl mx-auto">
    
    <!-- Page Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p class="text-sm text-gray-500 mt-1">{{ transactions.length }} transactions tracked</p>
      </div>
      <router-link to="/transactions" class="btn-primary">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
        Add transaction
      </router-link>
    </div>

    <!-- ==================== Summary Cards ==================== -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      <!-- Balance Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-start gap-4">
        <div class="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
          <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Balance</p>
          <p class="text-xl font-bold text-gray-900 truncate">MMK {{ formatCurrency(balance) }}</p>
          <p class="text-xs text-gray-400 mt-1">Income minus expenses</p>
        </div>
      </div>

      <!-- Total Income Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-start gap-4">
        <div class="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
          <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Total Income</p>
          <p class="text-xl font-bold text-gray-900 truncate">MMK {{ formatCurrency(totalIncome) }}</p>
          <p class="text-xs text-gray-400 mt-1">All recorded earnings</p>
        </div>
      </div>

      <!-- Total Expense Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-start gap-4">
        <div class="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
          <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Total Expense</p>
          <p class="text-xl font-bold text-gray-900 truncate">MMK {{ formatCurrency(totalExpense) }}</p>
          <p class="text-xs text-gray-400 mt-1">All recorded spending</p>
        </div>
      </div>

      <!-- Categories Used Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-start gap-4">
        <div class="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
          <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Categories Used</p>
          <p class="text-xl font-bold text-gray-900 truncate">{{ categoriesUsed }} of {{ totalCategories }}</p>
          <p class="text-xs text-gray-400 mt-1">Top spend: {{ formatCurrency(topSpending) }}</p>
        </div>
      </div>
    </div>

    <!-- ==================== Expense & Income by Category ==================== -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      
      <!-- Expense by Category -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h3 class="text-base font-semibold text-gray-900">Expense by category</h3>
            <p class="text-xs text-gray-500 mt-0.5">MMK {{ formatCurrency(totalExpense) }} spent in total</p>
          </div>
          <span class="text-xs text-gray-400">{{ expenseCategoryCount }} categories</span>
        </div>

        <!-- Category List -->
        <div v-if="expenseByCategory.length > 0" class="space-y-4">
          <div v-for="item in expenseByCategory" :key="item.category">
            <div class="flex justify-between items-center mb-1.5">
              <span class="text-sm font-medium text-gray-700">{{ item.category }}</span>
              <div class="flex items-center gap-3">
                <span class="text-sm font-semibold text-gray-900">MMK {{ formatCurrency(item.amount) }}</span>
                <span class="text-xs text-gray-400 w-8 text-right">{{ item.percentage }}%</span>
              </div>
            </div>
            <!-- Progress Bar -->
            <div class="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div 
                class="bg-red-400 h-1.5 rounded-full transition-all duration-500"
                :style="{ width: item.percentage + '%' }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <p v-else class="text-sm text-gray-400 text-center py-8">No expense data yet.</p>
      </div>

      <!-- Income by Category -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h3 class="text-base font-semibold text-gray-900">Income by category</h3>
            <p class="text-xs text-gray-500 mt-0.5">MMK {{ formatCurrency(totalIncome) }} earned in total</p>
          </div>
          <span class="text-xs text-gray-400">{{ incomeCategoryCount }} categories</span>
        </div>

        <!-- Category List -->
        <div v-if="incomeByCategory.length > 0" class="space-y-4">
          <div v-for="item in incomeByCategory" :key="item.category">
            <div class="flex justify-between items-center mb-1.5">
              <span class="text-sm font-medium text-gray-700">{{ item.category }}</span>
              <div class="flex items-center gap-3">
                <span class="text-sm font-semibold text-gray-900">MMK {{ formatCurrency(item.amount) }}</span>
                <span class="text-xs text-gray-400 w-8 text-right">{{ item.percentage }}%</span>
              </div>
            </div>
            <!-- Progress Bar -->
            <div class="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div 
                class="bg-emerald-400 h-1.5 rounded-full transition-all duration-500"
                :style="{ width: item.percentage + '%' }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <p v-else class="text-sm text-gray-400 text-center py-8">No income data yet.</p>
      </div>
    </div>

    <!-- ==================== Recent Transactions ==================== -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex justify-between items-center mb-4">
        <div>
          <h3 class="text-base font-semibold text-gray-900">Recent transactions</h3>
          <p class="text-xs text-gray-500 mt-0.5">Last {{ recentTransactions.length }} entries</p>
        </div>
        <router-link 
          to="/transactions" 
          class="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          View All
        </router-link>
      </div>

      <!-- Recent List -->
      <div v-if="recentTransactions.length > 0" class="divide-y divide-gray-100">
        <div 
          v-for="t in recentTransactions" 
          :key="t.id" 
          class="flex justify-between items-center py-3"
        >
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">{{ t.note || t.category }}</p>
            <p class="text-xs text-gray-500 mt-0.5">
              {{ t.category }} • {{ t.date }}
            </p>
          </div>
          <div 
            class="text-sm font-semibold shrink-0 ml-4"
            :class="t.type === 'income' ? 'text-emerald-600' : 'text-red-600'"
          >
            {{ t.type === 'income' ? '+' : '-' }}MMK {{ formatCurrency(t.amount) }}
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <p v-else class="text-sm text-gray-400 text-center py-8">No transactions yet.</p>
    </div>

  </div>
</template>