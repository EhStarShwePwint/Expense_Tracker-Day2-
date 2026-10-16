<!-- src/components/AddTransactionModal.vue -->
<script setup lang="ts">
import { ref, watch, computed } from "vue";
import type { Transaction, TransactionType } from "../types";
// Category Constant ကို Import လုပ်ပါ
import { expenseCategories, incomeCategories } from "../constants/categories";

const props = defineProps<{
  isOpen: boolean;
  editTransaction?: Transaction | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "save", transaction: Omit<Transaction, "id">): void;
  (e: "update", transaction: Transaction): void;
}>();

// ==================== Form Data ====================
const form = ref({
  type: "income" as TransactionType,
  amount: null as number | null,
  date: new Date().toISOString().split("T")[0],
  category: "Food",
  note: "",
});

const errors = ref({
  amount: "",
  category: "",
});

// ==================== Computed ====================
// လက်ရှိ Type အလိုက် ပြသရမယ့် Category List
const availableCategories = computed(() => {
  return form.value.type === "expense" ? expenseCategories : incomeCategories;
});

// ==================== Watch: Type ပြောင်းတိုင်း Category ကို ပြောင်းမယ် ====================
watch(
  () => form.value.type,
  (newType) => {
    form.value.category =
      newType === "expense" ? expenseCategories[0] : incomeCategories[0];
  },
);

// ==================== Watch: Modal ဖွင့်/ပိတ် ====================
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      if (props.editTransaction) {
        form.value = {
          type: props.editTransaction.type,
          amount: props.editTransaction.amount,
          date: props.editTransaction.date,
          category: props.editTransaction.category,
          note: props.editTransaction.note || "",
        };
      } else {
        resetForm();
      }
    }
  },
);

const resetForm = () => {
  form.value = {
    type: "expense",
    amount: null,
    date: new Date().toISOString().split("T")[0],
    category: expenseCategories[0],
    note: "",
  };
  errors.value = { amount: "", category: "" };
};

const handleSave = () => {
  errors.value = { amount: "", category: "" };
  let isValid = true;

  if (!form.value.amount || form.value.amount <= 0) {
    errors.value.amount = "Amount is required and must be greater than 0";
    isValid = false;
  }
  if (!form.value.category) {
    errors.value.category = "Category is required";
    isValid = false;
  }

  if (isValid) {
    if (props.editTransaction) {
      emit("update", {
        id: props.editTransaction.id,
        type: form.value.type,
        amount: form.value.amount as number,
        date: form.value.date,
        category: form.value.category,
        note: form.value.note || null,
      });
    } else {
      emit("save", {
        type: form.value.type,
        amount: form.value.amount as number,
        date: form.value.date,
        category: form.value.category,
        note: form.value.note || null,
      });
    }
  }
};
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
  >
    <div
      class="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200"
    >
      <!-- Modal Header -->
      <div
        class="flex justify-between items-center px-6 py-4 border-b border-gray-100"
      >
        <h3 class="text-lg font-semibold text-gray-900">
          {{ editTransaction ? "Edit transaction" : "Add transaction" }}
        </h3>
        <button
          @click="emit('close')"
          class="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <font-awesome-icon :icon="['fas', 'xmark']" class="w-5 h-5" />
        </button>
      </div>

      <!-- ✅ Form Tag နဲ့ ခြုံပါ -->
      <form @submit.prevent="handleSave">
        <div class="p-6 space-y-4">
          <!-- Type Toggle -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Type</label
            >
            <div class="flex bg-gray-100 rounded-lg p-1">
              <!-- ✅ type="button" ထည့်ပါ -->
              <button
                type="button"
                @click="form.type = 'expense'"
                :class="[
                  'flex-1 py-2 text-sm font-medium rounded-md transition-all',
                  form.type === 'expense'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700',
                ]"
              >
                Expenses
              </button>
              <!-- ✅ type="button" ထည့်ပါ -->
              <button
                type="button"
                @click="form.type = 'income'"
                :class="[
                  'flex-1 py-2 text-sm font-medium rounded-md transition-all',
                  form.type === 'income'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700',
                ]"
              >
                Income
              </button>
            </div>
          </div>

          <!-- Amount & Date -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Amount <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="form.amount"
                type="number"
                placeholder="0.00"
                class="input-field"
                :class="
                  errors.amount ? 'border-red-500 focus:ring-red-500' : ''
                "
              />
              <p v-if="errors.amount" class="text-red-500 text-xs mt-1">
                {{ errors.amount }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Date <span class="text-red-500">*</span>
              </label>
              <input v-model="form.date" type="date" class="input-field" />
            </div>
          </div>

          <!-- Category (Dynamic) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Category <span class="text-red-500">*</span>
            </label>
            <select v-model="form.category" class="input-field">
              <option
                v-for="cat in availableCategories"
                :key="cat"
                :value="cat"
              >
                {{ cat }}
              </option>
            </select>
            <!-- <p v-if="errors.category" class="text-red-500 text-xs mt-1">
              {{ errors.category }}
            </p> -->
          </div>

          <!-- Note -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Note (optional)</label
            >
            <input
              v-model="form.note"
              type="text"
              placeholder="What was this for?"
              class="input-field"
            />
          </div>
        </div>

        <!-- ✅ Footer (Form အတွင်းမှာ ထားရမယ်) -->
        <div
          class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3"
        >
          <!-- ✅ type="button" ထည့်ပါ -->
          <button
            type="button"
            @click="emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <!-- ✅ type="submit" ပြောင်းပါ (@click ဖျက်ပါ) -->
          <button type="submit" class="btn-primary">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>
