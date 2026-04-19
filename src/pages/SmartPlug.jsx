import React, { useState, useMemo } from "react";
import Layout from "../components/ui/Layout";
import { useEnergy } from "../context/EnergyContext";
import { useTranslation } from "react-i18next";
import { Power, Zap, Plus, AlertCircle } from "lucide-react";
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
      <div className="max-w-[1400px] mx-auto space-y-8 md:space-y-10 pb-16 px-4 sm:px-6 md:px-10">
        {/* 🔝 HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 md:gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight uppercase italic">
              {t("smartPlugTitle")}
            </h1>
            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-2">
              {t("smartPlugSub")}
            </p>
          </div>

          <div className="flex w-full sm:w-auto items-center justify-between sm:justify-start gap-3 bg-white dark:bg-slate-800 p-2 rounded-2xl shadow border border-slate-100 dark:border-slate-700">
            <div className="flex-1 sm:flex-none bg-emerald-500 text-white px-4 sm:px-6 py-3 rounded-xl flex items-center justify-center gap-2">
              <Zap size={18} />
              <span className="font-black text-lg sm:text-xl">
                {totalWatts.toLocaleString()}
                <span className="text-xs ml-1 opacity-70">
                  {t("wattsUnit")}
                </span>
              </span>
            </div>

            <button className="p-3 text-slate-400 hover:text-emerald-500">
              <Plus size={22} />
            </button>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* 🔌 PLUG GRID */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {plugs.map((plug) => (
              <div
                key={plug.id}
                className={`p-5 sm:p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] transition border ${
                  plug.status
                    ? "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 shadow-lg"
                    : "bg-slate-50 dark:bg-slate-900 opacity-60"
                }`}
              >
                <div className="flex justify-between mb-4 md:mb-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-900 dark:bg-slate-700 rounded-xl flex items-center justify-center text-xl md:text-2xl">
                    {plug.icon}
                  </div>

                  <button
                    onClick={() => togglePlug(plug.id)}
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center ${
                      plug.status
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-400"
                    }`}
                  >
                    <Power size={16} />
                  </button>
                </div>

                <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white">
                  {plug.name}
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {plug.room}
                </p>

                <div className="mt-4 md:mt-6 flex justify-between">
                  <div>
                    <p className="text-xs text-slate-400">
                      {t("currentUsage")}
                    </p>
                    <p className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
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
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white dark:bg-slate-900 p-4 md:p-6 rounded-2xl shadow border border-slate-100 dark:border-slate-700">
              <h3 className="text-xs md:text-sm font-bold text-slate-600 dark:text-slate-300 mb-3 md:mb-4">
                {t("totalLoadTrend")}
              </h3>

              <div className="h-[160px] md:h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={usageData}>
                    <Line
                      type="monotone"
                      dataKey="watt"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Tooltip />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ⚠️ AI WARNING */}
            <div className="bg-orange-50 dark:bg-orange-500/10 p-4 md:p-6 rounded-2xl border border-orange-100 dark:border-orange-500/20">
              <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold text-sm">
                <AlertCircle size={16} />
                {t("aiInsightTitle")}
              </div>
              <p className="text-xs md:text-sm mt-2 text-orange-800 dark:text-orange-300">
                {t("aiPlugWarning", { device: "Kitchen Fridge" })}
              </p>
            </div>
          </div>
        </div>

        {/* ⏰ SCHEDULE */}
        <div className="bg-white dark:bg-slate-800 p-6 md:p-10 rounded-2xl md:rounded-[3rem] border border-slate-100 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row justify-between gap-3 mb-6">
            <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white">
              {t("activeSchedules")}
            </h3>
            <button className="text-emerald-500 text-sm">{t("addTask")}</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {["22:00", "06:00", "23:00"].map((time, i) => (
              <div
                key={i}
                className="p-4 md:p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700"
              >
                <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
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
