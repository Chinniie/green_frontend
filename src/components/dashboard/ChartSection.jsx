import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function ChartSection({ data, viewMode, rate }) {
  const electricityRate = rate || 4.2;

  // ฟังก์ชันจัดรูปแบบตัวเลข
  const formatValue = (val) =>
    Number(val).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const themeColor = viewMode === "baht" ? "#10b981" : "#3b82f6";

  return (
    <div className="h-80 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
        >
          {/* ✅ แก้ไข: ใช้ตัวพิมพ์เล็ก และไม่ต้อง Import จาก recharts */}
          <defs>
            <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={themeColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={themeColor} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />

          <XAxis
            dataKey="hour"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9ca3af", fontSize: 12, fontWeight: 500 }}
            tickFormatter={(hour) => `${hour}:00`}
            dy={10}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9ca3af", fontSize: 12 }}
            tickFormatter={(val) =>
              viewMode === "baht"
                ? `฿${(val * electricityRate).toFixed(0)}`
                : `${val}`
            }
          />

          <Tooltip
            contentStyle={{
              borderRadius: "16px",
              border: "none",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              padding: "12px",
            }}
            formatter={(value) => [
              viewMode === "baht"
                ? `฿${formatValue(value * electricityRate)}`
                : `${formatValue(value)} kWh`,
              viewMode === "baht" ? "คิดเป็นเงิน" : "การใช้ไฟ",
            ]}
            labelFormatter={(label) => `เวลา ${label}:00 น.`}
          />

          <Area
            type="monotone"
            dataKey="kwh"
            stroke={themeColor}
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorUsage)"
            animationDuration={1500}
            dot={{ r: 4, fill: themeColor, strokeWidth: 2, stroke: "#fff" }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="flex justify-center gap-6 mt-2 text-xs font-medium text-gray-400">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: themeColor }}></span>
          <span>แสดงผลในหน่วย: {viewMode === "baht" ? "บาท (฿)" : "หน่วย (kWh)"}</span>
        </div>
      </div>
    </div>
  );
}