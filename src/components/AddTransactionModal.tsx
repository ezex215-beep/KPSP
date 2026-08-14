import React, { useState, useEffect } from 'react';
import { X, Calendar, ChevronDown, Check } from 'lucide-react';
import { Transaction, TransactionType, CategoryBudget } from '../types';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transactionData: Omit<Transaction, 'id'>, editId?: string) => void;
  categories: CategoryBudget[];
  editingTransaction?: Transaction | null;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  categories,
  editingTransaction,
}) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [title, setTitle] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(
    new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false })
  );
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // When opening in edit mode or new mode
  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setTitle(editingTransaction.title);
      setAmountStr(editingTransaction.amount.toString());
      setCategoryId(editingTransaction.categoryId);
      setDate(editingTransaction.date);
      setTime(editingTransaction.time || '12:00');
      setNotes(editingTransaction.notes || '');
    } else {
      setType('expense');
      setTitle('');
      setAmountStr('');
      // Default to first matching category
      const firstExp = categories.find((c) => c.type === 'expense');
      setCategoryId(firstExp ? firstExp.id : categories[0]?.id || 'food');
      setDate(new Date().toISOString().split('T')[0]);
      setTime(
        new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false })
      );
      setNotes('');
    }
    setErrorMsg('');
  }, [editingTransaction, isOpen, categories]);

  // Update selected category when type changes if current category doesn't match
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    const matchingCat = categories.find((c) => c.type === newType);
    if (matchingCat) {
      setCategoryId(matchingCat.id);
    }
  };

  if (!isOpen) return null;

  const filteredCategories = categories.filter((c) => c.type === type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amountStr);

    if (!amountStr || isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMsg('กรุณาระบุจำนวนเงินที่ถูกต้อง');
      return;
    }

    const selectedCat = categories.find((c) => c.id === categoryId);
    const catName = selectedCat ? selectedCat.name : (type === 'income' ? 'รายรับ' : 'รายจ่าย');
    const finalTitle = title.trim() || (selectedCat ? selectedCat.name : (type === 'income' ? 'รายรับ' : 'รายจ่าย'));

    onSave(
      {
        title: finalTitle,
        amount: parsedAmount,
        type,
        categoryId: categoryId || 'general',
        categoryName: catName,
        date: date || new Date().toISOString().split('T')[0],
        time: time || '12:00',
        notes: notes.trim(),
      },
      editingTransaction?.id
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg glass-panel-elevated rounded-2xl p-6 sm:p-8 relative border border-[#00E5FF]/30 shadow-2xl animate-in zoom-in-95 duration-150"
        role="dialog"
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#00E5FF] neon-text-primary tracking-tight">
              {editingTransaction ? 'แก้ไขรายการ' : 'เพิ่มรายการใหม่'}
            </h3>
            <p className="text-xs sm:text-sm text-[#849396] mt-1">
              บันทึกรายรับหรือรายจ่ายของคุณเพื่อติดตามสถานะการเงิน
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

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Type Toggle Pills */}
          <div className="grid grid-cols-2 gap-3 p-1 bg-[#0c0e12] rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`py-2.5 rounded-lg text-sm font-bold transition-all ${
                type === 'expense'
                  ? 'bg-[#39FF14] text-[#053900] neon-glow-secondary font-extrabold'
                  : 'text-[#849396] hover:text-white'
              }`}
            >
              รายจ่าย
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`py-2.5 rounded-lg text-sm font-bold transition-all ${
                type === 'income'
                  ? 'bg-[#00E5FF] text-[#00363d] neon-glow-primary font-extrabold'
                  : 'text-[#849396] hover:text-white'
              }`}
            >
              รายรับ
            </button>
          </div>

          {/* Amount Field (Large display) */}
          <div>
            <label className="text-xs font-semibold text-[#bac9cc] block mb-1.5">
              จำนวนเงิน
            </label>
            <div className="relative flex items-center bg-[#111318] border border-white/15 focus-within:border-[#00E5FF] rounded-xl px-4 py-3 transition-colors">
              <span className="text-[#00E5FF] font-bold text-lg mr-2 font-mono-data">
                ฿
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amountStr}
                onChange={(e) => {
                  setAmountStr(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full bg-transparent text-xl sm:text-2xl font-bold text-white font-mono-data focus:outline-none placeholder:text-[#849396]"
                autoFocus
              />
            </div>
          </div>

          {/* Title / Description */}
          <div>
            <label className="text-xs font-semibold text-[#bac9cc] block mb-1.5">
              ชื่อรายการ
            </label>
            <input
              type="text"
              placeholder="เช่น มื้อกลางวัน, ค่าเดินทาง, เงินเดือน"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#111318] border border-white/15 focus:border-[#00E5FF] rounded-xl px-4 py-2.5 text-sm text-[#e2e2e8] placeholder:text-[#849396] focus:outline-none transition-colors"
            />
          </div>

          {/* Category & Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category Select */}
            <div>
              <label className="text-xs font-semibold text-[#bac9cc] block mb-1.5">
                หมวดหมู่
              </label>
              <div className="relative">
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full appearance-none bg-[#111318] border border-white/15 focus:border-[#00E5FF] rounded-xl px-4 py-2.5 text-sm text-[#e2e2e8] focus:outline-none transition-colors cursor-pointer pr-10"
                >
                  <option value="">เลือกหมวดหมู่</option>
                  {filteredCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#849396] pointer-events-none"
                />
              </div>
            </div>

            {/* Date Input */}
            <div>
              <label className="text-xs font-semibold text-[#bac9cc] block mb-1.5">
                วันที่
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#111318] border border-white/15 focus:border-[#00E5FF] rounded-xl px-4 py-2.5 text-sm text-[#e2e2e8] font-mono-data focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Notes (Textarea) */}
          <div>
            <label className="text-xs font-semibold text-[#bac9cc] block mb-1.5">
              บันทึกเพิ่มเติม (ไม่บังคับ)
            </label>
            <textarea
              rows={3}
              placeholder="รายละเอียดเพิ่มเติม..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#111318] border border-white/15 focus:border-[#00E5FF] rounded-xl px-4 py-2.5 text-sm text-[#e2e2e8] placeholder:text-[#849396] focus:outline-none transition-colors resize-none"
            />
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-[#93000a]/30 border border-[#ffb4ab] text-xs text-[#ffb4ab]">
              {errorMsg}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-white/20 text-[#e2e2e8] font-semibold text-sm hover:bg-white/5 active:scale-95 transition-all"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-[#00E5FF] hover:bg-[#9cf0ff] text-[#00363d] font-bold text-sm neon-glow-primary active:scale-95 transition-all shadow-lg"
            >
              บันทึกข้อมูล
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
