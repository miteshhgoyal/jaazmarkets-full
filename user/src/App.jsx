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
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";

// Layout components
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

// Trading components
import Accounts from "./pages/trading/Accounts";
import Summary from "./pages/trading/Summary";
import HistoryOfOrders from "./pages/trading/HistoryOfOrders";
import ExnessTerminal from "./pages/trading/ExnessTerminal";
import NewAccount from "./pages/trading/NewAccount";

// Payments & Wallet components
import Deposit from "./pages/payments-wallet/Deposit";
import Withdrawal from "./pages/payments-wallet/Withdrawal";
import TransactionHistory from "./pages/payments-wallet/TransactionHistory";
import CryptoWallet from "./pages/payments-wallet/CryptoWallet";

// Analytics components
import AnalystViews from "./pages/analytics/AnalystViews";
import MarketNews from "./pages/analytics/MarketNews";
import EconomicCalendar from "./pages/analytics/EconomicCalendar";

// Other components
import CopyTrading from "./pages/others/CopyTrading";
import SupportHub from "./pages/others/SupportHub";

// Settings components
import Profile from "./pages/settings/Profile";
import Security from "./pages/settings/Security";
import TradingTerminals from "./pages/settings/TradingTerminals";
import Transfer from "./pages/payments-wallet/Transfer";
import ReferEarn from "./pages/others/ReferEarn";

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
    <Navigate to={isAuthenticated ? "/trading/accounts" : "/login"} replace />
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
            ${sidebarCollapsed ? "lg:ml-16" : "lg:ml-68"}
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
            {/* Public routes - no layout */}
            <Route
              path="/login"
              element={
                <ProtectedRoute requireAuth={false}>
                  <Login />
                </ProtectedRoute>
              }
            />
            <Route
              path="/register"
              element={
                <ProtectedRoute requireAuth={false}>
                  <Register />
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

            {/* Protected routes with dashboard layout */}
            <Route element={<ProtectedDashboardLayout />}>
              {/* Trading Routes */}
              <Route path="/trading/accounts" element={<Accounts />} />
              <Route path="/trading/summary" element={<Summary />} />
              <Route
                path="/trading/history-of-orders"
                element={<HistoryOfOrders />}
              />
              <Route path="/trading/webtrading" element={<ExnessTerminal />} />
              <Route path="/trading/new-account" element={<NewAccount />} />

              {/* Payments & Wallet Routes */}
              <Route
                path="/payments-and-wallet/deposit"
                element={<Deposit />}
              />
              <Route
                path="/payments-and-wallet/withdrawal"
                element={<Withdrawal />}
              />
              <Route
                path="/payments-and-wallet/history"
                element={<TransactionHistory />}
              />
              {/* <Route
                path="/payments-and-wallet/wallet"
                element={<CryptoWallet />}
              /> */}
              <Route
                path="/payments-and-wallet/transfer"
                element={<Transfer />}
              />

              {/* Analytics Routes */}
              <Route
                path="/analytics/analyst-views"
                element={<AnalystViews />}
              />
              <Route path="/analytics/market-news" element={<MarketNews />} />
              <Route
                path="/analytics/economic-calendar"
                element={<EconomicCalendar />}
              />

              {/* Other Routes */}
              <Route path="/copy-trading" element={<CopyTrading />} />
              <Route path="/support-hub" element={<SupportHub />} />
              <Route path="/refer-earn" element={<ReferEarn />} />

              {/* Settings Routes */}
              <Route path="/settings/profile" element={<Profile />} />
              <Route path="/settings/security" element={<Security />} />
              <Route
                path="/settings/trading-terminals"
                element={<TradingTerminals />}
              />
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
