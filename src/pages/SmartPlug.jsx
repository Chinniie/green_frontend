import React, { useState, useMemo } from "react";
import Layout from "../components/ui/Layout";
import { useEnergy } from "../context/EnergyContext";
import { useTranslation } from "react-i18next";
import { Power, Zap, Clock, Plus, TrendingUp, AlertCircle } from "lucide-react";
import { LineChart, Line, Tooltip, ResponsiveContainer } from "recharts";

export default function SmartPlug() {
  const { t } = useTranslation();
  const { effectiveRate } = useEnergy();

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
      <div className="max-w-[1600px] mx-auto space-y-10 pb-20 p-6 md:p-10">
        {/* 🔝 HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
              {t("smartPlugTitle")}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
              {t("smartPlugSub")}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-2 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="bg-emerald-500 text-white px-8 py-4 rounded-[1.8rem] flex items-center gap-3 shadow-lg">
              <Zap size={20} />
              <span className="font-black text-2xl">
                {totalWatts.toLocaleString()}{" "}
                <span className="text-sm opacity-70">{t("wattsUnit")}</span>
              </span>
            </div>
            <button className="p-4 text-slate-400 hover:text-emerald-500 transition">
              <Plus size={28} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* 🔌 PLUG GRID */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {plugs.map((plug) => (
              <div
                key={plug.id}
                className={`p-8 rounded-[3rem] transition border ${
                  plug.status
                    ? "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 shadow-xl"
                    : "bg-slate-50 dark:bg-slate-900 opacity-60"
                }`}
              >
                <div className="flex justify-between mb-6">
                  <div className="w-14 h-14 bg-slate-900 dark:bg-slate-700 rounded-xl flex items-center justify-center text-2xl">
                    {plug.icon}
                  </div>

                  <button
                    onClick={() => togglePlug(plug.id)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      plug.status
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-400"
                    }`}
                  >
                    <Power size={18} />
                  </button>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {plug.name}
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {plug.room}
                </p>

                <div className="mt-6 flex justify-between">
                  <div>
                    <p className="text-xs text-slate-400">
                      {t("currentUsage")}
                    </p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">
                      {plug.status ? plug.watt : 0} W
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">{t("estCost")}</p>
                    <p className="text-sm font-bold text-emerald-500">
                      ฿{((plug.watt * effectiveRate) / 1000).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 📉 ANALYTICS */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow border border-slate-100 dark:border-slate-700">
              <h3 className="text-sm font-bold text-slate-600 dark:text-slate-300 mb-4">
                {t("totalLoadTrend")}
              </h3>

              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={usageData}>
                    <Line
                      type="monotone"
                      dataKey="watt"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={false}
                    />
                    <Tooltip />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ⚠️ AI WARNING */}
            <div className="bg-orange-50 dark:bg-orange-500/10 p-6 rounded-[2rem] border border-orange-100 dark:border-orange-500/20">
              <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold">
                <AlertCircle size={18} />
                {t("aiInsightTitle")}
              </div>
              <p className="text-sm mt-3 text-orange-800 dark:text-orange-300">
                {t("aiPlugWarning", { device: "Kitchen Fridge" })}
              </p>
            </div>
          </div>
        </div>

        {/* ⏰ SCHEDULE */}
        <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-700">
          <div className="flex justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t("activeSchedules")}
            </h3>
            <button className="text-emerald-500 text-sm">{t("addTask")}</button>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {["22:00", "06:00", "23:00"].map((time, i) => (
              <div
                key={i}
                className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700"
              >
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {time}
                </p>
                <p className="text-xs text-slate-400">Device</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
