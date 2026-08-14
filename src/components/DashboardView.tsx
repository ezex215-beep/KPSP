import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  ChevronRight,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { CategoryBudget, Transaction, TabType, UserProfile } from '../types';
import { CategoryIcon } from './CategoryIcon';

interface DashboardViewProps {
  userProfile: UserProfile;
  categories: CategoryBudget[];
  transactions: Transaction[];
  onNavigateTab: (tab: TabType) => void;
  onOpenAddModal: () => void;
  onOpenBudgetModal: () => void;
  onEditTransaction: (tx: Transaction) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userProfile,
  categories,
  transactions,
  onNavigateTab,
  onOpenAddModal,
  onOpenBudgetModal,
  onEditTransaction,
}) => {
  // Calculations
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  const expenseCategories = categories.filter((c) => c.type === 'expense');
  const totalBudget = expenseCategories.reduce((sum, c) => sum + c.allocated, 0);
  const budgetSpent = expenseCategories.reduce((sum, c) => sum + c.spent, 0);
  const budgetPercent = totalBudget > 0 ? Math.round((budgetSpent / totalBudget) * 100) : 0;

  // Recent 4 transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(`${b.date}T${b.time || '00:00'}`).getTime() - new Date(`${a.date}T${a.time || '00:00'}`).getTime())
    .slice(0, 4);

  return (
    <div className="space-y-6 pb-24 md:pb-12">
      {/* Welcome Banner */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 relative overflow-hidden border border-[#00E5FF]/20">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono-data bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 uppercase">
                {userProfile.userId}
              </span>
              <span className="text-xs text-[#849396] font-mono-data">
                {new Date().toLocaleDateString('th-TH', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              ยินดีต้อนรับ, {userProfile.name}
            </h2>
            <p className="text-sm text-[#bac9cc] mt-1">
              ภาพรวมสถานะการเงินและการควบคุมงบประมาณแบบเรียลไทม์
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAddModal}
              className="bg-[#00E5FF] hover:bg-[#9cf0ff] text-[#00363d] px-5 py-2.5 rounded-full font-bold text-sm neon-glow-primary active:scale-95 transition-all flex items-center gap-1.5 shadow-lg"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>เพิ่มรายการ</span>
            </button>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Total Income */}
        <div className="glass-panel rounded-2xl p-5 border border-white/10 hover:border-[#39FF14]/40 transition-all">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-[#849396] uppercase tracking-wider">
              รายรับรวม
            </span>
            <div className="w-8 h-8 rounded-full bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14] flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono-data text-[#39FF14] neon-text-secondary">
            ฿ {totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#849396] mt-2">
            <ArrowUpRight size={14} className="text-[#39FF14]" />
            <span>กระแสเงินสดขาเข้า</span>
          </div>
        </div>

        {/* Card 2: Total Expense */}
        <div className="glass-panel rounded-2xl p-5 border border-white/10 hover:border-[#00E5FF]/40 transition-all">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-[#849396] uppercase tracking-wider">
              รายจ่ายรวม
            </span>
            <div className="w-8 h-8 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF] flex items-center justify-center">
              <TrendingDown size={16} />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono-data text-[#00E5FF] neon-text-primary">
            ฿ {totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#849396] mt-2">
            <ArrowDownRight size={14} className="text-[#00E5FF]" />
            <span>ใช้ไปแล้ว {budgetPercent}% ของงบ</span>
          </div>
        </div>

        {/* Card 3: Net Balance */}
        <div className="glass-panel rounded-2xl p-5 border border-white/10 hover:border-[#79ff5b]/40 transition-all">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-[#849396] uppercase tracking-wider">
              เงินคงเหลือสุทธิ
            </span>
            <div className="w-8 h-8 rounded-full bg-[#79ff5b]/10 text-[#79ff5b] border border-[#79ff5b] flex items-center justify-center">
              <PiggyBank size={16} />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono-data text-white">
            ฿ {netBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-[#39FF14] mt-2 font-medium">
            {netBalance >= 0 ? '✓ สถานะการเงินเป็นบวก' : '⚠️ ระวังรายจ่ายเกินรายรับ'}
          </div>
        </div>

        {/* Card 4: Budget Status */}
        <div className="glass-panel rounded-2xl p-5 border border-white/10 hover:border-[#00E5FF]/40 transition-all cursor-pointer" onClick={() => onNavigateTab('budget')}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-[#849396] uppercase tracking-wider">
              สถานะงบประมาณ
            </span>
            <div className="w-8 h-8 rounded-full bg-white/5 text-[#00E5FF] border border-[#00E5FF]/40 flex items-center justify-center">
              <Wallet size={16} />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono-data text-[#00E5FF]">
            {budgetPercent}% <span className="text-xs font-normal text-[#849396]">ที่ใช้ไป</span>
          </div>
          <div className="w-full bg-[#1e2024] h-1.5 rounded-full overflow-hidden mt-3">
            <div
              className="bg-[#00E5FF] h-full rounded-full"
              style={{ width: `${Math.min(100, budgetPercent)}%`, boxShadow: '0 0 8px #00E5FF' }}
            />
          </div>
        </div>
      </div>

      {/* Bento Two-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Quick Budget Glance */}
        <div className="lg:col-span-1 glass-panel rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">ภาพรวมงบประมาณ</h3>
              <button
                onClick={() => onNavigateTab('budget')}
                className="text-xs text-[#00E5FF] hover:underline flex items-center gap-1"
              >
                <span>ดูทั้งหมด</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="space-y-4">
              {expenseCategories.slice(0, 4).map((cat) => {
                const pct = cat.allocated > 0 ? Math.min(100, Math.round((cat.spent / cat.allocated) * 100)) : 0;
                return (
                  <div key={cat.id} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-[#e2e2e8]">{cat.name}</span>
                      <span className="text-[#849396] font-mono-data">
                        ฿{cat.spent.toLocaleString()} / ฿{cat.allocated.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-[#1e2024] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: pct >= 90 ? '#ffb4ab' : pct >= 75 ? '#eab308' : '#00E5FF',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-white/10">
            <button
              onClick={onOpenBudgetModal}
              className="w-full py-2.5 rounded-xl border border-[#39FF14]/40 bg-[#39FF14]/10 text-[#39FF14] text-xs font-bold hover:bg-[#39FF14]/20 transition-all flex items-center justify-center gap-1.5"
            >
              <Plus size={14} />
              <span>ปรับงบประมาณรายเดือน</span>
            </button>
          </div>
        </div>

        {/* Right: Recent Transactions List */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">กิจกรรมล่าสุด</h3>
            <button
              onClick={() => onNavigateTab('history')}
              className="text-xs text-[#00E5FF] hover:underline flex items-center gap-1"
            >
              <span>ดูประวัติทั้งหมด</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="space-y-2.5">
            {recentTransactions.map((tx) => {
              const cat = categories.find((c) => c.id === tx.categoryId);
              const isIncome = tx.type === 'income';

              return (
                <div
                  key={tx.id}
                  onClick={() => onEditTransaction(tx)}
                  className="p-3 rounded-xl bg-[#111318] border border-white/10 hover:border-[#00E5FF]/40 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <CategoryIcon
                      iconName={cat ? cat.icon : 'Utensils'}
                      color={cat ? cat.color : 'cyan'}
                      size={16}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#e2e2e8] truncate group-hover:text-[#00E5FF] transition-colors">
                        {tx.title}
                      </p>
                      <p className="text-[11px] text-[#849396] font-mono-data">
                        {tx.date} • {tx.categoryName}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-sm font-bold font-mono-data ${
                        isIncome ? 'text-[#39FF14]' : 'text-[#00E5FF]'
                      }`}
                    >
                      {isIncome ? '+' : '-'}฿{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
