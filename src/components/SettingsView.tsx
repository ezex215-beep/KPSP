import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Download,
  Upload,
  RotateCcw,
  Check,
  Code,
  BellRing,
} from 'lucide-react';
import { UserProfile, CategoryBudget, Transaction } from '../types';

interface SettingsViewProps {
  userProfile: UserProfile;
  onUpdateUserProfile: (profile: UserProfile) => void;
  categories: CategoryBudget[];
  transactions: Transaction[];
  onResetData: () => void;
  onImportData: (data: { categories: CategoryBudget[]; transactions: Transaction[]; userProfile: UserProfile }) => void;
  onOpenLoginModal: () => void;
  onSignOut: () => void;
  isAuthLoading?: boolean;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  userProfile,
  onUpdateUserProfile,
  categories,
  transactions,
  onResetData,
  onImportData,
  onOpenLoginModal,
  onSignOut,
  isAuthLoading = false,
}) => {
  const [name, setName] = useState(userProfile.name);
  const [tagline, setTagline] = useState(userProfile.tagline);
  const [userId, setUserId] = useState(userProfile.userId);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUserProfile({
      ...userProfile,
      name: name.trim() || userProfile.name,
      tagline: tagline.trim() || userProfile.tagline,
      userId: userId.trim() || userProfile.userId,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportData = () => {
    const exportObject = {
      userProfile,
      categories,
      transactions,
      exportedAt: new Date().toISOString(),
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(exportObject, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `cyber-finance-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.categories && parsed.transactions) {
            onImportData(parsed);
            alert('นำเข้าข้อมูลสำรองเรียบร้อยแล้ว!');
          } else {
            alert('รูปแบบไฟล์ไม่ถูกต้อง');
          }
        } catch (err) {
          alert('ไม่สามารถอ่านไฟล์ JSON ได้');
        }
      };
    }
  };

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-4xl">
      {/* Header */}
      <header>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#e2e2e8] tracking-tight">
          การตั้งค่าระบบ
        </h2>
        <p className="text-xs sm:text-sm font-mono-data text-[#849396] mt-1 tracking-wider uppercase">
          SYS.CONFIG // USER_PREFERENCES
        </p>
      </header>

      {/* Google Account & Cloud Database Status */}
      <div className="glass-panel rounded-2xl p-6 border border-[#00E5FF]/30 neon-glow-primary">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#111318] border border-[#00E5FF]/40 flex items-center justify-center p-2.5 flex-shrink-0">
              <svg className="w-full h-full" viewBox="0 0 24 24">
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
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  บัญชี Google (Gmail) & คลาวด์ซิงค์
                </h3>
                {userProfile.isGoogleAuth ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-data bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/50">
                    ONLINE SYNC
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-data bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    GUEST MODE
                  </span>
                )}
              </div>
              <p className="text-xs text-[#849396] mt-0.5">
                {userProfile.isGoogleAuth
                  ? `เข้าสู่ระบบด้วย: ${userProfile.email} (เชื่อมต่อ Firestore Cloud DB แล้ว)`
                  : 'เข้าสู่ระบบด้วยบัญชี Google เพื่อสำรองและเข้าถึงข้อมูลการเงินข้ามทุกอุปกรณ์ของคุณ'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!userProfile.isGoogleAuth ? (
              <button
                onClick={onOpenLoginModal}
                disabled={isAuthLoading}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#00E5FF] hover:bg-[#9cf0ff] text-[#00363d] font-bold text-xs neon-glow-primary active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>เข้าสู่ระบบ / ยืนยันตัวตน</span>
              </button>
            ) : (
              <button
                onClick={onSignOut}
                disabled={isAuthLoading}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 font-semibold text-xs transition-all active:scale-95"
              >
                ออกจากระบบ (Sign Out)
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-white/10">
            <User size={18} className="text-[#00E5FF]" />
            <h3 className="text-base font-bold text-white">ข้อมูลผู้ใช้งาน</h3>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#bac9cc] block mb-1">
                รหัสประจำตัว (User Code)
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full bg-[#111318] border border-white/15 focus:border-[#00E5FF] rounded-xl px-3.5 py-2 text-sm text-white font-mono-data focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#bac9cc] block mb-1">
                ชื่อที่แสดง
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#111318] border border-white/15 focus:border-[#00E5FF] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#bac9cc] block mb-1">
                คำขวัญ / สโลแกนเป้าหมาย
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-[#111318] border border-white/15 focus:border-[#00E5FF] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#00E5FF] hover:bg-[#9cf0ff] text-[#00363d] font-bold text-sm neon-glow-primary active:scale-95 transition-all flex items-center justify-center gap-1.5 mt-2"
            >
              {savedSuccess ? (
                <>
                  <Check size={16} /> บันทึกเรียบร้อย
                </>
              ) : (
                'บันทึกข้อมูลส่วนตัว'
              )}
            </button>
          </form>
        </div>

        {/* Developer Attribution Card */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-white/10">
            <Code size={18} className="text-[#39FF14]" />
            <h3 className="text-base font-bold text-white">ข้อมูลผู้พัฒนาระบบ</h3>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#39FF14] neon-glow-secondary flex-shrink-0">
              <img
                src={userProfile.developerAvatarUrl}
                alt={userProfile.developerName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                {userProfile.developerName}
              </h4>
              <p className="text-xs text-[#39FF14] font-mono-data mt-0.5">
                ระดับชั้น: {userProfile.developerClass}
              </p>
              <p className="text-xs text-[#849396] mt-0.5">
                {userProfile.developerSchool}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#111318] border border-white/10 text-xs text-[#bac9cc] leading-relaxed">
            โครงงานพัฒนาแอปพลิเคชันบริหารการเงินส่วนบุคคลด้วยระบบควบคุมงบประมาณอัจฉริยะ (Cyber-Luminous Finance)
          </div>
        </div>
      </div>

      {/* Backup & System Operations */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10">
        <h3 className="text-base font-bold text-white mb-4">
          การจัดการข้อมูลสำรอง (Backup & Restore)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={handleExportData}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#111318] border border-white/15 hover:border-[#00E5FF] text-white text-xs font-semibold hover:bg-white/5 transition-all"
          >
            <Download size={16} className="text-[#00E5FF]" />
            <span>ส่งออกข้อมูล (Export JSON)</span>
          </button>

          <label className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#111318] border border-white/15 hover:border-[#39FF14] text-white text-xs font-semibold hover:bg-white/5 transition-all cursor-pointer">
            <Upload size={16} className="text-[#39FF14]" />
            <span>นำเข้าข้อมูล (Import JSON)</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={() => {
              if (confirm('คุณต้องการรีเซ็ตข้อมูลเป็นค่าเริ่มต้นทั้งหมดหรือไม่?')) {
                onResetData();
              }
            }}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#93000a]/20 border border-[#ffb4ab]/40 hover:border-[#ffb4ab] text-[#ffb4ab] text-xs font-semibold hover:bg-[#93000a]/30 transition-all"
          >
            <RotateCcw size={16} />
            <span>รีเซ็ตเป็นข้อมูลตัวอย่าง</span>
          </button>
        </div>
      </div>
    </div>
  );
};
