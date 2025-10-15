import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Loader2, Shield } from "lucide-react";

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { isAuthenticated, loading } = useAuth();
  // to be set later

  //   const isAuthenticated = true;
  //   const loading = false;

  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-primary rounded-xl rotate-3 shadow-lg opacity-20" />
            <div className="relative w-full h-full bg-gradient-to-br from-gray-900 to-primary rounded-xl flex items-center justify-center shadow-xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <Loader2 className="w-6 h-6 text-gray-700 animate-spin mx-auto mb-2" />
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    //   return <Navigate to="/login" state={{ from: location }} replace />;
    return <Navigate to="/trading/accounts" replace />;
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/trading/accounts" replace />;
  }

  return children;
};

export default ProtectedRoute;
