import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminPanel from './components/AdminPanel';
import CounsellingSessionForm from './components/CounsellingSessionForm';
import SessionList from './components/SessionList';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import AttendancePage from './pages/AttendancePage';
import AttendanceDemo from './components/AttendanceDemo';
function App() {
  return (
    <Routes>

      {/* Redirect root to admin panel */}
      <Route path="/" element={<Navigate to="/admin" replace />} />
      
      {/* Admin Panel Routes */}
      <Route path="/admin" element={<AdminPanel />}>
        <Route index element={<Navigate to="create-session" replace />} />
        <Route path="create-session" element={<CounsellingSessionForm />} />
        <Route path="sessions" element={<SessionList />} />
        <Route path="analytics" element={<AnalyticsDashboard />} />
      </Route>
        {/* Attendance Routes */}
        <Route path="/attendance" element={<AttendancePage />} />
      <Route path="/attendance/demo" element={<AttendanceDemo />} />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}

export default App;
