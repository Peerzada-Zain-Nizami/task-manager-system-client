import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    return <Navigate to="/user_login" replace />;
  }

  return children;
};

export const AdminPrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(atob(token.split('.')[1])); // Assuming JWT
  if (user?.role !== "admin") {
    return <Navigate to="/user_login" replace />;
  }

  return children;
};
