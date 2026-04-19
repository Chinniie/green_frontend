import { useState } from "react";
import axios from "axios";
import Layout from "../components/ui/Layout";
import { useTranslation } from "react-i18next";

export default function BillDecoder() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    month: 4,
    year: 2026,
    kwh: "",
    amount: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [userPoints, setUserPoints] = useState(120);

  const handleDecode = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      setTimeout(() => {
        const kwh = Number(form.kwh);
        const amount = Number(form.amount);
        const prediction = form.month === 4 ? amount * 1.2 : amount * 1.05;
        const savingFromStandard = 1500 - amount;
        const earnedPoints =
          savingFromStandard > 0 ? Math.floor(savingFromStandard / 5) : 10;

        setResult({
          carbon: (kwh * 0.507).toFixed(1),
          avgCost: (amount / kwh).toFixed(2),
          prediction: prediction.toFixed(0),
          earnedPoints: earnedPoints,
          trees: Math.ceil((kwh * 0.507) / 9),
          savingAmount: savingFromStandard > 0 ? savingFromStandard : 0,
        });
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 py-6 md:py-10 space-y-8 md:space-y-10">
        {/* HEADER */}
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight italic uppercase">
              {t("billDecoder")}
            </h1>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">
              {t("billDecoderSub")}
            </p>
          </div>

          <div className="w-full sm:w-auto bg-white dark:bg-slate-800 px-4 sm:px-6 py-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-center sm:text-right">
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              {t("myGreenPoints")}
            </p>
            <p className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400">
              {userPoints + (result?.earnedPoints || 0)} PTS
            </p>
          </div>
        </header>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
          {/* FORM */}
          <div className="lg:col-span-4">
            <form
              onSubmit={handleDecode}
              className="space-y-6 bg-white dark:bg-slate-800 p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-700"
            >
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2 mb-2 block">
                    {t("kwhLabel")}
                  </label>
                  <input
                    type="number"
                    className="w-full bg-slate-50 dark:bg-slate-900 rounded-xl md:rounded-2xl p-4 md:p-5 font-bold text-base md:text-lg text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="เช่น 350"
                    onChange={(e) => setForm({ ...form, kwh: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2 mb-2 block">
                    {t("amountLabel")}
                  </label>
                  <input
                    type="number"
                    className="w-full bg-slate-50 dark:bg-slate-900 rounded-xl md:rounded-2xl p-4 md:p-5 font-bold text-base md:text-lg text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="เช่น 1500"
                    onChange={(e) =>
                      setForm({ ...form, amount: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <button className="w-full bg-slate-900 dark:bg-emerald-500 text-white py-4 md:py-5 rounded-xl md:rounded-[2rem] font-black text-sm md:text-base shadow-xl hover:shadow-emerald-200/50 transition-all active:scale-95 uppercase tracking-widest">
                {loading ? t("analyzing") : t("decodeBtn")}
              </button>
            </form>
          </div>

          {/* RESULT */}
          <div className="lg:col-span-8 space-y-6">
            {result ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 animate-in fade-in duration-500">
                {/* Predict */}
                <div className="bg-slate-900 dark:bg-slate-950 p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] text-white shadow-2xl">
                  <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest mb-6">
                    {t("billForecast")}
                  </p>
                  <h3 className="text-3xl md:text-5xl font-black italic">
                    ฿ {result.prediction}
                  </h3>
                </div>

                {/* Reward */}
                <div className="bg-gradient-to-br from-orange-400 to-amber-600 p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] text-white shadow-2xl">
                  <button className="w-full mt-6 bg-white text-orange-600 py-3 rounded-xl md:rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">
                    {t("redeemBtn")}
                  </button>
                </div>

                {/* Summary */}
                <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm col-span-1 sm:col-span-2 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
                  <div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                      +{result.earnedPoints} PTS
                    </p>
                  </div>
                  <div>
                    <p className="text-sm md:text-base text-slate-900 dark:text-white">
                      ฿ {result.avgCost} / kWh
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="min-h-[250px] md:min-h-[350px] border-4 border-dashed border-slate-100 dark:border-slate-700 rounded-[2rem] md:rounded-[4rem] flex items-center justify-center p-6 text-center">
                <h3 className="text-base md:text-xl font-black text-slate-300 dark:text-slate-600 uppercase">
                  {t("readyToDecode")}
                </h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
