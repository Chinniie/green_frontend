import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import Layout from "../components/ui/Layout";
import { useNavigate } from "react-router-dom";
import { useEnergy } from "../context/EnergyContext";
import { useTranslation } from "react-i18next";

// Components
import KPISection from "../components/dashboard/KPISection";
import ChartSection from "../components/dashboard/ChartSection";
import HouseholdFeature from "../components/role/HouseholdFeature";
import SmeFeature from "../components/role/SmeFeature";
import FactoryFeature from "../components/role/FactoryFeature";

import {
  Zap,
  TrendingUp,
  RefreshCw,
  AlertTriangle,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export default function Dashboard() {
  const { t } = useTranslation();
  const { config, effectiveRate } = useEnergy();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState("baht");
  const navigate = useNavigate();

  const [leadEmail, setLeadEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [leadLoading, setLeadLoading] = useState(false);
  const [showTutorial, setShowTutorial] = useState(
    !localStorage.getItem("skip_tutorial"),
  );

  const user = useMemo(
    () => JSON.parse(localStorage.getItem("user") || "{}"),
    [],
  );
  const domain = user?.domain || "household";

  const handleLeadSubmit = async (e) => {
    if (e) e.preventDefault();
    setLeadLoading(true);
    try {
      const res = await axios.post(`${API_URL}/leads/collect`, {
        email: leadEmail,
        domain: domain,
        username: user.username,
      });
      if (res.data.success) {
        setIsSubmitted(true);
        setLeadEmail("");
      }
    } catch (err) {
      console.error("LEAD ERROR:", err);
    } finally {
      setLeadLoading(false);
    }
  };

  const fetchData = useCallback(
    async (isSilent = false) => {
      try {
        if (!isSilent) setLoading(true);
        else setRefreshing(true);
        const res = await axios.get(`${API_URL}/energy/usage/${user.id}`);
        if (res.data.success || res.data.data) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error("FETCH ERROR:", err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user.id],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const stats = useMemo(() => {
    if (!data || data.length === 0)
      return {
        totalKwh: 0,
        totalCost: 0,
        carbon: 0,
        peak: null,
        topDevice: null,
      };
    const totalKwh = data.reduce((sum, d) => sum + Number(d.kwh || 0), 0);
    const totalCost = totalKwh * effectiveRate;
    const carbon = totalKwh * (config?.carbon_factor || 0.507);
    const peak = data.reduce(
      (max, curr) => (Number(curr.kwh) > (Number(max?.kwh) || 0) ? curr : max),
      data[0],
    );
    const deviceData = Object.values(
      data.reduce((acc, curr) => {
        const deviceName = curr.device || "Other Assets";
        if (!acc[deviceName]) acc[deviceName] = { name: deviceName, kwh: 0 };
        acc[deviceName].kwh += Number(curr.kwh || 0);
        return acc;
      }, {}),
    ).sort((a, b) => b.kwh - a.kwh);
    return { totalKwh, totalCost, carbon, peak, topDevice: deviceData[0] };
  }, [data, effectiveRate, config]);

  const closeTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem("skip_tutorial", "true");
  };

  if (loading)
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center h-[70vh] gap-6">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-900 dark:text-white font-black tracking-widest animate-pulse uppercase text-xs">
            {t("syncData")}
          </p>
        </div>
      </Layout>
    );

  return (
    <Layout>
      {/* 🧠 AI Onboarding Overlay */}
      {showTutorial && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 transition-all">
          <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-10 max-w-sm w-full text-center shadow-2xl border border-slate-100 dark:border-slate-700 animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6">
              🌱
            </div>
            <h3 className="text-2xl font-black mb-3 text-slate-900 dark:text-white uppercase tracking-tighter italic">
              Welcome, {user.username}!
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8 font-medium">
              Dashboard ใหม่พร้อมแล้วครับบอส
              ระบบจะช่วยวิเคราะห์จุดที่ใช้ไฟเยอะที่สุดให้ทันที
            </p>
            <button
              onClick={closeTutorial}
              className="w-full py-4 bg-slate-900 dark:bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl"
            >
              รับทราบครับ
            </button>
          </div>
        </div>
      )}

      <div className="max-w-[1600px] mx-auto pb-24 space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        {/* --- 🔝 Header Section --- */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 px-2">
          <div className="space-y-3">
            <nav className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] italic">
              <Sparkles size={12} className="fill-emerald-500" />
              <span>{t("controlCenter")}</span>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <span className="text-slate-400">v2.1 ONLINE</span>
            </nav>
            <div className="flex items-center gap-4">
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase leading-none">
                {t("intelDash")}
              </h1>
              <button
                onClick={() => fetchData(true)}
                className={`p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 hover:rotate-180 transition-all duration-500 ${refreshing ? "animate-spin text-emerald-500" : "text-slate-400"}`}
              >
                <RefreshCw size={18} />
              </button>
            </div>
          </div>

          <div className="flex bg-white dark:bg-slate-800 p-2 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 w-full md:w-auto transition-colors">
            {["baht", "kwh"].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`flex-1 md:flex-none px-8 py-3 rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest ${viewMode === mode ? "bg-slate-900 dark:bg-emerald-500 text-white shadow-xl" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-200"}`}
              >
                {mode === "baht" ? `฿ ${t("cost")}` : `⚡ ${t("energy")}`}
              </button>
            ))}
          </div>
        </header>

        {/* --- 📊 Section 1 & 2: KPI & Charts --- */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-10">
            <KPISection
              totalKwh={stats?.totalKwh?.toFixed(1)}
              cost={stats?.totalCost?.toFixed(2)}
              carbon={stats?.carbon?.toFixed(2)}
            />

            <div className="bg-white dark:bg-slate-800/50 p-6 md:p-12 rounded-[3.5rem] shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-all group">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <h3 className="font-black text-slate-800 dark:text-white text-2xl flex items-center gap-4 uppercase tracking-tighter italic">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="text-blue-500" />
                  </div>
                  {t("realtimeConsum")}
                </h3>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-full border border-slate-100 dark:border-slate-700">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                  <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    Live Sync
                  </span>
                </div>
              </div>
              <div className="min-h-[400px]">
                <ChartSection
                  data={data}
                  viewMode={viewMode}
                  rate={effectiveRate}
                />
              </div>
            </div>
          </div>

          {/* ⚡ Peak Card */}
          <div className="bg-slate-900 dark:bg-slate-950 p-10 rounded-[4rem] shadow-2xl text-white relative overflow-hidden flex flex-col justify-between border border-white/5 min-h-[500px] group transition-all">
            <div className="relative z-10 space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] italic">
                  {t("peakAlert")}
                </p>
                <Zap
                  size={20}
                  className="text-emerald-500 fill-emerald-500 animate-pulse"
                />
              </div>
              <div className="h-px bg-white/10 w-full"></div>
            </div>

            <div className="relative z-10 py-10">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">
                {t("dayPeakTime")}
              </p>
              <h4 className="text-7xl md:text-8xl font-black tracking-tighter italic leading-none text-white group-hover:scale-105 transition-transform duration-700">
                {stats?.peak?.hour ?? "00"}:00
              </h4>
              <div className="mt-8 p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  {t("peakImpactCost")}
                </p>
                <p className="text-4xl font-black text-emerald-400 tracking-tighter italic">
                  ฿{(Number(stats?.peak?.kwh || 0) * effectiveRate).toFixed(0)}
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/peak-analysis")}
              className="relative z-10 w-full py-5 bg-white dark:bg-emerald-500 text-slate-900 dark:text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-400 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {t("deepAnalytic")} <ChevronRight size={14} />
            </button>
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-1000"></div>
          </div>
        </div>

        {/* --- 🤖 Section 3: AI Advisor --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-emerald-600 dark:bg-emerald-700 p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="flex justify-between items-start mb-10">
                  <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center text-3xl border border-white/20 backdrop-blur-md">
                    🤖
                  </div>
                  <span className="bg-slate-900 text-emerald-400 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/30">
                    AI Analysis Engine
                  </span>
                </div>
                <h3 className="text-4xl font-black mb-6 italic tracking-tight leading-none uppercase">
                  {t("strategyRec")}
                </h3>
                <div className="space-y-6 mb-12">
                  <p className="text-xl opacity-90 font-medium leading-relaxed">
                    {t("highLoadDetected")}{" "}
                    <span className="bg-white/20 px-3 py-1 rounded-xl text-slate-900 font-black italic">
                      "{stats?.topDevice?.name || "Main Process"}"
                    </span>
                  </p>
                  <div className="bg-slate-900/40 p-6 rounded-[2.5rem] border border-white/10 backdrop-blur-sm">
                    <p className="text-[10px] font-bold text-emerald-300 mb-3 uppercase tracking-widest">
                      {t("recommendedAction")}:
                    </p>
                    <p className="text-2xl font-black uppercase tracking-tighter">
                      {t("shiftTo")}{" "}
                      <span className="text-emerald-400">22:00 - 05:00</span>
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => alert("Success: Applying Shifting Schedule...")}
                className="w-full py-5 bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-[1.02] transition-all active:scale-95"
              >
                {t("applyPlan")}
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-12 rounded-[4rem] shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between transition-colors">
            <div className="space-y-8">
              <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter italic">
                <div className="inline-block w-3 h-8 bg-emerald-500 rounded-full mr-4 align-middle"></div>
                {t("usageSummary")}
              </h3>
              <div className="grid grid-cols-2 gap-8">
                <div className="p-8 bg-blue-50 dark:bg-blue-500/5 rounded-[3rem] border border-blue-100 dark:border-blue-500/10 transition-colors">
                  <p className="text-[10px] text-blue-500 dark:text-blue-400 font-black mb-3 uppercase tracking-widest">
                    {t("efficiency")}
                  </p>
                  <p className="text-5xl font-black text-blue-700 dark:text-blue-300 tracking-tighter italic">
                    88.4%
                  </p>
                </div>
                <div className="p-8 bg-slate-900 dark:bg-emerald-900/30 rounded-[3rem] text-white shadow-xl transition-colors">
                  <p className="text-[10px] text-emerald-400 font-black mb-3 uppercase tracking-widest">
                    {t("esgScore")}
                  </p>
                  <p className="text-5xl font-black text-white tracking-tighter italic">
                    A+
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-12 p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] italic text-center border border-slate-100 dark:border-slate-800">
              <p className="text-slate-400 dark:text-slate-500 font-medium text-sm leading-relaxed">
                "{t("esgQuote")}"
              </p>
            </div>
          </div>
        </div>

        {/* --- 📦 Section 4: Role-Specific Packages --- */}
        <div className="pt-16 border-t border-slate-100 dark:border-slate-800 transition-colors">
          <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
            <div className="space-y-2">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase leading-none">
                {domain}{" "}
                <span className="text-emerald-500">{t("intelPackage")}</span>
              </h2>
              <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">
                TAILORED ANALYTICS FOR {domain} OWNERS
              </p>
            </div>
            {stats?.totalKwh > 500 && (
              <div className="flex items-center gap-3 text-rose-500 font-black text-[10px] bg-rose-50 dark:bg-rose-500/10 px-6 py-3 rounded-full border border-rose-100 dark:border-rose-500/20 uppercase tracking-widest shadow-sm">
                <AlertTriangle size={16} className="animate-bounce" />{" "}
                {t("highConsumption")}
              </div>
            )}
          </div>
          <div className="grid grid-cols-1">
            {domain === "household" && <HouseholdFeature data={data} />}
            {domain === "sme" && <SmeFeature data={data} />}
            {domain === "factory" && <FactoryFeature data={data} />}
          </div>
        </div>

        {/* --- 🚀 Lead Generation --- */}
        <div className="pt-24 px-2">
          <div className="bg-slate-950 rounded-[4rem] p-10 md:p-24 text-center relative overflow-hidden shadow-2xl border border-white/5 group transition-all">
            <div className="absolute inset-0 pointer-events-none">
              <div
                className={`absolute top-[-30%] left-[-10%] w-[70%] h-[100%] rounded-full blur-[150px] opacity-20 transition-all duration-1000 group-hover:opacity-40 ${domain === "factory" ? "bg-blue-600" : domain === "sme" ? "bg-amber-600" : "bg-emerald-600"}`}
              ></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto space-y-12">
              {!isSubmitted ? (
                <>
                  <div className="space-y-6 text-center">
                    <div
                      className={`inline-block px-8 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] italic mb-6 border ${domain === "factory" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : domain === "sme" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"}`}
                    >
                      {domain} Exclusive Early Access
                    </div>
                    <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-[0.85] italic uppercase">
                      {t(`interestTitle_${domain}`)}
                    </h2>
                    <p className="text-slate-400 text-lg md:text-2xl font-medium italic opacity-80 max-w-2xl mx-auto leading-relaxed">
                      {t(`interestSub_${domain}`)}
                    </p>
                  </div>

                  <form
                    onSubmit={handleLeadSubmit}
                    className="flex flex-col md:flex-row gap-4 bg-white/5 p-4 rounded-[3rem] border border-white/10 backdrop-blur-xl max-w-3xl mx-auto shadow-2xl transition-all focus-within:border-emerald-500/50"
                  >
                    <input
                      type="email"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      placeholder={t("emailPlaceholder")}
                      className="flex-1 bg-transparent border-none px-10 py-6 text-white font-bold placeholder:text-slate-600 outline-none text-xl"
                      required
                      disabled={leadLoading}
                    />
                    <button
                      type="submit"
                      disabled={leadLoading}
                      className={`${domain === "factory" ? "bg-blue-500" : domain === "sme" ? "bg-amber-500" : "bg-emerald-500"} text-slate-950 px-14 py-6 rounded-[2.5rem] font-black uppercase tracking-widest text-xs shadow-2xl transition-all active:scale-95 disabled:opacity-50`}
                    >
                      {leadLoading ? "Processing..." : t("notifyBtn")}
                    </button>
                  </form>
                </>
              ) : (
                <div className="py-16 animate-in zoom-in-95 duration-700">
                  <div className="w-24 h-24 bg-emerald-500 text-white rounded-[2rem] flex items-center justify-center text-4xl mx-auto mb-8 shadow-2xl shadow-emerald-500/40 rotate-12">
                    ✓
                  </div>
                  <h3 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">
                    {t("thankYou")}
                  </h3>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-12 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] hover:text-emerald-500 transition-colors py-4 px-10 border border-white/5 rounded-full"
                  >
                    Send Another Request
                  </button>
                </div>
              )}
            </div>
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-white/[0.02] font-black text-[20rem] select-none italic pointer-events-none uppercase tracking-tighter">
              {domain}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
