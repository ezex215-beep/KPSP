import React, { useState } from 'react';
import { X, Plus, Trash2, Check } from 'lucide-react';
import { CategoryBudget, CategoryColor } from '../types';
import { CategoryIcon } from './CategoryIcon';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryBudget[];
  onSaveCategories: (updated: CategoryBudget[]) => void;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  categories,
  onSaveCategories,
}) => {
  const [budgetList, setBudgetList] = useState<CategoryBudget[]>(categories);
  const [newCatName, setNewCatName] = useState('');
  const [newCatAmount, setNewCatAmount] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('ShoppingBag');
  const [newCatColor, setNewCatColor] = useState<CategoryColor>('cyan');

  if (!isOpen) return null;

  const handleAmountChange = (id: string, newAmount: number) => {
    setBudgetList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, allocated: Math.max(0, newAmount) } : c))
    );
  };

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    const allocated = parseFloat(newCatAmount) || 0;
    const newCat: CategoryBudget = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      icon: newCatIcon,
      allocated,
      spent: 0,
      color: newCatColor,
      type: 'expense',
    };
    setBudgetList([...budgetList, newCat]);
    setNewCatName('');
    setNewCatAmount('');
  };

  const handleDeleteCategory = (id: string) => {
    setBudgetList(budgetList.filter((c) => c.id !== id));
  };

  const handleSave = () => {
    onSaveCategories(budgetList);
    onClose();
  };

  const totalAllocated = budgetList
    .filter((c) => c.type === 'expense')
    .reduce((sum, c) => sum + c.allocated, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl glass-panel-elevated rounded-2xl p-6 sm:p-8 relative border border-[#39FF14]/30 shadow-2xl animate-in zoom-in-95 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#79ff5b] neon-text-secondary tracking-tight">
              วางแผนและปรับงบประมาณ
            </h3>
            <p className="text-xs sm:text-sm text-[#849396] mt-1">
              กำหนดยอดเงินเป้าหมายของแต่ละหมวดหมู่รายเดือน
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="ปิด"
            className="text-[#849396] hover:text-white p-1 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Total sum banner */}
        <div className="bg-[#111318] border border-[#00E5FF]/20 rounded-xl p-4 mb-4 flex justify-between items-center">
          <span className="text-sm text-[#bac9cc]">งบประมาณรวมเป้าหมาย:</span>
          <span className="text-xl font-bold font-mono-data text-[#00E5FF]">
            ฿ {totalAllocated.toLocaleString()}
          </span>
        </div>

        {/* Category List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-6">
          {budgetList
            .filter((c) => c.type === 'expense')
            .map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#111318] border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <CategoryIcon
                    iconName={cat.icon}
                    color={cat.color}
                    size={16}
                  />
                  <div className="min-w-0">
                    <span className="text-sm font-semibold text-[#e2e2e8] block truncate">
                      {cat.name}
                    </span>
                    <span className="text-[11px] text-[#849396]">
                      ใช้ไปแล้ว: ฿{cat.spent.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-[#050505] border border-white/15 rounded-lg px-2.5 py-1.5 w-32 sm:w-40 focus-within:border-[#00E5FF]">
                    <span className="text-[#00E5FF] font-mono-data text-xs mr-1">฿</span>
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={cat.allocated}
                      onChange={(e) =>
                        handleAmountChange(cat.id, parseFloat(e.target.value) || 0)
                      }
                      className="w-full bg-transparent text-sm text-right font-mono-data text-white focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    title="ลบหมวดหมู่"
                    className="p-1.5 text-[#849396] hover:text-[#ffb4ab] rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

          {/* Add Category Section */}
          <div className="p-4 rounded-xl border border-dashed border-white/20 bg-white/[0.01] space-y-3">
            <span className="text-xs font-bold text-[#849396] uppercase tracking-wider block">
              + เพิ่มหมวดหมู่ใหม่
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="ชื่อหมวดหมู่..."
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="bg-[#111318] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00E5FF]"
              />
              <input
                type="number"
                placeholder="งบประมาณ (฿)"
                value={newCatAmount}
                onChange={(e) => setNewCatAmount(e.target.value)}
                className="bg-[#111318] border border-white/15 rounded-lg px-3 py-2 text-xs text-white font-mono-data focus:outline-none focus:border-[#00E5FF]"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="bg-[#00E5FF]/20 border border-[#00E5FF] text-[#00E5FF] text-xs font-bold py-2 rounded-lg hover:bg-[#00E5FF]/30 transition-all flex items-center justify-center gap-1"
              >
                <Plus size={14} /> เพิ่มหมวด
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-white/20 text-[#e2e2e8] font-semibold text-sm hover:bg-white/5 active:scale-95 transition-all"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-xl bg-[#d7ffc5] hover:bg-[#79ff5b] text-[#053900] font-bold text-sm neon-glow-secondary active:scale-95 transition-all shadow-lg"
          >
            บันทึกการตั้งค่า
          </button>
        </div>
      </div>
    </div>
  );
};
