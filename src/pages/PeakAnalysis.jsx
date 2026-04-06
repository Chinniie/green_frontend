import React, { useMemo, useState, useEffect, useCallback } from "react";
import axios from "axios";
import Layout from "../components/ui/Layout";
import { useEnergy } from "../context/EnergyContext";
import { useTranslation } from "react-i18next"; // ✅ 1. เพิ่มการ Import
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";

export default function PeakAnalysis() {
  const { t } = useTranslation(); // ✅ 2. เรียกใช้งาน t function
  const { effectiveRate } = useEnergy();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = useMemo(
    () => JSON.parse(localStorage.getItem("user") || "{}"),
    [],
  );

  const fetchPeakData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/energy/usage/${user.id}`,
      );
      if (res.data && res.data.data) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error("PEAK DATA FETCH ERROR:", err);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    if (user.id) fetchPeakData();
  }, [fetchPeakData]);

  const chartData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => ({ hour: i, kwh: 0 }));
    if (!data || data.length === 0) return hours;
    const aggregated = data.reduce((acc, curr) => {
      const h = parseInt(curr.hour);
      if (!acc[h]) acc[h] = 0;
      acc[h] += Number(curr.kwh || 0);
      return acc;
    }, {});
    return hours.map((item) => ({
      ...item,
      kwh: Number(Number(aggregated[item.hour] || 0).toFixed(2)),
    }));
  }, [data]);

  const peakInfo = useMemo(() => {
    const max = chartData.reduce(
      (prev, curr) => (curr.kwh > prev.kwh ? curr : prev),
      chartData[0],
    );
    return {
      hour: max.hour,
      kwh: max.kwh,
      cost: max.kwh * 132.93, // ค่า Demand Charge สมมติ
      isCritical: max.hour >= 9 && max.hour <= 22,
    };
  }, [chartData]);

  if (loading)
    return (
      <Layout>
        <div className="p-20 text-center animate-pulse text-slate-400 font-black uppercase tracking-widest text-xs">
          ⚡ {t("analyzingPeak")}... {/* ✅ 3. ใช้คีย์จาก i18n */}
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div className="max-w-[1600px] mx-auto space-y-10 pb-20 p-6 md:p-10">
        {/* --- Header --- */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
          <div>
            <nav className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              <span>{t("analytics")}</span>
              <span className="opacity-30">/</span>
              <span className="text-orange-500">{t("peakLoadIntel")}</span>
            </nav>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">
              {t("peakCriticalTrend")}
            </h1>
            <p className="text-slate-500 mt-2 font-medium italic opacity-70">
              "{t("peakSubheader")}"
            </p>
          </div>

          <div className="bg-white px-8 py-5 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="text-right border-r border-slate-100 pr-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {t("peakDetected")}
              </p>
              <p className="text-xl font-black text-rose-500">
                {peakInfo.kwh.toFixed(2)}{" "}
                <span className="text-xs font-normal opacity-40">kWh</span>
              </p>
            </div>
            <button
              onClick={fetchPeakData}
              className="text-xl hover:rotate-180 transition-all duration-500"
              title={t("refresh")}
            >
              🔄
            </button>
          </div>
        </div>

        {/* --- 📈 Section 1: The Master Line Chart --- */}
        <div className="bg-white p-10 rounded-[4rem] shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="flex justify-between items-center mb-10 relative z-10">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 uppercase tracking-tighter">
              <span className="w-2 h-8 bg-orange-500 rounded-full"></span>
              {t("powerTrend24")}
            </h3>
            <div className="hidden md:flex items-center gap-6 bg-slate-50 px-6 py-3 rounded-2xl">
              <div className="flex items-center gap-2 text-[10px] font-black text-orange-500 uppercase tracking-widest">
                <div className="w-3 h-1 bg-orange-500"></div> {t("onPeakZone")}
              </div>
            </div>
          </div>

          <div className="h-[500px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="hour"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: "bold" }}
                  tickFormatter={(h) => `${h}:00`}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "24px",
                    border: "none",
                    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                    padding: "15px",
                  }}
                  formatter={(value) => [
                    `${Number(value).toFixed(2)} kWh`,
                    t("energyUsage"),
                  ]}
                  labelFormatter={(label) => `${t("timeLabel")} ${label}:00`}
                />
                <ReferenceArea
                  x1={9}
                  x2={22}
                  fill="#fff7ed"
                  strokeOpacity={0.3}
                />
                <Line
                  type="monotone"
                  dataKey="kwh"
                  stroke="#f97316"
                  strokeWidth={4}
                  dot={{
                    r: 4,
                    fill: "#f97316",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                  animationDuration={2000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- 📦 Section 2: Bento Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Peak Summary */}
          <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[10px] font-black text-orange-400 uppercase tracking-[0.3em] mb-12">
                {t("peakTiming")}
              </p>
              <h4 className="text-xs font-black opacity-50 mb-3 uppercase tracking-widest italic">
                {t("trendMaxima")}
              </h4>
              <p className="text-8xl font-black tracking-tighter italic">
                {peakInfo.hour}:00
              </p>
            </div>
            <div className="relative z-10 pt-10 border-t border-white/5 mt-10">
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                {t("peakTimingDesc", { hour: peakInfo.hour })}
              </p>
            </div>
            <div className="absolute -right-10 -bottom-10 text-[18rem] opacity-5 pointer-events-none font-black italic">
              TREND
            </div>
          </div>

          {/* Financial Impact */}
          <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-12">
                {t("costProjection")}
              </p>
              <p className="text-xs font-black text-slate-400 mb-2 uppercase tracking-tighter">
                {t("estimatedDemandCharge")}
              </p>
              <h4 className="text-6xl font-black text-slate-900 tracking-tighter">
                ฿{" "}
                {Number(peakInfo.cost).toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </h4>
            </div>
            <div className="mt-10 p-6 bg-blue-50 rounded-[2.5rem] border border-blue-100">
              <p className="text-xs text-blue-800 font-bold leading-relaxed">
                <span className="bg-blue-500 text-white px-2 py-0.5 rounded-lg mr-2 uppercase tracking-widest text-[10px]">
                  Fix
                </span>
                {t("costFixAdvice", {
                  saving: (peakInfo.cost * 0.1).toLocaleString(),
                })}
              </p>
            </div>
          </div>

          {/* AI Advice */}
          <div className="bg-orange-600 p-10 rounded-[3.5rem] shadow-2xl text-white flex flex-col justify-between group overflow-hidden relative">
            <div className="relative z-10">
              <p className="text-[10px] font-black text-orange-200 uppercase tracking-widest mb-12 italic">
                {t("dynamicStrategy")}
              </p>
              <h4 className="text-3xl font-black mb-4 tracking-tight leading-tight uppercase italic">
                {t("smoothingCurve")}
              </h4>
              <p className="text-sm text-orange-50 opacity-90 leading-relaxed font-medium">
                {t("smoothingDesc", { hour: peakInfo.hour })}
              </p>
            </div>
            <button className="relative z-10 w-full py-5 bg-white/10 hover:bg-white/20 border border-white/30 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all">
              {t("genScheduleBtn")}
            </button>
            <div className="absolute -right-6 -bottom-6 text-[12rem] opacity-10 group-hover:rotate-12 transition-all duration-1000">
              📈
            </div>
          </div>
        </div>

        {/* --- ⚙️ Section 3: Machine Breakdown --- */}
        <div className="bg-white p-12 rounded-[4rem] shadow-sm border border-slate-100">
          <h3 className="text-2xl font-black text-slate-800 mb-12 flex items-center gap-4 tracking-tighter uppercase">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
              🔌
            </div>
            {t("machineLoadAttrib")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
            {[
              {
                name: "Main Chiller System",
                impact: 45,
                color: "bg-orange-500",
                icon: "❄️",
              },
              {
                name: "Heavy Duty Motor Line",
                impact: 32,
                color: "bg-slate-900",
                icon: "🏭",
              },
              {
                name: "Backup Air Systems",
                impact: 15,
                color: "bg-blue-500",
                icon: "💨",
              },
              {
                name: "General Facility",
                impact: 8,
                color: "bg-slate-300",
                icon: "💡",
              },
            ].map((item, i) => (
              <div key={i} className="flex flex-col gap-3 group">
                <div className="flex justify-between items-center px-1">
                  <span className="text-xs font-black text-slate-600 flex items-center gap-2 uppercase tracking-widest">
                    <span className="opacity-50 text-base">{item.icon}</span>{" "}
                    {item.name}
                  </span>
                  <span className="text-sm font-black text-slate-900">
                    {item.impact}%
                  </span>
                </div>
                <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden border border-slate-100 shadow-inner">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${item.impact}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
