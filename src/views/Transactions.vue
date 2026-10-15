<!-- src/views/Transactions.vue -->
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Transaction } from '../types'
import AddTransactionModal from '../components/AddTransactionModal.vue'
import ConfirmModal from '../components/ConfirmModal.vue'
import EmptyState from '../components/EmptyState.vue'
import { useTransactions } from '../composables/useTransactions'
import { useToast } from '../composables/useToast'
// Category Constant ကို Import လုပ်ပါ
import { allCategories } from '../constants/categories'

// ==================== Composables ====================
const { transactions, addTransaction, deleteTransaction, updateTransaction } = useTransactions()
const { showToast } = useToast()

// ==================== Modal State ====================
const isModalOpen = ref(false)
const isConfirmOpen = ref(false)
const editingTransaction = ref<Transaction | null>(null)

const openAddModal = () => {
  editingTransaction.value = null
  isModalOpen.value = true
}

const openEditModal = (transaction: Transaction) => {
  editingTransaction.value = { ...transaction }
  isModalOpen.value = true
}

const handleSaveTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
  addTransaction(newTransaction)
  isModalOpen.value = false
  editingTransaction.value = null
  showToast('Transaction added successfully!', 'success')
}

const handleUpdateTransaction = (updatedTransaction: Transaction) => {
  updateTransaction(updatedTransaction)
  isModalOpen.value = false
  editingTransaction.value = null
  showToast('Transaction updated successfully!', 'success')
}

const handleDelete = (id: string | number) => {
  deleteTransaction(id)
  selectedIds.value = selectedIds.value.filter(selectedId => selectedId !== id)
  showToast('Transaction deleted successfully!', 'success')
}

// ==================== Filter State ====================
const searchQuery = ref('')
const filterType = ref('All types')
const filterCategory = ref('All categories')
const dateFrom = ref('')
const dateTo = ref('')

// ==================== Pagination State ====================
const currentPage = ref(1)
const itemsPerPage = ref(5)
const perPageOptions = [5, 10, 25, 50]

// ==================== Selection State ====================
const selectedIds = ref<Array<string | number>>([])

// ==================== Filtered Transactions ====================
// const filteredTransactions = computed(() => {
//   return transactions.value.filter(t => {
//     const search = searchQuery.value.toLowerCase()
//     const matchesSearch = search === '' || 
//       t.note?.toLowerCase().includes(search) ||
//       t.category.toLowerCase().includes(search) ||
//       t.amount.toString().includes(search) ||
//       t.date.includes(search)
//     const matchesType = filterType.value === 'All types' || t.type === filterType.value.toLowerCase()
//     const matchesCategory = filterCategory.value === 'All categories' || t.category === filterCategory.value
//     const matchesDateFrom = !dateFrom.value || t.date >= dateFrom.value
//     const matchesDateTo = !dateTo.value || t.date <= dateTo.value
//     return matchesSearch && matchesType && matchesCategory && matchesDateFrom && matchesDateTo
//   })
// }) Update
const filteredTransactions = computed(() => {
  const search = searchQuery.value.trim().toLowerCase()

  return transactions.value.filter((t) => {
    // Search: Note, Category, Amount, Date, Type
    const matchesSearch =
      search === '' ||
      (t.note ?? '').toLowerCase().includes(search) ||
      t.category.toLowerCase().includes(search) ||
      t.type.toLowerCase().includes(search) ||
      String(t.amount).includes(search) ||
      t.date.includes(search) ||
      t.date.split('-').reverse().join('/').includes(search)

    // Filter by transaction type
    const matchesType =
      filterType.value === 'All types' ||
      t.type === filterType.value

    // Filter by category
    const matchesCategory =
      filterCategory.value === 'All categories' ||
      t.category === filterCategory.value

    // Filter by date range
    const matchesDateFrom =
      !dateFrom.value || t.date >= dateFrom.value

    const matchesDateTo =
      !dateTo.value || t.date <= dateTo.value

    return (
      matchesSearch &&
      matchesType &&
      matchesCategory &&
      matchesDateFrom &&
      matchesDateTo
    )
  })
})//Update

// ==================== Pagination Computed ====================
const totalPages = computed(() => Math.ceil(filteredTransactions.value.length / itemsPerPage.value) || 1)
const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredTransactions.value.slice(start, end)
})
const showingStart = computed(() => filteredTransactions.value.length === 0 ? 0 : (currentPage.value - 1) * itemsPerPage.value + 1)
const showingEnd = computed(() => Math.min(currentPage.value * itemsPerPage.value, filteredTransactions.value.length))

// ==================== Selection Computed ====================
const allFilteredIds = computed(() => filteredTransactions.value.map(t => t.id))
const isAllSelected = computed(() => {
  if (allFilteredIds.value.length === 0) return false
  return allFilteredIds.value.every(id => selectedIds.value.includes(id))
})
const selectedCount = computed(() => selectedIds.value.length)

