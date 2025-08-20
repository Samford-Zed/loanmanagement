import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const RequireAuth: React.FC = () => {
  const { user, loading } = useAuth();
  const loc = useLocation();

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to='/login' replace state={{ from: loc }} />;
  return <Outlet />;
};

export const RequireRole: React.FC<{
  allowed: Array<"ADMIN" | "CUSTOMER">;
}> = ({ allowed }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to='/login' replace />;
  // user.role is "ADMIN" | "CUSTOMER" (uppercase)
  if (!allowed.includes(user.role)) {
    return <Navigate to={user.role === "ADMIN" ? "/admin" : "/app"} replace />;
  }
  return <Outlet />;
};
