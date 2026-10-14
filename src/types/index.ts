// ============================
// Transaction Data Model
// ============================
export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: string | number          // required
  type: TransactionType        // required
  amount: number               // required
  category: string             // required
  date: string                 // required (ISO string)
  note: string | null          // nullable
}

// ============================
// Budget Data Model
// ============================
export interface Budget {
  category: string             // required
  limitAmount: number          // required
}