import React, { useState, useMemo } from "react";
import MetaHead from "../../components/MetaHead";
import PageHeader from "../../components/ui/PageHeader";
import { useData } from "../../hooks/useData";
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
  Search,
  X,
  DollarSign,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Hash,
  Wallet,
  User,
  ArrowDownCircle,
} from "lucide-react";

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

const STATUS_FILTERS = [
  { label: "All Status", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "Processing", value: "processing" },
  { label: "Pending", value: "pending" },
  { label: "Failed", value: "failed" },
  { label: "Cancelled", value: "cancelled" },
];

const METHOD_FILTERS = [
  { label: "All Methods", value: "all" },
  { label: "Bank Transfer", value: "bank_transfer" },
  { label: "Bitcoin", value: "btc" },
  { label: "USDT ERC20", value: "usdt_erc20" },
  { label: "USDT TRC20", value: "usdt_trc20" },
  { label: "Ethereum", value: "eth" },
  { label: "TRON", value: "trx" },
  { label: "USDC", value: "usdc_erc20" },
];

const Withdrawals = () => {
  const { data: users } = useData("users");
  const { data: accounts } = useData("accounts");
  const { data: withdrawals, loading, error } = useData("withdrawals");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewModalWithdrawal, setViewModalWithdrawal] = useState(null);

  // Get user for withdrawal
  const getUserForWithdrawal = (userId) => {
    return users.find((user) => user.id === userId);
  };

  // Get account for withdrawal
  const getAccountForWithdrawal = (accountId) => {
    if (!accounts || typeof accounts !== "object") return null;
    const allAccounts = [
      ...(accounts.real || []),
      ...(accounts.demo || []),
      ...(accounts.archived || []),
    ];
    return allAccounts.find((acc) => acc.id === accountId);
  };

  // Filter and search withdrawals
  const filteredWithdrawals = useMemo(() => {
    return withdrawals.filter((withdrawal) => {
      const user = getUserForWithdrawal(withdrawal.userId);

      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        withdrawal.id.toLowerCase().includes(searchLower) ||
        withdrawal.transactionHash?.toLowerCase().includes(searchLower) ||
        withdrawal.methodName.toLowerCase().includes(searchLower) ||
        withdrawal.destinationAddress?.toLowerCase().includes(searchLower) ||
        (user &&
          (user.firstName.toLowerCase().includes(searchLower) ||
            user.lastName.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower)));

      const matchesStatus =
        statusFilter === "all" || withdrawal.status === statusFilter;
      const matchesMethod =
        methodFilter === "all" || withdrawal.method === methodFilter;

      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [withdrawals, searchQuery, statusFilter, methodFilter, users]);

  // Sort withdrawals
  const sortedWithdrawals = useMemo(() => {
    if (!sortField) return filteredWithdrawals;

    return [...filteredWithdrawals].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "createdAt" || sortField === "completedAt") {
        aValue = new Date(aValue || 0).getTime();
        bValue = new Date(bValue || 0).getTime();
      }

      if (sortField === "amount" || sortField === "netAmount") {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }

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
  }, [filteredWithdrawals, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedWithdrawals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedWithdrawals = sortedWithdrawals.slice(startIndex, endIndex);

  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, methodFilter, itemsPerPage]);

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
    const completed = withdrawals.filter((w) => w.status === "completed");
    const totalWithdrawn = completed.reduce(
      (sum, w) => sum + parseFloat(w.amount),
      0
    );
    const pending = withdrawals.filter(
      (w) => w.status === "pending" || w.status === "processing"
    ).length;

    return {
      totalWithdrawals: withdrawals.length,
      completedWithdrawals: completed.length,
      totalAmount: totalWithdrawn.toFixed(2),
      pendingWithdrawals: pending,
    };
  }, [withdrawals]);

  const csvHeaders = [
    { label: "Withdrawal ID", key: "id" },
    { label: "Amount", key: "amount" },
    { label: "Currency", key: "currency" },
    { label: "Method", key: "methodName" },
    { label: "Status", key: "status" },
    { label: "Transaction Hash", key: "transactionHash" },
    { label: "Destination", key: "destinationAddress" },
    { label: "Created At", key: "createdAt" },
    { label: "Completed At", key: "completedAt" },
  ];

  if (loading) {
    return (
      <>
        <MetaHead
          title="Withdrawals"
          description="View and manage all withdrawals"
          keywords="withdrawals, transactions, crypto withdrawals"
        />
        <PageHeader
          title="Withdrawal Transactions"
          subtitle="View and manage all withdrawal transactions"
        />
        <div className="flex justify-center items-center mt-20">
          <div className="animate-pulse text-gray-600">
            Loading withdrawals...
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <MetaHead
          title="Withdrawals"
          description="View and manage all withdrawals"
          keywords="withdrawals, transactions, crypto withdrawals"
        />
        <PageHeader
          title="Withdrawal Transactions"
          subtitle="View and manage all withdrawal transactions"
        />
        <div className="flex justify-center items-center mt-20">
          <p className="text-red-600">Error loading withdrawals: {error}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <MetaHead
        title="Withdrawals"
        description="View and manage all withdrawals"
        keywords="withdrawals, transactions, crypto withdrawals"
      />

      <PageHeader
        title="Withdrawal Transactions"
        subtitle="View and manage all withdrawal transactions"
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-50 rounded-lg">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Total Withdrawals
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalWithdrawals}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Completed
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.completedWithdrawals}
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
                Total Amount
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                ${stats.totalAmount}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-50 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Pending
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.pendingWithdrawals}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mt-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by withdrawal ID, transaction hash, destination, method, or user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          />
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-4">
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
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
          >
            {METHOD_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        <CSVLink
          data={sortedWithdrawals}
          headers={csvHeaders}
          filename={`withdrawals-${new Date().toISOString().split("T")[0]}.csv`}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download CSV
        </CSVLink>
      </div>

      {/* Results Count */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <span>
          Showing {paginatedWithdrawals.length} of {sortedWithdrawals.length}{" "}
          withdrawals
          {sortedWithdrawals.length !== withdrawals.length &&
            ` (filtered from ${withdrawals.length} total)`}
        </span>
      </div>

      {/* Withdrawals Table */}
      <div className="mt-4 bg-white border border-gray-200 rounded-xl overflow-hidden">
        {sortedWithdrawals.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500">
              No withdrawals found matching your filters
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("id")}
                    >
                      <div className="flex items-center gap-1">
                        Withdrawal ID
                        <SortIcon
                          field="id"
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
                      onClick={() => handleSort("amount")}
                    >
                      <div className="flex items-center gap-1">
                        Amount
                        <SortIcon
                          field="amount"
                          sortField={sortField}
                          sortDirection={sortDirection}
                        />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Destination
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("createdAt")}
                    >
                      <div className="flex items-center gap-1">
                        Created At
                        <SortIcon
                          field="createdAt"
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
                  {paginatedWithdrawals.map((withdrawal) => {
                    const user = getUserForWithdrawal(withdrawal.userId);
                    const account = getAccountForWithdrawal(
                      withdrawal.accountId
                    );
                    return (
                      <tr key={withdrawal.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <p className="text-sm font-mono font-medium text-gray-900">
                            {withdrawal.id}
                          </p>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {user ? (
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-semibold text-xs">
                                {user.firstName.charAt(0)}
                                {user.lastName.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {user.firstName} {user.lastName}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">
                              No user
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-semibold text-red-600">
                              -${parseFloat(withdrawal.amount).toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {withdrawal.currency}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm text-gray-700">
                            {withdrawal.methodName}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <p className="text-xs font-mono text-gray-600 max-w-[150px] truncate">
                            {withdrawal.destinationAddress || "N/A"}
                          </p>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <StatusBadge status={withdrawal.status} />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {new Date(withdrawal.createdAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button
                            onClick={() =>
                              setViewModalWithdrawal({
                                ...withdrawal,
                                user,
                                account,
                              })
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
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              startIndex={startIndex}
              endIndex={endIndex}
              totalItems={sortedWithdrawals.length}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      {/* View Modal */}
      {viewModalWithdrawal && (
        <ViewWithdrawalModal
          withdrawal={viewModalWithdrawal}
          onClose={() => setViewModalWithdrawal(null)}
        />
      )}
    </>
  );
};

// Helper Components
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
    completed: "bg-green-100 text-green-700",
    processing: "bg-blue-100 text-blue-700",
    pending: "bg-yellow-100 text-yellow-700",
    failed: "bg-red-100 text-red-700",
    cancelled: "bg-gray-100 text-gray-700",
  };
  return (
    <span
      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
        styles[status] || styles.pending
      }`}
    >
      {status}
    </span>
  );
};

const Pagination = ({
  currentPage,
  totalPages,
  itemsPerPage,
  setItemsPerPage,
  startIndex,
  endIndex,
  totalItems,
  onPageChange,
}) => {
  return (
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
          {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 py-1 text-sm">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// View Withdrawal Modal
const ViewWithdrawalModal = ({ withdrawal, onClose }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
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
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Withdrawal Details
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
          {withdrawal.user && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
                <User className="w-4 h-4" />
                User Information
              </h3>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-semibold">
                  {withdrawal.user.firstName.charAt(0)}
                  {withdrawal.user.lastName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {withdrawal.user.firstName} {withdrawal.user.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {withdrawal.user.email}
                  </p>
                  <p className="text-xs text-gray-500">
                    {withdrawal.user.phoneNumber}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Withdrawal Information */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
              <ArrowDownCircle className="w-4 h-4" />
              Withdrawal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">
                  Withdrawal ID
                </label>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {withdrawal.id}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">
                  Status
                </label>
                <div className="mt-1">
                  <StatusBadge status={withdrawal.status} />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">
                  Amount
                </label>
                <p className="text-sm font-semibold text-red-600 mt-1">
                  -${parseFloat(withdrawal.amount).toFixed(2)}{" "}
                  {withdrawal.currency}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">
                  Net Amount
                </label>
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  ${parseFloat(withdrawal.netAmount).toFixed(2)}{" "}
                  {withdrawal.currency}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">
                  Fee
                </label>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  ${parseFloat(withdrawal.fee).toFixed(2)}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">
                  Method
                </label>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {withdrawal.methodName}
                </p>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Transaction Details
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">
                  Transaction Hash
                </label>
                <p className="text-sm font-mono text-gray-900 mt-1 break-all">
                  {withdrawal.transactionHash || "Pending..."}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">
                  Destination Address
                </label>
                <p className="text-sm font-mono text-gray-900 mt-1 break-all">
                  {withdrawal.destinationAddress}
                </p>
              </div>
              {withdrawal.walletType && (
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">
                    Wallet Type
                  </label>
                  <p className="text-sm font-medium text-gray-900 mt-1 capitalize">
                    {withdrawal.walletType.replace("_", " ")}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Account Information */}
          {withdrawal.account && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                Trading Account
              </h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Account:</span> #
                  {withdrawal.account.login}
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  <span className="font-medium">Platform:</span>{" "}
                  {withdrawal.account.platform}
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  <span className="font-medium">Type:</span>{" "}
                  {withdrawal.account.accountType}
                </p>
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Timestamps
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">
                  Created At
                </label>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {formatDate(withdrawal.createdAt)}
                </p>
              </div>
              {withdrawal.completedAt && (
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">
                    Completed At
                  </label>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {formatDate(withdrawal.completedAt)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {withdrawal.notes && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
                Notes
              </h3>
              <p className="text-sm text-gray-700">{withdrawal.notes}</p>
            </div>
          )}

          {/* Status Badge */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Current Status
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {withdrawal.status === "pending" &&
                    "Withdrawal request is awaiting approval"}
                  {withdrawal.status === "processing" &&
                    "Withdrawal is being processed"}
                  {withdrawal.status === "completed" &&
                    "Withdrawal has been completed successfully"}
                  {withdrawal.status === "failed" &&
                    "Withdrawal failed - please contact support"}
                  {withdrawal.status === "cancelled" &&
                    "Withdrawal was cancelled"}
                </p>
              </div>
              <StatusBadge status={withdrawal.status} />
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

export default Withdrawals;
