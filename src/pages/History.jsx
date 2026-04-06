import { useState, useMemo } from "react";
import Layout from "../components/ui/Layout";
import { useEnergy } from "../context/EnergyContext";
import { useTranslation } from "react-i18next"; // ✅ 1. Import Hook
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowDownRight,
  ArrowUpRight,
  Leaf,
  Download,
  Filter,
} from "lucide-react";

export default function History() {
  const { t } = useTranslation(); // ✅ 2. Initialize t function
  const { effectiveRate } = useEnergy();
  const [filter, setFilter] = useState("Daily");

  // 🧠 ข้อมูลจำลองประวัติการใช้ไฟ (Historical Data)
  const historyData = [
    {
      date: "2026-03-25",
      kwh: 12.5,
      cost: 12.5 * effectiveRate,
      carbon: 6.25,
      trend: "down",
    },
    {
      date: "2026-03-24",
      kwh: 15.2,
      cost: 15.2 * effectiveRate,
      carbon: 7.6,
      trend: "up",
    },
    {
      date: "2026-03-23",
      kwh: 14.8,
      cost: 14.8 * effectiveRate,
      carbon: 7.4,
      trend: "down",
    },
    {
      date: "2026-03-22",
      kwh: 18.0,
      cost: 18.0 * effectiveRate,
      carbon: 9.0,
      trend: "up",
    },
    {
      date: "2026-03-21",
      kwh: 11.2,
      cost: 11.2 * effectiveRate,
      carbon: 5.6,
      trend: "down",
    },
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
        {/* --- 🔝 Header & Navigation --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
              {t("historyTitle")}
            </h1>
            <p className="text-slate-500 font-medium opacity-70">
              {t("historySub")}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
            {["daily", "weekly", "monthly"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${
                  filter.toLowerCase() === type
                    ? "bg-slate-900 text-white shadow-lg"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {t(type)}
              </button>
            ))}
          </div>
        </div>

        {/* --- 📦 Summary Metrics --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 italic">
              {t("avgDailyCost")}
            </p>
            <div className="flex justify-between items-end">
              <h4 className="text-4xl font-black text-slate-900 tracking-tighter">
                ฿ {historyData[0].cost.toFixed(0)}
              </h4>
              <span className="flex items-center gap-1 text-emerald-500 font-black text-[10px] bg-emerald-50 px-3 py-1 rounded-full uppercase">
                <ArrowDownRight size={14} /> 12%
              </span>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 italic">
              {t("totalEnergy")}
            </p>
            <h4 className="text-4xl font-black text-slate-900 tracking-tighter">
              342.5{" "}
              <span className="text-sm font-normal text-slate-400 uppercase">
                kWh
              </span>
            </h4>
          </div>

          <div className="bg-emerald-600 p-8 rounded-[2.5rem] text-white shadow-xl flex items-center justify-between overflow-hidden relative group">
            <div className="relative z-10">
              <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-4 italic">
                {t("carbonOffset")}
              </p>
              <h4 className="text-4xl font-black tracking-tighter">
                171.2{" "}
                <span className="text-sm font-normal opacity-60 uppercase">
                  kg
                </span>
              </h4>
            </div>
            <Leaf
              className="relative z-10 text-emerald-300 group-hover:rotate-12 transition-transform duration-500"
              size={48}
            />
            <div className="absolute -right-4 -bottom-4 text-8xl opacity-10 font-black italic select-none">
              CO2
            </div>
          </div>
        </div>

        {/* --- 📅 Detailed List --- */}
        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
            <h3 className="font-black text-slate-800 flex items-center gap-3 uppercase tracking-tight italic">
              <Calendar className="text-slate-400" size={20} />
              {t("historicalRecords")}
            </h3>
            <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-slate-900 transition-all shadow-sm active:scale-95">
              <Download size={20} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] bg-slate-50/50">
                  <th className="p-8">{t("dateCol")}</th>
                  <th className="p-8 text-right">{t("usageCol")}</th>
                  <th className="p-8 text-right">{t("estCostCol")}</th>
                  <th className="p-8 text-right">{t("impactCol")}</th>
                  <th className="p-8">{t("trendCol")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {historyData.map((row, i) => (
                  <tr
                    key={i}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="p-8 font-black text-slate-700 tracking-tight">
                      {row.date}
                    </td>
                    <td className="p-8 text-right font-bold text-slate-400 uppercase text-sm">
                      {row.kwh} kWh
                    </td>
                    <td className="p-8 text-right font-black text-blue-600 text-lg italic">
                      ฿ {row.cost.toFixed(2)}
                    </td>
                    <td className="p-8 text-right font-black text-emerald-600 text-sm tracking-tight">
                      {row.carbon} kgCO2e
                    </td>
                    <td className="p-8">
                      {row.trend === "down" ? (
                        <span className="text-emerald-500 bg-emerald-50 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                          {t("statusGood")}
                        </span>
                      ) : (
                        <span className="text-rose-500 bg-rose-50 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                          {t("statusHigh")}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-8 bg-slate-50/30 flex justify-center items-center gap-6 border-t border-slate-50">
            <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm active:scale-95">
              <ChevronLeft size={20} />
            </button>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              {t("pageInfo", { current: 1, total: 5 })}
            </span>
            <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm active:scale-95">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
