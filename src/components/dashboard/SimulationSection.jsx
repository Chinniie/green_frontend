import React, { useMemo } from "react";

export default function SimulationSection({
  totalKwh,
  cost,
  reduction,
  setReduction,
  isPremium,
}) {
  // คำนวณผลลัพธ์ (ใช้ useMemo เพื่อ Performance)
  const stats = useMemo(() => {
    const electricityRate = 4.2; // อัตราค่าไฟ
    const carbonFactor = 0.5; // kgCO2e ต่อหน่วย

    const currentDailyCost = totalKwh * electricityRate;
    const reducedKwh = totalKwh * (reduction / 100);
    const dailySaving = reducedKwh * electricityRate;
    const dailyCarbonSaved = reducedKwh * carbonFactor;

    return {
      newCost: currentDailyCost - dailySaving,
      savingDay: dailySaving,
      savingMonth: dailySaving * 30,
      savingYear: dailySaving * 365,
      carbonSaved: dailyCarbonSaved * 30, // รายเดือน
    };
  }, [totalKwh, reduction]);

  const format = (num) => Number(num).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden transition-all hover:shadow-2xl">
      {/* Header Section */}
      <div className="bg-slate-900 p-8 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black flex items-center gap-2">
              🔧 เครื่องมือจำลองการประหยัดไฟ
            </h2>
            <p className="text-slate-400 text-sm mt-1 font-light">
              ลองปรับ % การลดใช้ไฟเพื่อดูยอดเงินที่จะเพิ่มในกระเป๋าคุณ
            </p>
          </div>
          {!isPremium && (
            <span className="bg-amber-500/20 text-amber-400 text-[10px] px-3 py-1 rounded-full border border-amber-500/30 font-bold tracking-tighter">
              FREE VERSION (Max 10%)
            </span>
          )}
        </div>

        {/* Hero Saving Amount */}
        <div className="mt-8 flex flex-col md:flex-row md:items-end gap-2 md:gap-6">
          <div className="flex flex-col">
            <span className="text-xs text-emerald-400 uppercase font-black tracking-widest">คุณจะประหยัดเงินได้ถึง (ต่อปี)</span>
            <span className="text-6xl font-black text-white">฿{format(stats.savingYear)}</span>
          </div>
          <div className="bg-emerald-500/20 px-4 py-2 rounded-2xl border border-emerald-500/30 h-fit mb-2">
            <p className="text-xs font-bold text-emerald-300">🌿 ลดก๊าซเรือนกระจกได้</p>
            <p className="text-lg font-black text-white">{format(stats.carbonSaved)} <span className="text-xs font-normal">kgCO2e/เดือน</span></p>
          </div>
        </div>
      </div>

      {/* Control Section */}
      <div className="p-8">
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <span className="font-bold text-gray-700 text-lg">เป้าหมายการลดใช้ไฟของวันนี้</span>
            <span className="text-3xl font-black text-blue-600 bg-blue-50 px-5 py-2 rounded-2xl border border-blue-100">
              {reduction}%
            </span>
          </div>
          
          <input
            type="range"
            min="0"
            max={isPremium ? 50 : 10}
            value={reduction}
            onChange={(e) => setReduction(Number(e.target.value))}
            className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          
          <div className="flex justify-between mt-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <span>0%</span>
            <span>{isPremium ? "50% (Max)" : "10% (Free)"}</span>
          </div>
          
          {!isPremium && (
            <div className="mt-4 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-center justify-between">
              <p className="text-xs text-amber-700">🔓 <b>Premium User</b> สามารถจำลองการลดได้สูงสุดถึง 50%</p>
              <button className="text-xs font-black text-amber-700 underline underline-offset-4">Upgrade Now</button>
            </div>
          )}
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-[2rem] bg-gray-50 border border-gray-100 transition-transform hover:-translate-y-1">
            <p className="text-[10px] text-gray-400 uppercase font-black mb-2 tracking-widest">ประหยัดวันนี้</p>
            <p className="text-2xl font-black text-gray-800">฿{format(stats.savingDay)}</p>
          </div>
          <div className="p-6 rounded-[2rem] bg-blue-50 border border-blue-100 transition-transform hover:-translate-y-1">
            <p className="text-[10px] text-blue-400 uppercase font-black mb-2 tracking-widest">ประหยัดเดือนนี้</p>
            <p className="text-2xl font-black text-blue-800">฿{format(stats.savingMonth)}</p>
          </div>
          <div className="p-6 rounded-[2rem] bg-emerald-50 border border-emerald-100 transition-transform hover:-translate-y-1">
            <p className="text-[10px] text-emerald-400 uppercase font-black mb-2 tracking-widest">ค่าไฟใหม่วันนี้</p>
            <p className="text-2xl font-black text-emerald-700">฿{format(stats.newCost)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}