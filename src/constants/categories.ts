// src/constants/categories.ts

// Expense Categories
export const expenseCategories = [
  'Food',
  'Transport',
  'Health',
  'Shopping',
  'Travel',
  'Fitness',
  'Bills & Fees',
  'Other Expense'
]

// Income Categories
export const incomeCategories = [
  'Salary',
  'Freelance',
  'Investment',
  'Gift',
  'Other Income'
]

// Filter Dropdown အတွက် Category အားလုံး ပေါင်းထားတဲ့ List
export const allCategories = [
  ...expenseCategories,
  ...incomeCategories
]