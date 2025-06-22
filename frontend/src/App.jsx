import { Route, Routes, Navigate } from "react-router-dom";
import AuthPage from "./pages/Auth/AuthPage";
import CounsellorRegisterPage from "./pages/Auth/CounsellorRegisterPage";
import AdminLayout from "./layouts/AdminLayout";
import DashboardPage from "./pages/Auth/DashboardPage";
import CreateSessionPage from "./pages/Admin/CreateSessionPage";
import SessionDetailsPage from "./pages/Admin/SessionDetailsPage";
import CounsellorsPage from "./pages/Admin/CounsellorsPage";
import AnalyticsPage from "./pages/Admin/AnalyticsPage";
import FamilyReportPage from "./pages/Admin/FamilyReportPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/counsellor/register" element={<CounsellorRegisterPage />} />
      
      {/* Redirect /analytics to /admin/analytics */}
      <Route path="/analytics" element={<Navigate to="/admin/analytics" replace />} />
      
      {/* Admin routes with layout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="sessions" element={<CreateSessionPage />} />
        <Route path="sessions/:sessionId" element={<SessionDetailsPage />} />
        <Route path="counsellors" element={<CounsellorsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="family-report/:householdId" element={<FamilyReportPage />} />
      </Route>
      
      {/* Legacy dashboard route */}
      <Route path="/dashboard" element={<AdminLayout><DashboardPage /></AdminLayout>} />
    </Routes>
  );
}

export default App;