// 🔥 KPISection.jsx
import { useMemo } from "react";
import KpiCard from "../ui/KpiCard";

export default function KPISection({ totalKwh, cost, carbon }) {
  // ✅ ใช้ useMemo เพื่อช่วยคำนวณค่าให้ Relative ตามการเปลี่ยนแปลงของ Props
  const stats = useMemo(
    () => [
      {
        id: "usage",
        title: "ใช้ไฟฟ้าวันนี้",
        value: Number(totalKwh || 0).toFixed(2),
        unit: "kWh",
        color: "emerald",
      },
      {
        id: "cost",
        title: "ค่าไฟประมาณการ",
        value: Number(cost || 0).toFixed(2),
        unit: "฿",
        color: "blue",
      },
      {
        id: "carbon",
        title: "ลดคาร์บอน",
        value: Number(carbon || 0).toFixed(2),
        unit: "kgCO2",
        color: "rose",
      },
      {
        id: "savings",
        title: "ประหยัดได้",
        value: "12.5",
        unit: "%",
        color: "amber",
      },
    ],
    [totalKwh, cost, carbon],
  );

  return (
    <div className="relative group">
      {/* 🛡️ Background Decoration - Scoped Relative to this section */}
      <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/5 via-transparent to-blue-500/5 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

      {/* 📊 Grid Container: Relative to allow Z-index management */}
      <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {stats.map((item) => (
          <div key={item.id} className="relative h-full">
            <KpiCard
              title={item.title}
              value={item.value}
              unit={item.unit}
              color={item.color}
            />

            {/* ✨ Subtle Indicator - Relative to each card */}
            <div
              className={`absolute top-4 right-4 w-1 h-1 rounded-full animate-pulse bg-${item.color}-500 opacity-50`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
