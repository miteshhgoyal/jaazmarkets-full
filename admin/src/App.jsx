import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { Helmet } from "react-helmet";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./contexts/AuthContext";
import "./App.css";

// Auth components
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";

// Layout components
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

// Admin pages
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Accounts from "./pages/admin/Accounts";
import Withdrawals from "./pages/admin/Withdrawals";
import Deposits from "./pages/admin/Deposits";
import Settings from "./pages/admin/settings/Settings";
import AccountTypes from "./pages/admin/AccountTypes";
import TradesAndOrders from "./pages/admin/TradesAndOrders";

const DefaultRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="w-8 h-8 bg-gradient-to-br from-gray-900 to-black rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Navigate to={isAuthenticated ? "/admin/dashboard" : "/login"} replace />
  );
};

// Protected Layout Component with Outlet
const ProtectedDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <ProtectedRoute requireAuth={true}>
      <div className="min-h-screen bg-slate-50 relative">
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navbar
            toggleSidebar={toggleSidebar}
            toggleSidebarCollapse={toggleSidebarCollapse}
            sidebarCollapsed={sidebarCollapsed}
          />
        </div>

        <Sidebar
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
          isCollapsed={sidebarCollapsed}
          toggleCollapsed={toggleSidebarCollapse}
        />

        <main
          className={`
            pt-16 min-h-screen transition-all duration-300 ease-in-out
            ${sidebarCollapsed ? "lg:ml-16" : "lg:ml-60"}
          `}
        >
          <div className="p-3 sm:p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          {/* Global Default Helmet Configuration */}
          <Helmet
            titleTemplate="%s | Jaaz Markets CRM"
            defaultTitle="Jaaz Markets CRM - Trading Platform"
          >
            <meta
              name="description"
              content="Professional trading platform and CRM system for managing your trading accounts, deposits, withdrawals, and market analytics."
            />
            <meta
              name="keywords"
              content="trading, CRM, forex, crypto, financial platform, market analysis"
            />
            <meta name="author" content="Jaaz Markets" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
            <meta name="theme-color" content="#1e293b" />
            <meta property="og:site_name" content="Jaaz Markets CRM" />
            <meta property="og:type" content="website" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="robots" content="index, follow" />
            <link rel="canonical" href="https://yoursite.com" />
          </Helmet>

          <Routes>
            {/* Public routes - no authentication required */}
            <Route
              path="/login"
              element={
                <ProtectedRoute requireAuth={false}>
                  <Login />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reset-password"
              element={
                <ProtectedRoute requireAuth={false}>
                  <ResetPassword />
                </ProtectedRoute>
              }
            />

            {/* Protected admin routes - authentication required */}
            <Route element={<ProtectedDashboardLayout />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/users" element={<Users />} />
              <Route path="/admin/account-types" element={<AccountTypes />} />
              <Route path="/admin/accounts" element={<Accounts />} />
              <Route path="/admin/withdrawals" element={<Withdrawals />} />
              <Route path="/admin/deposits" element={<Deposits />} />
              <Route
                path="/admin/trades-and-orders"
                element={<TradesAndOrders />}
              />
              <Route path="/admin/settings" element={<Settings />} />
            </Route>

            {/* Default redirects */}
            <Route path="/" element={<DefaultRoute />} />
            <Route path="*" element={<DefaultRoute />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
