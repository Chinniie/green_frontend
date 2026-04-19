import { useState } from "react";
import Layout from "../components/ui/Layout";
import { useEnergy } from "../context/EnergyContext";
import { useTranslation } from "react-i18next";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowDownRight,
  Leaf,
  Download,
} from "lucide-react";

export default function History() {
  const { t } = useTranslation();
  const { effectiveRate } = useEnergy();
  const [filter, setFilter] = useState("Daily");

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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 py-6 md:py-10 space-y-8 md:space-y-10">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase italic">
              {t("historyTitle")}
            </h1>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
              {t("historySub")}
            </p>
          </div>

          {/* FILTER (scrollable on mobile) */}
          <div className="w-full sm:w-auto overflow-x-auto">
            <div className="flex gap-2 bg-white dark:bg-slate-800 p-2 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm w-max sm:w-auto">
              {["daily", "weekly", "monthly"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 sm:px-6 py-2 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest whitespace-nowrap ${
                    filter.toLowerCase() === type
                      ? "bg-slate-900 dark:bg-emerald-500 text-white shadow-lg"
                      : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-200"
                  }`}
                >
                  {t(type)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white dark:bg-slate-800 p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 italic">
              {t("avgDailyCost")}
            </p>
            <div className="flex justify-between items-end">
              <h4 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white">
                ฿ {historyData[0].cost.toFixed(0)}
              </h4>
              <span className="flex items-center gap-1 text-emerald-500 text-[10px] bg-emerald-50 px-2 py-1 rounded-full uppercase">
                <ArrowDownRight size={12} /> 12%
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 italic">
              {t("totalEnergy")}
            </p>
            <h4 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white">
              342.5{" "}
              <span className="text-xs md:text-sm font-normal text-slate-400 uppercase">
                kWh
              </span>
            </h4>
          </div>

          <div className="bg-emerald-600 p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] text-white shadow-xl flex items-center justify-between">
            <div>
              <p className="text-[10px] opacity-60 uppercase mb-2">
                {t("carbonOffset")}
              </p>
              <h4 className="text-2xl md:text-4xl font-black">
                171.2 <span className="text-xs opacity-60">kg</span>
              </h4>
            </div>
            <Leaf size={36} />
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] md:rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          {/* TABLE HEADER */}
          <div className="p-4 md:p-8 flex justify-between items-center border-b border-slate-100 dark:border-slate-700">
            <h3 className="font-black text-slate-800 dark:text-white flex items-center gap-2 text-sm md:text-base uppercase">
              <Calendar size={18} />
              {t("historicalRecords")}
            </h3>

            <button className="p-2 md:p-3 bg-white dark:bg-slate-900 border rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white">
              <Download size={18} />
            </button>
          </div>

          {/* TABLE SCROLL */}
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="text-[10px] text-slate-400 font-black uppercase tracking-widest bg-slate-50 dark:bg-slate-900">
                  <th className="p-4 md:p-6">{t("dateCol")}</th>
                  <th className="p-4 md:p-6 text-right">{t("usageCol")}</th>
                  <th className="p-4 md:p-6 text-right">{t("estCostCol")}</th>
                  <th className="p-4 md:p-6 text-right">{t("impactCol")}</th>
                  <th className="p-4 md:p-6">{t("trendCol")}</th>
                </tr>
              </thead>

              <tbody>
                {historyData.map((row, i) => (
                  <tr
                    key={i}
                    className="border-t border-slate-100 dark:border-slate-700"
                  >
                    <td className="p-4 md:p-6 font-bold">{row.date}</td>
                    <td className="p-4 md:p-6 text-right text-sm">
                      {row.kwh} kWh
                    </td>
                    <td className="p-4 md:p-6 text-right font-bold text-blue-600">
                      ฿ {row.cost.toFixed(2)}
                    </td>
                    <td className="p-4 md:p-6 text-right text-emerald-600 text-sm">
                      {row.carbon} kgCO2e
                    </td>
                    <td className="p-4 md:p-6">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                          row.trend === "down"
                            ? "text-emerald-500 bg-emerald-50"
                            : "text-rose-500 bg-rose-50"
                        }`}
                      >
                        {t(row.trend === "down" ? "statusGood" : "statusHigh")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="p-4 md:p-8 flex justify-center items-center gap-4 md:gap-6 border-t border-slate-100 dark:border-slate-700">
            <button className="p-2 md:p-3 border rounded-xl text-slate-400 hover:text-slate-900">
              <ChevronLeft size={18} />
            </button>

            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {t("pageInfo", { current: 1, total: 5 })}
            </span>

            <button className="p-2 md:p-3 border rounded-xl text-slate-400 hover:text-slate-900">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