// ==================== Selection Methods ====================
const toggleSelection = (id: string | number) => {
  const index = selectedIds.value.indexOf(id)
  if (index === -1) {
    selectedIds.value.push(id)
  } else {
    selectedIds.value.splice(index, 1)
  }
}

// const toggleSelectAll = () => {
//   if (isAllSelected.value) {
//     selectedIds.value = []
//   } else {
//     selectedIds.value = [...allFilteredIds.value]
//   }
// }Update
const toggleSelectAll = () => {
  const visibleIds = filteredTransactions.value.map(t => t.id)

  if (isAllSelected.value) {
    // လက်ရှိ Filter ရလဒ်ထဲက ID တွေကိုသာ ဖြုတ်မယ်
    selectedIds.value = selectedIds.value.filter(
      id => !visibleIds.includes(id)
    )
  } else {
    // လက်ရှိ Filter ရလဒ်ထဲက ID တွေကို ထပ်ထည့်မယ်
    selectedIds.value = [
      ...new Set([...selectedIds.value, ...visibleIds])
    ]
  }
}//Update

const clearSelection = () => {
  selectedIds.value = []
}

const openDeleteConfirm = () => {
  if (selectedIds.value.length === 0) return
  isConfirmOpen.value = true
}

const confirmDeleteSelected = () => {
  const count = selectedIds.value.length
  selectedIds.value.forEach(id => {
    deleteTransaction(id)
  })
  clearSelection()
  isConfirmOpen.value = false
  showToast(`${count} transactions deleted successfully!`, 'success')
  if (currentPage.value > totalPages.value) {
    currentPage.value = Math.max(1, totalPages.value)
  }
}

// ==================== Pagination Methods ====================
const nextPage = () => { 
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => { 
  if (currentPage.value > 1) currentPage.value--
}

const handlePerPageChange = () => { 
  currentPage.value = 1 
}

// ==================== Clear Filters ====================
const clearFilters = () => {
  searchQuery.value = ''
  filterType.value = 'All types'
  filterCategory.value = 'All categories'
  dateFrom.value = ''
  dateTo.value = ''
  currentPage.value = 1
  clearSelection()
}

const hasActiveFilters = computed(() => {
  return (
    searchQuery.value.trim() !== '' ||
    filterType.value !== 'All types' ||
    filterCategory.value !== 'All categories' ||
    dateFrom.value !== '' ||
    dateTo.value !== ''
  )
})

// ==================== Watchers ====================
watch([searchQuery, filterType, filterCategory, dateFrom, dateTo], () => {
  currentPage.value = 1
})

// ==================== Summary ====================
const totalIncome = computed(() => filteredTransactions.value.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0))
const totalExpense = computed(() => filteredTransactions.value.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0))
const balance = computed(() => totalIncome.value - totalExpense.value)

const formatCurrency = (value: number) => new Intl.NumberFormat('en-US').format(value)
</script>

<template>
  <div class="p-8 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Transactions</h2>
        <p class="text-sm text-gray-500 mt-1">{{ filteredTransactions.length }} of {{ transactions.length }} entries</p>
      </div>
      <button @click="openAddModal" class="btn-primary">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
        Add transaction
      </button>
    </div>

    <!-- Filters & Summary -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input v-model="searchQuery" type="text" placeholder="Search notes, categories, amounts or dates" class="input-field" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select v-model="filterType" class="input-field">
            <option>All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <!-- Category Dropdown မှာ allCategories ကို v-for နဲ့ ပြမယ် -->
          <select v-model="filterCategory" class="input-field">
            <option>All categories</option>
            <option v-for="cat in allCategories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">From</label>
          <input v-model="dateFrom" type="date" class="input-field" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">To</label>
          <input v-model="dateTo" type="date" class="input-field" />
        </div>
      </div>

      
<div class="flex items-center justify-between gap-4 pt-4 border-t border-gray-100">

  <!-- Left: Original Summary Design -->
  <div class="flex items-center gap-6 text-sm">
    <div>
      Income
      <span class="font-bold text-emerald-600">
        MMK {{ formatCurrency(totalIncome) }}
      </span>
    </div>

    <div>
      Expenses
      <span class="font-bold text-red-600">
        MMK {{ formatCurrency(totalExpense) }}
      </span>
    </div>

    <div>
      Balance
      <span class="font-bold text-gray-900">
        MMK {{ formatCurrency(balance) }}
      </span>
    </div>
  </div>

  <!-- Right: Clear Filters -->
  
<button
  v-if="hasActiveFilters"
  @click="clearFilters"
  type="button"
  class="flex-shrink-0 inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
