import React, { useState, useMemo } from "react";
import Layout from "../components/ui/Layout";
import { useEnergy } from "../context/EnergyContext";
import { useTranslation } from "react-i18next"; // ✅ 1. Import Hook
import {
  Power,
  Zap,
  Clock,
  TrendingUp,
  AlertCircle,
  Plus,
  Cpu,
  Activity,
  Settings2,
  BarChart3,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function AssetIntelligence() {
  const { t } = useTranslation(); // ✅ 2. Initialize
  const { effectiveRate } = useEnergy();

  // 🧠 ข้อมูล Smart Plugs (Individual Control)
  const [plugs, setPlugs] = useState([
    {
      id: 1,
      name: "แอร์ Office A",
      watt: 1200,
      status: true,
      room: "Zone 1",
      icon: "❄️",
    },
    {
      id: 2,
      name: "ตู้เย็นส่วนกลาง",
      watt: 150,
      status: true,
      room: "Pantry",
      icon: "🧊",
    },
  ]);

  // 🧠 ข้อมูล Machine Breakdown (Industrial Assets)
  // หมายเหตุ: status จะถูกนำไป map กับ key ใน i18n
  const [machines] = useState([
    {
      id: 101,
      name: "Main Compressor",
      kwh: 450,
      status: "statusHighLoad",
      efficiency: 85,
      color: "#f43f5e",
    },
    {
      id: 102,
      name: "Oven Unit 1",
      kwh: 380,
      status: "statusAbnormal",
      efficiency: 62,
      color: "#f59e0b",
    },
    {
      id: 103,
      name: "Conveyor Line A",
      kwh: 120,
      status: "statusNormal",
      efficiency: 98,
      color: "#10b981",
    },
  ]);

  const chartData = [
    ...machines,
    ...plugs.map((p) => ({ name: p.name, kwh: p.watt / 1000 })),
  ];

  const totalWatts = useMemo(
    () =>
      plugs.filter((p) => p.status).reduce((sum, p) => sum + p.watt, 0) +
      machines.reduce((sum, m) => sum + m.kwh * 1000, 0),
    [plugs, machines],
  );

  const togglePlug = (id) => {
    setPlugs(plugs.map((p) => (p.id === id ? { ...p, status: !p.status } : p)));
  };

  return (
    <Layout>
      <div className="max-w-[1600px] mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
        {/* --- 🔝 Header --- */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-slate-900 p-10 rounded-[3.5rem] shadow-2xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-5xl font-black tracking-tighter mb-2 italic uppercase">
              {t("assetIntel")}
            </h1>
            <p className="text-emerald-400 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
              {t("realtimeMonitor")}: {machines.length + plugs.length}{" "}
              {t("assetsOnline")}
            </p>
          </div>
          <div className="flex items-center gap-4 relative z-10 mt-6 lg:mt-0 bg-white/5 p-2 rounded-[2.5rem] border border-white/10">
            <div className="bg-emerald-500 text-white px-8 py-4 rounded-[2rem] flex items-center gap-3 shadow-lg">
              <Zap size={20} />
              <span className="font-black text-2xl">
                {(totalWatts / 1000).toFixed(1)}{" "}
                <span className="text-sm font-normal opacity-80">kW</span>
              </span>
            </div>
            <button className="p-4 text-slate-400 hover:text-white transition-colors">
              <Settings2 />
            </button>
          </div>
          <div className="absolute -right-20 -bottom-20 text-[20rem] opacity-5 pointer-events-none font-black italic">
            4.0
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* --- 📦 Section 1: Machine Health --- */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100">
              <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3 uppercase tracking-tighter">
                <Activity className="text-rose-500" />
                {t("machineHealth")}
              </h3>
              <div className="space-y-8">
                {machines.map((m) => (
                  <div key={m.id} className="group">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-xl shadow-inner">
                          ⚙️
                        </div>
                        <div>
                          <p className="font-black text-slate-800 uppercase tracking-tight">
                            {m.name}
                          </p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                            {t(m.status)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-slate-900">
                          {m.efficiency}%
                        </p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                          {t("efficiencyScore")}
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden border border-slate-100">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${m.efficiency}%`,
                          backgroundColor: m.color,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* --- 🔌 Section 2: Smart Plug Controls --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {plugs.map((plug) => (
                <div
                  key={plug.id}
                  className={`p-8 rounded-[3rem] border transition-all duration-500 ${plug.status ? "bg-white shadow-xl" : "bg-slate-50 opacity-60"}`}
                >
                  <div className="flex justify-between items-center mb-8">
                    <div className="text-3xl">{plug.icon}</div>
                    <button
                      onClick={() => togglePlug(plug.id)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-90 ${plug.status ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400"}`}
                    >
                      <Power size={20} />
                    </button>
                  </div>
                  <h4 className="font-black text-slate-800 text-lg tracking-tight uppercase italic">
                    {plug.name}
                  </h4>
                  <div className="mt-6 flex justify-between items-end">
                    <p className="text-2xl font-black text-slate-900">
                      {plug.status ? plug.watt : 0}{" "}
                      <span className="text-xs font-normal opacity-40">W</span>
                    </p>
                    <p className="text-xs font-black text-emerald-600">
                      ฿{((plug.watt * effectiveRate) / 1000).toFixed(2)}/hr
                    </p>
                  </div>
                </div>
              ))}
              <div className="border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center p-8 text-slate-300 hover:bg-slate-50 cursor-pointer transition-all group">
                <Plus
                  size={40}
                  className="mb-2 group-hover:rotate-90 transition-transform duration-500"
                />
                <p className="font-black text-[10px] uppercase tracking-[0.2em]">
                  {t("addNewAsset")}
                </p>
              </div>
            </div>
          </div>

          {/* --- 📉 Section 3: Analytics & AI --- */}
          <div className="space-y-8">
            <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100">
              <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-tighter text-sm">
                <BarChart3 size={18} className="text-blue-500" />{" "}
                {t("energyIntensity")}
              </h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <Bar dataKey="kwh" radius={[10, 10, 10, 10]}>
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.efficiency < 70 ? "#f43f5e" : "#334155"}
                        />
                      ))}
                    </Bar>
                    <Tooltip
                      cursor={{ fill: "transparent" }}
                      contentStyle={{
                        borderRadius: "24px",
                        border: "none",
                        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[10px] text-slate-400 font-black text-center mt-4 uppercase tracking-widest">
                {t("kwhPerUnit")}
              </p>
            </div>

            {/* AI Warning Card */}
            <div className="bg-orange-500 p-10 rounded-[3.5rem] shadow-2xl text-white relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <AlertCircle size={18} />
                  <h3 className="font-black uppercase tracking-[0.2em] text-[10px]">
                    {t("anomalyDetected")}
                  </h3>
                </div>
                <h4 className="text-3xl font-black mb-4 tracking-tighter italic leading-none">
                  {t("efficiencyDrop")}
                </h4>
                <p className="text-sm opacity-90 leading-relaxed font-medium">
                  {t("anomalyDesc")}
                </p>
              </div>
              <div className="absolute -right-6 -bottom-6 text-9xl opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-1000 select-none">
                ⚙️
              </div>
            </div>

            {/* Summary Statistics */}
            <div className="bg-slate-100 p-8 rounded-[3rem] space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {t("dailyRunningCost")}
                </span>
                <span className="text-xl font-black text-slate-900 tracking-tighter">
                  ฿{((totalWatts * 24 * effectiveRate) / 1000).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {t("avgEfficiency")}
                </span>
                <span className="text-xl font-black text-emerald-600 tracking-tighter">
                  81.6%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
