import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEnergy } from "../../context/EnergyContext";
import { useTranslation } from "react-i18next";

// ✅ 1. ดึงค่าจาก .env (Vite standard)
const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export default function SmeFeature({ data = [] }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { effectiveRate } = useEnergy();
  const [summary, setSummary] = useState(null);

  // ดึงข้อมูล User จาก LocalStorage
  const user = useMemo(
    () => JSON.parse(localStorage.getItem("user") || "{}"),
    [],
  );

  // ✅ 2. ปรับเป็น useCallback เพื่อประสิทธิภาพที่ดีขึ้น
  const fetchSummary = useCallback(async () => {
    if (!user.id) return;
    try {
      // ✅ 3. ใช้ API_URL จาก .env
      const res = await axios.get(
        `${API_URL}/report/monthly-summary/${user.id}`,
      );
      setSummary(res.data);
    } catch (err) {
      console.error("SME Summary Fetch Error:", err);
    }
  }, [user.id]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  // ดึงชั่วโมงที่ใช้ไฟสูงสุด (แบบย่อ)
  const quickPeak = useMemo(() => {
    if (!data || data.length === 0) return null;
    return data.reduce(
      (max, curr) => (Number(curr.kwh) > Number(max.kwh) ? curr : max),
      data[0],
    );
  }, [data]);

  return (
    <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 🚀 Quick Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <button
          onClick={() => navigate("/report")}
          className="flex-1 bg-emerald-600 text-white p-6 rounded-[2.5rem] font-black shadow-xl shadow-emerald-500/10 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-between group overflow-hidden relative"
        >
          <div className="text-left relative z-10">
            <p className="text-[10px] uppercase tracking-[0.3em] opacity-70 italic mb-1">
              Full Document
            </p>
            <p className="text-2xl italic tracking-tighter uppercase">
              ESG Report
            </p>
          </div>
          <span className="text-4xl group-hover:translate-x-2 transition-transform relative z-10">
            📄
          </span>
          <div className="absolute -right-4 -bottom-4 text-7xl opacity-10 font-black italic select-none">
            ESG
          </div>
        </button>

        <button
          onClick={() => navigate("/peak-analysis")}
          className="flex-1 bg-slate-900 text-white p-6 rounded-[2.5rem] font-black shadow-xl shadow-slate-200/50 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-between group overflow-hidden relative"
        >
          <div className="text-left relative z-10">
            <p className="text-[10px] uppercase tracking-[0.3em] opacity-50 italic mb-1">
              Deep Dive
            </p>
            <p className="text-2xl italic tracking-tighter uppercase">
              Peak Analysis
            </p>
          </div>
          <span className="text-4xl group-hover:translate-x-2 transition-transform relative z-10">
            ⚡
          </span>
          <div className="absolute -right-4 -bottom-4 text-white/[0.03] font-black text-8xl italic select-none">
            MAX
          </div>
        </button>
      </div>

      {/* 📊 Summary Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Monthly Cost */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm transition-all hover:shadow-md group">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 italic">
            Estimated Monthly Cost
          </p>
          <h4 className="text-4xl font-black text-blue-600 tracking-tighter italic">
            ฿ {Number(summary?.current?.cost || 0).toLocaleString()}
          </h4>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-emerald-500 bg-emerald-50 w-fit px-3 py-1.5 rounded-full uppercase tracking-widest">
            <span className="animate-bounce">↓</span> 12% vs Industry
          </div>
        </div>

        {/* Card 2: Quick Peak Insight */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden transition-all hover:shadow-md group">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 italic">
            Daily Peak Alert
          </p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-2xl group-hover:rotate-12 transition-transform">
              ⏰
            </div>
            <h4 className="text-3xl font-black text-slate-900 tracking-tighter italic">
              {quickPeak ? `${quickPeak.hour}:00` : "--:--"}
            </h4>
          </div>
          <p className="text-[10px] text-orange-500 font-black mt-4 italic uppercase tracking-widest">
            ⚠️ Peak warning zone
          </p>
        </div>

        {/* Card 3: ESG Teaser */}
        <div className="bg-emerald-900 p-8 rounded-[3rem] shadow-xl relative group overflow-hidden text-white">
          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4 italic">
            Sustainability Impact
          </p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform backdrop-blur-md">
              🌳
            </div>
            <h4 className="text-3xl font-black text-white tracking-tighter italic">
              {((Number(summary?.current?.carbon || 0) * 12) / 9).toFixed(0)}{" "}
              Trees
            </h4>
          </div>
          <div className="absolute -right-4 -bottom-4 text-7xl opacity-10 group-hover:rotate-12 transition-transform">
            🌿
          </div>
        </div>
      </div>

      {/* 📍 Industry Benchmarking Summary */}
      <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl flex flex-col md:flex-row items-center justify-between px-12 relative overflow-hidden border border-white/5">
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-14 h-14 bg-white/10 rounded-[1.5rem] flex items-center justify-center shadow-inner text-2xl border border-white/10 backdrop-blur-md">
            🏆
          </div>
          <div className="space-y-1">
            <p className="text-xs font-black text-emerald-400 uppercase tracking-[0.3em] italic">
              Performance Status
            </p>
            <p className="text-sm text-slate-400 font-medium italic opacity-80">
              คุณประหยัดไฟได้ดีกว่ากลุ่ม SME ทั่วไปในเขตกรุงเทพฯ
            </p>
          </div>
        </div>
        <div className="text-right mt-6 md:mt-0 relative z-10">
          <p className="text-4xl font-black text-white italic tracking-tighter uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            Excellent
          </p>
        </div>

        {/* Glow Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none"></div>
      </div>
    </div>
  );
}
