// ProtectedRoute Component
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ requiredRole }) => {
  const userRole = localStorage.getItem('role'); // Fetch role from local storage or context
  return userRole === requiredRole ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;