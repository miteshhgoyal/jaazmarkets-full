import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  TrendingUp,
  ArrowUpDown,
  History,
  Wallet,
  BarChart3,
  Copy,
  Heart,
  Settings,
  User,
  Shield,
  Terminal,
  FileText,
  Server,
  X,
  ChevronRight,
  ChevronDown,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Clock,
  CreditCard,
  Plus,
  Minus,
  UserCircle,
  Bell,
  Palette,
  Globe,
  Calendar,
  FileBarChart,
  BookOpen,
  DollarSign,
  WalletCards,
  Bitcoin,
  LineChart,
  Newspaper,
  CalendarDays,
  Users,
  Users2,
  GraduationCap,
} from "lucide-react";

const Sidebar = ({ isOpen, onToggle, isCollapsed, toggleCollapsed }) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});

  const navigationLinks = [
    {
      name: "Trading",
      href: "/trading",
      icon: TrendingUp, // Changed from BarChart3 to TrendingUp for trading
      subItems: [
        { name: "My Accounts", href: "/trading/accounts" },
        { name: "Summary", href: "/trading/summary" },
        {
          name: "History of orders",
          href: "/trading/history-of-orders",
        },
      ],
    },
    {
      name: "Payments & wallet",
      href: "/payments-and-wallet",
      icon: WalletCards, // Changed from BarChart3 to WalletCards for payments & wallet
      subItems: [
        { name: "Deposit", href: "/payments-and-wallet/deposit" },
        { name: "Withdrawal", href: "/payments-and-wallet/withdrawal" },
        {
          name: "Transaction History",
          href: "/payments-and-wallet/history",
        },
        {
          name: "Transfer",
          href: "/payments-and-wallet/transfer",
        },
      ],
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: LineChart, // Changed from BarChart3 to LineChart for analytics
      subItems: [
        { name: "Analyst Views", href: "/analytics/analyst-views" },
        { name: "Market News", href: "/analytics/market-news" },
        // {
        //   name: "Economic Calendar",
        //   href: "/analytics/economic-calendar",
        // },
      ],
    },
    {
      name: "Refer & Earn",
      href: "/refer-earn",
      icon: Users2,
    },
    {
      name: "Education",
      href: "/education",
      icon: GraduationCap,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings, // Keeping Settings as it's appropriate
      subItems: [
        { name: "Profile", href: "/settings/profile" },
        { name: "Security", href: "/settings/security" },
      ],
    },
  ];

  const isActiveLink = (href) => location.pathname === href;
  const hasActiveSubItem = (subItems) => {
    if (!subItems) return false;
    return subItems.some((item) => location.pathname === item.href);
  };

  const toggleMenu = (itemName) => {
    if (isCollapsed) return;
    setExpandedMenus((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-slate-200 z-50 
          transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "w-16" : "w-68"}
          lg:translate-x-0
        `}
      >
        {/* Sidebar Header with Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          {!isCollapsed && (
            <span className="font-semibold text-slate-900 text-sm">
              Navigation
            </span>
          )}

          {/* Toggle Button - Always visible */}
          <button
            onClick={toggleCollapsed}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors hidden lg:block"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <PanelLeftOpen size={18} />
            ) : (
              <PanelLeftClose size={18} />
            )}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={onToggle}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100%-80px)]">
          {navigationLinks.map((item) => {
            const Icon = item.icon;
            const active =
              isActiveLink(item.href) || hasActiveSubItem(item.subItems);
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isExpanded =
              expandedMenus[item.name] ||
              (active && hasSubItems && !isCollapsed);

            return (
              <div key={item.name}>
                {/* Main Menu Item */}
                <div className="relative group">
                  {hasSubItems ? (
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className={`
                        w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left
                        ${isCollapsed ? "justify-center" : ""}
                        ${
                          active
                            ? "bg-primary-light text-primary border-r-3 border-primary"
                            : "text-slate-700 hover:bg-slate-50"
                        }
                      `}
                    >
                      <Icon size={20} className="flex-shrink-0" />
                      {!isCollapsed && (
                        <>
                          <div className="flex-1 flex items-center justify-between">
                            <span className="font-medium text-sm">
                              {item.name}
                            </span>
                            <div className="flex items-center gap-2">
                              {item.badge && (
                                <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">
                                  {item.badge}
                                </span>
                              )}
                              {isExpanded ? (
                                <ChevronDown
                                  size={16}
                                  className="text-slate-400"
                                />
                              ) : (
                                <ChevronRight
                                  size={16}
                                  className="text-slate-400"
                                />
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </button>
                  ) : (
                    <Link
                      to={item.href}
                      onClick={() => window.innerWidth < 1024 && onToggle()}
                      className={`
                        flex items-center gap-3 p-3 rounded-lg transition-colors
                        ${isCollapsed ? "justify-center" : ""}
                        ${
                          active
                            ? "bg-primary-light text-primary border-r-3 border-primary"
                            : "text-slate-700 hover:bg-slate-50"
                        }
                      `}
                    >
                      <Icon size={20} className="flex-shrink-0" />
                      {!isCollapsed && (
                        <div className="flex-1 flex items-center justify-between">
                          <span className="font-medium text-sm">
                            {item.name}
                          </span>
                          {item.badge && (
                            <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </Link>
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full top-0 ml-3 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-60 hidden lg:block shadow-lg">
                      <div className="font-medium">{item.name}</div>
                      {item.badge && (
                        <div className="text-xs text-blue-300 mt-1">
                          {item.badge}
                        </div>
                      )}
                      {hasSubItems && (
                        <div className="text-xs text-slate-300 mt-2 space-y-1">
                          {item.subItems.map((subItem, idx) => (
                            <div key={idx}>{subItem.name}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Submenu */}
                {hasSubItems && !isCollapsed && isExpanded && (
                  <div className="ml-8 mt-1 space-y-1 border-l-2 border-slate-100 pl-4">
                    {item.subItems.map((subItem, index) => (
                      <Link
                        key={index}
                        to={subItem.href}
                        onClick={() => window.innerWidth < 1024 && onToggle()}
                        className={`
                          block p-3 rounded-lg text-sm transition-colors
                          ${
                            isActiveLink(subItem.href)
                              ? "bg-primary-light text-primary font-medium"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          }
                        `}
                      >
                        <div>{subItem.name}</div>
                        {subItem.description && (
                          <div className="text-xs text-slate-500 mt-1">
                            {subItem.description}
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
