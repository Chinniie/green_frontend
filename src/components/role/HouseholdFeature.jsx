import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useEnergy } from "../../context/EnergyContext";

export default function HouseholdFeature({ data = [] }) {
  const navigate = useNavigate();
  const { config } = useEnergy();

  // 👤 ข้อมูลจำลองสำหรับ Points
  const [points] = useState(1240);

  // 🧠 Logic คำนวณบิลจริง (ไม่มีการจำลอง)
  const billSummary = useMemo(() => {
    const totalKwh = data.reduce((sum, d) => sum + Number(d.kwh || 0), 0);
    const baseCost = totalKwh * (config.base_rate || 3.99);
    const ftCost = totalKwh * (config.ft_rate || 0);
    const vat = (baseCost + ftCost) * 0.07;
    const grandTotal = baseCost + ftCost + vat;
    const savings = 1500 - grandTotal;

    return { totalKwh, grandTotal, savings, baseCost, ftCost, vat };
  }, [data, config]);

  return (
    <div className="space-y-8 mt-6">
      
      {/* --- 🟢 1. Banner วาร์ปไปหน้า Simulation (เก็บไว้เป็นทางเข้า) --- */}
      <div 
        onClick={() => navigate("/simulation")}
        className="bg-emerald-50 p-6 rounded-[2.5rem] border border-emerald-100 flex items-center justify-between cursor-pointer group hover:bg-emerald-100 transition-all shadow-sm"
      >
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">🧪</div>
          <div>
            <h4 className="font-black text-emerald-900 text-lg leading-tight">อยากลองลดค่าไฟดูไหม?</h4>
            <p className="text-sm text-emerald-600 font-medium opacity-80">ไปที่ห้องทดลองเพื่อจำลองการประหยัดและรับแต้มเพิ่ม</p>
          </div>
        </div>
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-sm group-hover:translate-x-2 transition-transform">
          ➜
        </div>
      </div>

      {/* --- 🏆 2. Reward Points Card (Priority สูงสุด) --- */}
      <div className="bg-slate-900 rounded-[3.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <p className="text-[10px] font-black uppercase text-emerald-400 tracking-[0.3em] mb-4">Green Carbon Points</p>
            <h2 className="text-white text-7xl font-black tracking-tighter italic">
              {points.toLocaleString()} <span className="text-2xl not-italic opacity-40">PTS</span>
            </h2>
            <div className="mt-6 flex gap-3">
              <span className="bg-emerald-500 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">Energy Saver Pro</span>
            </div>
          </div>
          <div className="text-center md:text-right border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 md:pl-12">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monthly Savings</p>
             <p className="text-4xl font-black text-emerald-400">฿ {billSummary.savings > 0 ? billSummary.savings.toLocaleString() : "0"}</p>
             <p className="text-[10px] font-bold opacity-40 italic mt-1">ประหยัดได้มากกว่าเดือนที่แล้ว</p>
          </div>
        </div>
      </div>

      {/* --- 📊 3. Real Usage Breakdown (แทนที่กล่องดำเดิม) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-8">
             <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">🧾 Bill Breakdown</h3>
             <p className="text-3xl font-black text-slate-900">฿ {billSummary.grandTotal.toLocaleString(undefined, {maximumFractionDigits: 2})}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Base Cost</p>
                <p className="font-black text-slate-700 italic">฿ {billSummary.baseCost.toLocaleString()}</p>
             </div>
             <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">FT Rate</p>
                <p className="font-black text-slate-700 italic">฿ {billSummary.ftCost.toLocaleString()}</p>
             </div>
             <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                <p className="text-[10px] font-black text-emerald-600 uppercase mb-1">VAT (7%)</p>
                <p className="font-black text-emerald-700 italic">฿ {billSummary.vat.toLocaleString()}</p>
             </div>
          </div>
        </div>

        {/* ☕ Quick Rewards */}
        <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 flex flex-col justify-between group">
           <div className="flex justify-between items-start">
             <h3 className="font-black text-slate-800">Next Reward</h3>
             <span className="text-3xl group-hover:rotate-12 transition-transform">☕</span>
           </div>
           <div className="my-6">
              <p className="text-sm font-black text-slate-700 leading-tight">ส่วนลดกาแฟ ฿20 <br/> <span className="text-emerald-500">ใช้ 50 PTS</span></p>
           </div>
           <button 
             onClick={() => navigate("/bill-decoder")}
             className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
           >
             Redeem / Add Bill
           </button>
        </div>
      </div>

    </div>
  );
}