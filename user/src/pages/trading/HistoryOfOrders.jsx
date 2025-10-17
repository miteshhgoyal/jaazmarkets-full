// user/src/pages/trading/HistoryOfOrders.jsx
import React, { useState, useEffect, useMemo } from "react";
import MetaHead from "../../components/MetaHead";
import PageHeader from "../../components/ui/PageHeader";
import Tabs from "../../components/ui/Tabs";
import { CSVLink } from "react-csv";
import api from "../../services/api";
import toast from "react-hot-toast";
import {
  Download,
  ChevronUp,
  ChevronDown,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";

// Symbol Icon Component
const SymbolIcon = ({ order }) => {
  if (order.symbolIcon) {
    return (
      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center p-0">
        <img
          src={order.symbolIcon}
          alt={order.symbol}
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  const fallbackText = order.symbol.charAt(0);
  return (
    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
      <span className="text-xs font-semibold text-blue-700">
        {fallbackText}
      </span>
    </div>
  );
};

const DAY_FILTERS = [
  { label: "Last 7 days", value: 7 },
  { label: "Last 30 days", value: 30 },
  { label: "Last 90 days", value: 90 },
  { label: "All time", value: null },
];

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

const HistoryOfOrders = () => {
  const [accounts, setAccounts] = useState([]);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedAccount, setSelectedAccount] = useState("all");
  const [selectedDays, setSelectedDays] = useState(null);
  const [activeTab, setActiveTab] = useState("closed");
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch accounts and trades
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch accounts
      const accountsResponse = await api.get("/account/my-accounts");

      // Fetch trades
      const tradesResponse = await api.get("/trades/my-trades", {
        params: {
          limit: 1000, // Get all trades for filtering
        },
      });

      if (accountsResponse.data.success) {
        setAccounts(accountsResponse.data.data);
      }

      if (tradesResponse.data.success) {
        setTrades(tradesResponse.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError(err.response?.data?.message || "Failed to load data");
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const orderTabs = [
    { id: "closed", label: "Closed orders" },
    { id: "open", label: "Open orders" },
  ];

  // Filter and format trades
  const allOrders = useMemo(() => {
    let filteredTrades = trades;

    // Filter by status (tab)
    filteredTrades = filteredTrades.filter((trade) =>
      activeTab === "closed"
        ? trade.status === "closed"
        : trade.status === "open"
    );

    // Filter by account
    if (selectedAccount !== "all") {
      filteredTrades = filteredTrades.filter(
        (trade) => trade.tradingAccountId?._id === selectedAccount
      );
    }

    // Filter by date
    if (selectedDays) {
      const now = new Date();
      filteredTrades = filteredTrades.filter((trade) => {
        const tradeDate = new Date(trade.openTime);
        const diffDays = (now - tradeDate) / (1000 * 3600 * 24);
        return diffDays <= selectedDays;
      });
    }

    // Map to order format
    return filteredTrades.map((trade) => ({
      id: trade._id,
      tradeId: trade.tradeId,
      symbol: trade.symbol,
      symbolIcon: trade.symbolIcon,
      type: trade.type === "buy" ? "Buy" : "Sell",
      openingTime: trade.openTime,
      closingTime: trade.closeTime,
      lots: trade.lots,
      openingPrice: trade.openPrice,
      closingPrice: trade.closePrice,
      profit: trade.profitLoss || 0,
      positionId: trade.tradeId,
      commission: trade.commission || 0,
      accountId: trade.tradingAccountId?._id,
      accountLogin: trade.tradingAccountId?.login,
    }));
  }, [trades, selectedAccount, selectedDays, activeTab]);

  // Sort orders
  const sortedOrders = useMemo(() => {
    if (!sortField) return allOrders;

    return [...allOrders].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "openingTime" || sortField === "closingTime") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });
  }, [allOrders, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = sortedOrders.slice(startIndex, endIndex);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedAccount, selectedDays, activeTab, itemsPerPage]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closedOrdersCsvHeaders = [
    { label: "Trade ID", key: "tradeId" },
    { label: "Symbol", key: "symbol" },
    { label: "Type", key: "type" },
    { label: "Opening Time (UTC)", key: "openingTime" },
    { label: "Closing Time (UTC)", key: "closingTime" },
    { label: "Lots", key: "lots" },
    { label: "Opening Price", key: "openingPrice" },
    { label: "Closing Price", key: "closingPrice" },
    { label: "Profit (USD)", key: "profit" },
  ];

  const openOrdersCsvHeaders = [
    { label: "Trade ID", key: "tradeId" },
    { label: "Symbol", key: "symbol" },
    { label: "Type", key: "type" },
    { label: "Opening Time (UTC)", key: "openingTime" },
    { label: "Lots", key: "lots" },
    { label: "Opening Price", key: "openingPrice" },
    { label: "Position ID", key: "positionId" },
    { label: "Commission (USD)", key: "commission" },
  ];

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date
      .toLocaleString("en-US", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      .replace(",", "");
  };

  if (loading) {
    return (
      <>
        <MetaHead
          title="Order History"
          description="Complete history of your trading orders, executed trades, and transaction records."
          keywords="order history, trade history, executed orders"
        />
        <PageHeader title="History of orders" />
        <div className="flex justify-center items-center mt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400"></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <MetaHead
          title="Order History"
          description="Complete history of your trading orders, executed trades, and transaction records."
          keywords="order history, trade history, executed orders"
        />
        <PageHeader title="History of orders" />
        <div className="flex flex-col justify-center items-center mt-20">
          <div className="text-red-600 mb-4">
            <svg
              className="w-16 h-16 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-center">Error loading data: {error}</p>
          </div>
          <button
            onClick={fetchData}
            className="px-6 py-2 bg-orange-400 hover:bg-orange-500 rounded-lg font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <MetaHead
        title="Order History"
        description="Complete history of your trading orders, executed trades, and transaction records."
        keywords="order history, trade history, executed orders"
      />

      <PageHeader title="History of orders" />

      <div className="">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-6">
          <div className="flex flex-col md:flex-row gap-2">
            <select
              className="w-full md:w-auto px-3 py-2 text-sm rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-orange-400"
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
            >
              <option value="all">All accounts</option>
              {accounts.map((acc) => (
                <option key={acc._id} value={acc._id}>
                  {acc.accountClass} {acc.platform} #{acc.login}
                </option>
              ))}
            </select>
            <select
              className="w-full md:w-auto px-3 py-2 text-sm rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-orange-400"
              value={selectedDays || ""}
              onChange={(e) =>
                setSelectedDays(e.target.value ? Number(e.target.value) : null)
              }
            >
              {DAY_FILTERS.map((f) => (
                <option key={f.label} value={f.value || ""}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          <CSVLink
            data={sortedOrders}
            headers={
              activeTab === "closed"
                ? closedOrdersCsvHeaders
                : openOrdersCsvHeaders
            }
            filename={`${activeTab}-orders-${
              new Date().toISOString().split("T")[0]
            }.csv`}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download CSV
          </CSVLink>
        </div>

        {accounts.length === 0 ? (
          <div className="flex justify-center items-center mt-10 bg-white rounded-xl border border-gray-200 p-12">
            <div className="text-center">
              <svg
                className="w-20 h-20 text-gray-400 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <p className="text-gray-500 text-lg mb-4">
                No trading accounts found
              </p>
              <p className="text-gray-400 text-sm mb-6">
                Create a trading account to start viewing your order history
              </p>
              <button
                onClick={() => (window.location.href = "/trading/new-account")}
                className="px-6 py-3 bg-orange-400 hover:bg-orange-500 text-gray-900 font-semibold rounded-lg transition-colors"
              >
                Create Account
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <Tabs
                tabs={orderTabs}
                activeTab={activeTab}
                onTabChange={(tab) => {
                  setActiveTab(tab);
                  setSortField(null);
                  setSortDirection("asc");
                }}
              />
            </div>

            {sortedOrders.length === 0 ? (
              <div className="flex justify-center items-center py-12">
                <p className="text-gray-500">
                  No {activeTab} orders found for selected filters
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  {activeTab === "closed" ? (
                    <ClosedOrdersTable
                      orders={paginatedOrders}
                      formatDateTime={formatDateTime}
                      onSort={handleSort}
                      sortField={sortField}
                      sortDirection={sortDirection}
                    />
                  ) : (
                    <OpenOrdersTable
                      orders={paginatedOrders}
                      formatDateTime={formatDateTime}
                      onSort={handleSort}
                      sortField={sortField}
                      sortDirection={sortDirection}
                    />
                  )}
                </div>

                {/* Pagination */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span>Rows per page:</span>
                    <select
                      className="px-2 py-1 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-orange-400"
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    >
                      {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-700">
                      {startIndex + 1}-{Math.min(endIndex, sortedOrders.length)}{" "}
                      of {sortedOrders.length}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronsLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      {renderPageNumbers(
                        currentPage,
                        totalPages,
                        handlePageChange
                      )}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronsRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

// Helper Components
const renderPageNumbers = (currentPage, totalPages, handlePageChange) => {
  const pages = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  if (startPage > 1) {
    pages.push(
      <button
        key={1}
        onClick={() => handlePageChange(1)}
        className="px-3 py-1 rounded-lg hover:bg-gray-200 text-sm"
      >
        1
      </button>
    );
    if (startPage > 2) {
      pages.push(
        <span key="e1" className="px-2 text-gray-500">
          ...
        </span>
      );
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(
      <button
        key={i}
        onClick={() => handlePageChange(i)}
        className={`px-3 py-1 rounded-lg text-sm ${
          currentPage === i
            ? "bg-orange-400 text-gray-900 font-medium"
            : "hover:bg-gray-200"
        }`}
      >
        {i}
      </button>
    );
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pages.push(
        <span key="e2" className="px-2 text-gray-500">
          ...
        </span>
      );
    }
    pages.push(
      <button
        key={totalPages}
        onClick={() => handlePageChange(totalPages)}
        className="px-3 py-1 rounded-lg hover:bg-gray-200 text-sm"
      >
        {totalPages}
      </button>
    );
  }

  return pages;
};

const SortIcon = ({ field, sortField, sortDirection }) => {
  if (sortField !== field) {
    return <ChevronDown className="w-3 h-3 text-gray-400" />;
  }
  return sortDirection === "asc" ? (
    <ChevronUp className="w-3 h-3 text-gray-700" />
  ) : (
    <ChevronDown className="w-3 h-3 text-gray-700" />
  );
};

const ClosedOrdersTable = ({
  orders,
  formatDateTime,
  onSort,
  sortField,
  sortDirection,
}) => {
  return (
    <table className="w-full text-sm">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <th
            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            onClick={() => onSort("symbol")}
          >
            <div className="flex items-center gap-1">
              Symbol
              <SortIcon
                field="symbol"
                sortField={sortField}
                sortDirection={sortDirection}
              />
            </div>
          </th>
          <th
            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            onClick={() => onSort("type")}
          >
            <div className="flex items-center gap-1">
              Type
              <SortIcon
                field="type"
                sortField={sortField}
                sortDirection={sortDirection}
              />
            </div>
          </th>
          <th
            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            onClick={() => onSort("openingTime")}
          >
            <div className="flex items-center gap-1">
              Opening time, UTC
              <SortIcon
                field="openingTime"
                sortField={sortField}
                sortDirection={sortDirection}
              />
            </div>
          </th>
          <th
            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            onClick={() => onSort("closingTime")}
          >
            <div className="flex items-center gap-1">
              Closing time, UTC
              <SortIcon
                field="closingTime"
                sortField={sortField}
                sortDirection={sortDirection}
              />
            </div>
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Lots
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Opening price
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Closing price
          </th>
          <th
            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            onClick={() => onSort("profit")}
          >
            <div className="flex items-center gap-1">
              Profit, USD
              <SortIcon
                field="profit"
                sortField={sortField}
                sortDirection={sortDirection}
              />
            </div>
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {orders.map((order) => (
          <tr key={order.id} className="hover:bg-gray-50">
            <td className="px-4 py-3 whitespace-nowrap">
              <div className="flex items-center gap-2">
                <SymbolIcon order={order} />
                <span className="text-sm text-gray-900">{order.symbol}</span>
              </div>
            </td>
            <td className="px-4 py-3 whitespace-nowrap">
              <span
                className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                  order.type === "Buy"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {order.type}
              </span>
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
              {formatDateTime(order.openingTime)}
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
              {formatDateTime(order.closingTime)}
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
              {order.lots}
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
              {order.openingPrice?.toFixed(5)}
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
              {order.closingPrice?.toFixed(5)}
            </td>
            <td className="px-4 py-3 whitespace-nowrap">
              <span
                className={`text-sm font-medium ${
                  order.profit >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {order.profit >= 0 ? "+" : ""}
                {order.profit.toFixed(2)}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const OpenOrdersTable = ({
  orders,
  formatDateTime,
  onSort,
  sortField,
  sortDirection,
}) => {
  return (
    <table className="w-full text-sm">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <th
            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            onClick={() => onSort("symbol")}
          >
            <div className="flex items-center gap-1">
              Symbol
              <SortIcon
                field="symbol"
                sortField={sortField}
                sortDirection={sortDirection}
              />
            </div>
          </th>
          <th
            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            onClick={() => onSort("type")}
          >
            <div className="flex items-center gap-1">
              Type
              <SortIcon
                field="type"
                sortField={sortField}
                sortDirection={sortDirection}
              />
            </div>
          </th>
          <th
            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            onClick={() => onSort("openingTime")}
          >
            <div className="flex items-center gap-1">
              Opening time, UTC
              <SortIcon
                field="openingTime"
                sortField={sortField}
                sortDirection={sortDirection}
              />
            </div>
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Lots
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Opening price
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Position ID
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Commission, USD
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {orders.map((order) => (
          <tr key={order.id} className="hover:bg-gray-50">
            <td className="px-4 py-3 whitespace-nowrap">
              <div className="flex items-center gap-2">
                <SymbolIcon order={order} />
                <span className="text-sm text-gray-900">{order.symbol}</span>
              </div>
            </td>
            <td className="px-4 py-3 whitespace-nowrap">
              <span
                className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                  order.type === "Buy"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {order.type}
              </span>
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
              {formatDateTime(order.openingTime)}
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
              {order.lots}
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
              {order.openingPrice?.toFixed(5)}
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
              {order.positionId}
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
              {order.commission.toFixed(2)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default HistoryOfOrders;
