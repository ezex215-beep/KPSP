import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Clock,
  ArrowDownRight,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import { Transaction, TransactionType, CategoryBudget } from '../types';
import { CategoryIcon } from './CategoryIcon';

interface TransactionsViewProps {
  transactions: Transaction[];
  categories: CategoryBudget[];
  onOpenAddModal: () => void;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  initialCategoryFilter?: string | null;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  categories,
  onOpenAddModal,
  onEditTransaction,
  onDeleteTransaction,
  initialCategoryFilter = null,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategoryFilter || 'all');
  const [showParamsMenu, setShowParamsMenu] = useState(false);
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc'>('date_desc');

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        // Type filter
        if (typeFilter !== 'all' && tx.type !== typeFilter) {
          return false;
        }
        // Category filter
        if (categoryFilter !== 'all' && tx.categoryId !== categoryFilter) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchTitle = tx.title.toLowerCase().includes(query);
          const matchCategory = tx.categoryName.toLowerCase().includes(query);
          const matchNotes = tx.notes?.toLowerCase().includes(query);
          const matchAmount = tx.amount.toString().includes(query);
          return matchTitle || matchCategory || matchNotes || matchAmount;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date_desc') {
          return new Date(`${b.date}T${b.time || '00:00'}`).getTime() - new Date(`${a.date}T${a.time || '00:00'}`).getTime();
        }
        if (sortBy === 'date_asc') {
          return new Date(`${a.date}T${a.time || '00:00'}`).getTime() - new Date(`${b.date}T${b.time || '00:00'}`).getTime();
        }
        if (sortBy === 'amount_desc') {
          return b.amount - a.amount;
        }
        if (sortBy === 'amount_asc') {
          return a.amount - b.amount;
        }
        return 0;
      });
  }, [transactions, searchQuery, typeFilter, categoryFilter, sortBy]);

  // Compute total for filtered
  const totalFilteredExpense = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalFilteredIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6 pb-24 md:pb-12">
      {/* Top Header Row with System Title and Action Controls */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#e2e2e8] tracking-tight">
            บันทึกกิจกรรม
          </h2>
          <p className="text-xs sm:text-sm font-mono-data text-[#849396] mt-1 tracking-wider uppercase">
            SYS.LOG // TRANSACTION_HISTORY
          </p>
        </div>

        {/* Search Bar & Parameter Filter button */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#849396]"
            />
            <input
              type="text"
              placeholder="สืบค้นระเบียน..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111318] border border-white/15 focus:border-[#00E5FF] rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#e2e2e8] placeholder:text-[#849396] focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#849396] hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowParamsMenu(!showParamsMenu)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                showParamsMenu || categoryFilter !== 'all' || sortBy !== 'date_desc'
                  ? 'bg-[#00E5FF]/15 border-[#00E5FF] text-[#00E5FF]'
                  : 'bg-[#111318] border-white/15 text-[#e2e2e8] hover:bg-[#1e2024]'
              }`}
            >
              <SlidersHorizontal size={16} />
              <span className="hidden sm:inline">พารามิเตอร์</span>
            </button>

            {/* Filter Dropdown */}
            {showParamsMenu && (
              <div className="absolute right-0 mt-2 w-72 glass-panel-elevated rounded-xl p-4 z-50 animate-in fade-in zoom-in-95 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#849396]">
                    ตัวกรองและเรียงลำดับ
                  </span>
                  <button
                    onClick={() => {
                      setCategoryFilter('all');
                      setSortBy('date_desc');
                      setShowParamsMenu(false);
                    }}
                    className="text-[11px] text-[#00E5FF] hover:underline"
                  >
                    รีเซ็ต
                  </button>
                </div>

                <div>
                  <label className="text-xs text-[#bac9cc] block mb-1.5 font-medium">
                    หมวดหมู่
                  </label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full bg-[#111318] border border-white/20 rounded-lg px-3 py-2 text-xs text-[#e2e2e8] focus:border-[#00E5FF] focus:outline-none"
                  >
                    <option value="all">ทุกหมวดหมู่</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.type === 'income' ? 'รายรับ' : 'รายจ่าย'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-[#bac9cc] block mb-1.5 font-medium">
                    เรียงตาม
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full bg-[#111318] border border-white/20 rounded-lg px-3 py-2 text-xs text-[#e2e2e8] focus:border-[#00E5FF] focus:outline-none"
                  >
                    <option value="date_desc">วันที่: ใหม่ล่าสุด → เก่าสุด</option>
                    <option value="date_asc">วันที่: เก่าสุด → ใหม่ล่าสุด</option>
                    <option value="amount_desc">จำนวนเงิน: มาก → น้อย</option>
                    <option value="amount_asc">จำนวนเงิน: น้อย → มาก</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Filter Tabs (ทั้งหมด / รายรับ / รายจ่าย) */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto">
        <button
          onClick={() => setTypeFilter('all')}
          className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
            typeFilter === 'all'
              ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF] neon-glow-primary'
              : 'text-[#849396] hover:text-[#e2e2e8] hover:bg-[#1e2024]'
          }`}
        >
          ทั้งหมด ({transactions.length})
        </button>

        <button
          onClick={() => setTypeFilter('income')}
          className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
            typeFilter === 'income'
              ? 'bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14] neon-glow-secondary'
              : 'text-[#849396] hover:text-[#e2e2e8] hover:bg-[#1e2024]'
          }`}
        >
          รายรับ
        </button>

        <button
          onClick={() => setTypeFilter('expense')}
          className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
            typeFilter === 'expense'
              ? 'bg-[#ffb4ab]/20 text-[#ffb4ab] border border-[#ffb4ab]'
              : 'text-[#849396] hover:text-[#e2e2e8] hover:bg-[#1e2024]'
          }`}
        >
          รายจ่าย
        </button>

        <div className="ml-auto hidden sm:flex items-center gap-4 text-xs font-mono-data">
          <span className="text-[#39FF14]">
            +฿ {totalFilteredIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[#00E5FF]">
            -฿ {totalFilteredExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Transaction List Cards */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center">
            <p className="text-[#849396] text-sm">ไม่พบรายการที่ตรงกับเงื่อนไขการค้นหา</p>
            <button
              onClick={onOpenAddModal}
              className="mt-4 inline-flex items-center gap-2 bg-[#00E5FF] text-[#00363d] font-bold text-xs px-4 py-2 rounded-full neon-glow-primary hover:bg-[#9cf0ff]"
            >
              <Plus size={14} />
              <span>เพิ่มรายการใหม่</span>
            </button>
          </div>
        ) : (
          filteredTransactions.map((tx) => {
            const categoryObj = categories.find((c) => c.id === tx.categoryId);
            const isIncome = tx.type === 'income';

            return (
              <div
                key={tx.id}
                className="glass-panel rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/10 hover:border-[#00E5FF]/40 transition-all group"
              >
                {/* Left: Icon & Title & Meta */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <CategoryIcon
                    iconName={categoryObj ? categoryObj.icon : (isIncome ? 'Coins' : 'Utensils')}
                    color={categoryObj ? categoryObj.color : (isIncome ? 'green' : 'cyan')}
                    size={20}
                  />

                  <div className="min-w-0">
                    <h4 className="text-sm sm:text-base font-bold text-[#e2e2e8] truncate group-hover:text-[#00E5FF] transition-colors">
                      {tx.title}
                    </h4>

                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-[#849396]">
                      {tx.time && (
                        <span className="font-mono-data text-[11px] bg-black/40 px-2 py-0.5 rounded border border-white/5">
                          TIME: {tx.time}
                        </span>
                      )}
                      <span className="font-mono-data text-[11px] text-[#849396]">
                        {tx.date}
                      </span>
                      {tx.notes && (
                        <span className="hidden md:inline text-[11px] text-[#bac9cc] truncate max-w-xs">
                          • {tx.notes}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Center: Category Pill */}
                <div className="hidden sm:block">
                  <span className="px-3 py-1 rounded-md text-xs font-medium bg-[#1e2024] text-[#bac9cc] border border-white/10">
                    {tx.categoryName}
                  </span>
                </div>

                {/* Right: Status Indicator & Amount & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  {/* Status label: ● OUT - or ● IN + */}
                  <div className="flex items-center gap-1.5 text-xs font-mono-data">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isIncome ? 'bg-[#39FF14] animate-pulse' : 'bg-[#00E5FF]'
                      }`}
                    />
                    <span className={isIncome ? 'text-[#39FF14]' : 'text-[#00E5FF]'}>
                      {isIncome ? 'IN +' : 'OUT -'}
                    </span>
                  </div>

                  {/* Amount with JetBrains Mono */}
                  <div className="text-right">
                    <span
                      className={`text-base sm:text-xl font-bold font-mono-data tracking-tight ${
                        isIncome
                          ? 'text-[#39FF14] neon-text-secondary'
                          : 'text-[#00E5FF] neon-text-primary'
                      }`}
                    >
                      ฿{tx.amount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  {/* Actions (Edit / Delete) */}
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEditTransaction(tx)}
                      title="แก้ไข"
                      className="p-1.5 rounded-lg text-[#849396] hover:text-[#00E5FF] hover:bg-[#00E5FF]/10 transition-colors"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => onDeleteTransaction(tx.id)}
                      title="ลบ"
                      className="p-1.5 rounded-lg text-[#849396] hover:text-[#ffb4ab] hover:bg-[#93000a]/30 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
