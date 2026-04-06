import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// ✅ 1. ดึงค่าจาก .env (Vite standard)
const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export default function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!form.username || !form.password) {
      alert(t("fillAllFields"));
      return;
    }
    try {
      setLoading(true);
      // ✅ 2. เปลี่ยนมาใช้ API_URL จาก .env
      const res = await axios.post(`${API_URL}/auth/login`, form);

      // เก็บข้อมูล User ลง LocalStorage ตามปกติ
      localStorage.setItem("user", JSON.stringify(res.data.user || res.data));
      navigate("/dashboard");
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      alert(t("invalidLogin"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col lg:flex-row bg-slate-950 font-sans overflow-hidden fixed inset-0">
      {/* --- ⬅️ Section 1: Form Side --- */}
      <div className="relative h-full w-full lg:w-[42%] bg-white z-20 lg:rounded-r-[4.5rem] shadow-[25px_0_50px_-15px_rgba(0,0,0,0.3)] flex flex-col justify-center overflow-y-auto no-scrollbar">
        <div className="lg:hidden absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-emerald-50/50 to-transparent pointer-events-none"></div>

        <div className="w-full max-w-sm mx-auto p-8 sm:p-12 space-y-12 animate-in fade-in slide-in-from-left-6 duration-1000">
          <div className="text-center space-y-5">
            <div className="relative inline-block group">
              <div className="absolute -inset-1 bg-emerald-500/20 rounded-[2.2rem] blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative inline-flex items-center justify-center w-20 h-20 bg-emerald-500 text-white rounded-[2rem] text-4xl shadow-2xl shadow-emerald-200 transform hover:scale-105 active:scale-95 transition-all cursor-pointer">
                🌿
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
                Green Carbon
              </h2>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1 opacity-70">
                {t("esgSub")}
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-7">
            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic group-focus-within:text-emerald-500 transition-colors">
                {t("username")}
              </label>
              <input
                name="username"
                type="text"
                placeholder={t("usernamePlaceholder")}
                onChange={handleChange}
                className="w-full bg-slate-50 border-2 border-transparent rounded-[1.5rem] p-5 font-bold text-slate-700 focus:border-emerald-500 focus:bg-white transition-all outline-none text-base shadow-sm group-hover:bg-slate-100/50"
                required
              />
            </div>

            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic group-focus-within:text-emerald-500 transition-colors">
                {t("password")}
              </label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                onChange={handleChange}
                className="w-full bg-slate-50 border-2 border-transparent rounded-[1.5rem] p-5 font-bold text-slate-700 focus:border-emerald-500 focus:bg-white transition-all outline-none text-base shadow-sm group-hover:bg-slate-100/50"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black shadow-2xl shadow-slate-300 hover:bg-black active:scale-[0.97] transition-all mt-4 uppercase tracking-[0.2em] text-sm"
            >
              {loading ? t("authenticating") : t("login")}
            </button>
          </form>

          <div className="text-center">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
              {t("no_account")}{" "}
              <span
                className="text-emerald-600 font-black cursor-pointer hover:underline underline-offset-8 ml-1"
                onClick={() => navigate("/register")}
              >
                {t("register")}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* --- ➡️ Section 2: Desktop Hero Side --- */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center p-20 overflow-hidden bg-slate-950">
        <div className="absolute inset-0">
          <div className="absolute top-[-15%] right-[-10%] w-[70%] h-[70%] bg-emerald-600/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-15%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative z-10 space-y-12 text-white max-w-xl animate-in fade-in zoom-in-95 duration-1000">
          <div className="space-y-4">
            <p className="text-emerald-400 font-black uppercase tracking-[0.5em] text-xs italic">
              Intelligence ESG Platform
            </p>
            <h1 className="text-white text-7xl xl:text-[6rem] font-black tracking-tighter leading-[0.85] italic">
              Powering <br />{" "}
              <span className="text-emerald-500 drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                Intelligence.
              </span>
            </h1>
          </div>

          <p className="text-slate-400 text-xl font-medium leading-relaxed italic opacity-80 border-l-2 border-emerald-500/30 pl-6">
            "วิเคราะห์พฤติกรรมการใช้ไฟฟ้าด้วย AI <br />{" "}
            เพื่อกำไรที่มากขึ้นและความยั่งยืนที่เหนือกว่า"
          </p>

          <div className="flex gap-16 pt-8">
            <div className="space-y-1">
              <p className="text-5xl font-black italic tracking-tighter text-white">
                A+
              </p>
              <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em]">
                ESG Rating
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-5xl font-black italic tracking-tighter text-white">
                30%
              </p>
              <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em]">
                Avg. Savings
              </p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 right-10 text-white/[0.03] font-black text-[15rem] select-none italic pointer-events-none uppercase">
          ESG
        </div>
      </div>
    </div>
  );
}
