import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthService } from '../services/authService';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuth = AuthService.isAuthenticated();
  const location = useLocation();

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: UserRole | UserRole[];
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  children,
  allowedRole
}) => {
  const isAuth = AuthService.isAuthenticated();
  const user = AuthService.getCurrentUser();
  const location = useLocation();

  if (!isAuth || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const allowed = Array.isArray(allowedRole) ? allowedRole.includes(user.role) : user.role === allowedRole;

  if (!allowed) {
    // Redirect customer to /dashboard, technician to /technician, admin to /admin
    if (user.role === 'customer') {
      return <Navigate to="/dashboard" replace />;
    }
    if (user.role === 'technician') {
      return <Navigate to="/technician" replace />;
    }
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
