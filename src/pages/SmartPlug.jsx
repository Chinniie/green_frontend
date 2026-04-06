import React, { useState, useMemo } from "react";
import Layout from "../components/ui/Layout";
import { useEnergy } from "../context/EnergyContext";
import { useTranslation } from "react-i18next"; // ✅ 1. Import Hook
import { Power, Zap, Clock, Plus, TrendingUp, AlertCircle } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SmartPlug() {
  const { t } = useTranslation(); // ✅ 2. Initialize
  const { effectiveRate } = useEnergy();

  // 🧠 ข้อมูลจำลอง Smart Plugs
  const [plugs, setPlugs] = useState([
    {
      id: 1,
      name: "Living Room AC",
      watt: 1200,
      status: true,
      room: "Living Room",
      icon: "❄️",
    },
    {
      id: 2,
      name: "Kitchen Fridge",
      watt: 150,
      status: true,
      room: "Kitchen",
      icon: "🧊",
    },
    {
      id: 3,
      name: "Water Heater",
      watt: 0,
      status: false,
      room: "Bathroom",
      icon: "🚿",
    },
    {
      id: 4,
      name: "4K Television",
      watt: 200,
      status: true,
      room: "Living Room",
      icon: "📺",
    },
  ]);

  const usageData = [
    { time: "00:00", watt: 150 },
    { time: "04:00", watt: 140 },
    { time: "08:00", watt: 800 },
    { time: "12:00", watt: 2200 },
    { time: "16:00", watt: 1800 },
    { time: "20:00", watt: 2500 },
  ];

  const totalWatts = useMemo(
    () => plugs.filter((p) => p.status).reduce((sum, p) => sum + p.watt, 0),
    [plugs],
  );

  const togglePlug = (id) => {
    setPlugs(plugs.map((p) => (p.id === id ? { ...p, status: !p.status } : p)));
  };

  return (
    <Layout>
      <div className="max-w-[1600px] mx-auto space-y-10 pb-20 animate-in fade-in duration-700 p-6 md:p-10">
        {/* --- 🔝 Section 1: Header --- */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">
              {t("smartPlugTitle")}
            </h1>
            <p className="text-slate-500 mt-2 font-medium opacity-70">
              {t("smartPlugSub")}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white p-2 rounded-[2rem] shadow-sm border border-slate-100">
            <div className="bg-emerald-500 text-white px-8 py-4 rounded-[1.8rem] flex items-center gap-3 shadow-lg shadow-emerald-200">
              <Zap size={20} className="fill-current" />
              <span className="font-black text-2xl tracking-tighter">
                {totalWatts.toLocaleString()}{" "}
                <span className="text-sm font-bold opacity-70 uppercase">
                  {t("wattsUnit")}
                </span>
              </span>
            </div>
            <button className="p-4 text-slate-300 hover:text-emerald-500 transition-all active:scale-90">
              <Plus size={32} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* --- 📦 Section 2: Plug Grid --- */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {plugs.map((plug) => (
              <div
                key={plug.id}
                className={`p-8 rounded-[3.5rem] transition-all duration-500 border relative overflow-hidden group ${
                  plug.status
                    ? "bg-white border-slate-100 shadow-xl"
                    : "bg-slate-50 border-transparent opacity-60"
                }`}
              >
                <div className="flex justify-between items-start mb-10 relative z-10">
                  <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform">
                    {plug.icon}
                  </div>
                  <button
                    onClick={() => togglePlug(plug.id)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg active:scale-95 ${
                      plug.status
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    <Power size={24} strokeWidth={3} />
                  </button>
                </div>

                <div className="relative z-10">
                  <h3 className="text-xl font-black text-slate-900 mb-1 tracking-tight uppercase">
                    {plug.name}
                  </h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {plug.room}
                  </p>
                </div>

                <div className="mt-8 flex justify-between items-end relative z-10">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">
                      {t("currentUsage")}
                    </p>
                    <p className="text-2xl font-black text-slate-900 tracking-tighter">
                      {plug.status ? plug.watt : 0}{" "}
                      <span className="text-xs font-bold opacity-30">W</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">
                      {t("estCost")}
                    </p>
                    <p className="text-sm font-black text-emerald-600">
                      ฿{((plug.watt * effectiveRate) / 1000).toFixed(2)}{" "}
                      {t("perHour")}
                    </p>
                  </div>
                </div>

                <div className="absolute -right-4 -bottom-4 text-9xl opacity-[0.03] font-black group-hover:rotate-12 transition-transform duration-700 select-none">
                  {plug.icon}
                </div>
              </div>
            ))}
          </div>

          {/* --- 📉 Section 3: Live Analytics --- */}
          <div className="space-y-8">
            <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
              <div className="flex justify-between items-center mb-10 relative z-10">
                <h3 className="font-black text-sm uppercase tracking-widest opacity-80">
                  {t("totalLoadTrend")}
                </h3>
                <span className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>{" "}
                  {t("live")}
                </span>
              </div>
              <div className="h-[200px] w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={usageData}>
                    <Line
                      type="monotone"
                      dataKey="watt"
                      stroke="#10b981"
                      strokeWidth={4}
                      dot={false}
                    />
                    <Tooltip contentStyle={{ display: "none" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-10 flex justify-between items-center relative z-10">
                <div>
                  <p className="text-[10px] opacity-40 uppercase font-black tracking-widest mb-1">
                    {t("dailyPeak")}
                  </p>
                  <p className="text-3xl font-black italic tracking-tighter">
                    2,500{" "}
                    <span className="text-sm font-normal opacity-40">W</span>
                  </p>
                </div>
                <TrendingUp className="text-emerald-500 opacity-20" size={48} />
              </div>
            </div>

            {/* AI Warning (Interpolation) */}
            <div className="bg-orange-50 p-8 rounded-[3.5rem] border border-orange-100 flex flex-col gap-6 relative overflow-hidden">
              <div className="flex items-center gap-4 text-orange-600 font-black uppercase tracking-tighter">
                <AlertCircle size={20} />
                <h3 className="text-sm">{t("aiInsightTitle")}</h3>
              </div>
              <p className="text-sm text-orange-800 font-medium leading-relaxed">
                {t("aiPlugWarning", { device: t("Kitchen Fridge") })}{" "}
                {/* ✅ ส่งชื่อปลั๊กเข้าคำแปล */}
              </p>
              <button className="w-full py-4 bg-orange-600 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest shadow-lg shadow-orange-200 active:scale-95 transition-all">
                {t("checkSchedule")}
              </button>
            </div>
          </div>
        </div>

        {/* --- ⚙️ Section 4: Automated Schedules --- */}
        <div className="bg-white p-10 rounded-[4rem] shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-10 px-4">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 uppercase tracking-tighter italic">
              <Clock className="text-slate-400" size={24} />
              {t("activeSchedules")}
            </h3>
            <button className="text-emerald-600 font-black text-[10px] uppercase tracking-widest hover:underline transition-all">
              {t("addTask")}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                time: "22:00",
                action: "OFF",
                device: "Living Room AC",
                repeat: t("daily"),
              },
              {
                time: "06:00",
                action: "ON",
                device: "Living Room AC",
                repeat: t("daily"),
              },
              {
                time: "23:00",
                action: "OFF",
                device: "4K Television",
                repeat: t("monFri"),
              },
            ].map((task, i) => (
              <div
                key={i}
                className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex justify-between items-center group hover:bg-white hover:shadow-xl transition-all"
              >
                <div>
                  <p className="text-3xl font-black text-slate-900 tracking-tighter italic">
                    {task.time}
                  </p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                    {task.device}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest ${task.action === "OFF" ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"}`}
                  >
                    {task.action}
                  </span>
                  <p className="text-[9px] font-bold text-slate-400 mt-3 uppercase tracking-widest">
                    {task.repeat}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
