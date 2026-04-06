import KpiCard from "../ui/kpicard";

const format = (v) => Number(v || 0).toFixed(2);

export default function KPISection({ totalKwh, cost, carbon }) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {/* 🔥 อันแรก = เปลี่ยนเป็นภาษาคน */}
      <KpiCard
        title="ใช้ไฟฟ้าทั้งหมดวันนี้"
        value={`${format(totalKwh)} kWh`}
      />

      <KpiCard title="ค่าไฟ (บาท)" value={`${format(cost)} บาท`} />

      <KpiCard title="คาร์บอน (kgCO2)" value={format(carbon)} />

      <KpiCard title="ประหยัดได้" value="12%" />
    </div>
  );
}
