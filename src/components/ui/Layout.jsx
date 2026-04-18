import { useMemo, useState } from "react";
import LanguageToggle from "../Togglelanguage";
import ThemeToggle from "../ThemeToggle";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Zap,
  Activity,
  FileText,
  Calendar,
  BarChart3,
  Settings,
  ShieldCheck,
} from "lucide-react";

export default function Layout({ children }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const user = useMemo(
    () => JSON.parse(localStorage.getItem("user") || "{}"),
    [],
  );
  const domain = user?.domain || "household";

  const activeMenus = useMemo(() => {
    const menuConfig = {
      household: [
        {
          name: t("dashboard"),
          path: "/dashboard",
          icon: <LayoutDashboard size={20} />,
        },
        { name: t("smartPlug"), path: "/smart-plug", icon: <Zap size={20} /> },
        {
          name: t("simulation"),
          path: "/simulation",
          icon: <Activity size={20} />,
        },
        {
          name: t("billDecoder"),
          path: "/bill-decoder",
          icon: <FileText size={20} />,
        },
        { name: t("history"), path: "/history", icon: <Calendar size={20} /> },
      ],
      sme: [
        {
          name: t("dashboard"),
          path: "/dashboard",
          icon: <LayoutDashboard size={20} />,
        },
        {
          name: t("peakAnalysis"),
          path: "/peak-analysis",
          icon: <BarChart3 size={20} />,
        },
        { name: t("report"), path: "/report", icon: <FileText size={20} /> },
        {
          name: t("simulation"),
          path: "/simulation",
          icon: <Activity size={20} />,
        },
      ],
      factory: [
        {
          name: t("factoryDash"),
          path: "/dashboard",
          icon: <LayoutDashboard size={20} />,
        },
        {
          name: t("machineAnalytics"),
          path: "/machine-analytics",
          icon: <Settings size={20} />,
        },
        {
          name: t("peakShaving"),
          path: "/peak-analysis",
          icon: <Zap size={20} />,
        },
        {
          name: t("esgCompliance"),
          path: "/report",
          icon: <ShieldCheck size={20} />,
        },
      ],
    };
    return menuConfig[domain] || menuConfig.household;
  }, [domain, t]);

  const handleMenuClick = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    /* --- 🚀 THE FIX: h-screen และ overflow-hidden เพื่อล็อก Sidebar --- */
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 font-sans dark:bg-slate-950 transition-colors duration-300">
      {/* 🖥️ Desktop Sidebar (Fixed) */}
      <aside className="w-72 min-w-[288px] hidden lg:flex bg-slate-900 text-white flex-col p-6 shadow-2xl z-30 border-r border-white/5 h-full">
        <SidebarContent
          activeMenus={activeMenus}
          location={location}
          navigate={handleMenuClick}
          t={t}
          domain={domain}
          onLogout={handleLogout}
        />
      </aside>

      {/* 📱 Mobile Sidebar (Drawer) */}
      <div
        className={`fixed inset-0 z-[100] lg:hidden transition-all duration-300 ${isMobileMenuOpen ? "visible" : "invisible"}`}
      >
        <div
          className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
        <aside
          className={`absolute left-0 top-0 bottom-0 w-72 bg-slate-900 p-6 flex flex-col shadow-2xl transform transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <SidebarContent
            activeMenus={activeMenus}
            location={location}
            navigate={handleMenuClick}
            t={t}
            domain={domain}
            onLogout={handleLogout}
          />
        </aside>
      </div>

      {/* ⚪ Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <header className="flex justify-between items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-4 md:px-10 py-4 border-b border-slate-100 dark:border-slate-800 z-20 sticky top-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <Menu size={24} />
            </button>
            <h2 className="font-black text-slate-900 dark:text-white text-lg md:text-xl tracking-tighter uppercase italic truncate max-w-[180px] md:max-w-none">
              {activeMenus.find((m) => m.path === location.pathname)?.name ||
                t("overview")}
            </h2>
          </div>

          <div className="flex items-center gap-2 md:gap-5">
            <ThemeToggle />
            <LanguageToggle />
            <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-slate-100 dark:border-slate-800">
              <div className="text-right hidden md:block">
                <p className="text-xs font-black text-slate-900 dark:text-white leading-none">
                  {user.username}
                </p>
                <p className="text-[9px] font-bold text-emerald-500 uppercase mt-1 italic tracking-widest">
                  Verified
                </p>
              </div>
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-lg shadow-inner border border-slate-200 dark:border-slate-700">
                {domain === "factory" ? "🏭" : domain === "sme" ? "🏢" : "👤"}
              </div>
            </div>
          </div>
        </header>

        {/* --- 🚀 ส่วนเนื้อหาที่เลื่อนได้จริง --- */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 scroll-smooth custom-scrollbar">
          <div className="p-4 md:p-10 max-w-[1600px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarContent({
  activeMenus,
  location,
  navigate,
  t,
  domain,
  onLogout,
}) {
  return (
    <>
      <div
        className="flex items-center gap-3 mb-10 px-2 cursor-pointer group"
        onClick={() => navigate("/dashboard")}
      >
        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
          🌱
        </div>
        <h1 className="text-xl font-black tracking-tighter uppercase italic text-white">
          Green Carbon
        </h1>
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 custom-scrollbar">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 px-4">
          {domain} {t("controlCenter")}
        </p>
        {activeMenus.map((item) => (
          <div
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl font-bold cursor-pointer transition-all duration-300 group ${
              location.pathname === item.path
                ? "bg-emerald-500 text-white shadow-xl shadow-emerald-500/20"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <span
              className={`transition-transform group-hover:scale-110 ${location.pathname === item.path ? "text-white" : "text-emerald-500"}`}
            >
              {item.icon}
            </span>
            <span className="text-sm tracking-tight">{item.name}</span>
          </div>
        ))}
      </nav>

      <div className="pt-6 border-t border-slate-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-rose-400 hover:bg-rose-400/10 transition-all active:scale-95"
        >
          <LogOut size={20} />
          <span className="text-sm uppercase tracking-widest">
            {t("logout")}
          </span>
        </button>
      </div>
    </>
  );
}
