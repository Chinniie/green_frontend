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
      <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-10">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase">
              {t("billDecoder")}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              {t("billDecoderSub")}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 px-6 py-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-right print:hidden">
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              {t("myGreenPoints")}
            </p>
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              {userPoints + (result?.earnedPoints || 0)} PTS
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* FORM */}
          <div className="lg:col-span-4">
            <form
              onSubmit={handleDecode}
              className="space-y-6 bg-white dark:bg-slate-800 p-8 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-700"
            >
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2 mb-2 block">
                    {t("kwhLabel")}
                  </label>
                  <input
                    type="number"
                    className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-5 font-bold text-lg text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
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
                    className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-5 font-bold text-lg text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="เช่น 1500"
                    onChange={(e) =>
                      setForm({ ...form, amount: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <button className="w-full bg-slate-900 dark:bg-emerald-500 text-white py-5 rounded-[2rem] font-black shadow-xl hover:shadow-emerald-200/50 transition-all active:scale-95 uppercase tracking-widest">
                {loading ? t("analyzing") : t("decodeBtn")}
              </button>
            </form>
          </div>

          {/* RESULT */}
          <div className="lg:col-span-8 space-y-6">
            {result ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-500">
                {/* Predict */}
                <div className="bg-slate-900 dark:bg-slate-950 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                  <p className="text-[10px] font-black uppercase text-emerald-400 tracking-[0.2em] mb-8">
                    {t("billForecast")}
                  </p>
                  <p className="text-xs opacity-50 font-bold mb-1 uppercase">
                    {t("nextMonthForecast")}
                  </p>
                  <h3 className="text-5xl font-black italic">
                    ฿ {result.prediction}
                  </h3>
                </div>

                {/* Reward */}
                <div className="bg-gradient-to-br from-orange-400 to-amber-600 p-8 rounded-[3rem] text-white shadow-2xl relative group">
                  <p className="text-[10px] font-black uppercase text-white/60 tracking-[0.2em] mb-8">
                    {t("specialRewards")}
                  </p>
                  <button className="w-full mt-6 bg-white text-orange-600 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">
                    {t("redeemBtn")}
                  </button>
                </div>

                {/* Summary */}
                <div className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm col-span-1 md:col-span-2 flex items-center justify-between px-12 text-sm">
                  <div>
                    <p className="text-slate-900 dark:text-white font-bold">
                      +{result.earnedPoints} PTS
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-900 dark:text-white">
                      ฿ {result.avgCost} / kWh
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[350px] border-4 border-dashed border-slate-100 dark:border-slate-700 rounded-[4rem] flex flex-col items-center justify-center p-12 text-center">
                <h3 className="text-xl font-black text-slate-300 dark:text-slate-600 uppercase">
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
