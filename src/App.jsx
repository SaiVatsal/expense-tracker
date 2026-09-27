import React, { useState } from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertTriangle,
  Plus,
  Download,
  Mail,
  PieChart,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Trash2,
  CheckCircle2,
  CreditCard,
  Building,
  Sliders,
  X
} from 'lucide-react';
import { useStore } from './store/useStore';

export default function App() {
  const {
    accounts,
    activeAccountId,
    setActiveAccountId,
    categories,
    transactions,
    recurringSchedules,
    emailDigestSent,
    addTransaction,
    deleteTransaction,
    updateCategoryBudget,
    triggerEmailDigest
  } = useStore();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddTxModal, setShowAddTxModal] = useState(false);
  const [txMerchant, setTxMerchant] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txType, setTxType] = useState('expense');
  const [txCategory, setTxCategory] = useState('Cloud Infrastructure & SaaS');
  const [txAccount, setTxAccount] = useState('Sylvan Prime Checking');
  const [txNote, setTxNote] = useState('');

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.note.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleAddTx = (e) => {
    e.preventDefault();
    if (!txMerchant.trim() || !txAmount) return;
    addTransaction({
      merchant: txMerchant,
      amount: txAmount,
      type: txType,
      category: txCategory,
      account: txAccount,
      note: txNote
    });
    setShowAddTxModal(false);
    setTxMerchant('');
    setTxAmount('');
    setTxNote('');
  };

  const handleExportCSV = () => {
    const headers = 'ID,Date,Merchant/Entity,Category,Account,Type,Amount,Note\n';
    const rows = transactions.map((t) =>
      `"${t.id}","${t.date}","${t.merchant}","${t.category}","${t.account}","${t.type}",${t.amount},"${t.note}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Sylvan_Financial_Ledger_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#faf8f0] text-emerald-950 flex flex-col justify-between">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#f4f0df]/90 backdrop-blur-md border-b border-emerald-900/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-900 text-cream-100 flex items-center justify-center font-black shadow-md shadow-emerald-900/20">
              <Wallet className="w-5 h-5 text-[#fefae0]" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-emerald-950 block leading-none">
                SYLVAN WEALTH
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-700 font-semibold">
                Fiscal Ledger & Multi-Account Treasury
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="hidden md:flex items-center gap-1 bg-[#eae5cf] p-1 rounded-2xl border border-emerald-900/10 text-xs font-semibold text-emerald-800">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-xl transition ${activeTab === 'dashboard' ? 'bg-emerald-900 text-white font-bold shadow-sm' : 'hover:text-emerald-950'}`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-4 py-2 rounded-xl transition ${activeTab === 'transactions' ? 'bg-emerald-900 text-white font-bold shadow-sm' : 'hover:text-emerald-950'}`}
            >
              Transactions ({transactions.length})
            </button>
            <button
              onClick={() => setActiveTab('budgets')}
              className={`px-4 py-2 rounded-xl transition ${activeTab === 'budgets' ? 'bg-emerald-900 text-white font-bold shadow-sm' : 'hover:text-emerald-950'}`}
            >
              Budgets & Limits
            </button>
            <button
              onClick={() => setActiveTab('recurring')}
              className={`px-4 py-2 rounded-xl transition ${activeTab === 'recurring' ? 'bg-emerald-900 text-white font-bold shadow-sm' : 'hover:text-emerald-950'}`}
            >
              Recurring
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3 py-2 bg-[#eae5cf] hover:bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold border border-emerald-900/10 transition flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Export CSV</span>
            </button>
            <button
              onClick={() => setShowAddTxModal(true)}
              className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-900/20 transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Log Entry
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-8 w-full flex-1">
        {/* VIEW 1: OVERVIEW DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-emerald-900 text-cream-100 rounded-3xl p-6 shadow-xl space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-300 font-bold">
                  Aggregate Liquid Treasury
                </span>
                <div className="text-3xl font-black font-mono-fig text-[#fefae0]">
                  ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-200">
                  <CreditCard className="w-3.5 h-3.5" /> Across 3 Active Institutional Vaults
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase font-bold text-emerald-700">Monthly Inflow</span>
                  <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black font-mono-fig text-emerald-900">
                  +${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <span className="text-[11px] text-emerald-600 font-medium">Retainers & Invoiced Settlements</span>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase font-bold text-rose-700">Monthly Outflow</span>
                  <div className="w-7 h-7 rounded-full bg-rose-100 flex items-center justify-center text-rose-800">
                    <ArrowDownRight className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black font-mono-fig text-rose-700">
                  -${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <span className="text-[11px] text-slate-500 font-medium">SaaS, Studio Infrastructure & Payroll</span>
              </div>
            </div>

            {/* Overspend Alert Banners */}
            {categories.filter((c) => c.spent > c.budget).map((cat) => (
              <div key={cat.id} className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-xs text-rose-900">Budget Limit Exceeded: {cat.name}</h4>
                    <p className="text-[11px] text-rose-700">
                      Spent ${cat.spent.toLocaleString()} against assigned threshold of ${cat.budget.toLocaleString()} (${(cat.spent - cat.budget).toLocaleString()} overspend)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('budgets')}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Adjust Limit
                </button>
              </div>
            ))}

            {/* Grid Breakdown & Recent Ledger */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Category Breakdown */}
              <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-emerald-800" /> Category Allocation Pulse
                </h3>
                <div className="space-y-3">
                  {categories.map((cat) => {
                    const pct = Math.min(100, Math.round((cat.spent / cat.budget) * 100));
                    const isOver = cat.spent > cat.budget;
                    return (
                      <div key={cat.id} className="p-3 bg-[#faf8f0] rounded-2xl border border-emerald-900/5 space-y-1.5">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="font-bold text-emerald-950">{cat.name}</span>
                          <span className={`font-mono-fig font-bold ${isOver ? 'text-rose-600' : 'text-emerald-800'}`}>
                            ${cat.spent} / ${cat.budget}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-emerald-900/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${isOver ? 'bg-rose-600' : 'bg-emerald-800'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Ledger */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-emerald-950 uppercase tracking-wider">
                    Recent Transactions Ledger
                  </h3>
                  <button
                    onClick={() => setActiveTab('transactions')}
                    className="text-xs font-bold text-emerald-800 hover:underline"
                  >
                    View All &rarr;
                  </button>
                </div>

                <div className="space-y-3">
                  {transactions.slice(0, 4).map((tx) => (
                    <div key={tx.id} className="p-4 bg-[#faf8f0] rounded-2xl border border-emerald-900/5 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-emerald-950">{tx.merchant}</h4>
                          <span className="text-[10px] bg-emerald-900/10 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                            {tx.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{tx.date} • {tx.account} • {tx.note}</p>
                      </div>

                      <div className="text-right">
                        <div className={`font-mono-fig text-sm font-black ${tx.type === 'income' ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {tx.type === 'income' ? `+$${tx.amount.toLocaleString()}` : `-$${Math.abs(tx.amount).toLocaleString()}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: TRANSACTIONS */}
        {activeTab === 'transactions' && (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-emerald-950">Complete Fiscal Ledger</h2>
                <p className="text-xs text-slate-500">Searchable income and expense records with account tags</p>
              </div>

              <input
                type="text"
                placeholder="Search merchant, notes, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white border border-emerald-900/15 rounded-xl px-4 py-2 text-xs text-emerald-950 placeholder-slate-400 focus:outline-none focus:border-emerald-800 w-full sm:w-72"
              />
            </div>

            <div className="bg-white rounded-3xl border border-emerald-900/10 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f4f0df] text-emerald-900 border-b border-emerald-900/10 font-bold uppercase font-mono">
                  <tr>
                    <th className="p-4">Date</th>
                    <th className="p-4">Merchant / Source</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Account</th>
                    <th className="p-4 text-right">Amount</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/5 font-medium text-slate-700">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[#faf8f0]">
                      <td className="p-4 font-mono font-semibold">{tx.date}</td>
                      <td className="p-4">
                        <div className="font-bold text-emerald-950">{tx.merchant}</div>
                        <div className="text-[10px] text-slate-400">{tx.note}</div>
                      </td>
                      <td className="p-4">
                        <span className="text-[10px] bg-emerald-900/10 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                          {tx.category}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600">{tx.account}</td>
                      <td className={`p-4 text-right font-mono-fig font-black ${tx.type === 'income' ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {tx.type === 'income' ? `+$${tx.amount.toLocaleString()}` : `-$${Math.abs(tx.amount).toLocaleString()}`}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => deleteTransaction(tx.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 3: BUDGETS & LIMITS */}
        {activeTab === 'budgets' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-bold text-emerald-950">Departmental Budget Ceilings</h2>
                <p className="text-xs text-slate-500 mt-0.5">Define category thresholds to automatically detect and flag burn-rate spikes</p>
              </div>

              <div className="space-y-4">
                {categories.map((cat) => (
                  <div key={cat.id} className="p-4 bg-[#faf8f0] rounded-2xl border border-emerald-900/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-xs text-emerald-950">{cat.name}</h4>
                        <span className={`text-xs font-mono-fig font-bold ${cat.spent > cat.budget ? 'text-rose-600' : 'text-emerald-800'}`}>
                          ${cat.spent.toLocaleString()} spent of ${cat.budget.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-emerald-900/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${cat.spent > cat.budget ? 'bg-rose-600' : 'bg-emerald-800'}`}
                          style={{ width: `${Math.min(100, Math.round((cat.spent / cat.budget) * 100))}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[11px] font-bold text-slate-500">Cap: $</span>
                      <input
                        type="number"
                        defaultValue={cat.budget}
                        onBlur={(e) => updateCategoryBudget(cat.id, e.target.value)}
                        className="w-24 bg-white border border-emerald-900/20 rounded-xl px-2.5 py-1 text-xs font-mono-fig font-bold text-emerald-950 focus:outline-none focus:border-emerald-800"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: RECURRING EXPENSE SCHEDULER */}
        {activeTab === 'recurring' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-emerald-950">Recurring Commitments & Subscriptions</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Automated schedules and upcoming month-end debit forecasts</p>
                </div>
                <button
                  onClick={triggerEmailDigest}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    emailDigestSent ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-emerald-900 text-white hover:bg-emerald-800'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  {emailDigestSent ? 'Digest Dispatched!' : 'Send Monthly Digest Email'}
                </button>
              </div>

              <div className="space-y-3">
                {recurringSchedules.map((rec) => (
                  <div key={rec.id} className="p-4 bg-[#faf8f0] rounded-2xl border border-emerald-900/10 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-emerald-950">{rec.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Frequency: {rec.frequency} • Next Billing Date: {rec.nextDate}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-mono-fig text-base font-black text-emerald-900">
                        ${rec.amount.toFixed(2)}
                      </div>
                      <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                        Auto-Debit Armed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: ADD TRANSACTION */}
      {showAddTxModal && (
        <div className="fixed inset-0 z-50 bg-emerald-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-emerald-900/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-900/10">
              <h3 className="text-sm font-bold text-emerald-950">Record Fiscal Transaction</h3>
              <button onClick={() => setShowAddTxModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddTx} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTxType('expense')}
                  className={`py-2 rounded-xl text-xs font-bold border transition ${txType === 'expense' ? 'bg-rose-50 border-rose-500 text-rose-700' : 'bg-[#faf8f0] border-emerald-900/10 text-slate-600'}`}
                >
                  Expense Outflow
                </button>
                <button
                  type="button"
                  onClick={() => setTxType('income')}
                  className={`py-2 rounded-xl text-xs font-bold border transition ${txType === 'income' ? 'bg-emerald-50 border-emerald-600 text-emerald-800' : 'bg-[#faf8f0] border-emerald-900/10 text-slate-600'}`}
                >
                  Income Inflow
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Entity / Merchant</label>
                <input
                  type="text"
                  placeholder="E.g., Supabase Cloud Hosting"
                  value={txMerchant}
                  onChange={(e) => setTxMerchant(e.target.value)}
                  className="w-full bg-[#faf8f0] border border-emerald-900/15 rounded-xl px-3 py-2 text-xs text-emerald-950 focus:outline-none focus:border-emerald-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Amount ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    className="w-full bg-[#faf8f0] border border-emerald-900/15 rounded-xl px-3 py-2 text-xs font-mono-fig font-bold text-emerald-950 focus:outline-none focus:border-emerald-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Category</label>
                  <select
                    value={txCategory}
                    onChange={(e) => setTxCategory(e.target.value)}
                    className="w-full bg-[#faf8f0] border border-emerald-900/15 rounded-xl px-2.5 py-2 text-xs text-emerald-950 focus:outline-none focus:border-emerald-800"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                    <option value="Consulting Retainer">Consulting Retainer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Account Vault</label>
                <select
                  value={txAccount}
                  onChange={(e) => setTxAccount(e.target.value)}
                  className="w-full bg-[#faf8f0] border border-emerald-900/15 rounded-xl px-3 py-2 text-xs text-emerald-950 focus:outline-none focus:border-emerald-800"
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.name}>{a.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Memo / Purpose</label>
                <input
                  type="text"
                  placeholder="Optional note..."
                  value={txNote}
                  onChange={(e) => setTxNote(e.target.value)}
                  className="w-full bg-[#faf8f0] border border-emerald-900/15 rounded-xl px-3 py-2 text-xs text-emerald-950 focus:outline-none focus:border-emerald-800"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTxModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs"
                >
                  Post Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-emerald-900/10 bg-[#f4f0df] py-6 text-center text-xs text-emerald-800 font-mono">
        © 2026 SYLVAN WEALTH MANAGEMENT. FIREBASE FIRESTORE REAL-TIME TRANSACTION PIPELINE.
      </footer>
    </div>
  );
}
