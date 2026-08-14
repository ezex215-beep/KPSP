import React from 'react';
import { Plus, AlertTriangle, ChevronRight } from 'lucide-react';
import { CategoryBudget, Transaction } from '../types';
import { CategoryIcon } from './CategoryIcon';

interface BudgetViewProps {
  categories: CategoryBudget[];
  transactions: Transaction[];
  onOpenBudgetModal: () => void;
  onOpenAddModal: () => void;
  onSelectCategoryFilter?: (categoryId: string) => void;
}

export const BudgetView: React.FC<BudgetViewProps> = ({
  categories,
  transactions,
  onOpenBudgetModal,
  onOpenAddModal,
  onSelectCategoryFilter,
}) => {
  // Only consider expense categories for budgeting
  const expenseCategories = categories.filter((c) => c.type === 'expense');

  // Compute total allocated budget
  const totalAllocated = expenseCategories.reduce(
    (sum, cat) => sum + cat.allocated,
    0
  );

  // Compute total spent from actual transactions or category spent
  const totalSpent = expenseCategories.reduce(
    (sum, cat) => sum + cat.spent,
    0
  );

  const totalRemaining = Math.max(0, totalAllocated - totalSpent);
  const usedPercent = totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0;

  // Donut chart math (radius 40, circumference 2 * PI * 40 ≈ 251.327)
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(usedPercent, 100) / 100) * circumference;

  // Find categories that trigger warnings (> 85%)
  const warningCategories = expenseCategories.filter((cat) => {
    const pct = cat.allocated > 0 ? (cat.spent / cat.allocated) * 100 : 0;
    return pct >= 85;
  });

  const primaryAlertCat = warningCategories[0] || expenseCategories[0];
  const primaryAlertPercent = primaryAlertCat
    ? Math.round((primaryAlertCat.spent / primaryAlertCat.allocated) * 100)
    : 90;

  return (
    <div className="space-y-6 pb-24 md:pb-12">
      {/* Top Header Row */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#e2e2e8] tracking-tight">
            วางแผนงบประมาณ
          </h2>
          <p className="text-sm md:text-base text-[#849396] mt-1">
            ตั้งเป้าหมายรายเดือน เพื่อควบคุมค่าใช้จ่ายของคุณ
          </p>
        </div>

        <button
          id="btn-new-budget"
          onClick={onOpenBudgetModal}
          className="self-start sm:self-auto flex items-center gap-2 bg-[#d7ffc5] hover:bg-[#79ff5b] text-[#053900] px-5 sm:px-6 py-2.5 rounded-full font-bold text-sm transition-all neon-glow-secondary active:scale-95 cursor-pointer shadow-lg"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>ตั้งงบประมาณใหม่</span>
        </button>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Summary Bento */}
        <section className="lg:col-span-1 flex flex-col gap-6">
          <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
            {/* Subtle background glow accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E5FF]/5 rounded-full blur-3xl pointer-events-none"></div>

            <h3 className="text-lg font-bold text-[#e2e2e8] mb-4">
              ภาพรวมเดือนนี้
            </h3>

            {/* Circular Donut Chart */}
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto mb-6 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="#1e2024"
                  strokeWidth="12"
                />
                {/* Active Progress Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="#00E5FF"
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{
                    filter: 'drop-shadow(0 0 6px #00E5FF)',
                    transition: 'stroke-dashoffset 0.8s ease-in-out',
                  }}
                />
              </svg>

              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs text-[#849396] font-medium tracking-wide">
                  ใช้ไปแล้ว
                </span>
                <span className="text-3xl font-extrabold text-[#00E5FF] neon-text-primary font-mono-data mt-1">
                  {usedPercent}%
                </span>
              </div>
            </div>

            {/* Metric Summary Rows */}
            <div className="space-y-3.5 pt-2">
              <div className="flex justify-between items-center pb-2.5 border-b border-white/10 text-sm">
                <span className="text-[#bac9cc]">งบประมาณรวม</span>
                <span className="font-bold text-[#e2e2e8] font-mono-data">
                  ฿ {totalAllocated.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center pb-2.5 border-b border-white/10 text-sm">
                <span className="text-[#bac9cc]">งบประมาณที่ใช้ไป</span>
                <span className="font-bold text-[#00E5FF] font-mono-data">
                  ฿ {totalSpent.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-[#bac9cc]">คงเหลือ</span>
                <span className="font-bold text-[#39FF14] font-mono-data neon-text-secondary">
                  ฿ {totalRemaining.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Alert Box (Exact style from screenshot) */}
          <div
            id="budget-warning-card"
            className="bg-[#93000a]/20 border border-[#ffb4ab]/60 rounded-2xl p-4 flex items-start gap-3.5 relative overflow-hidden transition-all hover:border-[#ffb4ab]"
          >
            <div className="p-1.5 rounded-full bg-[#93000a]/40 text-[#ffb4ab] mt-0.5 flex-shrink-0">
              <AlertTriangle size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#ffb4ab] mb-0.5">
                แจ้งเตือนงบประมาณ
              </h4>
              <p className="text-xs text-[#ffb4ab]/90 leading-relaxed">
                {primaryAlertCat
                  ? `หมวดหมู่ '${primaryAlertCat.name}' ใกล้ถึงขีดจำกัดแล้ว (${primaryAlertPercent}%)`
                  : "ทุกหมวดหมู่อยู่ในเกณฑ์งบประมาณที่ปลอดภัย"}
              </p>
            </div>
          </div>
        </section>

        {/* Right Column: Budget Categories List */}
        <section className="lg:col-span-2">
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#e2e2e8]">หมวดหมู่</h3>
              <button
                onClick={onOpenAddModal}
                className="text-[#00E5FF] hover:text-white font-medium text-sm flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-[#00E5FF]/10"
              >
                <Plus size={16} />
                <span>เพิ่มรายการ</span>
              </button>
            </div>

            {/* Category Items */}
            <div className="space-y-6">
              {expenseCategories.map((cat) => {
                const percent =
                  cat.allocated > 0
                    ? Math.min(100, Math.round((cat.spent / cat.allocated) * 100))
                    : 0;
                const remaining = cat.allocated - cat.spent;
                const isOver = remaining < 0;
                const isExact = remaining === 0;

                // Color mappings
                let barColor = '#00E5FF';
                let barShadow = '0 0 8px #00E5FF';
                let amountColor = 'text-[#00E5FF]';
                let statusText = `เหลืออีก ฿ ${remaining.toLocaleString()}`;
                let statusTextColor = 'text-[#849396]';

                if (cat.color === 'error' || percent >= 90) {
                  barColor = '#ffb4ab';
                  barShadow = '0 0 8px #ffb4ab';
                  amountColor = 'text-[#ffb4ab]';
                  statusTextColor = 'text-[#ffb4ab]';
                  statusText = isOver
                    ? `เกินงบ ฿ ${Math.abs(remaining).toLocaleString()}`
                    : `เหลืออีก ฿ ${remaining.toLocaleString()}`;
                } else if (cat.color === 'yellow' || (percent >= 75 && percent < 90)) {
                  barColor = '#eab308';
                  barShadow = '0 0 8px #eab308';
                  amountColor = 'text-yellow-400';
                  statusTextColor = 'text-[#849396]';
                  statusText = `เหลืออีก ฿ ${remaining.toLocaleString()}`;
                } else if (cat.color === 'green' || isExact) {
                  barColor = '#39FF14';
                  barShadow = '0 0 8px #39FF14';
                  amountColor = 'text-[#39FF14]';
                  statusTextColor = 'text-[#849396]';
                  statusText = isExact ? 'พอดีงบประมาณ' : `เหลืออีก ฿ ${remaining.toLocaleString()}`;
                } else if (cat.color === 'purple') {
                  barColor = '#c084fc';
                  barShadow = '0 0 8px #c084fc';
                  amountColor = 'text-purple-300';
                  statusTextColor = 'text-[#849396]';
                  statusText = `เหลืออีก ฿ ${remaining.toLocaleString()}`;
                }

                return (
                  <div
                    key={cat.id}
                    className="p-3 rounded-xl hover:bg-white/[0.02] transition-all group"
                  >
                    <div className="flex justify-between items-end mb-2.5">
                      <div className="flex items-center gap-3">
                        <CategoryIcon
                          iconName={cat.icon}
                          color={cat.color}
                          size={18}
                        />
                        <div>
                          <span className="text-sm font-semibold text-[#e2e2e8] group-hover:text-[#00E5FF] transition-colors">
                            {cat.name}
                          </span>
                          <span className="ml-2 text-xs font-mono-data text-[#849396]">
                            ({percent}%)
                          </span>
                        </div>
                      </div>

                      <div className="text-right font-mono-data">
                        <span className={`text-sm font-bold ${amountColor}`}>
                          ฿ {cat.spent.toLocaleString()}
                        </span>
                        <span className="text-xs text-[#849396]">
                          {' '}
                          / ฿ {cat.allocated.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-[#1e2024] h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${percent}%`,
                          backgroundColor: barColor,
                          boxShadow: barShadow,
                        }}
                      />
                    </div>

                    {/* Bottom Status text */}
                    <div className="flex justify-between items-center mt-1.5">
                      <button
                        onClick={() =>
                          onSelectCategoryFilter && onSelectCategoryFilter(cat.id)
                        }
                        className="text-[11px] text-[#849396] hover:text-[#00E5FF] flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <span>ดูรายการในหมวดนี้</span>
                        <ChevronRight size={12} />
                      </button>
                      <p className={`text-xs font-mono-data text-right ml-auto ${statusTextColor}`}>
                        {statusText}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
