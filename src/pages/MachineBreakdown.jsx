import React, { useMemo } from "react";
import Layout from "../components/ui/Layout";
import { useTranslation } from "react-i18next"; // ✅ 1. Import Hook
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function MachineBreakdown() {
  const { t } = useTranslation(); // ✅ 2. Initialize
  const user = useMemo(
    () => JSON.parse(localStorage.getItem("user") || "{}"),
    [],
  );

  // 🧠 ข้อมูลจำลอง: ประสิทธิภาพรายเครื่อง (สถานะจะถูก Map กับ Key ใน i18n)
  const machineData = [
    {
      name: "Main Compressor",
      kwh: 450,
      status: "statusHighLoad",
      efficiency: 85,
      color: "#f43f5e",
    },
    {
      name: "Conveyor Line A",
      kwh: 120,
      status: "statusNormal",
      efficiency: 98,
      color: "#10b981",
    },
    {
      name: "Oven Unit 1",
      kwh: 380,
      status: "statusAbnormal",
      efficiency: 62,
      color: "#f59e0b",
    },
    {
      name: "Oven Unit 2",
      kwh: 310,
      status: "statusNormal",
      efficiency: 92,
      color: "#10b981",
    },
    {
      name: "Packaging System",
      kwh: 85,
      status: "statusIdle",
      efficiency: 40,
      color: "#94a3b8",
    },
  ];

  return (
    <Layout>
      <div className="max-w-[1600px] mx-auto space-y-10 pb-20 animate-in fade-in duration-1000">
        {/* --- 🔝 Header --- */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-slate-900 p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl font-black tracking-tighter mb-2 italic uppercase">
              {t("machineIntelCenter")}
            </h1>
            <p className="text-emerald-400 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
              {t("factoryMonitoring")}
            </p>
          </div>
          <div className="flex gap-4 relative z-10 mt-6 lg:mt-0">
            <div className="px-6 py-4 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 text-center min-w-[140px]">
              <p className="text-[10px] opacity-50 uppercase font-black mb-1 tracking-widest">
                {t("totalActiveAssets")}
              </p>
              <p className="text-2xl font-black">
                12{" "}
                <span className="text-xs opacity-50 font-normal uppercase">
                  {t("units")}
                </span>
              </p>
            </div>
            <div className="px-6 py-4 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 text-center min-w-[140px]">
              <p className="text-[10px] opacity-50 uppercase font-black mb-1 tracking-widest">
                {t("avgFactoryOEE")}
              </p>
              <p className="text-2xl font-black text-emerald-400">88.4%</p>
            </div>
          </div>
          <div className="absolute -right-20 -bottom-20 text-[20rem] opacity-5 pointer-events-none italic font-black select-none">
            4.0
          </div>
        </div>

        {/* --- 📦 Section 1: Real-time Asset Status --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 flex flex-col justify-between">
            <h3 className="text-xl font-black text-slate-800 mb-10 flex items-center gap-3 uppercase tracking-tighter">
              <span className="w-1.5 h-8 bg-slate-900 rounded-full"></span>
              {t("assetPerfHealth")}
            </h3>

            <div className="space-y-8">
              {machineData.map((item, i) => (
                <div key={i} className="group">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-3 h-3 rounded-full shadow-sm`}
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="font-black text-slate-700 uppercase tracking-tight text-sm">
                        {item.name}
                      </span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${item.status === "statusAbnormal" ? "bg-rose-100 text-rose-600" : "bg-slate-100 text-slate-500"}`}
                      >
                        {t(item.status)}
                      </span>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {t("efficiency")}:{" "}
                      <span
                        className={
                          item.efficiency < 70
                            ? "text-rose-500"
                            : "text-emerald-500"
                        }
                      >
                        {item.efficiency}%
                      </span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden border border-slate-100 p-0.5">
                    <div
                      className="h-full rounded-full transition-all duration-1000 shadow-inner"
                      style={{
                        width: `${item.efficiency}%`,
                        backgroundColor: item.color,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Critical Audit (The "Why" Card) */}
          <div className="bg-rose-600 p-10 rounded-[3.5rem] shadow-2xl text-white flex flex-col justify-between group overflow-hidden relative">
            <div className="relative z-10">
              <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-10 italic">
                {t("abnormalDetection")}
              </p>
              <h4 className="text-3xl font-black mb-4 tracking-tighter leading-none italic">
                {t("ovenCriticalTitle")}
              </h4>
              <p className="text-sm opacity-90 leading-relaxed font-medium">
                {t("ovenCriticalDesc")}
              </p>
            </div>
            <div className="relative z-10 pt-10 mt-10 border-t border-rose-400/30">
              <p className="text-[10px] font-black uppercase opacity-50 mb-4 italic">
                {t("estLossIgnored")}
              </p>
              <p className="text-4xl font-black tracking-tighter">
                ฿12,400{" "}
                <span className="text-xs font-normal opacity-50 italic">
                  {t("perMonth")}
                </span>
              </p>
            </div>
            <div className="absolute -right-6 -bottom-6 text-9xl opacity-10 group-hover:scale-110 transition-transform duration-1000 pointer-events-none">
              ⚙️
            </div>
          </div>
        </div>

        {/* --- 📉 Section 2: Energy per Output --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100">
            <h3 className="text-xl font-black text-slate-800 mb-10 uppercase tracking-tighter">
              {t("energyIntensityTitle")}
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={machineData}>
                  <XAxis dataKey="name" hide />
                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{
                      borderRadius: "24px",
                      border: "none",
                      boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Bar dataKey="kwh" radius={[15, 15, 15, 15]}>
                    {machineData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.efficiency < 80 ? "#fb7185" : "#334155"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-8 text-xs text-slate-500 font-medium leading-relaxed bg-slate-50 p-6 rounded-3xl border border-slate-100 relative">
              <span className="font-black text-slate-900 uppercase tracking-widest block mb-2">
                {t("intensityInsightLabel")}
              </span>
              {t("intensityInsightText")}
            </div>
          </div>

          {/* Machine ROI Comparison */}
          <div className="bg-blue-600 p-10 rounded-[3.5rem] shadow-2xl text-white flex flex-col justify-between relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-10 italic">
                {t("investmentOpp")}
              </p>
              <h4 className="text-3xl font-black mb-8 tracking-tighter italic uppercase">
                {t("worthUpgradeTitle")}
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-white/10 p-5 rounded-2xl backdrop-blur-md border border-white/10">
                  <span className="text-xs font-bold uppercase opacity-80">
                    {t("oldMachineCost")}
                  </span>
                  <span className="font-black text-rose-300 text-lg">
                    ฿ 240,000
                  </span>
                </div>
                <div className="flex justify-between items-center bg-white/10 p-5 rounded-2xl backdrop-blur-md border border-white/10">
                  <span className="text-xs font-bold uppercase opacity-80">
                    {t("newMachineCost")}
                  </span>
                  <span className="font-black text-emerald-300 text-lg">
                    ฿ 145,000
                  </span>
                </div>
                <div className="pt-6 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black uppercase opacity-60 tracking-widest mb-1">
                      {t("paybackPeriod")}
                    </p>
                    <p className="text-5xl font-black tracking-tighter italic">
                      1.8{" "}
                      <span className="text-sm font-normal not-italic opacity-60">
                        {t("years")}
                      </span>
                    </p>
                  </div>
                  <button className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all">
                    {t("viewRoiBtn")}
                  </button>
                </div>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 text-[18rem] opacity-5 pointer-events-none italic font-black select-none">
              ROI
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
