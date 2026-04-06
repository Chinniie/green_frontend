import React, { useState, useEffect } from "react";
import axios from "axios";

// ✅ 1. ดึงค่าจาก .env (Vite standard)
const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export default function UtilityFeature() {
  const [config, setConfig] = useState({
    base_rate: 3.99,
    ft_rate: 0.39,
    carbon_factor: 0.5,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // ดึงค่าเริ่มต้นจาก Database ทันทีที่ Component โหลด
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // ✅ 2. เปลี่ยนจาก URL แข็งๆ เป็น API_URL
      const res = await axios.get(`${API_URL}/settings`);
      if (res.data) setConfig(res.data);
    } catch (err) {
      console.error("Fetch Settings Error:", err);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // ✅ 3. เปลี่ยนจาก URL แข็งๆ เป็น API_URL
      await axios.post(`${API_URL}/settings/update`, config);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      // ✅ แนะนำ: ให้ทำการ Reload หน้าเว็บเบาๆ เพื่อให้ Dashboard รับค่าใหม่
      // (หรือในอนาคตบอสอาจจะใช้ Context ในการ Refresh ค่าแทนการ Reload หน้า)
      window.location.reload();
    } catch (err) {
      console.error("SAVE ERROR:", err);
      alert("ไม่สามารถบันทึกข้อมูลได้ กรุณาตรวจสอบการเชื่อมต่อ Backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 md:p-0">
      <header className="mb-8 border-b border-slate-100 pb-6">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase italic">
          ⚙️ {import.meta.env.VITE_APP_NAME || "System"} Central Control
        </h2>
        <p className="text-slate-500 mt-2 font-medium italic">
          กำหนดอัตราค่าไฟและคาร์บอนฟุตพริ้นท์เพื่อใช้คำนวณในทุก Dashboard
          ทั่วระบบ
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card: อัตราค่าไฟฟ้า */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 transition-all hover:shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black">
              ฿
            </div>
            <h3 className="font-black text-lg text-slate-700 uppercase italic">
              อัตราค่าไฟฟ้าสุทธิ
            </h3>
          </div>
          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">
                ค่าไฟฐาน (Base Rate)
              </label>
              <input
                type="number"
                step="0.01"
                value={config.base_rate}
                onChange={(e) =>
                  setConfig({ ...config, base_rate: Number(e.target.value) })
                }
                className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-lg focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">
                ค่า FT (Float Time)
              </label>
              <input
                type="number"
                step="0.01"
                value={config.ft_rate}
                onChange={(e) =>
                  setConfig({ ...config, ft_rate: Number(e.target.value) })
                }
                className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-lg focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              />
            </div>
          </div>
        </div>

        {/* Card: ESG & Sustainability */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 transition-all hover:shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
              🌿
            </div>
            <h3 className="font-black text-lg text-slate-700 uppercase italic">
              เป้าหมาย Green Carbon
            </h3>
          </div>
          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">
                Carbon Factor (kgCO2e/kWh)
              </label>
              <input
                type="number"
                step="0.001"
                value={config.carbon_factor}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    carbon_factor: Number(e.target.value),
                  })
                }
                className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-lg focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
              />
            </div>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <p className="text-[11px] text-emerald-700 leading-relaxed font-medium italic">
                ตัวเลขนี้มีผลต่อการออกรายงาน ESG 13 (Climate Action)
                ของลูกค้ากลุ่ม SME และ Factory ทั่วทั้งระบบ
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* สรุปและปุ่มบันทึก */}
      <div className="mt-10 flex flex-col md:flex-row items-center justify-between bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl shadow-slate-200 relative overflow-hidden">
        <div className="mb-6 md:mb-0 relative z-10">
          <p className="text-[10px] text-slate-400 uppercase tracking-[0.3em] font-black mb-1 italic">
            Effective Rate ปัจจุบัน
          </p>
          <p className="text-5xl font-black text-emerald-400 tracking-tighter italic">
            ฿ {(config.base_rate + config.ft_rate).toFixed(4)}{" "}
            <span className="text-sm font-normal opacity-50 not-italic">
              / หน่วย
            </span>
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className={`relative z-10 px-12 py-5 rounded-[1.5rem] font-black transition-all uppercase tracking-widest text-xs ${loading ? "bg-slate-700" : "bg-blue-600 hover:bg-blue-500 hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/30"}`}
        >
          {loading
            ? "Syncing..."
            : success
              ? "✅ Success!"
              : "Update System Settings"}
        </button>

        {/* Decorative Background */}
        <div className="absolute -right-10 -bottom-10 text-white/[0.03] font-black text-[12rem] select-none italic pointer-events-none uppercase">
          Utility
        </div>
      </div>
    </div>
  );
}
