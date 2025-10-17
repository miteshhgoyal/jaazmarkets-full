// user/src/components/layout/Navbar.jsx
import React, { useState, useRef, useEffect } from "react";
import { DollarSign, User, LogOut, Menu, RefreshCw, Hash } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

const Navbar = ({ toggleSidebar, toggleSidebarCollapse, sidebarCollapsed }) => {
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [totalBalance, setTotalBalance] = useState(0);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [balanceCurrency, setBalanceCurrency] = useState("USD");
  const userMenuRef = useRef(null);

  // Get user info from auth context or localStorage
  const userInfo = user || {
    name: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")).firstName || "User"
      : "User",
    email: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")).email || "user@jaazmarkets.com"
      : "user@jaazmarkets.com",
    userId: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")).userId || "JZM00000000"
      : "JZM00000000",
  };

  // Fetch total balance from all Real accounts
  useEffect(() => {
    fetchTotalBalance();
  }, []);

  const fetchTotalBalance = async () => {
    setBalanceLoading(true);
    try {
      const response = await api.get("/account/my-accounts");

      if (response.data.success) {
        const accounts = response.data.data;

        // Filter only Real accounts (not Demo)
        const realAccounts = accounts.filter(
          (acc) => acc.accountType === "Real"
        );

        // Calculate total balance from all Real accounts
        let total = 0;
        let primaryCurrency = "USD";

        if (realAccounts.length > 0) {
          // Sum all real account balances
          total = realAccounts.reduce(
            (sum, account) => sum + (account.balance || 0),
            0
          );

          // Use the currency of the first real account
          primaryCurrency = realAccounts[0].currency || "USD";
        }

        setTotalBalance(total);
        setBalanceCurrency(primaryCurrency);
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      // Keep showing 0 if error
      setTotalBalance(0);
    } finally {
      setBalanceLoading(false);
    }
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
      setIsUserMenuOpen(false);
    }
  };

  // Format balance with currency
  const formatBalance = (balance, currency) => {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(balance);
  };

  return (
    <nav className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={toggleSidebar}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg lg:hidden"
          >
            <Menu size={20} />
          </button>

          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-xl px-0.5 font-black uppercase tracking-tighter bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600 bg-clip-text text-transparent transition-all duration-300">
              Jaaz Markets
            </h1>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* User ID - Hidden on small screens */}
          <div className="hidden md:flex items-center gap-2 text-slate-700 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 px-3 py-2 rounded-lg">
            <Hash size={14} className="text-blue-600" />
            <span className="font-mono text-xs font-semibold text-blue-700">
              {userInfo.userId}
            </span>
          </div>

          {/* Balance - Hidden on small screens */}
          <div className="hidden sm:flex items-center gap-2 text-slate-700 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
            <DollarSign size={16} />
            {balanceLoading ? (
              <span className="text-sm text-slate-400 flex items-center gap-1">
                <RefreshCw size={12} className="animate-spin" />
                Loading...
              </span>
            ) : (
              <>
                <span className="font-medium text-sm">
                  {formatBalance(totalBalance, balanceCurrency)}{" "}
                  {balanceCurrency}
                </span>
                <button
                  onClick={fetchTotalBalance}
                  className="p-0.5 hover:bg-slate-200 rounded transition-colors"
                  title="Refresh balance"
                >
                  <RefreshCw size={12} className="text-slate-500" />
                </button>
              </>
            )}
            <div
              className={`w-2 h-2 rounded-full ${
                totalBalance > 0 ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-300"
            >
              <User size={20} />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {userInfo.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-slate-900">
                        {userInfo.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {userInfo.email}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Hash size={12} className="text-blue-600" />
                        <span className="text-xs font-mono font-semibold text-blue-700">
                          {userInfo.userId}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Balance for mobile */}
                  <div className="sm:hidden mt-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-700">
                        <DollarSign size={16} />
                        {balanceLoading ? (
                          <span className="text-sm text-slate-400 flex items-center gap-1">
                            <RefreshCw size={12} className="animate-spin" />
                            Loading...
                          </span>
                        ) : (
                          <>
                            <span className="font-medium text-sm">
                              {formatBalance(totalBalance, balanceCurrency)}{" "}
                              {balanceCurrency}
                            </span>
                            <button
                              onClick={fetchTotalBalance}
                              className="p-0.5 hover:bg-slate-200 rounded transition-colors"
                              title="Refresh balance"
                            >
                              <RefreshCw size={12} className="text-slate-500" />
                            </button>
                          </>
                        )}
                      </div>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          totalBalance > 0 ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></div>
                    </div>
                  </div>

                  {/* User ID for mobile (shown when menu is open) */}
                  <div className="md:hidden mt-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 px-2 py-1.5 rounded-md">
                      <Hash size={12} className="text-blue-600" />
                      <span className="text-xs font-mono font-semibold text-blue-700">
                        {userInfo.userId}
                      </span>
                      <span className="ml-auto text-xs text-slate-500">
                        User ID
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sign Out */}
                <div className="border-t border-slate-100 pt-2">
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <LogOut size={16} />
                    {isLoggingOut ? "Signing Out..." : "Sign Out"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
