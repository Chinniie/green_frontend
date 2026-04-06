import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import Layout from "../components/ui/Layout";
import { useEnergy } from "../context/EnergyContext";
import { useTranslation } from "react-i18next"; // ✅ 1. Import Hook

export default function Simulation() {
  const { t } = useTranslation(); // ✅ 2. Initialize
  const { config } = useEnergy();
  const [reduction, setReduction] = useState(10);
  const [currentData, setCurrentData] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = useMemo(
    () => JSON.parse(localStorage.getItem("user") || "{}"),
    [],
  );

  useEffect(() => {
    const fetchBaseline = async () => {
      try {
        // ✅ แก้ไข: ใช้ Base URL จาก Environment
        const baseURL =
          import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

        const res = await axios.get(
          `${baseURL}/report/monthly-summary/${user.id}`,
        );
        setCurrentData(res.data.current);
      } catch (err) {
        console.error("SIMULATION BASELINE FETCH ERROR:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user.id) fetchBaseline();
  }, [user.id]);

  const simResult = useMemo(() => {
    if (!currentData) return null;
    const baseKwh = Number(currentData.kwh);
    const baseCost = Number(currentData.cost);
    const multiplier = (100 - reduction) / 100;
    const simKwh = baseKwh * multiplier;
    const simCost = baseCost * multiplier;
    const moneySaved = baseCost - simCost;
    const carbonSaved = (baseKwh - simKwh) * 0.507;
    const bonusPoints = Math.floor(moneySaved / 5);
    return { simKwh, simCost, moneySaved, carbonSaved, bonusPoints };
  }, [currentData, reduction]);

  if (loading)
    return (
      <Layout>
        <div className="p-20 text-center animate-pulse text-slate-400 font-black uppercase tracking-widest text-xs">
          🧪 {t("preparingLab")}
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-10 pb-20 p-6 md:p-10">
        {/* --- 🔝 Header --- */}
        <header className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <nav className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 italic">
              <span>LAB</span>
              <span className="opacity-30">/</span>
              <span className="text-emerald-500">SIMULATOR</span>
            </nav>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase">
              {t("simLabTitle")}
            </h1>
            <p className="text-slate-500 mt-2 font-medium opacity-70">
              {t("simLabSub")}
            </p>
          </div>
          <div className="bg-white px-8 py-4 rounded-3xl shadow-sm border border-slate-100 hidden md:block">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
              {t("baseCostRate")}
            </p>
            <p className="text-xl font-black text-slate-900 tracking-tight">
              ฿ {config.base_rate}{" "}
              <span className="text-[10px] font-bold opacity-30 uppercase">
                {t("perUnit")}
              </span>
            </p>
          </div>
        </header>

        {/* --- 🎚️ Section 1: The Slider --- */}
        <div className="bg-slate-900 p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group">
          <div className="relative z-10 text-center space-y-8">
            <p className="text-emerald-400 font-black uppercase tracking-[0.4em] text-[10px]">
              {t("adjustGoal")}
            </p>
            <h2 className="text-white text-8xl font-black tracking-tighter italic">
              {reduction}%
            </h2>

            <div className="max-w-2xl mx-auto space-y-4">
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={reduction}
                onChange={(e) => setReduction(e.target.value)}
                className="w-full h-4 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[9px] font-black uppercase tracking-widest opacity-40">
                <span>{t("conservative")}</span>
                <span>{t("optimized")}</span>
                <span>{t("aggressive")}</span>
              </div>
            </div>
          </div>
          <div className="absolute -left-10 -bottom-10 text-[20rem] opacity-5 font-black italic select-none pointer-events-none">
            LAB
          </div>
        </div>

        {/* --- 📊 Section 2: Simulated Impact --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 flex flex-col justify-between group hover:shadow-2xl transition-all">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10 italic">
                {t("monthlySavings")}
              </p>
              <h4 className="text-6xl font-black text-emerald-600 tracking-tighter">
                ฿{" "}
                {simResult?.moneySaved.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </h4>
            </div>
            <div className="mt-10 p-6 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 italic">
              <p className="text-[11px] text-emerald-800 font-bold leading-relaxed">
                "เพียงลดการใช้แอร์วันละ 1 ชม.
                คุณก็สามารถประหยัดเงินก้อนนี้ได้ทันที"
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-400 to-amber-600 p-10 rounded-[3.5rem] text-white shadow-xl relative overflow-hidden">
            <p className="text-[10px] font-black uppercase text-white/60 tracking-widest mb-10 italic">
              {t("rewardPotential")}
            </p>
            <h4 className="text-6xl font-black tracking-tighter">
              +{simResult?.bonusPoints}{" "}
              <span className="text-2xl not-italic opacity-60">PTS</span>
            </h4>
            <div className="absolute -right-6 -bottom-6 text-9xl opacity-20 rotate-12 select-none">
              🏆
            </div>
          </div>

          <div className="bg-slate-50 p-10 rounded-[3.5rem] border border-slate-100 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">
                  {t("simulatedUsage")}
                </p>
                <p className="text-3xl font-black text-slate-900 tracking-tight">
                  {simResult?.simKwh.toFixed(1)}{" "}
                  <span className="text-xs opacity-30">kWh</span>
                </p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">
                  {t("carbonReduction")}
                </p>
                <p className="text-3xl font-black text-blue-600 tracking-tight">
                  -{simResult?.carbonSaved.toFixed(1)}{" "}
                  <span className="text-xs opacity-30">kgCO2e</span>
                </p>
              </div>
            </div>
            <button className="w-full mt-10 py-4 bg-white border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-sm hover:bg-slate-900 hover:text-white transition-all active:scale-95">
              {t("commitGoal")}
            </button>
          </div>
        </div>

        {/* --- 💡 Section 3: Smart Suggestions --- */}
        <div className="bg-white p-12 rounded-[4rem] shadow-sm border border-slate-100">
          <h3 className="text-2xl font-black text-slate-800 mb-10 flex items-center gap-4 uppercase tracking-tighter">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
              💡
            </div>
            {t("strategyTitle", { reduction })}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: t("tipAC"),
                desc: t("tipACDesc"),
                impact: t("impactHigh"),
                color: "text-emerald-600",
              },
              {
                title: t("tipLED"),
                desc: t("tipLEDDesc"),
                impact: t("impactMedium"),
                color: "text-blue-600",
              },
              {
                title: t("tipStandby"),
                desc: t("tipStandbyDesc"),
                impact: t("impactLow"),
                color: "text-slate-400",
              },
            ].map((tip, i) => (
              <div
                key={i}
                className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:scale-105 transition-all group"
              >
                <div className="mb-4">
                  <span className="bg-white px-3 py-1 rounded-full text-[9px] font-black text-slate-400 shadow-sm border border-slate-100 tracking-widest uppercase">
                    {t("impactLabel")}{" "}
                    <span className={tip.color}>{tip.impact}</span>
                  </span>
                </div>
                <h4 className="font-black text-slate-800 text-lg mb-2 uppercase tracking-tight">
                  {tip.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-medium opacity-80">
                  {tip.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
