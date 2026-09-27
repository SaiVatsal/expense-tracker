import { create } from 'zustand';

export const useStore = create((set, get) => ({
  accounts: [
    { id: 'acc-1', name: 'Sylvan Prime Checking', balance: 28450.00, type: 'Checking', currency: 'USD' },
    { id: 'acc-2', name: 'High-Yield Treasury Vault', balance: 84300.00, type: 'Savings', currency: 'USD' },
    { id: 'acc-3', name: 'Venture Operating Credit', balance: 4200.00, type: 'Credit Card', currency: 'USD' }
  ],

  activeAccountId: 'all', // 'all' | 'acc-1' | 'acc-2' | 'acc-3'

  categories: [
    { id: 'cat-1', name: 'Cloud Infrastructure & SaaS', budget: 3500, spent: 2840, icon: 'Server', color: 'bg-emerald-700' },
    { id: 'cat-2', name: 'Office & Studio Lease', budget: 4200, spent: 4200, icon: 'Building', color: 'bg-teal-800' },
    { id: 'cat-3', name: 'Marketing & Ad Campaigns', budget: 2000, spent: 2450, icon: 'TrendingUp', color: 'bg-rose-700' }, // Overspent alert
    { id: 'cat-4', name: 'Travel & Client Hospitality', budget: 1500, spent: 920, icon: 'Plane', color: 'bg-amber-700' },
    { id: 'cat-5', name: 'Hardware & Lab Equipment', budget: 3000, spent: 1800, icon: 'Cpu', color: 'bg-emerald-900' }
  ],

  transactions: [
    {
      id: 'tx-101',
      date: '2026-09-26',
      merchant: 'AWS Cloud Services Europe',
      category: 'Cloud Infrastructure & SaaS',
      account: 'Sylvan Prime Checking',
      amount: -1240.50,
      type: 'expense',
      note: 'EC2 GPU compute cluster & S3 backup'
    },
    {
      id: 'tx-102',
      date: '2026-09-25',
      merchant: 'Client Retainer // Hyperion Corp',
      category: 'Consulting Retainer',
      account: 'Sylvan Prime Checking',
      amount: 14500.00,
      type: 'income',
      note: 'Q3 Enterprise Architecture advisory milestone'
    },
    {
      id: 'tx-103',
      date: '2026-09-24',
      merchant: 'Meta & LinkedIn Sponsored Placements',
      category: 'Marketing & Ad Campaigns',
      account: 'Venture Operating Credit',
      amount: -950.00,
      type: 'expense',
      note: 'Developer community recruitment push'
    },
    {
      id: 'tx-104',
      date: '2026-09-22',
      merchant: 'WeWork Sovereign Studio Lease',
      category: 'Office & Studio Lease',
      account: 'Sylvan Prime Checking',
      amount: -4200.00,
      type: 'expense',
      note: 'Monthly 10-person private design suite'
    }
  ],

  recurringSchedules: [
    { id: 'rec-1', name: 'GitHub Enterprise & Copilot', amount: 480.00, frequency: 'Monthly', nextDate: '2026-10-01', autoDebit: true },
    { id: 'rec-2', name: 'Figma Organization Seats', amount: 360.00, frequency: 'Monthly', nextDate: '2026-10-05', autoDebit: true },
    { id: 'rec-3', name: 'Health & Dental Premium Pool', amount: 1850.00, frequency: 'Monthly', nextDate: '2026-10-01', autoDebit: true }
  ],

  emailDigestSent: false,

  // Actions
  setActiveAccountId: (id) => set({ activeAccountId: id }),

  addTransaction: (tx) => set((state) => {
    const isExpense = tx.type === 'expense';
    const amountVal = isExpense ? -Math.abs(Number(tx.amount)) : Math.abs(Number(tx.amount));

    const newTx = {
      id: `tx-${Date.now()}`,
      date: tx.date || '2026-09-27',
      merchant: tx.merchant,
      category: tx.category,
      account: tx.account || 'Sylvan Prime Checking',
      amount: amountVal,
      type: tx.type,
      note: tx.note || ''
    };

    // Update categories if expense
    const updatedCategories = state.categories.map((c) => {
      if (c.name === tx.category && isExpense) {
        return { ...c, spent: c.spent + Math.abs(amountVal) };
      }
      return c;
    });

    return {
      transactions: [newTx, ...state.transactions],
      categories: updatedCategories
    };
  }),

  deleteTransaction: (id) => set((state) => ({
    transactions: state.transactions.filter((t) => t.id !== id)
  })),

  updateCategoryBudget: (categoryId, newBudget) => set((state) => ({
    categories: state.categories.map((c) =>
      c.id === categoryId ? { ...c, budget: Number(newBudget) } : c
    )
  })),

  triggerEmailDigest: () => set({ emailDigestSent: true })
}));
