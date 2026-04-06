import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// ✅ 1. ดึงค่าจาก .env (Vite standard)
const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    domain: "household",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const register = async (e) => {
    if (e) e.preventDefault();

    if (!form.username || !form.password) {
      alert(t("validationAlert"));
      return;
    }

    try {
      setLoading(true);
      // ✅ 2. เปลี่ยนจาก URL แข็งๆ เป็น API_URL จาก .env
      const res = await axios.post(`${API_URL}/auth/register`, form);

      alert(t("successAlert"));

      const userData = res.data.user || res.data;
      localStorage.setItem("user", JSON.stringify(userData));
      navigate("/dashboard");
    } catch (err) {
      console.error("REGISTER ERROR:", err.response?.data || err);
      alert(err.response?.data?.message || t("errorDuplicate"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-2xl border border-slate-100 w-full max-w-md transition-all">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 text-white rounded-2xl text-3xl shadow-lg shadow-emerald-200 mb-6">
            🌱
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">
            {t("registerTitle")}
          </h2>
          <p className="text-slate-500 mt-2 text-[10px] font-black opacity-70 uppercase tracking-[0.2em]">
            {t("registerSubtitle")}
          </p>
        </div>

        <form onSubmit={register} className="space-y-5">
          {/* Username */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block italic opacity-60">
              {t("usernameHint")}
            </label>
            <input
              name="username"
              type="text"
              placeholder={t("username")}
              onChange={handleChange}
              className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
              required
            />
          </div>

          {/* Email (Optional) */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block italic opacity-60">
              {t("emailLabel")}{" "}
              <span className="text-slate-300 font-normal">
                {t("optional")}
              </span>
            </label>
            <input
              name="email"
              type="email"
              placeholder="example@mail.com"
              onChange={handleChange}
              className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block italic opacity-60">
              {t("password")}
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={handleChange}
              className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
              required
            />
          </div>

          {/* Domain Selection */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block italic opacity-60">
              {t("accountType")}
            </label>
            <div className="relative">
              <select
                name="domain"
                onChange={handleChange}
                className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer outline-none"
              >
                <option value="household">{t("household")}</option>
                <option value="sme">{t("sme")}</option>
                <option value="factory">{t("factory")}</option>
                <option value="utility">{t("utility")}</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 text-xs">
                ▼
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black shadow-xl hover:bg-slate-800 transition-all active:scale-95 disabled:bg-slate-300 mt-4 uppercase tracking-[0.2em] text-xs"
          >
            {loading ? t("creatingAccount") : t("registerBtn")}
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-slate-50 text-center">
          <p className="text-xs text-slate-500 font-medium">
            {t("alreadyHaveAccount")}{" "}
            <span
              className="text-emerald-600 font-black cursor-pointer hover:underline underline-offset-4"
              onClick={() => navigate("/")}
            >
              {t("loginLink")}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