>
  <svg
    class="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M4 4v5h5M20 20v-5h-5M5.6 9A7 7 0 0118 6l2 3M18.4 15A7 7 0 016 18l-2-3"
    />
  </svg>
  Clear Filters
</button>


</div>

    </div>

    <!-- Table Section -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      
      <!-- Select All Checkbox & Action Bar -->
      <div v-if="filteredTransactions.length > 0" class="px-6 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <label class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
          <input 
            type="checkbox" 
            :checked="isAllSelected"
            @change="toggleSelectAll"
            class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4" 
          />
          Select all ({{ filteredTransactions.length }})
        </label>

        <div v-if="selectedCount > 0" class="flex items-center gap-3 animate-in fade-in duration-200">
          <span class="text-sm font-medium text-gray-700">
            {{ selectedCount }} selected
          </span>
          <button 
            @click="clearSelection"
            class="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            Clear
          </button>
          <button 
            @click="openDeleteConfirm"
            class="flex items-center gap-1.5 px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            Delete selected
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <EmptyState 
        v-if="filteredTransactions.length === 0" 
        @clear-filters="clearFilters" 
      />

      <!-- Table -->
      <table v-else class="w-full">
        <thead class="bg-white border-b border-gray-100">
          <tr>
            <th class="w-12 px-6 py-3">
              <input 
                type="checkbox" 
                :checked="isAllSelected"
                @change="toggleSelectAll"
                class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4" 
              />
            </th>
            <th class="th-text">TRANSACTION</th>
            <th class="th-text">CATEGORY</th>
            <th class="th-text">DATE</th>
            <th class="th-text">NOTE</th>
            <th class="th-text text-right">AMOUNT</th>
            <th class="th-text text-right">ACTIONS</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr 
            v-for="t in paginatedTransactions" 
            :key="t.id" 
            :class="['hover:bg-gray-50 transition-colors', selectedIds.includes(t.id) ? 'bg-indigo-50/50' : '']"
          >
            <td class="px-6 py-4">
              <input 
                type="checkbox" 
                :checked="selectedIds.includes(t.id)"
                @change="toggleSelection(t.id)"
                class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4" 
              />
            </td>
            <td class="td-text font-medium capitalize" :class="t.type === 'income' ? 'text-emerald-600' : 'text-red-600'">
              {{ t.type }}
            </td>
            <td class="td-text">{{ t.category }}</td>
            <td class="td-text">{{ t.date }}</td>
            <td class="td-text text-gray-500">{{ t.note || '-' }}</td>
            <td class="td-text text-right font-medium" :class="t.type === 'income' ? 'text-emerald-600' : 'text-red-600'">
              {{ t.type === 'income' ? '+' : '-' }}MMK {{ formatCurrency(t.amount) }}
            </td>
            <td class="td-text text-right">
              <div class="flex justify-end gap-2">
                <button @click="openEditModal(t)" class="text-indigo-600 hover:text-indigo-800 p-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </button>
                <button @click="handleDelete(t.id)" class="text-red-500 hover:text-red-700 p-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination Footer -->
      <div v-if="filteredTransactions.length > 0" class="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50">
        <p class="text-sm text-gray-500">
          Showing <span class="font-medium text-gray-700">{{ showingStart }}</span> 
          – 
          <span class="font-medium text-gray-700">{{ showingEnd }}</span> 
          of 
          <span class="font-medium text-gray-700">{{ filteredTransactions.length }}</span>
        </p>
        
        <div class="flex items-center gap-2">
          <select v-model.number="itemsPerPage" @change="handlePerPageChange" class="text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 py-1.5 pl-3 pr-8 bg-white">
            <option v-for="option in perPageOptions" :key="option" :value="option">{{ option }} per page</option>
          </select>

          <button @click="prevPage" :disabled="currentPage === 1"
            :class="['px-3 py-1.5 text-sm border rounded-md transition-colors', currentPage === 1 ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50']">
            Prev
          </button>

          <span class="text-sm text-gray-600 px-2">{{ currentPage }} / {{ totalPages }}</span>

          <button @click="nextPage" :disabled="currentPage === totalPages"
            :class="['px-3 py-1.5 text-sm border rounded-md transition-colors', currentPage === totalPages ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50']">
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Add / Edit Transaction Modal -->
    <AddTransactionModal 
      :isOpen="isModalOpen" 
      :editTransaction="editingTransaction"
      @close="isModalOpen = false; editingTransaction = null" 
      @save="handleSaveTransaction" 
      @update="handleUpdateTransaction"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmModal 
      :isOpen="isConfirmOpen"
      title="Delete transactions"
      message="You are about to permanently delete these items. This action cannot be undone."
      confirmText="Delete"
      cancelText="Cancel"
      :count="selectedCount"
      @confirm="confirmDeleteSelected"
      @cancel="isConfirmOpen = false"
    />
  </div>
</template>