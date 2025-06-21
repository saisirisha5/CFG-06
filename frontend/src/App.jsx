import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/Auth/AuthPage";
import CounsellorRegisterPage from "./pages/Auth/CounsellorRegisterPage";
import AdminLayout from "./layouts/AdminLayout";
import DashboardPage from "./pages/Auth/DashboardPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/counsellor/register" element={<CounsellorRegisterPage />} />
      
      {/* Dashboard and other admin routes go here, wrapped by the layout */}
      <Route path="/dashboard" element={<AdminLayout><DashboardPage /></AdminLayout>} />
    </Routes>
  );
}

export default App;