import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { EnergyProvider } from "./context/EnergyContext";

// 📄 Import Pages
import Register from "./pages/Register";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import Simulation from "./pages/Simulation";
import Report from "./pages/Report";
import PeakAnalysis from "./pages/PeakAnalysis";
import MachineBreakdown from "./pages/MachineBreakdown";
import SmartPlug from "./pages/SmartPlug";
import History from "./pages/History"; // ✅ Uncomment ออกได้เลย เพราะเราทำไฟล์ไว้แล้ว
// import UtilitySettings from "./pages/UtilitySettings";
import BillDecoder from "./pages/BillDecoder";

// 🛡️ Components
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <EnergyProvider>
      <BrowserRouter>
        <Routes>
          {/* --- 🔓 Public Routes --- */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* --- 🔐 Protected Routes --- */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/simulation"
            element={
              <ProtectedRoute>
                <Simulation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/smart-plug"
            element={
              <ProtectedRoute>
                <SmartPlug />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bill-decoder"
            element={
              <ProtectedRoute>
                <BillDecoder />
              </ProtectedRoute>
            }
          />

          {/* 📅 2. หน้าประวัติ (เปลี่ยนจาก Dashboard เป็น History) */}
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />

          {/* 🌿 3. หน้าธุรกิจ (SME & Factory) */}
          <Route
            path="/report"
            element={
              <ProtectedRoute>
                <Report />
              </ProtectedRoute>
            }
          />
          <Route
            path="/peak-analysis"
            element={
              <ProtectedRoute>
                <PeakAnalysis />
              </ProtectedRoute>
            }
          />

          {/* ⚙️ 4. หน้าโรงงาน */}
          <Route
            path="/machine-analytics"
            element={
              <ProtectedRoute>
                <MachineBreakdown />
              </ProtectedRoute>
            }
          />

          {/* 🌐 5. หน้าแอดมิน (ใช้ Dashboard เป็น Placeholder ไปก่อนได้) */}
          <Route
            path="/utility-settings"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* ❌ Catch-all */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </EnergyProvider>
  );
}

export default App;
