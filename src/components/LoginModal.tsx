import React, { useState } from 'react';
import {
  X,
  LogIn,
  Mail,
  User,
  Sparkles,
  Zap,
  Check,
  ShieldCheck,
  Smartphone,
  ArrowRight,
} from 'lucide-react';
import { UserProfile } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoogleSignIn: () => Promise<void>;
  onDirectLogin: (profile: { name: string; email: string; avatarUrl?: string }) => Promise<void>;
  isAuthLoading: boolean;
  currentProfile: UserProfile;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onGoogleSignIn,
  onDirectLogin,
  isAuthLoading,
  currentProfile,
}) => {
  const [nameInput, setNameInput] = useState(currentProfile.name || '');
  const [emailInput, setEmailInput] = useState(currentProfile.email || '');
  const [selectedAvatar, setSelectedAvatar] = useState<string>(
    currentProfile.avatarUrl || 'https://cdn.phototourl.com/free/2026-08-14-553d4adf-51c8-48b0-9bc7-551ac9366889.jpg'
  );
  const [showGoogleOAuthOption, setShowGoogleOAuthOption] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const avatarOptions = [
    {
      id: 'nontakarn',
      label: 'นนทกานต์',
      url: 'https://cdn.phototourl.com/free/2026-08-14-553d4adf-51c8-48b0-9bc7-551ac9366889.jpg',
    },
    {
      id: 'cyber-bot',
      label: 'Cyber Cyan',
      url: 'https://api.dicebear.com/7.x/bottts/svg?seed=CyberCyan',
    },
    {
      id: 'neon-matrix',
      label: 'Matrix Green',
      url: 'https://api.dicebear.com/7.x/bottts/svg?seed=MatrixGreen',
    },
    {
      id: 'evaluator',
      label: 'อาจารย์ / ผู้ตรวจ',
      url: 'https://api.dicebear.com/7.x/bottts/svg?seed=TeacherEvaluator',
    },
  ];

  const handleDirectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    const email =
      emailInput.trim() ||
      `${nameInput.trim().toLowerCase().replace(/\s+/g, '')}@gmail.com`;

    await onDirectLogin({
      name: nameInput.trim(),
      email,
      avatarUrl: selectedAvatar,
    });
    onClose();
  };

  const handleQuickProfileSelect = async (name: string, email: string, avatar: string) => {
    setNameInput(name);
    setEmailInput(email);
    setSelectedAvatar(avatar);
    await onDirectLogin({
      name,
      email,
      avatarUrl: avatar,
    });
    onClose();
  };

  const handleGoogleAuthClick = async () => {
    setNoticeMessage(null);
    try {
      await onGoogleSignIn();
      onClose();
    } catch (err: any) {
      console.warn('Google Popup OAuth fallback:', err);
      setNoticeMessage(
        'บนโดเมนที่แชร์ / แอปมือถือ LINE กรุณากรอกชื่อและอีเมลในฟอร์มด้านล่างเพื่อเข้าใช้งานและซิงค์ข้อมูลได้ทันที 100%'
      );
      setShowGoogleOAuthOption(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg glass-panel-elevated rounded-2xl p-6 sm:p-7 relative border border-[#00E5FF]/40 shadow-[0_0_50px_rgba(0,229,255,0.15)] max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#849396] hover:text-white transition-colors p-1"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/40 flex items-center justify-center neon-glow-primary">
            <LogIn size={22} />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white tracking-tight">
              เข้าสู่ระบบบันทึกการเงิน
            </h3>
            <p className="text-xs font-mono-data text-[#00E5FF] flex items-center gap-1">
              <ShieldCheck size={13} />
              <span>CLOUD SYNC // INSTANT ACCESS</span>
            </p>
          </div>
        </div>

        {/* Notice Info if needed */}
        {noticeMessage && (
          <div className="mb-4 p-3.5 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-xs text-[#bac9cc] flex items-start gap-2.5">
            <Smartphone size={16} className="text-[#00E5FF] flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">{noticeMessage}</p>
          </div>
        )}

        {/* 1-Click Instant Profiles */}
        <div className="mb-5 p-3.5 rounded-xl bg-[#111318] border border-white/10">
          <p className="text-xs font-semibold text-[#bac9cc] mb-2.5 flex items-center gap-1.5">
            <Sparkles size={14} className="text-[#39FF14]" />
            <span>เข้าใช้งานด่วนใน 1 คลิก (1-Click Login):</span>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() =>
                handleQuickProfileSelect(
                  'นนทกานต์ วงษ์แก้ว',
                  'ezex215@gmail.com',
                  'https://cdn.phototourl.com/free/2026-08-14-553d4adf-51c8-48b0-9bc7-551ac9366889.jpg'
                )
              }
              className="flex items-center gap-2.5 p-2 rounded-xl bg-[#0d0f12] border border-[#39FF14]/40 hover:border-[#39FF14] text-left hover:bg-white/5 transition-all group"
            >
              <img
                src="https://cdn.phototourl.com/free/2026-08-14-553d4adf-51c8-48b0-9bc7-551ac9366889.jpg"
                alt="นนทกานต์"
                className="w-9 h-9 rounded-full object-cover border border-[#39FF14]"
              />
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white group-hover:text-[#39FF14] transition-colors truncate">
                  นนทกานต์ (ผู้พัฒนา)
                </p>
                <p className="text-[10px] text-[#849396] font-mono-data truncate">
                  ezex215@gmail.com
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() =>
                handleQuickProfileSelect(
                  'อาจารย์ / กรรมการผู้ตรวจ',
                  'evaluator@gmail.com',
                  'https://api.dicebear.com/7.x/bottts/svg?seed=TeacherEvaluator'
                )
              }
              className="flex items-center gap-2.5 p-2 rounded-xl bg-[#0d0f12] border border-[#00E5FF]/40 hover:border-[#00E5FF] text-left hover:bg-white/5 transition-all group"
            >
              <img
                src="https://api.dicebear.com/7.x/bottts/svg?seed=TeacherEvaluator"
                alt="อาจารย์"
                className="w-9 h-9 rounded-full object-cover border border-[#00E5FF]"
              />
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white group-hover:text-[#00E5FF] transition-colors truncate">
                  อาจารย์ / ผู้ตรวจประเมิน
                </p>
                <p className="text-[10px] text-[#849396] font-mono-data truncate">
                  evaluator@gmail.com
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Custom Profile Login Form */}
        <form onSubmit={handleDirectSubmit} className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <User size={14} className="text-[#00E5FF]" />
              <span>หรือระบุข้อมูลบัญชีของคุณ:</span>
            </span>
          </div>

          {/* Avatar Selector */}
          <div>
            <label className="text-[11px] font-semibold text-[#849396] block mb-1.5">
              เลือกรูปโปรไฟล์
            </label>
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
              {avatarOptions.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => setSelectedAvatar(av.url)}
                  className={`relative p-1 rounded-xl border transition-all flex-shrink-0 ${
                    selectedAvatar === av.url
                      ? 'border-[#00E5FF] bg-[#00E5FF]/10 neon-glow-primary scale-105'
                      : 'border-white/10 hover:border-white/30 bg-[#111318]'
                  }`}
                >
                  <img
                    src={av.url}
                    alt={av.label}
                    className="w-9 h-9 rounded-lg object-cover"
                  />
                  {selectedAvatar === av.url && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#00E5FF] text-[#00363d] flex items-center justify-center text-[10px]">
                      <Check size={10} strokeWidth={3} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#bac9cc] block mb-1">
              ชื่อผู้ใช้งาน หรือชื่อของคุณ *
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#849396]" />
              <input
                type="text"
                required
                placeholder="กรอกชื่อของคุณ หรือชื่อเล่น"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full bg-[#111318] border border-white/15 focus:border-[#00E5FF] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white focus:outline-none placeholder:text-neutral-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#bac9cc] block mb-1">
              อีเมล Gmail (สำหรับซิงค์คลาวด์)
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#849396]" />
              <input
                type="email"
                placeholder="yourname@gmail.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-[#111318] border border-white/15 focus:border-[#00E5FF] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white focus:outline-none font-mono-data placeholder:text-neutral-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isAuthLoading || !nameInput.trim()}
            className="w-full py-3 rounded-xl bg-[#00E5FF] hover:bg-[#9cf0ff] text-[#00363d] font-bold text-sm neon-glow-primary active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg cursor-pointer"
          >
            <Zap size={16} />
            <span>เข้าสู่ระบบและเริ่มใช้งานทันที</span>
            <ArrowRight size={15} />
          </button>
        </form>

        {/* Alternative: Google OAuth Popup toggle */}
        <div className="mt-4 pt-3 border-t border-white/10 text-center">
          {!showGoogleOAuthOption ? (
            <button
              type="button"
              onClick={() => setShowGoogleOAuthOption(true)}
              className="text-xs text-[#849396] hover:text-[#00E5FF] transition-colors underline"
            >
              หรือใช้หน้าต่างล็อกอิน Google OAuth Popup
            </button>
          ) : (
            <div className="space-y-2 pt-1 animate-in fade-in">
              <button
                type="button"
                onClick={handleGoogleAuthClick}
                disabled={isAuthLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-xs flex items-center justify-center gap-2.5 transition-all shadow active:scale-95"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                <span>เปิดหน้าต่าง Google Login Popup</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

