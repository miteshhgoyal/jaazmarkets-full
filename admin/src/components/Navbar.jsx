import React, { useState, useRef, useEffect } from "react";
import {
  DollarSign,
  Globe,
  HelpCircle,
  Bell,
  MoreHorizontal,
  User,
  LogOut,
  Settings,
  Users,
  Menu,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Navbar = ({ toggleSidebar, toggleSidebarCollapse, sidebarCollapsed }) => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);

  // Get user info from localStorage or use defaults
  const userInfo = user || {
    name: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")).name || "Admin"
      : "Admin",
    email: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")).email ||
        "admin@jaazmarkets.com"
      : "admin@jaazmarkets.com",
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
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
        <div className="flex items-center gap-2 sm:gap-4">
          {/* More Options Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-300"
            >
              <MoreHorizontal size={20} />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                  <Users size={16} />
                  Partnership
                </button>
              </div>
            )}
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
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-300 rounded-full flex items-center justify-center">
                      <User size={20} className="text-slate-600" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">
                        {userInfo.name}
                      </div>
                      <div className="text-sm text-slate-500">
                        {userInfo.email}
                      </div>
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
