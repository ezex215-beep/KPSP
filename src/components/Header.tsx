import React, { useState } from 'react';
import {
  Bell,
  Check,
  X,
  ShieldAlert,
  Info,
  CheckCircle2,
  LogIn,
  LogOut,
  Mail,
  Cloud,
} from 'lucide-react';
import { NotificationItem, UserProfile } from '../types';

interface HeaderProps {
  userProfile: UserProfile;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  onClearAllNotifications: () => void;
  onOpenAddModal: () => void;
  onOpenLoginModal: () => void;
  onSignOut: () => void;
  isAuthLoading?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  userProfile,
  notifications,
  onMarkNotificationRead,
  onClearAllNotifications,
  onOpenAddModal,
  onOpenLoginModal,
  onSignOut,
  isAuthLoading = false,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="glass-panel fixed top-0 left-0 w-full z-40 flex justify-between items-center px-4 md:px-10 h-16 md:pl-72 border-b border-white/10">
      <div className="flex items-center gap-3">
        <h1 className="text-xl md:text-2xl font-extrabold text-[#00E5FF] neon-text-primary tracking-tight">
          บันทึกการเงิน
        </h1>
        <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono-data uppercase bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/40 rounded">
          v2.6 // PRO
        </span>
      </div>

      <div className="flex items-center gap-3 md:gap-4 relative">
        {/* Sign-in button for guests */}
        {!userProfile.isGoogleAuth ? (
          <button
            onClick={onOpenLoginModal}
            disabled={isAuthLoading}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111318] border border-[#00E5FF]/60 hover:border-[#00E5FF] text-white text-xs font-semibold hover:bg-[#00E5FF]/10 transition-all active:scale-95 shadow-sm"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
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
            <span className="hidden sm:inline">เข้าสู่ระบบ (Gmail / บัญชี)</span>
            <span className="sm:hidden">เข้าสู่ระบบ</span>
          </button>
        ) : (
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-[#39FF14] font-mono-data bg-[#39FF14]/10 border border-[#39FF14]/30 px-2.5 py-1 rounded-full">
            <Cloud size={13} />
            <span>CLOUD SYNC ONLINE</span>
          </div>
        )}

        {/* Quick Add button on mobile */}
        <button
          onClick={onOpenAddModal}
          className="md:hidden flex items-center gap-1 bg-[#00E5FF] text-[#050505] font-semibold text-xs px-3 py-1.5 rounded-full neon-glow-primary active:scale-95 transition-transform"
        >
          <span>+</span> บันทึก
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            id="notifications-btn"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            aria-label="การแจ้งเตือน"
            className="text-[#bac9cc] hover:text-white hover:bg-[#333539] transition-all p-2 rounded-full active:scale-95 relative"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#39FF14] rounded-full ring-2 ring-[#050505] animate-pulse"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-panel-elevated rounded-xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">การแจ้งเตือน</h4>
                  {unreadCount > 0 && (
                    <span className="bg-[#00E5FF]/20 text-[#00E5FF] text-[10px] font-mono-data px-2 py-0.5 rounded-full border border-[#00E5FF]/40">
                      {unreadCount} ใหม่
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {notifications.length > 0 && (
                    <button
                      onClick={onClearAllNotifications}
                      className="text-[11px] text-[#849396] hover:text-[#00E5FF] transition-colors"
                    >
                      อ่านทั้งหมด
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-[#849396] hover:text-white p-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <div className="text-center py-6 text-xs text-[#849396]">
                    ไม่มีการแจ้งเตือนในขณะนี้
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onMarkNotificationRead(item.id)}
                      className={`p-3 rounded-lg border transition-all cursor-pointer ${
                        item.read
                          ? 'bg-[#111318]/50 border-white/5 opacity-70'
                          : 'bg-[#1a1c20] border-[#00E5FF]/30'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5">
                          {item.type === 'warning' && (
                            <ShieldAlert size={16} className="text-[#ffb4ab]" />
                          )}
                          {item.type === 'info' && (
                            <Info size={16} className="text-[#00E5FF]" />
                          )}
                          {item.type === 'success' && (
                            <CheckCircle2 size={16} className="text-[#39FF14]" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-white truncate">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-[#bac9cc] mt-0.5 leading-relaxed">
                            {item.message}
                          </p>
                          <p className="text-[10px] text-[#849396] font-mono-data mt-1">
                            {item.timestamp}
                          </p>
                        </div>
                        {!item.read && (
                          <div className="w-2 h-2 rounded-full bg-[#00E5FF] mt-1.5 flex-shrink-0"></div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Mini Avatar & Account Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="w-9 h-9 rounded-full overflow-hidden bg-[#1e2024] border border-white/20 ring-1 ring-[#00E5FF]/40 hover:ring-[#00E5FF] transition-all cursor-pointer"
          >
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.name}
              className="w-full h-full object-cover"
            />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-3 w-64 glass-panel-elevated rounded-xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150 border border-white/10 shadow-2xl">
              <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                <img
                  src={userProfile.avatarUrl}
                  alt={userProfile.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#00E5FF]"
                />
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-white truncate">
                    {userProfile.name}
                  </p>
                  <p className="text-xs text-[#849396] truncate">
                    {userProfile.email || 'Guest Mode (โหมดทดลอง)'}
                  </p>
                </div>
              </div>

              <div className="py-2 space-y-1">
                {userProfile.isGoogleAuth ? (
                  <div className="p-2 rounded-lg bg-[#39FF14]/10 border border-[#39FF14]/30 text-[11px] text-[#39FF14] flex items-center gap-2">
                    <Cloud size={14} />
                    <span>เชื่อมต่อกับ Gmail และ Cloud Sync เรียบร้อย</span>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenLoginModal();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#00E5FF] text-[#00363d] font-bold text-xs hover:bg-[#9cf0ff] transition-all neon-glow-primary"
                  >
                    <LogIn size={14} />
                    <span>เข้าสู่ระบบ (Gmail / บัญชี)</span>
                  </button>
                )}
              </div>

              {userProfile.isGoogleAuth && (
                <div className="pt-2 border-t border-white/10">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onSignOut();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 font-semibold text-xs transition-all border border-red-500/30"
                  >
                    <LogOut size={14} />
                    <span>ออกจากระบบ (Sign Out)</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

