import React, { useState, useMemo } from "react";
import Layout from "../components/ui/Layout";
import { useEnergy } from "../context/EnergyContext";
import { useTranslation } from "react-i18next";
import {
  Power,
  Zap,
  TrendingUp,
  AlertCircle,
  Plus,
  Activity,
  Settings2,
  BarChart3,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function AssetIntelligence() {
  const { t } = useTranslation();
  const { effectiveRate } = useEnergy();

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
      <div className="max-w-[1400px] mx-auto space-y-8 md:space-y-10 pb-16 px-4 sm:px-6 md:px-10">
        {/* 🔝 HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-slate-900 p-6 md:p-10 rounded-2xl md:rounded-[3rem] text-white gap-6 relative overflow-hidden">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight italic uppercase">
              {t("assetIntel")}
            </h1>
            <p className="text-emerald-400 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 mt-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
              {t("realtimeMonitor")}: {machines.length + plugs.length}{" "}
              {t("assetsOnline")}
            </p>
          </div>

          <div className="flex w-full sm:w-auto items-center justify-between sm:justify-start gap-3 bg-white/10 p-2 rounded-2xl border border-white/10">
            <div className="flex-1 sm:flex-none bg-emerald-500 px-4 md:px-6 py-3 rounded-xl flex items-center justify-center gap-2">
              <Zap size={18} />
              <span className="font-black text-lg md:text-xl">
                {(totalWatts / 1000).toFixed(1)}
                <span className="text-xs ml-1 opacity-70">kW</span>
              </span>
            </div>

            <button className="p-3 text-slate-300 hover:text-white">
              <Settings2 size={20} />
            </button>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* MACHINE + PLUG */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* MACHINE HEALTH */}
            <div className="bg-white dark:bg-slate-800 p-5 md:p-10 rounded-2xl md:rounded-[3rem] shadow border border-slate-100 dark:border-slate-700">
              <h3 className="text-lg md:text-2xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2 uppercase">
                <Activity className="text-rose-500" />
                {t("machineHealth")}
              </h3>

              <div className="space-y-6">
                {machines.map((m) => (
                  <div key={m.id}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                          ⚙️
                        </div>
                        <div>
                          <p className="font-bold text-sm md:text-base">
                            {m.name}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {t(m.status)}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm md:text-lg font-bold">
                        {m.efficiency}%
                      </p>
                    </div>

                    <div className="w-full bg-slate-100 h-2 rounded-full">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${m.efficiency}%`,
                          backgroundColor: m.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SMART PLUG */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {plugs.map((plug) => (
                <div
                  key={plug.id}
                  className={`p-5 md:p-8 rounded-2xl border ${
                    plug.status
                      ? "bg-white dark:bg-slate-800 shadow-lg"
                      : "bg-slate-50 dark:bg-slate-900 opacity-60"
                  }`}
                >
                  <div className="flex justify-between mb-4">
                    <div className="text-2xl">{plug.icon}</div>

                    <button
                      onClick={() => togglePlug(plug.id)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        plug.status
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-400"
                      }`}
                    >
                      <Power size={16} />
                    </button>
                  </div>

                  <h4 className="font-bold text-sm md:text-lg">{plug.name}</h4>

                  <div className="mt-4 flex justify-between">
                    <p className="text-sm font-bold">
                      {plug.status ? plug.watt : 0} W
                    </p>
                    <p className="text-xs text-emerald-500">
                      ฿{((plug.watt * effectiveRate) / 1000).toFixed(2)}/hr
                    </p>
                  </div>
                </div>
              ))}

              {/* ADD */}
              <div className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 text-slate-400">
                <Plus size={30} />
                <p className="text-xs mt-2">{t("addNewAsset")}</p>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="space-y-6 md:space-y-8">
            {/* BAR CHART */}
            <div className="bg-white dark:bg-slate-800 p-5 md:p-10 rounded-2xl shadow border">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                <BarChart3 size={16} /> {t("energyIntensity")}
              </h3>

              <div className="h-[180px] md:h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <Bar dataKey="kwh">
                      {chartData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={entry.efficiency < 70 ? "#f43f5e" : "#334155"}
                        />
                      ))}
                    </Bar>
                    <Tooltip />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ALERT */}
            <div className="bg-orange-500 p-6 md:p-10 rounded-2xl text-white">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle size={16} />
                <p className="text-xs uppercase">{t("anomalyDetected")}</p>
              </div>
              <h4 className="text-xl md:text-3xl font-black mb-2">
                {t("efficiencyDrop")}
              </h4>
              <p className="text-sm opacity-90">{t("anomalyDesc")}</p>
            </div>

            {/* SUMMARY */}
            <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-2xl space-y-4">
              <div className="flex justify-between">
                <span className="text-xs">{t("dailyRunningCost")}</span>
                <span className="font-bold">
                  ฿{((totalWatts * 24 * effectiveRate) / 1000).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-xs">{t("avgEfficiency")}</span>
                <span className="font-bold text-emerald-500">81.6%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
