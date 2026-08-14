import React from 'react';
import { X, HelpCircle, ShieldCheck, Zap, PieChart, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
}

export const HelpModal: React.FC<HelpModalProps> = ({
  isOpen,
  onClose,
  userProfile,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl glass-panel-elevated rounded-2xl p-6 sm:p-8 relative border border-[#00E5FF]/30 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF] flex items-center justify-center">
              <HelpCircle size={18} />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-[#00E5FF] neon-text-primary">
                ศูนย์ช่วยเหลือและคู่มือ
              </h3>
              <p className="text-xs text-[#849396]">
                คำแนะนำในการใช้งานระบบบันทึกการเงิน Cyber-Luminous
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#849396] hover:text-white p-1"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-[#bac9cc]">
          <div className="p-4 rounded-xl bg-[#111318] border border-white/10 space-y-2">
            <div className="flex items-center gap-2 font-bold text-white">
              <PieChart size={16} className="text-[#00E5FF]" />
              <span>1. การวางแผนงบประมาณรายเดือน</span>
            </div>
            <p className="leading-relaxed text-[#849396]">
              คลิกที่ปุ่ม <span className="text-[#39FF14] font-semibold">+ ตั้งงบประมาณใหม่</span> เพื่อกำหนดวงเงินสูงสุดในแต่ละหมวดหมู่ ระบบจะคำนวณสัดส่วน % การใช้จ่ายและแจ้งเตือนอัตโนมัติเมื่อใกล้เต็มวงเงิน
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#111318] border border-white/10 space-y-2">
            <div className="flex items-center gap-2 font-bold text-white">
              <Zap size={16} className="text-[#39FF14]" />
              <span>2. การบันทึกรายรับ-รายจ่าย</span>
            </div>
            <p className="leading-relaxed text-[#849396]">
              คลิกปุ่ม <span className="text-[#00E5FF] font-semibold">+ เพิ่มรายการ</span> เพื่อบันทึกค่าใช้จ่ายหรือเงินเดือนที่ได้รับ ยอดเงินจะสะท้อนเข้ากราฟวงแหวนและประวัติกิจกรรมแบบเรียลไทม์ทันที
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#111318] border border-white/10 space-y-2">
            <div className="flex items-center gap-2 font-bold text-white">
              <ShieldCheck size={16} className="text-[#79ff5b]" />
              <span>3. ความปลอดภัยและการจัดเก็บข้อมูล</span>
            </div>
            <p className="leading-relaxed text-[#849396]">
              ข้อมูลทั้งหมดถูกจัดเก็บบนอุปกรณ์ของคุณอย่างปลอดภัยผ่าน Local Storage พร้อมฟังก์ชัน Export/Import สำรองข้อมูลเป็นไฟล์ JSON ได้ทุกเมื่อ
            </p>
          </div>

          {/* Credits */}
          <div className="pt-4 border-t border-white/10 text-center text-xs text-[#849396]">
            <p>พัฒนาโดย: <strong className="text-white">{userProfile.developerName}</strong> ({userProfile.developerClass})</p>
            <p className="text-[11px] mt-0.5">{userProfile.developerSchool}</p>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-[#00E5FF] hover:bg-[#9cf0ff] text-[#00363d] font-bold text-sm neon-glow-primary active:scale-95 transition-all"
          >
            เข้าใจแล้ว
          </button>
        </div>
      </div>
    </div>
  );
};
