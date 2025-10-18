// pages/admin/users/Users.jsx
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
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Save,
  AlertTriangle,
  RefreshCw,
  User as UserIcon,
  CheckCircle,
  XCircle,
  Building,
  CreditCard,
  Activity,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Package,
  DollarSign,
  Users as UsersIcon,
} from "lucide-react";

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

const STATUS_FILTERS = [
  { label: "All Status", value: "all" },
  { label: "Active", value: "active" },
  { label: "Suspended", value: "suspended" },
  { label: "Pending", value: "pending" },
  { label: "Closed", value: "closed" },
];

const KYC_FILTERS = [
  { label: "All KYC", value: "all" },
  { label: "Approved", value: "approved" },
  { label: "Pending", value: "pending" },
  { label: "Submitted", value: "submitted" },
  { label: "Rejected", value: "rejected" },
];

const ROLE_FILTERS = [
  { label: "All Roles", value: "all" },
  { label: "User", value: "user" },
  { label: "Admin", value: "admin" },
  { label: "Super Admin", value: "superadmin" },
];

const TRADING_FILTERS = [
  { label: "All Users", value: "all" },
  { label: "Profitable", value: "profitable" },
  { label: "Losing", value: "losing" },
  { label: "No Trades", value: "no_trades" },
];

const Users = () => {
  const [users, setUsers] = useState([]);
  const [overallStats, setOverallStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [kycFilter, setKycFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [tradingFilter, setTradingFilter] = useState("all");
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal states
  const [viewModalUser, setViewModalUser] = useState(null);
  const [editModalUser, setEditModalUser] = useState(null);
  const [deleteModalUser, setDeleteModalUser] = useState(null);

  // Fetch all users from API
  const fetchUsers = async () => {
    try {
      setError(null);
      const response = await api.get("/admin/users");
      if (response.data.data && Array.isArray(response.data.data)) {
        setUsers(response.data.data);
        setOverallStats(response.data.stats);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  // Fetch single user by ID
  const fetchUserById = async (userId) => {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      return response.data.data;
    } catch (err) {
      console.error("Error fetching user:", err);
      throw err;
    }
  };

  // Open view modal
  const handleViewUser = async (user) => {
    try {
      const fullUserData = await fetchUserById(user.id);
      setViewModalUser(fullUserData);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to fetch user details");
    }
  };

  // Open edit modal
  const handleEditUser = async (user) => {
    try {
      const fullUserData = await fetchUserById(user.id);
      setEditModalUser(fullUserData);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to fetch user details");
    }
  };

  // Update user
  const handleUpdateUser = async (userId, updatedData) => {
    try {
      const response = await api.put(`/admin/users/${userId}`, updatedData);
      if (response.data.success) {
        await fetchUsers();
        return true;
      }
    } catch (err) {
      console.error("Error updating user:", err);
      throw err;
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      if (response.data.success) {
        setUsers(users.filter((u) => u.id !== userId));
        return true;
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      throw err;
    }
  };

  // Quick toggle functions
  const handleQuickToggleStatus = async (userId, currentStatus) => {
    const statusCycle = {
      active: "suspended",
      suspended: "pending",
      pending: "closed",
      closed: "active",
    };
    const newStatus = statusCycle[currentStatus] || "active";
    try {
      await api.patch(`/admin/users/${userId}/status`, { status: newStatus });
      await fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleQuickToggleKYC = async (userId, currentKyc) => {
    const kycCycle = {
      pending: "submitted",
      submitted: "approved",
      approved: "rejected",
      rejected: "pending",
    };
    const newKyc = kycCycle[currentKyc] || "pending";
    try {
      await api.patch(`/admin/users/${userId}/kyc`, { kycStatus: newKyc });
      await fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update KYC status");
    }
  };

  const handleQuickToggleVerification = async (userId, field, currentValue) => {
    try {
      await api.patch(`/admin/users/${userId}/verification`, {
        field,
        value: !currentValue,
      });
      await fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update verification");
    }
  };

  // Filter and search users with trading performance
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        user.firstname?.toLowerCase().includes(searchLower) ||
        user.lastname?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.mobile?.toLowerCase().includes(searchLower) ||
        user.userId?.toLowerCase().includes(searchLower) ||
        user.id?.toLowerCase().includes(searchLower);

      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;
      const matchesKyc = kycFilter === "all" || user.kyc === kycFilter;
      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      const matchesTrading =
        tradingFilter === "all" ||
        (tradingFilter === "profitable" &&
          user.isProfitable &&
          user.totalTrades > 0) ||
        (tradingFilter === "losing" &&
          !user.isProfitable &&
          user.totalTrades > 0) ||
        (tradingFilter === "no_trades" && user.totalTrades === 0);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesKyc &&
        matchesRole &&
        matchesTrading
      );
    });
  }, [users, searchQuery, statusFilter, kycFilter, roleFilter, tradingFilter]);

  // Sort users
  const sortedUsers = useMemo(() => {
    if (!sortField) return filteredUsers;

    return [...filteredUsers].sort((a, b) => {
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
  }, [filteredUsers, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = sortedUsers.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    statusFilter,
    kycFilter,
    roleFilter,
    tradingFilter,
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
    { label: "User ID", key: "userId" },
    { label: "First Name", key: "firstname" },
    { label: "Last Name", key: "lastname" },
    { label: "Email", key: "email" },
    { label: "Mobile", key: "mobile" },
    { label: "Role", key: "role" },
    { label: "Status", key: "status" },
    { label: "KYC", key: "kyc" },
    { label: "Wallet Balance", key: "walletbalance" },
    { label: "Currency", key: "currency" },
    { label: "Total Trades", key: "totalTrades" },
    { label: "Total P/L", key: "totalProfitLoss" },
    { label: "Winning Trades", key: "winningTrades" },
    { label: "Losing Trades", key: "losingTrades" },
  ];

  if (loading) {
    return (
      <>
        <MetaHead
          title="All Users"
          description="Manage all users and their accounts"
          keywords="users, user management, accounts"
        />
        <PageHeader
          title="Manage All Users"
          subtitle="Manage all user accounts and monitor activity"
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
          title="All Users"
          description="Manage all users and their accounts"
          keywords="users, user management, accounts"
        />
        <PageHeader
          title="Manage All Users"
          subtitle="Manage all user accounts and monitor activity"
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
        title="All Users"
        description="Manage all users and their accounts"
        keywords="users, user management, accounts"
      />
      <PageHeader
        title="Manage All Users"
        subtitle="Manage all user accounts and monitor trading activity"
      />

      {/* Overall Trading Statistics Cards */}
      {overallStats && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-blue-700 uppercase">
                Total Users
              </p>
              <UsersIcon className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-900">
              {overallStats.totalUsers}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {overallStats.totalTrades} total trades
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-green-700 uppercase">
                Profitable Users
              </p>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-900">
              {overallStats.profitableUsers}
            </p>
            <p className="text-xs text-green-600 mt-1">
              {overallStats.totalUsers > overallStats.usersWithNoTrades
                ? (
                    (overallStats.profitableUsers /
                      (overallStats.totalUsers -
                        overallStats.usersWithNoTrades)) *
                    100
                  ).toFixed(1)
                : 0}
              % of active traders
            </p>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-red-700 uppercase">
                Losing Users
              </p>
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-red-900">
              {overallStats.losingUsers}
            </p>
            <p className="text-xs text-red-600 mt-1">
              {overallStats.totalUsers > overallStats.usersWithNoTrades
                ? (
                    (overallStats.losingUsers /
                      (overallStats.totalUsers -
                        overallStats.usersWithNoTrades)) *
                    100
                  ).toFixed(1)
                : 0}
              % of active traders
            </p>
          </div>

          <div
            className={`bg-gradient-to-br ${
              overallStats.totalProfitLoss >= 0
                ? "from-purple-50 to-purple-100 border-purple-200"
                : "from-orange-50 to-orange-100 border-orange-200"
            } border rounded-xl p-4`}
          >
            <div className="flex items-center justify-between mb-2">
              <p
                className={`text-xs font-medium uppercase ${
                  overallStats.totalProfitLoss >= 0
                    ? "text-purple-700"
                    : "text-orange-700"
                }`}
              >
                Total Platform P/L
              </p>
              <DollarSign
                className={`w-5 h-5 ${
                  overallStats.totalProfitLoss >= 0
                    ? "text-purple-600"
                    : "text-orange-600"
                }`}
              />
            </div>
            <p
              className={`text-2xl font-bold ${
                overallStats.totalProfitLoss >= 0
                  ? "text-purple-900"
                  : "text-orange-900"
              }`}
            >
              ${overallStats.totalProfitLoss.toFixed(2)}
            </p>
            <p
              className={`text-xs mt-1 ${
                overallStats.totalProfitLoss >= 0
                  ? "text-purple-600"
                  : "text-orange-600"
              }`}
            >
              Platform-wide performance
            </p>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="mt-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, mobile, or User ID..."
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
              value={kycFilter}
              onChange={(e) => setKycFilter(e.target.value)}
            >
              {KYC_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>

            <select
              className="w-full md:w-auto px-3 py-2 text-sm rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-blue-500"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              {ROLE_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>

            <select
              className="w-full md:w-auto px-3 py-2 text-sm rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-blue-500"
              value={tradingFilter}
              onChange={(e) => setTradingFilter(e.target.value)}
            >
              {TRADING_FILTERS.map((f) => (
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
              data={sortedUsers}
              headers={csvHeaders}
              filename={`users-trading-stats-${
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
            Showing {paginatedUsers.length} of {sortedUsers.length} users
            {sortedUsers.length !== users.length &&
              ` (filtered from ${users.length} total)`}
          </span>
        </div>
      </div>

      {/* Users Table with Trading Stats */}
      {sortedUsers.length === 0 ? (
        <div className="mt-6 bg-white border border-gray-200 rounded-xl p-12">
          <div className="text-center">
            <p className="text-gray-500">
              No users found matching your filters
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
                    onClick={() => handleSort("userId")}
                  >
                    <div className="flex items-center gap-1">
                      User ID
                      <SortIcon
                        field="userId"
                        sortField={sortField}
                        sortDirection={sortDirection}
                      />
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("firstname")}
                  >
                    <div className="flex items-center gap-1">
                      Name
                      <SortIcon
                        field="firstname"
                        sortField={sortField}
                        sortDirection={sortDirection}
                      />
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("email")}
                  >
                    <div className="flex items-center gap-1">
                      Email
                      <SortIcon
                        field="email"
                        sortField={sortField}
                        sortDirection={sortDirection}
                      />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("totalProfitLoss")}
                  >
                    <div className="flex items-center gap-1">
                      P/L
                      <SortIcon
                        field="totalProfitLoss"
                        sortField={sortField}
                        sortDirection={sortDirection}
                      />
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("totalTrades")}
                  >
                    <div className="flex items-center gap-1">
                      Trades
                      <SortIcon
                        field="totalTrades"
                        sortField={sortField}
                        sortDirection={sortDirection}
                      />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Verifications
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-blue-600 font-semibold">
                      {user.userId}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-xs">
                          {user.firstname?.charAt(0)?.toUpperCase()}
                          {user.lastname?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {user.firstname} {user.lastname}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {user.email}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <RoleBadge role={user.role} />
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() =>
                          handleQuickToggleStatus(user.id, user.status)
                        }
                        className="focus:outline-none"
                        title="Click to cycle: active → suspended → pending → closed"
                      >
                        <StatusBadge status={user.status} />
                      </button>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {user.totalTrades > 0 ? (
                        <div className="flex items-center gap-1">
                          {user.isProfitable ? (
                            <TrendingUp className="w-3 h-3 text-green-600" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-red-600" />
                          )}
                          <span
                            className={`text-sm font-semibold ${
                              user.isProfitable
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            ${(user.totalProfitLoss || 0).toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">No trades</span>
                      )}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-xs text-gray-600">
                        {user.totalTrades > 0 ? (
                          <>
                            <span className="text-green-600 font-semibold">
                              {user.winningTrades || 0}
                            </span>
                            {" / "}
                            <span className="text-red-600 font-semibold">
                              {user.losingTrades || 0}
                            </span>
                          </>
                        ) : (
                          <span className="text-gray-400">0</span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleQuickToggleVerification(
                              user.id,
                              "emailverified",
                              user.emailverified
                            )
                          }
                          className="p-1 rounded hover:bg-gray-100"
                          title={`Email ${
                            user.emailverified ? "Verified" : "Not Verified"
                          }`}
                        >
                          {user.emailverified ? (
                            <Mail className="w-4 h-4 text-green-600" />
                          ) : (
                            <Mail className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                        <button
                          onClick={() =>
                            handleQuickToggleVerification(
                              user.id,
                              "phoneverified",
                              user.phoneverified
                            )
                          }
                          className="p-1 rounded hover:bg-gray-100"
                          title={`Phone ${
                            user.phoneverified ? "Verified" : "Not Verified"
                          }`}
                        >
                          {user.phoneverified ? (
                            <Phone className="w-4 h-4 text-green-600" />
                          ) : (
                            <Phone className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                        <button
                          onClick={() =>
                            handleQuickToggleVerification(
                              user.id,
                              "mfaenabled",
                              user.mfaenabled
                            )
                          }
                          className="p-1 rounded hover:bg-gray-100"
                          title={`MFA ${
                            user.mfaenabled ? "Enabled" : "Disabled"
                          }`}
                        >
                          {user.mfaenabled ? (
                            <Shield className="w-4 h-4 text-green-600" />
                          ) : (
                            <Shield className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteModalUser(user)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete User"
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
                {startIndex + 1}-{Math.min(endIndex, sortedUsers.length)} of{" "}
                {sortedUsers.length}
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
      {viewModalUser && (
        <ViewUserModal
          user={viewModalUser}
          onClose={() => setViewModalUser(null)}
        />
      )}

      {editModalUser && (
        <EditUserModal
          user={editModalUser}
          onClose={() => setEditModalUser(null)}
          onSave={handleUpdateUser}
        />
      )}

      {deleteModalUser && (
        <DeleteUserModal
          user={deleteModalUser}
          onClose={() => setDeleteModalUser(null)}
          onConfirm={handleDeleteUser}
        />
      )}
    </>
  );
};

// HELPER COMPONENTS
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
    suspended: "bg-red-100 text-red-700 hover:bg-red-200",
    pending: "bg-orange-100 text-orange-700 hover:bg-orange-200",
    closed: "bg-gray-100 text-gray-700 hover:bg-gray-200",
  };

  return (
    <span
      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full transition-colors cursor-pointer ${
        styles[status] || styles.pending
      }`}
    >
      {status}
    </span>
  );
};

const KYCBadge = ({ status }) => {
  const styles = {
    approved: "bg-green-100 text-green-700 hover:bg-green-200",
    pending: "bg-orange-100 text-orange-700 hover:bg-orange-200",
    submitted: "bg-blue-100 text-blue-700 hover:bg-blue-200",
    rejected: "bg-red-100 text-red-700 hover:bg-red-200",
  };

  return (
    <span
      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full transition-colors cursor-pointer ${
        styles[status] || styles.pending
      }`}
    >
      {status}
    </span>
  );
};

const RoleBadge = ({ role }) => {
  const styles = {
    user: "bg-blue-100 text-blue-700",
    admin: "bg-purple-100 text-purple-700",
    superadmin: "bg-pink-100 text-pink-700",
  };

  return (
    <span
      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
        styles[role] || styles.user
      }`}
    >
      {role === "superadmin"
        ? "Super Admin"
        : role?.charAt(0).toUpperCase() + role?.slice(1)}
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

// VIEW USER MODAL WITH TRADING STATS
const ViewUserModal = ({ user, onClose }) => {
  const [tradingStats, setTradingStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [activeTradeTab, setActiveTradeTab] = useState("overview");

  useEffect(() => {
    const fetchTradingStats = async () => {
      try {
        const response = await api.get(`/admin/users/${user.id}/trading-stats`);
        if (response.data.success) {
          setTradingStats(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching trading stats:", err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchTradingStats();
  }, [user.id]);

  const formatDate = (dateString) => {
    if (!dateString) return "Not provided";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              User Details
            </h2>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
              <UserIcon className="w-4 h-4" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoField label="User ID" value={user.id} mono />
              <InfoField label="First Name" value={user.firstname} />
              <InfoField label="Last Name" value={user.lastname} />
              <InfoField
                label="Email"
                value={user.email}
                icon={<Mail className="w-4 h-4" />}
              />
              <InfoField
                label="Mobile"
                value={user.mobile || "Not provided"}
                icon={<Phone className="w-4 h-4" />}
              />
              <InfoField
                label="Date of Birth"
                value={formatDate(user.dateofbirth)}
                icon={<Calendar className="w-4 h-4" />}
              />
            </div>
          </div>

          {/* Trading Statistics Section */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Trading Performance
            </h3>

            {loadingStats ? (
              <div className="flex justify-center items-center py-12">
                <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            ) : tradingStats ? (
              <>
                {/* Trading Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium text-blue-700 uppercase">
                        Total Trades
                      </p>
                      <BarChart3 className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-blue-900">
                      {tradingStats.trades.totalTrades}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      {tradingStats.trades.openTrades} open,{" "}
                      {tradingStats.trades.closedTrades} closed
                    </p>
                  </div>

                  <div
                    className={`bg-gradient-to-br ${
                      parseFloat(tradingStats.trades.totalProfitLoss) >= 0
                        ? "from-green-50 to-green-100 border-green-200"
                        : "from-red-50 to-red-100 border-red-200"
                    } border rounded-xl p-4`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p
                        className={`text-xs font-medium uppercase ${
                          parseFloat(tradingStats.trades.totalProfitLoss) >= 0
                            ? "text-green-700"
                            : "text-red-700"
                        }`}
                      >
                        Total P/L
                      </p>
                      {parseFloat(tradingStats.trades.totalProfitLoss) >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <p
                      className={`text-2xl font-bold ${
                        parseFloat(tradingStats.trades.totalProfitLoss) >= 0
                          ? "text-green-900"
                          : "text-red-900"
                      }`}
                    >
                      ${tradingStats.trades.totalProfitLoss}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        parseFloat(tradingStats.trades.totalProfitLoss) >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      Avg: ${tradingStats.trades.avgProfitPerTrade}/trade
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium text-purple-700 uppercase">
                        Win Rate
                      </p>
                      <Activity className="w-4 h-4 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-purple-900">
                      {tradingStats.trades.winRate}%
                    </p>
                    <p className="text-xs text-purple-600 mt-1">
                      {tradingStats.trades.winningTrades}W /{" "}
                      {tradingStats.trades.losingTrades}L
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium text-orange-700 uppercase">
                        Volume
                      </p>
                      <Package className="w-4 h-4 text-orange-600" />
                    </div>
                    <p className="text-2xl font-bold text-orange-900">
                      {tradingStats.trades.totalVolume}
                    </p>
                    <p className="text-xs text-orange-600 mt-1">Lots traded</p>
                  </div>
                </div>

                {/* Additional Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <p className="text-xs text-gray-500 uppercase">
                      Total Commission
                    </p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      ${tradingStats.trades.totalCommission}
                    </p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <p className="text-xs text-gray-500 uppercase">
                      Total Swap
                    </p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      ${tradingStats.trades.totalSwap}
                    </p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <p className="text-xs text-gray-500 uppercase">
                      Break Even
                    </p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {tradingStats.trades.breakEvenTrades} trades
                    </p>
                  </div>
                </div>

                {/* Tabs for Trades and Orders */}
                <div className="border-b border-gray-200">
                  <nav className="flex gap-4">
                    <button
                      onClick={() => setActiveTradeTab("overview")}
                      className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                        activeTradeTab === "overview"
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Overview
                    </button>
                    <button
                      onClick={() => setActiveTradeTab("trades")}
                      className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                        activeTradeTab === "trades"
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Trades ({tradingStats.trades.totalTrades})
                    </button>
                    <button
                      onClick={() => setActiveTradeTab("orders")}
                      className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                        activeTradeTab === "orders"
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Orders ({tradingStats.orders.totalOrders})
                    </button>
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="mt-4">
                  {activeTradeTab === "overview" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Activity className="w-4 h-4" />
                          Trade Breakdown
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              Winning Trades:
                            </span>
                            <span className="font-semibold text-green-600">
                              {tradingStats.trades.winningTrades}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              Losing Trades:
                            </span>
                            <span className="font-semibold text-red-600">
                              {tradingStats.trades.losingTrades}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Break Even:</span>
                            <span className="font-semibold text-gray-600">
                              {tradingStats.trades.breakEvenTrades}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Open Trades:</span>
                            <span className="font-semibold text-blue-600">
                              {tradingStats.trades.openTrades}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          Order Statistics
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Total Orders:</span>
                            <span className="font-semibold text-gray-900">
                              {tradingStats.orders.totalOrders}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Executed:</span>
                            <span className="font-semibold text-green-600">
                              {tradingStats.orders.executedOrders}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Pending:</span>
                            <span className="font-semibold text-orange-600">
                              {tradingStats.orders.pendingOrders}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Cancelled:</span>
                            <span className="font-semibold text-red-600">
                              {tradingStats.orders.cancelledOrders}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTradeTab === "trades" && (
                    <div className="max-h-96 overflow-y-auto">
                      {tradingStats.trades.list.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">
                          No trades found
                        </p>
                      ) : (
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50 sticky top-0">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Trade ID
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Symbol
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Type
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Volume
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                P/L
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Status
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Open Time
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {tradingStats.trades.list.map((trade) => (
                              <tr key={trade._id} className="hover:bg-gray-50">
                                <td className="px-3 py-2 font-mono text-xs">
                                  {trade.tradeId}
                                </td>
                                <td className="px-3 py-2 font-semibold">
                                  {trade.symbol}
                                </td>
                                <td className="px-3 py-2">
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${
                                      trade.type?.toLowerCase().includes("buy")
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                    }`}
                                  >
                                    {trade.type}
                                  </span>
                                </td>
                                <td className="px-3 py-2">{trade.volume}</td>
                                <td className="px-3 py-2">
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
                                <td className="px-3 py-2">
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${
                                      trade.status === "open"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-gray-100 text-gray-700"
                                    }`}
                                  >
                                    {trade.status}
                                  </span>
                                </td>
                                <td className="px-3 py-2 text-xs text-gray-600">
                                  {formatDateTime(trade.openTime)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}

                  {activeTradeTab === "orders" && (
                    <div className="max-h-96 overflow-y-auto">
                      {tradingStats.orders.list.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">
                          No orders found
                        </p>
                      ) : (
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50 sticky top-0">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Order ID
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Symbol
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Type
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Volume
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Price
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Status
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Placed At
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {tradingStats.orders.list.map((order) => (
                              <tr key={order._id} className="hover:bg-gray-50">
                                <td className="px-3 py-2 font-mono text-xs">
                                  {order.orderId}
                                </td>
                                <td className="px-3 py-2 font-semibold">
                                  {order.symbol}
                                </td>
                                <td className="px-3 py-2">
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${
                                      order.type?.toLowerCase().includes("buy")
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                    }`}
                                  >
                                    {order.type}
                                  </span>
                                </td>
                                <td className="px-3 py-2">{order.volume}</td>
                                <td className="px-3 py-2 font-medium">
                                  ${order.orderPrice?.toFixed(2)}
                                </td>
                                <td className="px-3 py-2">
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${
                                      order.status === "executed"
                                        ? "bg-green-100 text-green-700"
                                        : order.status === "pending"
                                        ? "bg-orange-100 text-orange-700"
                                        : "bg-gray-100 text-gray-700"
                                    }`}
                                  >
                                    {order.status}
                                  </span>
                                </td>
                                <td className="px-3 py-2 text-xs text-gray-600">
                                  {formatDateTime(order.placedAt)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500 py-8">
                No trading data available
              </p>
            )}
          </div>

          {/* Keep all existing sections from original ViewUserModal below */}
          {/* Verification Status, Address, Account Status, Wallet, Platform Preferences, Referral, Trading Accounts, Timestamps */}

          {/* Verification Status */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Verification & Security
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">
                  Email Verified
                </label>
                <div className="mt-1">
                  {user.emailverified ? (
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-green-700">
                      <CheckCircle className="w-4 h-4" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-red-700">
                      <XCircle className="w-4 h-4" />
                      Not Verified
                    </span>
                  )}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">
                  Phone Verified
                </label>
                <div className="mt-1">
                  {user.phoneverified ? (
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-green-700">
                      <CheckCircle className="w-4 h-4" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-red-700">
                      <XCircle className="w-4 h-4" />
                      Not Verified
                    </span>
                  )}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">
                  2FA / MFA
                </label>
                <div className="mt-1">
                  {user.mfaenabled ? (
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-green-700">
                      <CheckCircle className="w-4 h-4" />
                      Enabled
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-700">
                      <XCircle className="w-4 h-4" />
                      Disabled
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Address Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoField
                label="Address Line 1"
                value={user.addressline1 || "Not provided"}
              />
              <InfoField
                label="Address Line 2"
                value={user.addressline2 || "Not provided"}
              />
              <InfoField label="City" value={user.city || "Not provided"} />
              <InfoField label="State" value={user.state || "Not provided"} />
              <InfoField
                label="ZIP/Postal Code"
                value={user.zipcode || "Not provided"}
              />
              <InfoField
                label="Country"
                value={user.country || "Not provided"}
              />
            </div>
          </div>

          {/* Account Status */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
              Account Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">
                  Status
                </label>
                <div className="mt-1">
                  <StatusBadge status={user.status} />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">
                  KYC Status
                </label>
                <div className="mt-1">
                  <KYCBadge status={user.kyc} />
                </div>
              </div>
            </div>
          </div>

          {/* Wallet Information */}
          {user.walletbalance !== undefined && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Wallet Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoField
                  label="Wallet Balance"
                  value={`${user.currency || "USD"} ${user.walletbalance || 0}`}
                />
                <InfoField
                  label="Total Deposits"
                  value={`${user.currency || "USD"} ${user.totaldeposits || 0}`}
                />
                <InfoField
                  label="Total Withdrawals"
                  value={`${user.currency || "USD"} ${
                    user.totalwithdrawals || 0
                  }`}
                />
              </div>
            </div>
          )}

          {/* Platform Preferences */}
          {(user.preferredMT5Terminal || user.preferredMT4Terminal) && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
                <Building className="w-4 h-4" />
                Platform Preferences
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField
                  label="Preferred MT5 Terminal"
                  value={user.preferredMT5Terminal || "Not set"}
                />
                <InfoField
                  label="Preferred MT4 Terminal"
                  value={user.preferredMT4Terminal || "Not set"}
                />
              </div>
            </div>
          )}

          {/* Referral Information */}
          {(user.referralCode || user.referredBy) && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
                Referral Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField
                  label="Referral Code"
                  value={user.referralCode || "Not generated"}
                  mono
                />
                <InfoField
                  label="Referred By"
                  value={user.referredBy || "Direct signup"}
                />
              </div>
            </div>
          )}

          {/* Trading Accounts */}
          {user.tradingaccounts && user.tradingaccounts.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
                Trading Accounts
              </h3>
              <div className="space-y-2">
                {user.tradingaccounts.map((account) => (
                  <div
                    key={account.id}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {account.accountnumber}
                        </p>
                        <p className="text-xs text-gray-500">
                          {account.platform} - {account.type}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {account.currency} {account.balance}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
              Account Timestamps
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoField
                label="Created At"
                value={formatDate(user.createdat)}
              />
              <InfoField
                label="Last Updated"
                value={formatDate(user.updatedat)}
              />
              <InfoField
                label="Last Login"
                value={formatDate(user.lastlogin)}
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

// EDIT USER MODAL WITH ALL MODEL FIELDS
const EditUserModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    // Authentication
    email: user.email || "",

    // Personal Info
    firstname: user.firstname || "",
    lastname: user.lastname || "",
    dateofbirth: user.dateofbirth || "",
    mobile: user.mobile || "",

    // Role
    role: user.role || "user",

    // Address
    country: user.country || "",
    state: user.state || "",
    city: user.city || "",
    addressline1: user.addressline1 || "",
    addressline2: user.addressline2 || "",
    zipcode: user.zipcode || "",

    // Account Status
    status: user.status || "active",
    kyc: user.kyc || "pending",

    // Verification
    emailverified: user.emailverified || false,
    phoneverified: user.phoneverified || false,
    mfaenabled: user.mfaenabled || false,

    // Wallet
    walletbalance: user.walletbalance || 0,
    currency: user.currency || "USD",

    // Platform Preferences
    preferredMT5Terminal: user.preferredMT5Terminal || "",
    preferredMT4Terminal: user.preferredMT4Terminal || "",

    // Referral
    referralCode: user.referralCode || "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSave(user.id, formData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold text-gray-900">Edit User</h2>
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

          {/* Personal Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateofbirth"
                  value={
                    formData.dateofbirth
                      ? new Date(formData.dateofbirth)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
              Address Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 1
                </label>
                <input
                  type="text"
                  name="addressline1"
                  value={formData.addressline1}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 2
                </label>
                <input
                  type="text"
                  name="addressline2"
                  value={formData.addressline2}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP/Postal Code
                </label>
                <input
                  type="text"
                  name="zipcode"
                  value={formData.zipcode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
              Account Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
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
                  <option value="pending">Pending</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  KYC Status
                </label>
                <select
                  name="kyc"
                  value={formData.kyc}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="submitted">Submitted</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
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
            </div>
          </div>

          {/* Wallet Settings */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
              Wallet Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Wallet Balance
                </label>
                <input
                  type="number"
                  name="walletbalance"
                  value={formData.walletbalance}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Platform Preferences */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
              Platform Preferences
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred MT5 Terminal
                </label>
                <select
                  name="preferredMT5Terminal"
                  value={formData.preferredMT5Terminal}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Not Set</option>
                  <option value="MT5 WebTerminal">MT5 WebTerminal</option>
                  <option value="MT5 Desktop">MT5 Desktop</option>
                  <option value="MT5 Mobile">MT5 Mobile</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred MT4 Terminal
                </label>
                <select
                  name="preferredMT4Terminal"
                  value={formData.preferredMT4Terminal}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Not Set</option>
                  <option value="MT4 WebTerminal">MT4 WebTerminal</option>
                  <option value="MT4 Desktop">MT4 Desktop</option>
                  <option value="MT4 Mobile">MT4 Mobile</option>
                </select>
              </div>
            </div>
          </div>

          {/* Referral */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
              Referral
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Referral Code
                </label>
                <input
                  type="text"
                  name="referralCode"
                  value={formData.referralCode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Verification Toggles */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Verification & Security
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Email Verified
                    </p>
                    <p className="text-xs text-gray-500">
                      Mark email as verified
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="emailverified"
                    checked={formData.emailverified}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Phone Verified
                    </p>
                    <p className="text-xs text-gray-500">
                      Mark phone as verified
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="phoneverified"
                    checked={formData.phoneverified}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      2FA / MFA Enabled
                    </p>
                    <p className="text-xs text-gray-500">
                      Enable/disable two-factor authentication
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="mfaenabled"
                    checked={formData.mfaenabled}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
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

// DELETE USER MODAL
const DeleteUserModal = ({ user, onClose, onConfirm }) => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setError("");
    setDeleting(true);
    try {
      await onConfirm(user.id);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
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
            Delete User
          </h2>
          <p className="text-sm text-gray-600 text-center mb-4">
            Are you sure you want to delete{" "}
            <span className="font-semibold">
              {user.firstname} {user.lastname}
            </span>
            ? This action cannot be undone.
          </p>

          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-xs text-red-800">
              <strong>Warning:</strong> This will permanently delete all user
              data, accounts, and transaction history.
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
                "Delete User"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
