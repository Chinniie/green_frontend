import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Home,
  Store,
  Factory,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isConnecting, setIsConnecting] = useState(null);

  // ✅ ฟังก์ชัน Login ทางลัด ปรับ ID ตามโจทย์: Household=1, SME=2, Factory=3
  const handleQuickLogin = (roleType) => {
    setIsConnecting(roleType);

    const roleMapping = {
      household: { id: 1, name: "Home User", domain: "household" },
      sme: { id: 2, name: "SME Owner", domain: "sme" },
      factory: { id: 3, name: "Factory Manager", domain: "factory" },
    };

    const selected = roleMapping[roleType];

    setTimeout(() => {
      const demoUser = {
        id: selected.id, // ✅ ดึง ID 1, 2, 3 ตามโจทย์
        username: selected.name,
        role: "guest",
        domain: selected.domain, // ✅ ดึง domain ตามประเภท
        has_plug: true,
        subscription_status: "active",
      };

      // 💾 บันทึกลง LocalStorage ให้ Dashboard นำไปใช้เรียก API
      localStorage.setItem("user", JSON.stringify(demoUser));

      // ตั้งค่าให้ Onboarding Tutorial แสดงผลเพื่อให้กรรมการเห็นความใส่ใจใน UX
      localStorage.setItem("skip_tutorial", "false");

      navigate("/dashboard");
    }, 1000);
  };

  const roleConfigs = [
    {
      id: "household",
      name: "Household",
      desc: "ระบบประหยัดไฟครัวเรือน ",
      icon: <Home className="w-8 h-8" />,
      theme: "from-emerald-500 to-teal-600",
    },
    {
      id: "sme",
      name: "SME / Office",
      desc: "จัดการต้นทุนพลังงานธุรกิจ ",
      icon: <Store className="w-8 h-8" />,
      theme: "from-blue-500 to-indigo-600",
    },
    {
      id: "factory",
      name: "Industrial",
      desc: "มอนิเตอร์โรงงานขนาดใหญ่ ",
      icon: <Factory className="w-8 h-8" />,
      theme: "from-rose-500 to-orange-600",
    },
  ];

  return (
    <div className="min-h-screen w-full flex bg-slate-950 font-sans overflow-hidden">
      {/* --- ⬅️ ฝั่งซ้าย: Role Selection --- */}
      <div className="w-full lg:w-[42%] bg-white relative z-10 flex flex-col justify-center px-8 sm:px-16 lg:rounded-r-[4.5rem] shadow-2xl transition-all duration-700">
        <div className="max-w-md mx-auto w-full space-y-12 py-12 animate-in fade-in slide-in-from-left-8 duration-1000">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-emerald-500 font-black tracking-[0.3em] text-[10px] uppercase italic">
              <Sparkles size={14} className="fill-emerald-500" />
              <span>Intelligence Platform v2.1</span>
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase leading-tight">
              Green <span className="text-emerald-500">Carbon</span>
              <br />
              <span className="text-2xl not-italic font-medium text-slate-400">
                Prototype Access
              </span>
            </h1>
          </div>

          {/* Role Cards */}
          <div className="space-y-4">
            {roleConfigs.map((role) => (
              <button
                key={role.id}
                onClick={() => handleQuickLogin(role.id)}
                disabled={isConnecting !== null}
                className={`w-full group relative flex items-center p-1 rounded-[2.2rem] transition-all duration-500 
                  ${isConnecting === role.id ? "scale-[0.97] ring-2 ring-slate-900" : "hover:scale-[1.02]"}
                `}
              >
                <div
                  className={`flex items-center gap-5 w-full p-5 rounded-[2.1rem] bg-slate-50 border-2 border-transparent group-hover:border-white group-hover:bg-white group-hover:shadow-2xl transition-all duration-300`}
                >
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${role.theme} text-white flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform duration-500`}
                  >
                    {role.icon}
                  </div>

                  <div className="flex-1 text-left">
                    <h3 className="font-black text-xl text-slate-800 uppercase tracking-tight italic">
                      {role.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                      {role.desc}
                    </p>
                  </div>

                  <div className="text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all">
                    {isConnecting === role.id ? (
                      <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ArrowRight size={24} />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Footer Info */}
          <div className="flex items-center justify-between pt-8 border-t border-slate-100">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
              <ShieldCheck size={14} />
              Database Linked Access
            </div>
            <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
              PostgreSQL Ready
            </div>
          </div>
        </div>
      </div>

      {/* --- ➡️ ฝั่งขวา: Hero Visual (Desktop Only) --- */}
      <div className="hidden lg:flex flex-1 relative bg-slate-950 items-center justify-center overflow-hidden p-20">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[100px]" />

        <div className="relative z-10 space-y-10 max-w-2xl animate-in zoom-in-95 duration-1000">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            <span className="text-white text-[10px] font-black uppercase tracking-[0.3em]">
              System Monitoring Online
            </span>
          </div>

          <h2 className="text-white text-7xl xl:text-8xl font-black italic tracking-tighter leading-[0.85] uppercase">
            Reduce <span className="text-emerald-500">Cost.</span>
            <br />
            Enhance <span className="text-blue-400">ESG.</span>
          </h2>

          <p className="text-slate-400 text-xl font-medium italic opacity-70 leading-relaxed max-w-md border-l-2 border-emerald-500/30 pl-6">
            "วิเคราะห์พฤติกรรมการใช้ไฟด้วย AI
            เพื่อความยั่งยืนของธุรกิจและโลกใบนี้"
          </p>

          <div className="grid grid-cols-2 gap-12 pt-10 border-t border-white/10">
            <div className="space-y-1">
              <p className="text-white text-5xl font-black italic tracking-tighter">
                A+
              </p>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                ESG Rating
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-white text-5xl font-black italic tracking-tighter">
                1ms
              </p>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                Real-time Sync
              </p>
            </div>
          </div>
        </div>

        {/* Huge Background Text */}
        <div className="absolute -bottom-20 -right-20 text-white/[0.02] text-[28rem] font-black italic select-none pointer-events-none uppercase tracking-tighter">
          ESG
        </div>
      </div>
    </div>
  );
}
