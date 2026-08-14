import React from 'react';
import {
  LayoutDashboard,
  History,
  Wallet,
  Settings,
  HelpCircle,
  Plus,
  LogIn,
  LogOut,
  Sparkles,
  Cloud,
} from 'lucide-react';
import { TabType, UserProfile } from '../types';

interface SidebarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenAddModal: () => void;
  onOpenHelpModal: () => void;
  userProfile: UserProfile;
  onOpenLoginModal: () => void;
  onSignOut: () => void;
  isAuthLoading?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  onOpenAddModal,
  onOpenHelpModal,
  userProfile,
  onOpenLoginModal,
  onSignOut,
  isAuthLoading = false,
}) => {
  const navItems = [
    {
      id: 'dashboard' as TabType,
      label: 'หน้าหลัก',
      icon: LayoutDashboard,
    },
    {
      id: 'history' as TabType,
      label: 'ประวัติรายการ',
      icon: History,
    },
    {
      id: 'budget' as TabType,
      label: 'งบประมาณ',
      icon: Wallet,
    },
    {
      id: 'settings' as TabType,
      label: 'ตั้งค่า',
      icon: Settings,
    },
  ];

  return (
    <nav
      id="main-sidebar"
      className="hidden md:flex flex-col h-screen fixed left-0 top-0 border-r border-white/10 p-6 glass-panel w-64 z-40 pt-20"
    >
      {/* Profile Section */}
      <div className="mb-4 flex flex-col items-center text-center">
        <div className="relative mb-2.5">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-[#1e2024] border-2 border-[#00E5FF] neon-glow-primary">
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#050505] flex items-center justify-center ${userProfile.isGoogleAuth ? 'bg-[#39FF14]' : 'bg-[#e5a93b]'}`}>
            <div className="w-1.5 h-1.5 bg-[#053900] rounded-full animate-ping"></div>
          </div>
        </div>
        <h2 className="text-base font-bold text-[#e2e2e8] truncate max-w-[200px]">
          {userProfile.name}
        </h2>
        <p className="text-[11px] text-[#849396] truncate max-w-[200px] mt-0.5">
          {userProfile.email || 'โหมดทดลองใช้งาน (Guest)'}
        </p>

        {/* Quick Google Login / Logout Pill in Sidebar */}
        <div className="mt-2 w-full">
          {!userProfile.isGoogleAuth ? (
            <button
              onClick={onOpenLoginModal}
              disabled={isAuthLoading}
              className="w-full py-1.5 px-2.5 rounded-lg bg-[#111318] hover:bg-white/5 border border-[#00E5FF]/40 hover:border-[#00E5FF] text-[11px] font-semibold text-white flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
            >
              <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>เข้าสู่ระบบ / บัญชี</span>
            </button>
          ) : (
            <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-[#111318] border border-[#39FF14]/30 text-[10px] text-[#39FF14]">
              <span className="flex items-center gap-1">
                <Cloud size={12} /> Sync Online
              </span>
              <button
                onClick={onSignOut}
                className="text-red-400 hover:text-red-300 font-medium ml-2 underline"
              >
                ออก
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Nav Menu */}
      <div className="flex-1 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id}`}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                isActive
                  ? 'bg-[#00E5FF]/10 text-[#00E5FF] font-bold border border-[#00E5FF] neon-glow-primary'
                  : 'text-[#bac9cc] hover:bg-[#333539]/60 hover:text-white'
              }`}
            >
              <Icon
                size={18}
                className={isActive ? 'text-[#00E5FF]' : 'text-[#bac9cc]'}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="mt-auto space-y-2.5 pt-3 border-t border-white/5">
        <button
          id="sidebar-add-btn"
          onClick={onOpenAddModal}
          className="w-full bg-[#00E5FF] hover:bg-[#9cf0ff] text-[#00363d] font-bold text-sm py-2.5 rounded-xl transition-all neon-glow-primary flex items-center justify-center gap-2 active:scale-95"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>เพิ่มรายการ</span>
        </button>

        <button
          id="sidebar-help-btn"
          onClick={onOpenHelpModal}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-[#bac9cc] hover:bg-[#333539]/60 hover:text-white transition-all text-xs"
        >
          <HelpCircle size={16} />
          <span>ความช่วยเหลือ</span>
        </button>
      </div>

      {/* Developer Profile Section */}
      <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-[#1e2024] flex-shrink-0 border border-white/15">
          <img
            src={userProfile.developerAvatarUrl}
            alt={userProfile.developerName}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col overflow-hidden text-left">
          <span className="text-xs text-[#e2e2e8] font-bold truncate">
            {userProfile.developerName}
          </span>
          <span className="text-[11px] text-[#849396] truncate">
            {userProfile.developerClass}
          </span>
          <span className="text-[9px] text-[#849396] truncate">
            {userProfile.developerSchool}
          </span>
        </div>
      </div>
    </nav>
  );
};

