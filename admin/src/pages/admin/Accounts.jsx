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
  DollarSign,
  TrendingUp,
  Users,
  Activity,
  Server,
  Save,
  AlertTriangle,
  RefreshCw,
  Plus,
  Shield,
  Key,
  Globe,
} from "lucide-react";

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

const ACCOUNT_TYPE_FILTERS = [
  { label: "All Types", value: "all" },
  { label: "Real", value: "real" },
  { label: "Demo", value: "demo" },
];

const PLATFORM_FILTERS = [
  { label: "All Platforms", value: "all" },
  { label: "MT4", value: "MT4" },
  { label: "MT5", value: "MT5" },
];

const STATUS_FILTERS = [
  { label: "All Status", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Suspended", value: "suspended" },
];

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [users, setUsers] = useState([]);
  const [accountTypes, setAccountTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [accountTypeFilter, setAccountTypeFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal states
  const [viewModalAccount, setViewModalAccount] = useState(null);
  const [editModalAccount, setEditModalAccount] = useState(null);
  const [deleteModalAccount, setDeleteModalAccount] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Fetch all accounts
  const fetchAccounts = async () => {
    try {
      setError(null);
      const response = await api.get("/admin/accounts");

      if (response.data.data && Array.isArray(response.data.data)) {
        setAccounts(response.data.data);
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

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await api.get("/admin/users");
      if (response.data.data && Array.isArray(response.data.data)) {
        setUsers(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // Fetch account types
  const fetchAccountTypes = async () => {
    try {
      const response = await api.get("/admin/account-types");
      if (response.data.data && Array.isArray(response.data.data)) {
        setAccountTypes(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching account types:", err);
    }
  };

  useEffect(() => {
    fetchAccounts();
    fetchUsers();
    fetchAccountTypes();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAccounts();
  };

  // Fetch single account by ID
  const fetchAccountById = async (accountId) => {
    try {
      const response = await api.get(`/admin/accounts/${accountId}`);
      return response.data.data;
    } catch (err) {
      console.error("Error fetching account:", err);
      throw err;
    }
  };

  // Get user for account
  const getUserForAccount = (userId) => {
    return users.find((user) => user.id === userId);
  };

  // Get account type for account
  const getAccountTypeForAccount = (accountTypeId) => {
    return accountTypes.find((type) => type.id === accountTypeId);
  };

  // Open view modal
  const handleViewAccount = async (account) => {
    try {
      const fullData = await fetchAccountById(account.id);
      const user = getUserForAccount(fullData.user_id);
      const accountType = getAccountTypeForAccount(fullData.account_type_id);
      setViewModalAccount({ ...fullData, user, accountType });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to fetch account details");
    }
  };

  // Open edit modal
  const handleEditAccount = async (account) => {
    try {
      const fullData = await fetchAccountById(account.id);
      const user = getUserForAccount(fullData.user_id);
      const accountType = getAccountTypeForAccount(fullData.account_type_id);
      setEditModalAccount({ ...fullData, user, accountType });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to fetch account details");
    }
  };

  // Create account
  const handleCreateAccount = async (newData) => {
    try {
      const response = await api.post("/admin/accounts", newData);

      if (response.data.status === 200) {
        await fetchAccounts();
        return true;
      }
    } catch (err) {
      console.error("Error creating account:", err);
      throw err;
    }
  };

  // Update account
  const handleUpdateAccount = async (accountId, updatedData) => {
    try {
      const response = await api.put(
        `/admin/accounts/${accountId}`,
        updatedData
      );

      if (response.data.status === 200) {
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
      const response = await api.delete(`/admin/accounts/${accountId}`);

      if (response.data.status === 200) {
        setAccounts(accounts.filter((acc) => acc.id !== accountId));
        return true;
      }
    } catch (err) {
      console.error("Error deleting account:", err);
      throw err;
    }
  };

  // Filter and search
  const filteredAccounts = useMemo(() => {
    return accounts.filter((account) => {
      const user = getUserForAccount(account.user_id);

      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        account.id?.toLowerCase().includes(searchLower) ||
        account.login?.toLowerCase().includes(searchLower) ||
        account.server?.toLowerCase().includes(searchLower) ||
        (user &&
          (user.first_name?.toLowerCase().includes(searchLower) ||
            user.last_name?.toLowerCase().includes(searchLower) ||
            user.email?.toLowerCase().includes(searchLower)));

      const matchesAccountType =
        accountTypeFilter === "all" ||
        account.account_type === accountTypeFilter;
      const matchesPlatform =
        platformFilter === "all" || account.platform === platformFilter;
      const matchesStatus =
        statusFilter === "all" || account.status === statusFilter;

      return (
        matchesSearch && matchesAccountType && matchesPlatform && matchesStatus
      );
    });
  }, [
    accounts,
    searchQuery,
    accountTypeFilter,
    platformFilter,
    statusFilter,
    users,
  ]);

  // Sort
  const sortedAccounts = useMemo(() => {
    if (!sortField) return filteredAccounts;

    return [...filteredAccounts].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "balance") {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      const aStr = String(aValue || "").toLowerCase();
      const bStr = String(bValue || "").toLowerCase();

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
    accountTypeFilter,
    platformFilter,
    statusFilter,
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

  // Calculate statistics
  const stats = useMemo(() => {
    const realAccounts = accounts.filter((acc) => acc.account_type === "real");
    const totalBalance = realAccounts.reduce(
      (sum, acc) => sum + parseFloat(acc.balance || 0),
      0
    );
    const activeCount = accounts.filter(
      (acc) => acc.status === "active"
    ).length;

    return {
      totalAccounts: accounts.length,
      activeAccounts: activeCount,
      totalBalance: totalBalance.toFixed(2),
      realAccounts: realAccounts.length,
    };
  }, [accounts]);

  const csvHeaders = [
    { label: "Account ID", key: "id" },
    { label: "Login", key: "login" },
    { label: "Type", key: "account_type" },
    { label: "Platform", key: "platform" },
    { label: "Balance", key: "balance" },
    { label: "Currency", key: "currency" },
    { label: "Leverage", key: "leverage" },
    { label: "Server", key: "server" },
    { label: "Status", key: "status" },
  ];

  if (loading) {
    return (
      <>
        <MetaHead
          title="All Accounts"
          description="Manage all trading accounts"
          keywords="accounts, trading accounts, MT4, MT5"
        />
        <PageHeader
          title="Manage All Accounts"
          subtitle="View and manage all trading accounts"
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
          title="All Accounts"
          description="Manage all trading accounts"
          keywords="accounts, trading accounts, MT4, MT5"
        />
        <PageHeader
          title="Manage All Accounts"
          subtitle="View and manage all trading accounts"
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
        title="All Accounts"
        description="Manage all trading accounts"
        keywords="accounts, trading accounts, MT4, MT5"
      />

      <PageHeader
        title="Manage All Accounts"
        subtitle="View and manage all trading accounts"
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Total Accounts
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalAccounts}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Active Accounts
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.activeAccounts}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Total Balance
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                ${stats.totalBalance}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-50 rounded-lg">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Real Accounts
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.realAccounts}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mt-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by account ID, login, server, or user name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex flex-col md:flex-row gap-2 flex-1">
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
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Account
            </button>

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
              data={sortedAccounts}
              headers={csvHeaders}
              filename={`accounts-${
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
                    onClick={() => handleSort("login")}
                  >
                    <div className="flex items-center gap-1">
                      Account
                      <SortIcon
                        field="login"
                        sortField={sortField}
                        sortDirection={sortDirection}
                      />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedAccounts.map((account) => {
                  const user = getUserForAccount(account.user_id);
                  return (
                    <tr key={account.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-mono font-medium text-gray-900">
                            #{account.login}
                          </p>
                          <p className="text-xs text-gray-500">
                            {account.server || "N/A"}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {user ? (
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-xs">
                              {user.first_name?.charAt(0)}
                              {user.last_name?.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {user.first_name} {user.last_name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">No user</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded capitalize bg-indigo-100 text-indigo-700">
                          {account.account_type}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700">
                          {account.platform || "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            ${parseFloat(account.balance || 0).toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {account.currency || "USD"}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-700">
                        {account.leverage || "N/A"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <StatusBadge status={account.status} />
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
                            onClick={() =>
                              setDeleteModalAccount({ ...account, user })
                            }
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Account"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
          users={users}
          accountTypes={accountTypes}
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

      {createModalOpen && (
        <CreateAccountModal
          onClose={() => setCreateModalOpen(false)}
          onCreate={handleCreateAccount}
          users={users}
          accountTypes={accountTypes}
        />
      )}
    </>
  );
};

// ============ Helper Components ============

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
    active: "bg-green-100 text-green-700",
    inactive: "bg-gray-100 text-gray-700",
    suspended: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
        styles[status] || styles.active
      }`}
    >
      {status}
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

const InfoField = ({ label, value, icon, mono = false }) => (
  <div>
    <label className="text-xs text-gray-500 uppercase tracking-wide flex items-center gap-1">
      {icon && <span className="text-gray-400">{icon}</span>}
      {label}
    </label>
    <p
      className={`text-sm font-medium text-gray-900 mt-1 ${
        mono ? "font-mono text-xs break-all" : ""
      }`}
    >
      {value || "Not provided"}
    </p>
  </div>
);

// ============ VIEW MODAL ============

const ViewAccountModal = ({ account, onClose }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Not provided";
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
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Account Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* User Information */}
          {account.user && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
                <Users className="w-4 h-4" />
                Account Owner
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField
                  label="Full Name"
                  value={`${account.user.first_name} ${account.user.last_name}`}
                />
                <InfoField label="Email" value={account.user.email} />
                <InfoField label="Mobile" value={account.user.mobile} />
                <InfoField label="User ID" value={account.user.id} mono />
              </div>
            </div>
          )}

          {/* Account Information */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
              <Key className="w-4 h-4" />
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoField label="Account ID" value={account.id} mono />
              <InfoField label="Login" value={account.login} />
              <InfoField
                label="Account Type"
                value={account.account_type}
                className="capitalize"
              />
              <InfoField label="Platform" value={account.platform} />
              <InfoField
                label="Server"
                value={account.server}
                icon={<Server className="w-3 h-3" />}
              />
              <InfoField
                label="Currency"
                value={account.currency}
                icon={<DollarSign className="w-3 h-3" />}
              />
            </div>
          </div>

          {/* Trading Details */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Trading Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoField
                label="Balance"
                value={`$${parseFloat(account.balance || 0).toFixed(2)}`}
              />
              <InfoField
                label="Equity"
                value={`$${parseFloat(account.equity || 0).toFixed(2)}`}
              />
              <InfoField label="Leverage" value={account.leverage} />
              <InfoField
                label="Margin"
                value={`$${parseFloat(account.margin || 0).toFixed(2)}`}
              />
              <InfoField
                label="Free Margin"
                value={`$${parseFloat(account.free_margin || 0).toFixed(2)}`}
              />
              <InfoField
                label="Margin Level"
                value={
                  account.margin_level ? `${account.margin_level}%` : "N/A"
                }
              />
            </div>
          </div>

          {/* Account Type Details */}
          {account.accountType && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Account Type Configuration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoField label="Type Name" value={account.accountType.name} />
                <InfoField
                  label="Spread Type"
                  value={account.accountType.spread_type}
                />
                <InfoField
                  label="Spread Value"
                  value={account.accountType.spread_value}
                />
                <InfoField
                  label="Commission"
                  value={account.accountType.commission || "None"}
                />
                <InfoField
                  label="Margin Call"
                  value={account.accountType.margin_call}
                />
                <InfoField
                  label="Stop Out"
                  value={account.accountType.stop_out}
                />
              </div>
            </div>
          )}

          {/* Status and Timestamps */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
              Status & Timestamps
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">
                  Status
                </label>
                <div className="mt-1">
                  <StatusBadge status={account.status} />
                </div>
              </div>
              <InfoField
                label="Created At"
                value={formatDate(account.created_at)}
              />
              <InfoField
                label="Updated At"
                value={formatDate(account.updated_at)}
              />
            </div>
          </div>
        </div>

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

// ============ CREATE MODAL ============

const CreateAccountModal = ({ onClose, onCreate, users, accountTypes }) => {
  const [formData, setFormData] = useState({
    user_id: "",
    account_type_id: "",
    login: "",
    password: "",
    account_type: "demo",
    platform: "MT5",
    server: "",
    balance: 0,
    currency: "USD",
    leverage: "1:100",
    status: "active",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      await onCreate(formData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create account");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Create Trading Account
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

          {/* User Selection */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
              Account Owner
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select User *
              </label>
              <select
                name="user_id"
                value={formData.user_id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Choose a user...</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name} ({user.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Account Configuration */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
              Account Configuration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Type Config
                </label>
                <select
                  name="account_type_id"
                  value={formData.account_type_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select account type...</option>
                  {accountTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Type *
                </label>
                <select
                  name="account_type"
                  value={formData.account_type}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="demo">Demo</option>
                  <option value="real">Real</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Platform *
                </label>
                <select
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="MT4">MT4</option>
                  <option value="MT5">MT5</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Login *
                </label>
                <input
                  type="text"
                  name="login"
                  value={formData.login}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 123456"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Account password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Server *
                </label>
                <input
                  type="text"
                  name="server"
                  value={formData.server}
                  onChange={handleChange}
                  required
                  placeholder="e.g., DemoServer-01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Trading Parameters */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
              Trading Parameters
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Balance *
                </label>
                <input
                  type="number"
                  name="balance"
                  value={formData.balance}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency *
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="JPY">JPY</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Leverage *
                </label>
                <input
                  type="text"
                  name="leverage"
                  value={formData.leverage}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 1:100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
              Status
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
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
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Create Account
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============ EDIT MODAL ============

const EditAccountModal = ({
  account,
  users,
  accountTypes,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    user_id: account.user_id || "",
    account_type_id: account.account_type_id || "",
    login: account.login || "",
    account_type: account.account_type || "demo",
    platform: account.platform || "MT5",
    server: account.server || "",
    balance: account.balance || 0,
    currency: account.currency || "USD",
    leverage: account.leverage || "1:100",
    status: account.status || "active",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      await onSave(account.id, formData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update account");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Edit Account</h2>
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

          {/* User Selection */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
              Account Owner
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select User *
              </label>
              <select
                name="user_id"
                value={formData.user_id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Choose a user...</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name} ({user.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Account Configuration */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
              Account Configuration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Type Config
                </label>
                <select
                  name="account_type_id"
                  value={formData.account_type_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select account type...</option>
                  {accountTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Type *
                </label>
                <select
                  name="account_type"
                  value={formData.account_type}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="demo">Demo</option>
                  <option value="real">Real</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Platform *
                </label>
                <select
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="MT4">MT4</option>
                  <option value="MT5">MT5</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Login *
                </label>
                <input
                  type="text"
                  name="login"
                  value={formData.login}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Server *
                </label>
                <input
                  type="text"
                  name="server"
                  value={formData.server}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Trading Parameters */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
              Trading Parameters
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Balance *
                </label>
                <input
                  type="number"
                  name="balance"
                  value={formData.balance}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency *
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="JPY">JPY</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Leverage *
                </label>
                <input
                  type="text"
                  name="leverage"
                  value={formData.leverage}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
              Status
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
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

// ============ DELETE MODAL ============

const DeleteAccountModal = ({ account, onClose, onConfirm }) => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setError("");
    setDeleting(true);

    try {
      await onConfirm(account.id);
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
            <span className="font-semibold font-mono">#{account.login}</span>
            {account.user && (
              <>
                {" "}
                belonging to{" "}
                <span className="font-semibold">
                  {account.user.first_name} {account.user.last_name}
                </span>
              </>
            )}
            ? This action cannot be undone.
          </p>

          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-xs text-red-800">
              <strong>Warning:</strong> Deleting this account will permanently
              remove all trading history, positions, and related data.
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
