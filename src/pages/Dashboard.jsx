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

import { Zap, TrendingUp, Info, RefreshCw, AlertTriangle } from "lucide-react";

// ดึงค่าจาก .env
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

  // --- 🛠️ State สำหรับเก็บข้อมูล Lead ---
  const [leadEmail, setLeadEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [leadLoading, setLeadLoading] = useState(false);

  const user = useMemo(
    () => JSON.parse(localStorage.getItem("user") || "{}"),
    [],
  );
  const domain = user?.domain || "household";

  // --- 🚀 ฟังก์ชันส่งข้อมูลไป PostgreSQL ---
  const handleLeadSubmit = async (e) => {
    if (e) e.preventDefault();
    setLeadLoading(true);

    try {
      // ✅ เปลี่ยนจาก URL แข็งๆ เป็น API_URL
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
      alert("Connection error.");
    } finally {
      setLeadLoading(false);
    }
  };

  const fetchData = useCallback(
    async (isSilent = false) => {
      try {
        if (!isSilent) setLoading(true);
        else setRefreshing(true);

        // ✅ เปลี่ยนจาก URL แข็งๆ เป็น API_URL
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
    [user.id, API_URL], // อย่าลืมใส่ API_URL ใน Dependency
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const stats = useMemo(() => {
    if (!data || data.length === 0) return null;
    const totalKwh = data.reduce((sum, d) => sum + Number(d.kwh || 0), 0);
    const totalCost = totalKwh * effectiveRate;
    const carbon = totalKwh * (config?.carbon_factor || 0.5);
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

  if (loading)
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-black tracking-widest animate-pulse uppercase text-xs">
            {t("syncData")}...
          </p>
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div className="max-w-[1600px] mx-auto pb-20 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* --- Section 1 & 2 (KPI & Charts) --- */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase">
                {t("intelDash")}
              </h1>
              <button
                onClick={() => fetchData(true)}
                className={`p-2 rounded-full hover:bg-slate-100 transition-all ${refreshing ? "animate-spin text-emerald-500" : "text-slate-300"}`}
              >
                <RefreshCw size={20} />
              </button>
            </div>
            <p className="text-slate-400 font-medium flex items-center gap-2 uppercase tracking-widest text-[10px]">
              <Zap size={14} className="text-emerald-500 fill-emerald-500" />
              {domain} {t("controlCenter")} • {user.username}
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white p-2 rounded-3xl shadow-sm border border-slate-100">
            {["baht", "kwh"].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-10 py-3 rounded-2xl text-[10px] font-black transition-all uppercase ${viewMode === mode ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:text-slate-600"}`}
              >
                {mode === "baht" ? `฿ ${t("cost")}` : `⚡ ${t("energy")}`}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <KPISection
              totalKwh={stats?.totalKwh.toFixed(1)}
              cost={stats?.totalCost.toFixed(2)}
              carbon={stats?.carbon.toFixed(2)}
            />
            <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="flex justify-between items-center mb-10">
                <h3 className="font-black text-slate-800 text-xl flex items-center gap-3 uppercase tracking-tighter">
                  <TrendingUp className="text-blue-500" /> {t("realtimeConsum")}
                </h3>
              </div>
              <ChartSection
                data={data}
                viewMode={viewMode}
                rate={effectiveRate}
              />
            </div>
          </div>
          {/* Peak Card (Grid Edition) */}
          <div className="bg-slate-900 p-8 rounded-[3.5rem] shadow-2xl text-white relative overflow-hidden h-full min-h-[450px] border border-white/5 flex flex-col justify-between">
            <div className="relative z-10 flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em]">
                  {t("peakAlert")}
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-[9px] font-black text-orange-400 uppercase tracking-widest italic">
                    Live On-Peak
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-xl border border-white/10 backdrop-blur-md">
                ⚡
              </div>
            </div>
            <div className="relative z-10 grid grid-cols-2 gap-4 items-center border-y border-white/5 py-10">
              <div className="space-y-1 border-r border-white/5 pr-4">
                <p className="text-[9px] font-bold opacity-30 uppercase tracking-widest">
                  {t("dayPeakTime")}
                </p>
                <p className="text-5xl xl:text-6xl font-black tracking-tighter italic leading-none">
                  {stats?.peak?.hour ?? "16"}:00
                </p>
              </div>
              <div className="space-y-1 pl-6 text-right">
                <p className="text-[9px] font-bold opacity-30 uppercase tracking-widest">
                  {t("peakImpactCost")}
                </p>
                <p className="text-5xl xl:text-6xl font-black text-emerald-400 tracking-tighter italic leading-none">
                  {(stats?.peak?.kwh * effectiveRate).toFixed(0)}
                  <span className="text-xl not-italic ml-2 opacity-60">฿</span>
                </p>
              </div>
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-end gap-1.5 h-12 justify-center opacity-20">
                {[30, 60, 45, 90, 65, 80, 40, 55, 70].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 bg-white rounded-full transition-all duration-1000"
                    style={{ height: `${h}%` }}
                  ></div>
                ))}
              </div>
              <button
                onClick={() => navigate("/peak-analysis")}
                className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg"
              >
                {t("deepAnalytic")}
              </button>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
          </div>
        </div>

        {/* --- Section 3: AI Advisor --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-emerald-600 p-10 rounded-[3.5rem] text-white shadow-2xl flex flex-col justify-between relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-2xl border border-white/20 backdrop-blur-md">
                  🤖
                </div>
                <div className="bg-slate-900 text-emerald-400 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/30">
                  AI Optimal Found
                </div>
              </div>
              <h3 className="text-3xl font-black mb-4 italic tracking-tight leading-tight uppercase">
                {t("strategyRec")}
              </h3>
              <div className="space-y-4 mb-10">
                <p className="text-lg opacity-90 font-medium">
                  {t("highLoadDetected")}{" "}
                  <span className="bg-white/20 px-2 rounded-lg text-slate-900 font-black italic">
                    "{stats?.topDevice?.name || "Main Process"}"
                  </span>
                </p>
                <div className="bg-white/10 border border-white/20 p-5 rounded-3xl backdrop-blur-sm">
                  <p className="text-xs font-bold text-emerald-200 mb-2 uppercase">
                    {t("recommendedAction")}:
                  </p>
                  <p className="text-sm font-black uppercase">
                    {t("shiftTo")}{" "}
                    <span className="text-xl text-white">22:00 - 05:00</span>
                  </p>
                </div>
                <p className="text-sm font-medium opacity-80">
                  {t("potentialSavingText")}{" "}
                  <span className="text-2xl font-black text-emerald-200">
                    ฿{(stats?.totalCost * 0.15 || 234).toLocaleString()}
                  </span>{" "}
                  และรับ{" "}
                  <span className="text-xl font-black text-white">+50 PTS</span>
                </p>
              </div>
            </div>
            <div className="relative z-10 flex flex-col gap-3">
              <button
                onClick={() => alert("Success: Applying Shifting Schedule...")}
                className="w-full py-4 bg-white text-emerald-700 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-emerald-50 active:scale-95 transition-all"
              >
                {t("applyPlan")}
              </button>
              <button
                onClick={() => navigate("/peak-analysis")}
                className="w-full py-3 bg-transparent text-white/60 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all"
              >
                {t("deepAnalytic")}
              </button>
            </div>
          </div>

          <div className="bg-white p-12 rounded-[4rem] shadow-sm border border-slate-100 flex flex-col justify-between">
            <h3 className="text-2xl font-black text-slate-800 mb-8 uppercase tracking-tighter">
              <div className="inline-block w-2 h-8 bg-emerald-500 rounded-full mr-3 align-middle"></div>
              {t("usageSummary")}
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100">
                <p className="text-[10px] text-blue-400 font-black mb-2 uppercase tracking-widest">
                  {t("efficiency")}
                </p>
                <p className="text-4xl font-black text-blue-700 tracking-tighter">
                  88.4%
                </p>
              </div>
              <div className="p-8 bg-emerald-900 rounded-[2.5rem] text-white shadow-xl">
                <p className="text-[10px] text-emerald-400 font-black mb-2 uppercase tracking-widest">
                  {t("esgScore")}
                </p>
                <p className="text-4xl font-black text-white tracking-tighter">
                  A+
                </p>
              </div>
            </div>
            <p className="mt-8 text-slate-400 font-medium italic text-sm text-center">
              "{t("esgQuote")}"
            </p>
          </div>
        </div>

        {/* --- Section 4: Role Features --- */}
        <div className="pt-10 border-t border-slate-100">
          <div className="mb-12 flex justify-between items-end">
            <h2 className="text-3xl font-black text-slate-900 italic tracking-tighter uppercase">
              {domain} {t("intelPackage")}
            </h2>
            {stats?.totalKwh > 500 && (
              <div className="flex items-center gap-2 text-rose-500 font-black text-[10px] bg-rose-50 px-4 py-2 rounded-full border border-rose-100 uppercase tracking-widest">
                <AlertTriangle size={14} /> {t("highConsumption")}
              </div>
            )}
          </div>
          <div className="grid grid-cols-1">
            {domain === "household" && <HouseholdFeature data={data} />}
            {domain === "sme" && <SmeFeature data={data} />}
            {domain === "factory" && <FactoryFeature data={data} />}
          </div>
        </div>

        {/* --- 🚀 🏁 FINAL SECTION: Personalized Lead Generation --- */}
        <div className="pt-24">
          <div className="bg-slate-900 rounded-[4rem] p-10 md:p-20 text-center relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/5">
            <div className="absolute inset-0 pointer-events-none">
              <div
                className={`absolute top-[-20%] left-[-10%] w-[60%] h-[80%] rounded-full blur-[120px] opacity-20 ${domain === "factory" ? "bg-blue-500" : domain === "sme" ? "bg-amber-500" : "bg-emerald-500"}`}
              ></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto space-y-10">
              {!isSubmitted ? (
                <>
                  <div className="space-y-4">
                    <div
                      className={`inline-block px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] italic mb-4 border ${domain === "factory" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : domain === "sme" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"}`}
                    >
                      {domain} Exclusive Early Access
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[0.9] italic uppercase">
                      {t(`interestTitle_${domain}`)}
                    </h2>
                    <p className="text-slate-400 text-lg md:text-xl font-medium italic opacity-80 max-w-2xl mx-auto">
                      {t(`interestSub_${domain}`)}
                    </p>
                  </div>

                  {/* ✅ ฟอร์มเก็บเมลที่เชื่อมต่อ API จริง */}
                  <form
                    onSubmit={handleLeadSubmit} // 🔗 เชื่อมต่อฟังก์ชัน Submit
                    className="flex flex-col md:flex-row gap-4 bg-white/5 p-3 rounded-[2.5rem] border border-white/10 backdrop-blur-md max-w-2xl mx-auto"
                  >
                    <input
                      type="email"
                      value={leadEmail} // 🔗 เชื่อมต่อตัวแปรเก็บค่าเมล
                      onChange={(e) => setLeadEmail(e.target.value)} // 🔗 อัปเดตค่าเมื่อพิมพ์
                      placeholder={t("emailPlaceholder")}
                      className="flex-1 bg-transparent border-none px-8 py-5 text-white font-bold placeholder:text-slate-500 outline-none text-lg"
                      required
                      disabled={leadLoading}
                    />
                    <button
                      type="submit"
                      disabled={leadLoading}
                      className={`${domain === "factory" ? "bg-blue-500 hover:bg-blue-400" : domain === "sme" ? "bg-amber-500 hover:bg-amber-400" : "bg-emerald-500 hover:bg-emerald-400"} text-slate-900 px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl transition-all active:scale-95 whitespace-nowrap disabled:opacity-50`}
                    >
                      {leadLoading ? "Processing..." : t("notifyBtn")}
                    </button>
                  </form>
                </>
              ) : (
                // ✅ หน้าจอแสดงเมื่อส่งเมลสำเร็จ
                <div className="py-10 animate-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center text-3xl mx-auto mb-6 shadow-2xl shadow-emerald-500/40">
                    ✅
                  </div>
                  <h3 className="text-3xl font-black text-white uppercase italic">
                    {t("thankYou")}
                  </h3>
                  <p className="text-slate-400 mt-2 font-medium italic">
                    We've added your email to the priority list.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-8 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
                  >
                    Send Another Request
                  </button>
                </div>
              )}

              <div className="pt-10 flex flex-wrap justify-center gap-10 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                {domain === "factory" && (
                  <>
                    <span className="text-[10px] font-black text-white tracking-[0.2em] uppercase">
                      ISO 14001 / 50001
                    </span>
                    <span className="text-[10px] font-black text-white tracking-[0.2em] uppercase">
                      Industrial IoT Secured
                    </span>
                  </>
                )}
                {domain === "sme" && (
                  <>
                    <span className="text-[10px] font-black text-white tracking-[0.2em] uppercase">
                      Tax Deduction Ready
                    </span>
                    <span className="text-[10px] font-black text-white tracking-[0.2em] uppercase">
                      ESG Certified Business
                    </span>
                  </>
                )}
                <span className="text-[10px] font-black text-white tracking-[0.2em] uppercase">
                  256-Bit Encryption
                </span>
              </div>
            </div>
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white/[0.03] font-black text-[15rem] select-none italic pointer-events-none uppercase">
              {domain}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
