import { Routes, Route } from "react-router-dom";
import RegisterPage from "./components/Register";
import LoginPage from "./components/Login";
import AdminDashboard from "./components/admin/Dashboard";
import { ToastNotify } from "./components/ToastifyContainer";
import UserPage from "./components/user/UserPage";
import { useAuth } from "./context/AuthContext";
import NotFoundPage from "./components/NotFoundPage";
import ResetPasswordPage from "./components/ReserPasswordPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";

function App() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    );
  }

  if (user.role === "admin") {
    return (
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/user" element={<UserPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
