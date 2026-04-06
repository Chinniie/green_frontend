import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

// ✅ ดึงค่าจาก .env (Vite standard)
const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const EnergyContext = createContext();

export const EnergyProvider = ({ children }) => {
  const [config, setConfig] = useState({
    baseRate: 3.99,
    ftRate: 0.39,
    carbonFactor: 0.5,
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      // ✅ เปลี่ยนจาก URL แข็งๆ เป็น API_URL
      const res = await axios.get(`${API_URL}/settings`);

      const remoteConfig = res.data.config || res.data;

      if (remoteConfig) {
        setConfig({
          baseRate: Number(remoteConfig.base_rate) || 3.99,
          ftRate: Number(remoteConfig.ft_rate) || 0.39,
          carbonFactor: Number(remoteConfig.carbon_factor) || 0.5,
        });
      }
    } catch (err) {
      console.error("❌ โหลดการตั้งค่าไม่สำเร็จ ใช้ค่าเริ่มต้นแทน");
    }
  };

  // ✅ คำนวณเรทสุทธิ
  // $EffectiveRate = BaseRate + FTRate$
  const effectiveRate =
    (Number(config.baseRate) || 0) + (Number(config.ftRate) || 0);

  return (
    <EnergyContext.Provider
      value={{ config, effectiveRate, refreshConfig: fetchConfig }}
    >
      {children}
    </EnergyContext.Provider>
  );
};

export const useEnergy = () => useContext(EnergyContext);
