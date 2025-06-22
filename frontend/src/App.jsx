import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/Auth/AuthPage";
import CounsellorRegisterPage from "./pages/Auth/CounsellorRegisterPage";
import AdminLayout from "./layouts/AdminLayout";
import DashboardPage from "./pages/Auth/DashboardPage";
import CreateSessionPage from "./pages/Admin/CreateSessionPage";
import SessionDetailsPage from "./pages/Admin/SessionDetailsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/counsellor/register" element={<CounsellorRegisterPage />} />
      
      {/* Admin routes with layout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="sessions" element={<CreateSessionPage />} />
        <Route path="sessions/:sessionId" element={<SessionDetailsPage />} />
      </Route>
      
      {/* Legacy dashboard route */}
      <Route path="/dashboard" element={<AdminLayout><DashboardPage /></AdminLayout>} />
    </Routes>
  );
}

export default App;