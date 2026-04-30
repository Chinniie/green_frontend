// 🔥 KPISection.jsx
import KpiCard from "../ui/KpiCard";

const format = (v) => Number(v || 0).toFixed(2);

export default function KPISection({ totalKwh, cost, carbon }) {
  return (
    /* 
       ปรับจาก grid-cols-4 เป็น:
       - grid-cols-2 (มือถือ: แสดง 2 แถว แถวละ 2 ใบ)
       - lg:grid-cols-4 (หน้าจอใหญ่: เรียงแถวเดียว 4 ใบ)
    */
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8">
      
      {/* ใบที่ 1: การใช้ไฟ */}
      <KpiCard
        title="ใช้ไฟฟ้าวันนี้"
        value={`${format(totalKwh)}`}
        unit="kWh"
        color="emerald"
      />

      {/* ใบที่ 2: ค่าไฟ */}
      <KpiCard 
        title="ค่าไฟประมาณการ" 
        value={`${format(cost)}`} 
        unit="บาท"
        color="blue" 
      />

      {/* ใบที่ 3: คาร์บอน */}
      <KpiCard 
        title="ลดคาร์บอน" 
        value={format(carbon)} 
        unit="kgCO2"
        color="rose" 
      />

      {/* ใบที่ 4: เปอร์เซ็นต์การประหยัด */}
      <KpiCard 
        title="ประหยัดได้" 
        value="12" 
        unit="%"
        color="amber" 
      />
      
    </div>
  );
}