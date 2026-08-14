import React from 'react';
import { LayoutDashboard, History, Wallet, Settings, Plus } from 'lucide-react';
import { TabType } from '../types';

interface MobileBottomNavProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenAddModal: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onTabChange,
  onOpenAddModal,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-3 h-16 glass-panel rounded-t-2xl border-t border-white/10 bg-[#111318]/90">
      <button
        onClick={() => onTabChange('dashboard')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-transform active:scale-90 ${
          currentTab === 'dashboard'
            ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]'
            : 'text-[#849396] hover:text-white'
        }`}
      >
        <LayoutDashboard size={18} />
        <span className="text-[10px] font-medium mt-1">หน้าหลัก</span>
      </button>

      <button
        onClick={() => onTabChange('history')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-transform active:scale-90 ${
          currentTab === 'history'
            ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]'
            : 'text-[#849396] hover:text-white'
        }`}
      >
        <History size={18} />
        <span className="text-[10px] font-medium mt-1">ประวัติ</span>
      </button>

      {/* Floating Center Add button */}
      <button
        onClick={onOpenAddModal}
        aria-label="เพิ่มรายการ"
        className="w-12 h-12 rounded-full bg-[#00E5FF] text-[#00363d] flex items-center justify-center -mt-6 neon-glow-primary active:scale-95 shadow-xl border-2 border-[#050505]"
      >
        <Plus size={22} strokeWidth={3} />
      </button>

      <button
        onClick={() => onTabChange('budget')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-transform active:scale-90 ${
          currentTab === 'budget'
            ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]'
            : 'text-[#849396] hover:text-white'
        }`}
      >
        <Wallet size={18} />
        <span className="text-[10px] font-medium mt-1">งบประมาณ</span>
      </button>

      <button
        onClick={() => onTabChange('settings')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-transform active:scale-90 ${
          currentTab === 'settings'
            ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]'
            : 'text-[#849396] hover:text-white'
        }`}
      >
        <Settings size={18} />
        <span className="text-[10px] font-medium mt-1">ตั้งค่า</span>
      </button>
    </nav>
  );
};
