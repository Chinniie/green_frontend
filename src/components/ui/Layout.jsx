import { useMemo } from "react";
import LanguageToggle from "../Togglelanguage";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";

export default function Layout({ children }) {
  const { t } = useTranslation(); // ✅ เรียกใช้งาน Hook
  const navigate = useNavigate();
  const location = useLocation();

  const user = useMemo(
    () => JSON.parse(localStorage.getItem("user") || "{}"),
    [],
  );
  const domain = user?.domain || "household";

  // 📋 กำหนดเมนูแยกตาม Role และใช้ t() เพื่อให้เปลี่ยนภาษาได้ทันที
  const activeMenus = useMemo(() => {
    const menuConfig = {
      household: [
        { name: t("dashboard"), path: "/dashboard", icon: "📊" },
        { name: t("smartPlug"), path: "/smart-plug", icon: "🔌" },
        { name: t("simulation"), path: "/simulation", icon: "⚡" },
        { name: t("billDecoder"), path: "/bill-decoder", icon: "📑" },
        { name: t("history"), path: "/history", icon: "📅" },
      ],
      sme: [
        { name: t("dashboard"), path: "/dashboard", icon: "🏢" },
        { name: t("peakAnalysis"), path: "/peak-analysis", icon: "📈" },
        { name: t("report"), path: "/report", icon: "🌿" },
        { name: t("simulation"), path: "/simulation", icon: "🧪" },
      ],
      factory: [
        { name: t("factoryDash"), path: "/dashboard", icon: "🏭" },
        { name: t("machineAnalytics"), path: "/machine-analytics", icon: "⚙️" },
        { name: t("peakShaving"), path: "/peak-analysis", icon: "⚡" },
        { name: t("esgCompliance"), path: "/report", icon: "🌿" },
        { name: t("smartPlug"), path: "/smart-plug", icon: "🔌" },
      ],
      utility: [
        { name: t("systemOverview"), path: "/dashboard", icon: "🌐" },
        { name: t("utilitySettings"), path: "/utility-settings", icon: "⚙️" },
      ],
    };
    return menuConfig[domain] || menuConfig.household;
  }, [domain, t]); // ✅ ให้ re-render เมื่อภาษา (t) เปลี่ยน

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans">
      {/* --- 🟢 Sidebar --- */}
      <div className="w-72 min-w-[288px] bg-slate-900 text-white flex flex-col p-6 shadow-2xl z-20">
        <div
          className="flex items-center gap-3 mb-12 px-2 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-emerald-500/20">
            🌱
          </div>
          <h1 className="text-xl font-black tracking-tighter uppercase italic">
            Green Carbon
          </h1>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 px-4">
            {domain} {t("controlCenter")}
          </p>
          {activeMenus.map((item) => (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold cursor-pointer transition-all duration-300 group ${
                location.pathname === item.path
                  ? "bg-emerald-500 text-white shadow-xl shadow-emerald-500/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span
                className={`text-xl transition-transform group-hover:scale-125 ${location.pathname === item.path ? "scale-110" : ""}`}
              >
                {item.icon}
              </span>
              <span className="text-sm tracking-tight">{item.name}</span>
            </div>
          ))}
        </nav>

        <div className="pt-6 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-rose-400 hover:bg-rose-400/10 transition-all active:scale-95"
          >
            <span className="text-xl">🚪</span>
            <span className="text-sm uppercase tracking-widest">
              {t("logout")}
            </span>
          </button>
        </div>
      </div>

      {/* --- ⚪ Content Area --- */}
      <div className="flex-1 flex flex-col w-full relative">
        <header className="flex justify-between items-center bg-white/80 backdrop-blur-md px-10 py-6 border-b border-slate-100 z-10">
          <div>
            <h2 className="font-black text-slate-900 text-xl tracking-tight uppercase italic">
              {activeMenus.find((m) => m.path === location.pathname)?.name ||
                t("overview")}
            </h2>
          </div>

          <div className="flex items-center gap-8">
            <LanguageToggle />
            <div className="flex items-center gap-4 pl-8 border-l border-slate-100">
              <div className="text-right hidden md:block">
                <p className="text-sm font-black text-slate-900 tracking-tight">
                  {user.username || "User Account"}
                </p>
                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest leading-none mt-1 italic">
                  {t("verified")} {domain}
                </p>
              </div>
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-xl shadow-inner border border-slate-200">
                {domain === "factory" ? "🏭" : domain === "sme" ? "🏢" : "👤"}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-slate-50 scroll-smooth">
          <div className="p-10 max-w-[1600px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
