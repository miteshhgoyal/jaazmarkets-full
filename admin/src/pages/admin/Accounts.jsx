// pages/admin/accounts/Accounts.jsx
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
  Eye,
  Edit,
  Trash2,
  Search,
  X,
  Save,
  AlertTriangle,
  RefreshCw,
  Plus,
  TrendingUp,
  DollarSign,
  Shield,
  User,
  CheckCircle,
  XCircle,
  Lock,
  Key,
  Server,
  Activity,
} from "lucide-react";

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

const STATUS_FILTERS = [
  { label: "All Status", value: "all" },
  { label: "Active", value: "active" },
  { label: "Suspended", value: "suspended" },
  { label: "Closed", value: "closed" },
];

const ACCOUNT_TYPE_FILTERS = [
  { label: "All Types", value: "all" },
  { label: "Real", value: "Real" },
  { label: "Demo", value: "Demo" },
];

const PLATFORM_FILTERS = [
  { label: "All Platforms", value: "all" },
  { label: "MT4", value: "MT4" },
  { label: "MT5", value: "MT5" },
  { label: "cTrader", value: "cTrader" },
];

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [accountTypeFilter, setAccountTypeFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalAccounts, setTotalAccounts] = useState(0);

  // Modal states
  const [viewModalAccount, setViewModalAccount] = useState(null);
  const [editModalAccount, setEditModalAccount] = useState(null);
  const [deleteModalAccount, setDeleteModalAccount] = useState(null);

  // Fetch all accounts from API
  const fetchAccounts = async () => {
    try {
      setError(null);
      const response = await api.get("/account/admin/all", {
        params: {
          page: currentPage,
          limit: 1000, // Get all for client-side filtering
        },
      });

      if (response.data.data && Array.isArray(response.data.data)) {
        setAccounts(response.data.data);
        setTotalAccounts(response.data.total || response.data.data.length);
      } else {
        setAccounts([]);
      }
    } catch (err) {
      console.error("Error fetching accounts:", err);
      setError(err.response?.data?.message || "Failed to fetch accounts");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAccounts();
  };

  // Fetch single account by ID
  const fetchAccountById = async (accountId) => {
    try {
      const response = await api.get(`/account/admin/${accountId}`);
      return response.data.data;
    } catch (err) {
      console.error("Error fetching account:", err);
      throw err;
    }
  };

  // Open view modal
  const handleViewAccount = async (account) => {
    try {
      const fullData = await fetchAccountById(account._id || account.id);
      setViewModalAccount(fullData);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to fetch account details");
    }
  };

  // Open edit modal
  const handleEditAccount = async (account) => {
    try {
      const fullData = await fetchAccountById(account._id || account.id);
      setEditModalAccount(fullData);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to fetch account details");
    }
  };

  // Update account
  const handleUpdateAccount = async (accountId, updatedData) => {
    try {
      const response = await api.put(
        `/account/admin/${accountId}`,
        updatedData
      );
      if (response.data.success) {
        await fetchAccounts();
        return true;
      }
    } catch (err) {
      console.error("Error updating account:", err);
      throw err;
    }
  };

  // Delete account
  const handleDeleteAccount = async (accountId) => {
    try {
      const response = await api.delete(`/account/admin/${accountId}`);
      if (response.data.success) {
        setAccounts(accounts.filter((a) => (a._id || a.id) !== accountId));
        return true;
      }
    } catch (err) {
      console.error("Error deleting account:", err);
      throw err;
    }
  };

  // Quick toggle status
  const handleQuickToggleStatus = async (accountId, currentStatus) => {
    const statusCycle = {
      active: "suspended",
      suspended: "closed",
      closed: "active",
    };
    const newStatus = statusCycle[currentStatus] || "active";
    try {
      await api.patch(`/account/admin/${accountId}/status`, {
        status: newStatus,
      });
      await fetchAccounts();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  // Quick update balance
  const handleQuickUpdateBalance = async (accountId, currentBalance) => {
    const newBalance = prompt("Enter new balance:", currentBalance);
    if (newBalance !== null && !isNaN(newBalance)) {
      try {
        await api.patch(`/account/admin/${accountId}/balance`, {
          balance: parseFloat(newBalance),
          equity: parseFloat(newBalance),
          freeMargin: parseFloat(newBalance),
        });
        await fetchAccounts();
      } catch (err) {
        alert(err.response?.data?.message || "Failed to update balance");
      }
    }
  };

  // Filter and search
  const filteredAccounts = useMemo(() => {
    return accounts.filter((account) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        account.accountNumber?.toLowerCase().includes(searchLower) ||
        account.login?.toLowerCase().includes(searchLower) ||
        account.userId?.firstName?.toLowerCase().includes(searchLower) ||
        account.userId?.lastName?.toLowerCase().includes(searchLower) ||
        account.userId?.email?.toLowerCase().includes(searchLower) ||
        account.accountClass?.toLowerCase().includes(searchLower);

      const matchesStatus =
        statusFilter === "all" || account.status === statusFilter;
      const matchesAccountType =
        accountTypeFilter === "all" ||
        account.accountType === accountTypeFilter;
      const matchesPlatform =
        platformFilter === "all" || account.platform === platformFilter;

      return (
        matchesSearch && matchesStatus && matchesAccountType && matchesPlatform
      );
    });
  }, [accounts, searchQuery, statusFilter, accountTypeFilter, platformFilter]);

  // Sort
  const sortedAccounts = useMemo(() => {
    if (!sortField) return filteredAccounts;

    return [...filteredAccounts].sort((a, b) => {
      let aValue = sortField.includes(".")
        ? sortField.split(".").reduce((obj, key) => obj?.[key], a)
        : a[sortField];
      let bValue = sortField.includes(".")
        ? sortField.split(".").reduce((obj, key) => obj?.[key], b)
        : b[sortField];

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
  }, [filteredAccounts, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedAccounts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAccounts = sortedAccounts.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    statusFilter,
    accountTypeFilter,
    platformFilter,
    itemsPerPage,
  ]);

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

  const csvHeaders = [
    { label: "Account Number", key: "accountNumber" },
    { label: "Login", key: "login" },
    { label: "Account Type", key: "accountType" },
    { label: "Platform", key: "platform" },
    { label: "Account Class", key: "accountClass" },
    { label: "Balance", key: "balance" },
    { label: "Currency", key: "currency" },
    { label: "Leverage", key: "leverage" },
    { label: "Status", key: "status" },
    { label: "User Email", key: "userId.email" },
  ];

  if (loading) {
    return (
      <>
        <MetaHead
          title="Trading Accounts"
          description="Manage all trading accounts"
          keywords="trading accounts, MT4, MT5, cTrader"
        />
        <PageHeader
          title="Trading Accounts"
          subtitle="Manage all trading accounts across all platforms"
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
          title="Trading Accounts"
          description="Manage all trading accounts"
          keywords="trading accounts, MT4, MT5, cTrader"
        />
        <PageHeader
          title="Trading Accounts"
          subtitle="Manage all trading accounts across all platforms"
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
        title="Trading Accounts"
        description="Manage all trading accounts"
        keywords="trading accounts, MT4, MT5, cTrader"
      />
      <PageHeader
        title="Trading Accounts"
        subtitle="Manage all trading accounts across all platforms"
      />

      {/* Stats Overview */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Accounts"
          value={accounts.length}
          icon={<Activity className="w-5 h-5" />}
          color="blue"
        />
        <StatCard
          title="Active Accounts"
          value={accounts.filter((a) => a.status === "active").length}
          icon={<CheckCircle className="w-5 h-5" />}
          color="green"
        />
        <StatCard
          title="Real Accounts"
          value={accounts.filter((a) => a.accountType === "Real").length}
          icon={<DollarSign className="w-5 h-5" />}
          color="purple"
        />
        <StatCard
          title="Demo Accounts"
          value={accounts.filter((a) => a.accountType === "Demo").length}
          icon={<TrendingUp className="w-5 h-5" />}
          color="orange"
        />
      </div>

      {/* Filters and Actions */}
      <div className="mt-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by account number, login, user name, email, or account class..."
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
              value={accountTypeFilter}
              onChange={(e) => setAccountTypeFilter(e.target.value)}
            >
              {ACCOUNT_TYPE_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>

            <select
              className="w-full md:w-auto px-3 py-2 text-sm rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-blue-500"
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
            >
              {PLATFORM_FILTERS.map((f) => (
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
              data={sortedAccounts.map((acc) => ({
                ...acc,
                "userId.email": acc.userId?.email || "N/A",
              }))}
              headers={csvHeaders}
              filename={`trading-accounts-${
                new Date().toISOString().split("T")[0]
              }.csv`}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </CSVLink>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {paginatedAccounts.length} of {sortedAccounts.length}{" "}
            accounts
            {sortedAccounts.length !== accounts.length &&
              ` (filtered from ${accounts.length} total)`}
          </span>
        </div>
      </div>

      {/* Accounts Table */}
      {sortedAccounts.length === 0 ? (
        <div className="mt-6 bg-white border border-gray-200 rounded-xl p-12">
          <div className="text-center">
            <p className="text-gray-500">
              No accounts found matching your filters
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-6 bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("accountNumber")}
                  >
                    <div className="flex items-center gap-1">
                      Account Number
                      <SortIcon
                        field="accountNumber"
                        sortField={sortField}
                        sortDirection={sortDirection}
                      />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("accountType")}
                  >
                    <div className="flex items-center gap-1">
                      Type
                      <SortIcon
                        field="accountType"
                        sortField={sortField}
                        sortDirection={sortDirection}
                      />
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("platform")}
                  >
                    <div className="flex items-center gap-1">
                      Platform
                      <SortIcon
                        field="platform"
                        sortField={sortField}
                        sortDirection={sortDirection}
                      />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("balance")}
                  >
                    <div className="flex items-center gap-1">
                      Balance
                      <SortIcon
                        field="balance"
                        sortField={sortField}
                        sortDirection={sortDirection}
                      />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Leverage
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
                {paginatedAccounts.map((account) => (
                  <tr
                    key={account._id || account.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-mono font-medium text-gray-900">
                          {account.accountNumber}
                        </span>
                        <span className="text-xs text-gray-500 font-mono">
                          Login: {account.login}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-xs">
                          {account.userId?.firstName
                            ?.charAt(0)
                            ?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {account.userId?.firstName}{" "}
                            {account.userId?.lastName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {account.userId?.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <AccountTypeBadge type={account.accountType} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <PlatformBadge platform={account.platform} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {account.accountClass}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() =>
                          handleQuickUpdateBalance(
                            account._id || account.id,
                            account.balance
                          )
                        }
                        className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                        title="Click to update balance"
                      >
                        {account.currency} {account.balance?.toFixed(2)}
                      </button>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-700">
                        {account.leverage}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() =>
                          handleQuickToggleStatus(
                            account._id || account.id,
                            account.status
                          )
                        }
                        className="focus:outline-none"
                        title="Click to cycle: active → suspended → closed"
                      >
                        <StatusBadge status={account.status} />
                      </button>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewAccount(account)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditAccount(account)}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit Account"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteModalAccount(account)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">
                {startIndex + 1}-{Math.min(endIndex, sortedAccounts.length)} of{" "}
                {sortedAccounts.length}
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

                {renderPageNumbers(currentPage, totalPages, handlePageChange)}

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
        </div>
      )}

      {/* Modals */}
      {viewModalAccount && (
        <ViewAccountModal
          account={viewModalAccount}
          onClose={() => setViewModalAccount(null)}
        />
      )}

      {editModalAccount && (
        <EditAccountModal
          account={editModalAccount}
          onClose={() => setEditModalAccount(null)}
          onSave={handleUpdateAccount}
        />
      )}

      {deleteModalAccount && (
        <DeleteAccountModal
          account={deleteModalAccount}
          onClose={() => setDeleteModalAccount(null)}
          onConfirm={handleDeleteAccount}
        />
      )}
    </>
  );
};

// HELPER COMPONENTS
const StatCard = ({ title, value, icon, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
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
    active: "bg-green-100 text-green-700 hover:bg-green-200",
    suspended: "bg-orange-100 text-orange-700 hover:bg-orange-200",
    closed: "bg-red-100 text-red-700 hover:bg-red-200",
  };

  return (
    <span
      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full transition-colors cursor-pointer ${
        styles[status] || styles.active
      }`}
    >
      {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
    </span>
  );
};

const AccountTypeBadge = ({ type }) => {
  const styles = {
    Real: "bg-purple-100 text-purple-700",
    Demo: "bg-blue-100 text-blue-700",
  };

  return (
    <span
      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
        styles[type] || "bg-gray-100 text-gray-700"
      }`}
    >
      {type}
    </span>
  );
};

const PlatformBadge = ({ platform }) => {
  const styles = {
    MT4: "bg-indigo-100 text-indigo-700",
    MT5: "bg-cyan-100 text-cyan-700",
    cTrader: "bg-teal-100 text-teal-700",
  };

  return (
    <span
      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
        styles[platform] || "bg-gray-100 text-gray-700"
      }`}
    >
      {platform}
    </span>
  );
};

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
            ? "bg-blue-500 text-white font-medium"
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

// VIEW ACCOUNT MODAL
const ViewAccountModal = ({ account, onClose }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold text-gray-900">
            Trading Account Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Account Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
              <Key className="w-4 h-4" />
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoField
                label="Account Number"
                value={account.accountNumber}
                mono
              />
              <InfoField label="Login" value={account.login} mono />
              <InfoField label="Account Type" value={account.accountType} />
              <InfoField label="Platform" value={account.platform} />
              <InfoField label="Account Class" value={account.accountClass} />
              <InfoField label="Leverage" value={account.leverage} />
              <InfoField
                label="Server"
                value={account.server}
                icon={<Server className="w-4 h-4" />}
              />
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">
                  Status
                </label>
                <div className="mt-1">
                  <StatusBadge status={account.status} />
                </div>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Financial Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoField
                label="Balance"
                value={`${account.currency} ${
                  account.balance?.toFixed(2) || "0.00"
                }`}
              />
              <InfoField
                label="Equity"
                value={`${account.currency} ${
                  account.equity?.toFixed(2) || "0.00"
                }`}
              />
              <InfoField
                label="Free Margin"
                value={`${account.currency} ${
                  account.freeMargin?.toFixed(2) || "0.00"
                }`}
              />
              <InfoField
                label="Floating P/L"
                value={`${account.currency} ${
                  account.floatingPL?.toFixed(2) || "0.00"
                }`}
              />
              <InfoField
                label="Margin Level"
                value={account.marginLevel || "N/A"}
              />
              <InfoField label="Currency" value={account.currency} />
            </div>
          </div>

          {/* User Information */}
          {account.userId && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
                <User className="w-4 h-4" />
                User Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField
                  label="User Name"
                  value={`${account.userId.firstName} ${account.userId.lastName}`}
                />
                <InfoField label="Email" value={account.userId.email} />
                <InfoField label="User ID" value={account.userId._id} mono />
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
              Timestamps
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoField
                label="Created At"
                value={formatDate(account.createdAt)}
              />
              <InfoField
                label="Last Updated"
                value={formatDate(account.updatedAt)}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Info Field Component
const InfoField = ({ label, value, icon, mono = false }) => (
  <div>
    <label className="text-xs text-gray-500 uppercase tracking-wide flex items-center gap-1">
      {icon && <span className="text-gray-400">{icon}</span>}
      {label}
    </label>
    <p
      className={`text-sm font-medium text-gray-900 mt-1 ${
        mono ? "font-mono text-xs" : ""
      }`}
    >
      {value || "Not provided"}
    </p>
  </div>
);

// EDIT ACCOUNT MODAL
const EditAccountModal = ({ account, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    accountNumber: account.accountNumber || "",
    login: account.login || "",
    accountType: account.accountType || "Real",
    platform: account.platform || "MT5",
    accountClass: account.accountClass || "Standard",
    balance: account.balance || 0,
    equity: account.equity || 0,
    freeMargin: account.freeMargin || 0,
    floatingPL: account.floatingPL || 0,
    marginLevel: account.marginLevel || "",
    currency: account.currency || "USD",
    leverage: account.leverage || "1:100",
    server: account.server || "",
    status: account.status || "active",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSave(account._id || account.id, formData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update account");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold text-gray-900">
            Edit Trading Account
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Account Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Login
                </label>
                <input
                  type="text"
                  name="login"
                  value={formData.login}
                  onChange={handleChange}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Type
                </label>
                <select
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Real">Real</option>
                  <option value="Demo">Demo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Platform
                </label>
                <select
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="MT4">MT4</option>
                  <option value="MT5">MT5</option>
                  <option value="cTrader">cTrader</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Class
                </label>
                <select
                  name="accountClass"
                  value={formData.accountClass}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Standard">Standard</option>
                  <option value="Standard Cent">Standard Cent</option>
                  <option value="Pro">Pro</option>
                  <option value="Raw Spread">Raw Spread</option>
                  <option value="Zero">Zero</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Leverage
                </label>
                <select
                  name="leverage"
                  value={formData.leverage}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="1:50">1:50</option>
                  <option value="1:100">1:100</option>
                  <option value="1:200">1:200</option>
                  <option value="1:500">1:500</option>
                  <option value="1:1000">1:1000</option>
                  <option value="1:2000">1:2000</option>
                  <option value="1:Unlimited">1:Unlimited</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Server
                </label>
                <input
                  type="text"
                  name="server"
                  value={formData.server}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
              Financial Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="JPY">JPY</option>
                  <option value="AUD">AUD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Balance
                </label>
                <input
                  type="number"
                  name="balance"
                  value={formData.balance}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Equity
                </label>
                <input
                  type="number"
                  name="equity"
                  value={formData.equity}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Free Margin
                </label>
                <input
                  type="number"
                  name="freeMargin"
                  value={formData.freeMargin}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Floating P/L
                </label>
                <input
                  type="number"
                  name="floatingPL"
                  value={formData.floatingPL}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Margin Level
                </label>
                <input
                  type="text"
                  name="marginLevel"
                  value={formData.marginLevel}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// DELETE ACCOUNT MODAL
const DeleteAccountModal = ({ account, onClose, onConfirm }) => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setError("");
    setDeleting(true);
    try {
      await onConfirm(account._id || account.id);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete account");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>

          <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
            Delete Trading Account
          </h2>
          <p className="text-sm text-gray-600 text-center mb-4">
            Are you sure you want to delete account{" "}
            <span className="font-mono font-semibold">
              {account.accountNumber}
            </span>
            ? This action cannot be undone.
          </p>

          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-xs text-red-800">
              <strong>Warning:</strong> Deleting this account will permanently
              remove all associated data including trades, orders, and
              transaction history.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-4">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={deleting}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {deleting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Account"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accounts;
