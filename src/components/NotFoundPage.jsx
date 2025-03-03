import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Assuming you have an auth context

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth(); // Adjust according to your auth setup

  const handleNavigation = () => {
    if (!isAuthenticated || !user) {
      navigate("/login");
    } else if (user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/user");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-800">404</h1>
        <h2 className="text-4xl font-semibold text-gray-600 mt-4">Page Not Found</h2>
        <p className="text-gray-500 mt-4 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <button onClick={handleNavigation} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          {!isAuthenticated ? "Go to Login" : user.role === "admin" ? "Go to Dashboard" : "Go to Home"}
        </button>
      </div>
    </div>
  );
}
