// 🧠 InsightSection.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function InsightSection({ domain }) {
  const [insight, setInsight] = useState(null);

  useEffect(() => {
    fetchInsight();
  }, [domain]);

  const fetchInsight = async () => {
    try {
      // ✅ แก้ไข: ใช้ Base URL จาก Environment
      const baseURL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

      const res = await axios.get(
        `${baseURL}/ai/insight?domain=${domain}`, // 💡 อย่าลืมเช็ค Path /ai/ นะครับถ้าบอสแยก Folder ไว้
      );
      setInsight(res.data);
    } catch (err) {
      console.error("AI INSIGHT FETCH ERROR:", err);
    }
  };

  if (!insight) return <div>Loading...</div>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow mt-6">
      <h2 className="font-bold mb-4">🧠 AI Insight</h2>

      <p>⏰ Peak: {insight.peakHour}:00</p>
      <p>🔌 อุปกรณ์หลัก: {insight.device}</p>

      <p className="mt-2 text-gray-700">{insight.insight}</p>

      <p className="mt-2 text-green-600">💡 {insight.suggestion}</p>
    </div>
  );
}
