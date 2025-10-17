// pages/admin/analytics/TradesAndOrders.jsx
import React, { useState, useEffect, useMemo } from "react";
import MetaHead from "../../components/MetaHead";
import PageHeader from "../../components/ui/PageHeader";
import api from "../../services/api";
import { CSVLink } from "react-csv";
import {
  Download,
  ChevronUp,
  ChevronDown,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Search,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  BarChart3,
  Package,
  CheckCircle,
  XCircle,
  Eye,
  X,
} from "lucide-react";

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

const STATUS_FILTERS = [
  { label: "All Status", value: "all" },
  { label: "Executed", value: "executed" },
  { label: "Pending", value: "pending" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Expired", value: "expired" },
];

const TYPE_FILTERS = [
  { label: "All Types", value: "all" },
  { label: "Buy Limit", value: "buy_limit" },
  { label: "Sell Limit", value: "sell_limit" },
  { label: "Buy Stop", value: "buy_stop" },
  { label: "Sell Stop", value: "sell_stop" },
];

const TRADE_STATUS_FILTERS = [
  { label: "All Trades", value: "all" },
  { label: "Open", value: "open" },
  { label: "Closed", value: "closed" },
];

const TradesAndOrders = () => {
  const [orders, setOrders] = useState([]);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [tradeStatusFilter, setTradeStatusFilter] = useState("all");

  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [viewModalData, setViewModalData] = useState(null);

  // Fetch data
  const fetchData = async () => {
    try {
      setError(null);
      const [ordersResponse, tradesResponse] = await Promise.all([
        api.get("/admin/orders"),
        api.get("/admin/trades"),
      ]);

      if (ordersResponse.data.success) {
        setOrders(ordersResponse.data.data || []);
      }
      if (tradesResponse.data.success) {
        setTrades(tradesResponse.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const executedOrders = orders.filter((o) => o.status === "executed").length;
    const pendingOrders = orders.filter((o) => o.status === "pending").length;
    const totalOrderVolume = orders.reduce(
      (sum, o) => sum + (o.volume || 0),
      0
    );

    const totalTrades = trades.length;
    const openTrades = trades.filter((t) => t.status === "open").length;
    const closedTrades = trades.filter((t) => t.status === "closed").length;
    const totalTradeVolume = trades.reduce(
      (sum, t) => sum + (t.volume || 0),
      0
    );
    const totalProfitLoss = trades
      .filter((t) => t.status === "closed")
      .reduce((sum, t) => sum + (t.profitLoss || 0), 0);
    const totalSpread = trades.reduce((sum, t) => {
      if (t.closePrice && t.openPrice) {
        return sum + Math.abs(t.closePrice - t.openPrice);
      }
      return sum;
    }, 0);
    const avgSpread = totalTrades > 0 ? totalSpread / totalTrades : 0;

    const winningTrades = trades.filter(
      (t) => t.status === "closed" && (t.profitLoss || 0) > 0
    ).length;
    const losingTrades = trades.filter(
      (t) => t.status === "closed" && (t.profitLoss || 0) < 0
    ).length;

    return {
      totalOrders,
      executedOrders,
      pendingOrders,
      totalOrderVolume,
      totalTrades,
      openTrades,
      closedTrades,
      totalTradeVolume,
      totalProfitLoss,
      avgSpread,
      winningTrades,
      losingTrades,
    };
  }, [orders, trades]);

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        order.orderId?.toLowerCase().includes(searchLower) ||
        order.symbol?.toLowerCase().includes(searchLower) ||
        order.userId?.email?.toLowerCase().includes(searchLower);

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      const matchesType = typeFilter === "all" || order.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [orders, searchQuery, statusFilter, typeFilter]);

  // Filter trades
  const filteredTrades = useMemo(() => {
    return trades.filter((trade) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        trade.tradeId?.toLowerCase().includes(searchLower) ||
        trade.symbol?.toLowerCase().includes(searchLower) ||
        trade.userId?.email?.toLowerCase().includes(searchLower);

      const matchesStatus =
        tradeStatusFilter === "all" || trade.status === tradeStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [trades, searchQuery, tradeStatusFilter]);

  // Sort function
  const sortData = (data) => {
    if (!sortField) return data;

    return [...data].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (aValue === null || aValue === undefined) aValue = "";
      if (bValue === null || bValue === undefined) bValue = "";

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      if (sortDirection === "asc") {
        return aStr > bStr ? 1 : -1;
      }
      return aStr < bStr ? 1 : -1;
    });
  };

  const sortedOrders = sortData(filteredOrders);
  const sortedTrades = sortData(filteredTrades);

  // Pagination
  const getCurrentPageData = (data) => {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return {
      data: data.slice(startIndex, endIndex),
      totalPages,
      startIndex,
      endIndex,
    };
  };

  const { data: paginatedOrders, totalPages: ordersTotalPages } =
    getCurrentPageData(sortedOrders);
  const { data: paginatedTrades, totalPages: tradesTotalPages } =
    getCurrentPageData(sortedTrades);

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

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    statusFilter,
    typeFilter,
    tradeStatusFilter,
    itemsPerPage,
    activeTab,
  ]);

  if (loading) {
    return (
      <>
        <MetaHead
          title="Trades & Orders"
          description="View all trades and orders"
          keywords="trades, orders, analytics"
        />
        <PageHeader
          title="Trades & Orders"
          subtitle="Monitor all trading activity and order flow"
        />
        <div className="flex justify-center items-center mt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <MetaHead
          title="Trades & Orders"
          description="View all trades and orders"
          keywords="trades, orders, analytics"
        />
        <PageHeader
          title="Trades & Orders"
          subtitle="Monitor all trading activity and order flow"
        />
        <div className="flex flex-col justify-center items-center mt-20">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
        title="Trades & Orders"
        description="View all trades and orders"
        keywords="trades, orders, analytics"
      />
      <PageHeader
        title="Trades & Orders"
        subtitle="Monitor all trading activity and order flow"
      />

      {/* Stats Overview */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          subtitle={`${stats.executedOrders} executed, ${stats.pendingOrders} pending`}
          icon={<Package className="w-5 h-5" />}
          color="blue"
        />
        <StatCard
          title="Total Order Volume"
          value={stats.totalOrderVolume.toFixed(2)}
          subtitle="Lots"
          icon={<BarChart3 className="w-5 h-5" />}
          color="purple"
        />
        <StatCard
          title="Total Trades"
          value={stats.totalTrades}
          subtitle={`${stats.openTrades} open, ${stats.closedTrades} closed`}
          icon={<Activity className="w-5 h-5" />}
          color="green"
        />
        <StatCard
          title="Total Trade Volume"
          value={stats.totalTradeVolume.toFixed(2)}
          subtitle="Lots"
          icon={<TrendingUp className="w-5 h-5" />}
          color="orange"
        />
      </div>

      {/* Second row stats */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total P/L"
          value={`$${stats.totalProfitLoss.toFixed(2)}`}
          subtitle={stats.totalProfitLoss >= 0 ? "Profit" : "Loss"}
          icon={
            stats.totalProfitLoss >= 0 ? (
              <TrendingUp className="w-5 h-5" />
            ) : (
              <TrendingDown className="w-5 h-5" />
            )
          }
          color={stats.totalProfitLoss >= 0 ? "green" : "red"}
        />
        <StatCard
          title="Average Spread"
          value={stats.avgSpread.toFixed(5)}
          subtitle="Pips"
          icon={<DollarSign className="w-5 h-5" />}
          color="indigo"
        />
        <StatCard
          title="Winning Trades"
          value={stats.winningTrades}
          subtitle={`${(
            (stats.winningTrades / (stats.closedTrades || 1)) *
            100
          ).toFixed(1)}% win rate`}
          icon={<CheckCircle className="w-5 h-5" />}
          color="green"
        />
        <StatCard
          title="Losing Trades"
          value={stats.losingTrades}
          subtitle={`${(
            (stats.losingTrades / (stats.closedTrades || 1)) *
            100
          ).toFixed(1)}% loss rate`}
          icon={<XCircle className="w-5 h-5" />}
          color="red"
        />
      </div>

      {/* Tabs */}
      <div className="mt-6 border-b border-gray-200">
        <nav className="flex gap-4">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "overview"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "orders"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("trades")}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "trades"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Trades ({trades.length})
          </button>
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="mt-6 space-y-6">
          {/* Recent Orders */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Orders
              </h3>
              <button
                onClick={() => setActiveTab("orders")}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View All →
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Symbol
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Volume
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap font-mono text-xs">
                        {order.orderId}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-medium">
                        {order.symbol}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <TypeBadge type={order.type} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {order.volume} lots
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <StatusBadge status={order.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Trades */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Trades
              </h3>
              <button
                onClick={() => setActiveTab("trades")}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View All →
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Trade ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Symbol
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Volume
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      P/L
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {trades.slice(0, 5).map((trade) => (
                    <tr key={trade._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap font-mono text-xs">
                        {trade.tradeId}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-medium">
                        {trade.symbol}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <TypeBadge type={trade.type} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {trade.volume} lots
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`font-semibold ${
                            (trade.profitLoss || 0) >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          ${(trade.profitLoss || 0).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <TradeStatusBadge status={trade.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <OrdersTable
          orders={paginatedOrders}
          sortedOrders={sortedOrders}
          allOrders={orders}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          refreshing={refreshing}
          handleRefresh={handleRefresh}
          sortField={sortField}
          sortDirection={sortDirection}
          handleSort={handleSort}
          setViewModalData={setViewModalData}
          currentPage={currentPage}
          totalPages={ordersTotalPages}
          handlePageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
        />
      )}

      {/* Trades Tab */}
      {activeTab === "trades" && (
        <TradesTable
          trades={paginatedTrades}
          sortedTrades={sortedTrades}
          allTrades={trades}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          tradeStatusFilter={tradeStatusFilter}
          setTradeStatusFilter={setTradeStatusFilter}
          refreshing={refreshing}
          handleRefresh={handleRefresh}
          sortField={sortField}
          sortDirection={sortDirection}
          handleSort={handleSort}
          setViewModalData={setViewModalData}
          currentPage={currentPage}
          totalPages={tradesTotalPages}
          handlePageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
        />
      )}

      {/* View Modal */}
      {viewModalData && (
        <ViewModal
          data={viewModalData}
          onClose={() => setViewModalData(null)}
        />
      )}
    </>
  );
};

// Helper Components
const StatCard = ({ title, value, subtitle, icon, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600",
    indigo: "bg-indigo-50 text-indigo-600",
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${colors[color]}`}>{icon}</div>
      </div>
    </div>
  );
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

const StatusBadge = ({ status }) => {
  const styles = {
    executed: "bg-green-100 text-green-700",
    pending: "bg-orange-100 text-orange-700",
    cancelled: "bg-red-100 text-red-700",
    expired: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
    </span>
  );
};

const TradeStatusBadge = ({ status }) => {
  const styles = {
    open: "bg-blue-100 text-blue-700",
    closed: "bg-gray-100 text-gray-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
    </span>
  );
};

const TypeBadge = ({ type }) => {
  const isBuy = type?.toLowerCase().includes("buy");
  return (
    <span
      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
        isBuy ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {type?.replace("_", " ").toUpperCase()}
    </span>
  );
};

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronsLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <span className="text-sm text-gray-700 px-2">
        Page {currentPage} of {totalPages || 1}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage >= totalPages}
        className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronsRight className="w-4 h-4" />
      </button>
    </div>
  );
};

// Orders Table Component
const OrdersTable = ({
  orders,
  sortedOrders,
  allOrders,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  refreshing,
  handleRefresh,
  sortField,
  sortDirection,
  handleSort,
  setViewModalData,
  currentPage,
  totalPages,
  handlePageChange,
  itemsPerPage,
  setItemsPerPage,
}) => {
  const ordersCSVHeaders = [
    { label: "Order ID", key: "orderId" },
    { label: "Symbol", key: "symbol" },
    { label: "Type", key: "type" },
    { label: "Volume", key: "volume" },
    { label: "Price", key: "orderPrice" },
    { label: "Status", key: "status" },
  ];

  return (
    <div className="mt-6 space-y-4">
      {/* Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order ID, symbol, or user email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex flex-col md:flex-row gap-2 flex-1">
            <select
              className="w-full md:w-auto px-3 py-2 text-sm rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {STATUS_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>

            <select
              className="w-full md:w-auto px-3 py-2 text-sm rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-blue-500"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              {TYPE_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
            <CSVLink
              data={sortedOrders}
              headers={ordersCSVHeaders}
              filename={`orders-${new Date().toISOString().split("T")[0]}.csv`}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </CSVLink>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {orders.length} of {sortedOrders.length} orders
            {sortedOrders.length !== allOrders.length &&
              ` (filtered from ${allOrders.length} total)`}
          </span>
        </div>
      </div>

      {/* Orders Table */}
      {sortedOrders.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12">
          <div className="text-center">
            <p className="text-gray-500">
              No orders found matching your filters
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("orderId")}
                  >
                    <div className="flex items-center gap-1">
                      Order ID
                      <SortIcon
                        field="orderId"
                        sortField={sortField}
                        sortDirection={sortDirection}
                      />
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("symbol")}
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("volume")}
                  >
                    <div className="flex items-center gap-1">
                      Volume
                      <SortIcon
                        field="volume"
                        sortField={sortField}
                        sortDirection={sortDirection}
                      />
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("orderPrice")}
                  >
                    <div className="flex items-center gap-1">
                      Price
                      <SortIcon
                        field="orderPrice"
                        sortField={sortField}
                        sortDirection={sortDirection}
                      />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    TP / SL
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center gap-1">
                      Status
                      <SortIcon
                        field="status"
                        sortField={sortField}
                        sortDirection={sortDirection}
                      />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap font-mono text-xs text-gray-900">
                      {order.orderId}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-semibold text-gray-900">
                      {order.symbol}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <TypeBadge type={order.type} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                      {order.volume || order.lots || 0} lots
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">
                      ${order.orderPrice?.toFixed(2) || "0.00"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-600">
                      <div>TP: ${order.takeProfit?.toFixed(2) || "N/A"}</div>
                      <div>SL: ${order.stopLoss?.toFixed(2) || "N/A"}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() =>
                          setViewModalData({ type: "order", data: order })
                        }
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span>Rows per page:</span>
              <select
                className="px-2 py-1 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
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

            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Trades Table Component
const TradesTable = ({
  trades,
  sortedTrades,
  allTrades,
  searchQuery,
  setSearchQuery,
  tradeStatusFilter,
  setTradeStatusFilter,
  refreshing,
  handleRefresh,
  sortField,
  sortDirection,
  handleSort,
  setViewModalData,
  currentPage,
  totalPages,
  handlePageChange,
  itemsPerPage,
  setItemsPerPage,
}) => {
  const tradesCSVHeaders = [
    { label: "Trade ID", key: "tradeId" },
    { label: "Symbol", key: "symbol" },
    { label: "Type", key: "type" },
    { label: "Volume", key: "volume" },
    { label: "Open Price", key: "openPrice" },
    { label: "Close Price", key: "closePrice" },
    { label: "Profit/Loss", key: "profitLoss" },
    { label: "Status", key: "status" },
  ];

  return (
    <div className="mt-6 space-y-4">
      {/* Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by trade ID, symbol, or user email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex flex-col md:flex-row gap-2 flex-1">
            <select
              className="w-full md:w-auto px-3 py-2 text-sm rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-blue-500"
              value={tradeStatusFilter}
              onChange={(e) => setTradeStatusFilter(e.target.value)}
            >
              {TRADE_STATUS_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
            <CSVLink
              data={sortedTrades}
              headers={tradesCSVHeaders}
              filename={`trades-${new Date().toISOString().split("T")[0]}.csv`}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </CSVLink>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {trades.length} of {sortedTrades.length} trades
            {sortedTrades.length !== allTrades.length &&
              ` (filtered from ${allTrades.length} total)`}
          </span>
        </div>
      </div>

      {/* Trades Table */}
      {sortedTrades.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12">
          <div className="text-center">
            <p className="text-gray-500">
              No trades found matching your filters
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("tradeId")}
                  >
                    <div className="flex items-center gap-1">
                      Trade ID
                      <SortIcon
                        field="tradeId"
                        sortField={sortField}
                        sortDirection={sortDirection}
                      />
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("symbol")}
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("volume")}
                  >
                    <div className="flex items-center gap-1">
                      Volume
                      <SortIcon
                        field="volume"
                        sortField={sortField}
                        sortDirection={sortDirection}
                      />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Open Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Close Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Spread
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("profitLoss")}
                  >
                    <div className="flex items-center gap-1">
                      P/L
                      <SortIcon
                        field="profitLoss"
                        sortField={sortField}
                        sortDirection={sortDirection}
                      />
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center gap-1">
                      Status
                      <SortIcon
                        field="status"
                        sortField={sortField}
                        sortDirection={sortDirection}
                      />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {trades.map((trade) => {
                  const spread =
                    trade.closePrice && trade.openPrice
                      ? Math.abs(trade.closePrice - trade.openPrice).toFixed(5)
                      : "N/A";

                  return (
                    <tr key={trade._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap font-mono text-xs text-gray-900">
                        {trade.tradeId}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-semibold text-gray-900">
                        {trade.symbol}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <TypeBadge type={trade.type} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                        {trade.volume || trade.lots || 0} lots
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">
                        ${trade.openPrice?.toFixed(2) || "0.00"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">
                        {trade.closePrice
                          ? `$${trade.closePrice.toFixed(2)}`
                          : "-"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-600">
                        {spread}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`font-semibold ${
                            (trade.profitLoss || 0) >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          ${(trade.profitLoss || 0).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <TradeStatusBadge status={trade.status} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          onClick={() =>
                            setViewModalData({ type: "trade", data: trade })
                          }
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span>Rows per page:</span>
              <select
                className="px-2 py-1 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
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

            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// View Modal
const ViewModal = ({ data, onClose }) => {
  const { type, data: item } = data;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">
            {type === "order" ? "Order" : "Trade"} Details
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">ID</p>
              <p className="font-mono text-sm text-gray-900">
                {type === "order" ? item.orderId : item.tradeId}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Symbol</p>
              <p className="font-semibold text-gray-900">{item.symbol}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Type</p>
              <TypeBadge type={item.type} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Volume</p>
              <p className="text-gray-900">{item.volume || item.lots} lots</p>
            </div>
            {type === "order" && (
              <>
                <div>
                  <p className="text-sm text-gray-600">Order Price</p>
                  <p className="font-semibold text-gray-900">
                    ${item.orderPrice?.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <StatusBadge status={item.status} />
                </div>
              </>
            )}
            {type === "trade" && (
              <>
                <div>
                  <p className="text-sm text-gray-600">Open Price</p>
                  <p className="font-semibold text-gray-900">
                    ${item.openPrice?.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Close Price</p>
                  <p className="font-semibold text-gray-900">
                    {item.closePrice ? `$${item.closePrice.toFixed(2)}` : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Profit/Loss</p>
                  <p
                    className={`font-semibold ${
                      (item.profitLoss || 0) >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    ${(item.profitLoss || 0).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <TradeStatusBadge status={item.status} />
                </div>
              </>
            )}
            <div>
              <p className="text-sm text-gray-600">Take Profit</p>
              <p className="text-gray-900">
                ${item.takeProfit?.toFixed(2) || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Stop Loss</p>
              <p className="text-gray-900">
                ${item.stopLoss?.toFixed(2) || "N/A"}
              </p>
            </div>
            {item.platform && (
              <div>
                <p className="text-sm text-gray-600">Platform</p>
                <p className="text-gray-900">{item.platform}</p>
              </div>
            )}
            {item.comment && (
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Comment</p>
                <p className="text-gray-900">{item.comment}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradesAndOrders;
