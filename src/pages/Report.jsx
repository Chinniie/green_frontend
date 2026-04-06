import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Layout from "../components/ui/Layout";
import { useEnergy } from "../context/EnergyContext";

export default function Report() {
  const { effectiveRate } = useEnergy();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = useMemo(
    () => JSON.parse(localStorage.getItem("user") || "{}"),
    [],
  );
  const isBusiness = user.domain === "sme" || user.domain === "factory";

  useEffect(() => {
    if (isBusiness && user.id) {
      fetchMonthlySummary();
    } else {
      setLoading(false);
    }
  }, [isBusiness, user.id]);

  const fetchMonthlySummary = async () => {
    try {
      setLoading(true);
      // ✅ มั่นใจว่า Path ตรงกับ Backend: /api/report/monthly-summary/
      const res = await axios.get(
        `http://localhost:5000/api/report/monthly-summary/${user.id}`,
      );
      setReportData(res.data);
    } catch (err) {
      console.error("REPORT FETCH ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  const exportExcel = () => {
    window.open(`http://localhost:5000/api/report/export/${user.id}`, "_blank");
  };

  const handlePrint = () => {
    window.print();
  };

  // ✅ ป้องกัน NaN โดยการเช็คค่าอย่างละเอียด
  const treeCount = useMemo(() => {
    const carbon = Number(reportData?.current?.carbon) || 0;
    return ((carbon * 12) / 9).toFixed(0);
  }, [reportData]);

  if (loading)
    return (
      <Layout>
        <div className="p-20 text-center animate-pulse text-slate-400 font-black uppercase tracking-widest">
          🛠️ กำลังประกอบรายงานความยั่งยืน...
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-12 pb-20 print:p-0">
        {/* --- 1. Action Header --- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 print:hidden">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
              Sustainability Center
            </h1>
            <p className="text-slate-500 font-medium italic">
              จัดการเอกสารรับรอง ESG สำหรับ {user.domain?.toUpperCase()}
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handlePrint}
              className="bg-white border-2 border-slate-200 text-slate-700 px-6 py-4 rounded-2xl font-black hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
            >
              <span>🖨️</span> Print PDF
            </button>
            <button
              onClick={exportExcel}
              className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:bg-slate-800 transition-all active:scale-95 flex items-center gap-2"
            >
              <span>📊</span> Export Excel
            </button>
          </div>
        </div>

        {/* --- 2. The ESG Statement --- */}
        <div className="bg-white rounded-[4rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden relative print:shadow-none print:border-none">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-12 text-white relative">
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <p className="text-emerald-200 text-xs font-black uppercase tracking-[0.3em] mb-4">
                  Official Verification Statement
                </p>
                <h2 className="text-5xl font-black tracking-tighter">
                  Green Carbon Certificate
                </h2>
                <p className="mt-4 text-emerald-100/80 font-medium max-w-md">
                  สรุปผลการลดคาร์บอนฟุตพริ้นท์ ประจำรอบบัญชีเดือนปัจจุบัน
                </p>
              </div>
              <div className="text-right">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-[2rem] flex items-center justify-center text-4xl border border-white/20">
                  🌱
                </div>
                <p className="mt-4 font-black text-sm uppercase">
                  Verified Status
                </p>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 translate-x-20"></div>
          </div>

          <div className="p-12 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Carbon Metric */}
              <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                  Carbon Footprint
                </p>
                <div className="flex items-baseline gap-2">
                  {/* ✅ ใช้ .toLocaleString() และป้องกันค่า undefined */}
                  <h4 className="text-5xl font-black text-slate-900 tracking-tighter">
                    {(
                      Number(reportData?.current?.carbon) || 0
                    ).toLocaleString()}
                  </h4>
                  <span className="text-slate-400 font-bold">kgCO2e</span>
                </div>
              </div>

              {/* Tree Equivalent */}
              <div className="bg-emerald-50 p-8 rounded-[3rem] border border-emerald-100 relative overflow-hidden">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4">
                  Environmental Impact
                </p>
                <h4 className="text-5xl font-black text-emerald-700 tracking-tighter">
                  {treeCount} <span className="text-lg">Trees</span>
                </h4>
                <p className="text-sm text-emerald-600 mt-2 font-medium">
                  เทียบเท่าการปลูกต้นไม้
                </p>
                <div className="absolute -right-6 -bottom-6 text-9xl opacity-10 rotate-12">
                  🌳
                </div>
              </div>

              {/* SDG Goal */}
              <div className="bg-blue-50 p-8 rounded-[3rem] border border-blue-100">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">
                  SDG Alignment
                </p>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-xl font-black shadow-lg shadow-blue-200">
                    13
                  </div>
                  <p className="text-sm font-black text-blue-900 uppercase">
                    Climate Action
                  </p>
                </div>
                <p className="text-xs text-blue-600 leading-relaxed font-medium">
                  สอดคล้องกับมาตรฐานความยั่งยืนสากล
                </p>
              </div>
            </div>

            {/* Audit Table */}
            <div className="pt-12 border-t border-slate-100">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  Financial & Energy Audit
                </h3>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">
                    Billing Rate
                  </p>
                  <p className="text-sm font-black text-emerald-600">
                    ฿ {Number(effectiveRate || 0).toFixed(2)} / kWh
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-[2.5rem] border border-slate-100">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 text-left text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                      <th className="p-8">Description</th>
                      <th className="p-8 text-right">Units (kWh)</th>
                      <th className="p-8 text-right">Cost (THB)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-8">
                        <p className="font-black text-slate-800 italic">
                          Current Billing Period
                        </p>
                        <p className="text-xs text-slate-400">
                          ข้อมูลสรุปการใช้พลังงาน ณ ปัจจุบัน
                        </p>
                      </td>
                      <td className="p-8 text-right font-bold text-slate-600 text-lg">
                        {(
                          Number(reportData?.current?.kwh) || 0
                        ).toLocaleString()}
                      </td>
                      <td className="p-8 text-right font-black text-slate-900 text-2xl">
                        ฿{" "}
                        {(
                          Number(reportData?.current?.cost) || 0
                        ).toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          body { background-color: white !important; }
          .Layout-content { padding: 0 !important; }
          header, nav, button { display: none !important; }
          @page { margin: 1cm; }
        }
      `,
        }}
      />
    </Layout>
  );
}
