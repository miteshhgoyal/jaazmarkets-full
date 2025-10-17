import React, { useState, useEffect, useMemo } from "react";
import MetaHead from "../../components/MetaHead";
import PageHeader from "../../components/ui/PageHeader";
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
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Hash,
  Wallet,
  User,
  Edit2,
  Trash2,
  Save,
  RefreshCw,
} from "lucide-react";
import api from "../../services/api";

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
  { label: "Crypto", value: "crypto" },
  { label: "Card", value: "card" },
  { label: "Wallet", value: "wallet" },
];

const Deposits = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewModalDeposit, setViewModalDeposit] = useState(null);
  const [editModalDeposit, setEditModalDeposit] = useState(null);
  const [deleteConfirmDeposit, setDeleteConfirmDeposit] = useState(null);

  // Fetch all deposits with populated data
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/transactions/admin/deposits?limit=1000");
      setDeposits(response.data.data || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  // Filter and search deposits
  const filteredDeposits = useMemo(() => {
    return deposits.filter((deposit) => {
      const user = deposit.userId;

      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        (deposit._id || deposit.id || "").toLowerCase().includes(searchLower) ||
        deposit.transactionId?.toLowerCase().includes(searchLower) ||
        deposit.paymentMethod?.toLowerCase().includes(searchLower) ||
        (user &&
          (user.firstName?.toLowerCase().includes(searchLower) ||
            user.lastName?.toLowerCase().includes(searchLower) ||
            user.email?.toLowerCase().includes(searchLower)));

      const matchesStatus =
        statusFilter === "all" || deposit.status === statusFilter;
      const matchesMethod =
        methodFilter === "all" || deposit.paymentMethod === methodFilter;

      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [deposits, searchQuery, statusFilter, methodFilter]);

  // Sort deposits
  const sortedDeposits = useMemo(() => {
    if (!sortField) return filteredDeposits;

    return [...filteredDeposits].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "createdAt" || sortField === "completedAt") {
        aValue = new Date(aValue || 0).getTime();
        bValue = new Date(bValue || 0).getTime();
      }

      if (sortField === "amount") {
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
  }, [filteredDeposits, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedDeposits.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDeposits = sortedDeposits.slice(startIndex, endIndex);

  useEffect(() => {
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
    const completed = deposits.filter((d) => d.status === "completed");
    const totalDeposited = completed.reduce(
      (sum, d) => sum + parseFloat(d.amount || 0),
      0
    );
    const pending = deposits.filter(
      (d) => d.status === "pending" || d.status === "processing"
    ).length;

    return {
      totalDeposits: deposits.length,
      completedDeposits: completed.length,
      totalAmount: totalDeposited.toFixed(2),
      pendingDeposits: pending,
    };
  }, [deposits]);

  // Handle Delete Deposit
  const handleDeleteDeposit = async (depositId) => {
    try {
      await api.delete(`/transactions/admin/deposits/${depositId}`);
      setDeposits(deposits.filter((d) => (d._id || d.id) !== depositId));
      setDeleteConfirmDeposit(null);
      alert("Deposit deleted successfully");
    } catch (err) {
      console.error("Error deleting deposit:", err);
      alert(err.response?.data?.message || "Failed to delete deposit");
    }
  };

  const csvHeaders = [
    { label: "Transaction ID", key: "transactionId" },
    { label: "User", key: "userId.firstName" },
    { label: "Email", key: "userId.email" },
    { label: "Amount", key: "amount" },
    { label: "Currency", key: "currency" },
    { label: "Method", key: "paymentMethod" },
    { label: "Status", key: "status" },
    { label: "Created At", key: "createdAt" },
  ];

  if (loading) {
    return (
      <>
        <MetaHead
          title="Deposits"
          description="View and manage all deposits"
          keywords="deposits, transactions, crypto deposits"
        />
        <PageHeader
          title="Deposit Transactions"
          subtitle="View and manage all deposit transactions"
        />
        <div className="flex justify-center items-center mt-20">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-gray-600">Loading deposits...</span>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <MetaHead
          title="Deposits"
          description="View and manage all deposits"
          keywords="deposits, transactions, crypto deposits"
        />
        <PageHeader
          title="Deposit Transactions"
          subtitle="View and manage all deposit transactions"
        />
        <div className="flex flex-col justify-center items-center mt-20 gap-4">
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-red-600">Error loading deposits: {error}</p>
          </div>
          <button
            onClick={fetchAllData}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <MetaHead
        title="Deposits"
        description="View and manage all deposits"
        keywords="deposits, transactions, crypto deposits"
      />

      <PageHeader
        title="Deposit Transactions"
        subtitle="View and manage all deposit transactions"
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Total Deposits
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalDeposits}
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
                {stats.completedDeposits}
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
                {stats.pendingDeposits}
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
            placeholder="Search by transaction ID, payment method, or user..."
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

          <button
            onClick={fetchAllData}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        <CSVLink
          data={sortedDeposits}
          headers={csvHeaders}
          filename={`deposits-${new Date().toISOString().split("T")[0]}.csv`}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download CSV
        </CSVLink>
      </div>

      {/* Results Count */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <span>
          Showing {paginatedDeposits.length} of {sortedDeposits.length} deposits
          {sortedDeposits.length !== deposits.length &&
            ` (filtered from ${deposits.length} total)`}
        </span>
      </div>

      {/* Deposits Table */}
      <div className="mt-4 bg-white border border-gray-200 rounded-xl overflow-hidden">
        {sortedDeposits.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500">
              No deposits found matching your filters
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
                      onClick={() => handleSort("transactionId")}
                    >
                      <div className="flex items-center gap-1">
                        Transaction ID
                        <SortIcon
                          field="transactionId"
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
                      Account
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
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
                  {paginatedDeposits.map((deposit) => {
                    const user = deposit.userId;
                    const account = deposit.tradingAccountId;
                    const depositId = deposit._id || deposit.id;

                    return (
                      <tr key={depositId} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <p className="text-sm font-mono font-medium text-gray-900">
                            {deposit.transactionId}
                          </p>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {user ? (
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-xs">
                                {user.firstName?.charAt(0) || ""}
                                {user.lastName?.charAt(0) || ""}
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
                            <p className="text-sm font-semibold text-gray-900">
                              ${parseFloat(deposit.amount || 0).toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {deposit.currency}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {account ? (
                            <div>
                              <p className="text-sm font-mono font-medium text-gray-900">
                                {account.accountNumber}
                              </p>
                              <p className="text-xs text-gray-500">
                                {account.platform} • {account.accountClass}
                              </p>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm text-gray-700 capitalize">
                            {deposit.paymentMethod?.replace("_", " ") || "N/A"}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <StatusBadge status={deposit.status} />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {new Date(deposit.createdAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setViewModalDeposit(deposit)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditModalDeposit(deposit)}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Edit Deposit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmDeposit(depositId)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Deposit"
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
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              startIndex={startIndex}
              endIndex={endIndex}
              totalItems={sortedDeposits.length}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      {/* View Modal */}
      {viewModalDeposit && (
        <ViewDepositModal
          deposit={viewModalDeposit}
          onClose={() => setViewModalDeposit(null)}
        />
      )}

      {/* Edit Modal */}
      {editModalDeposit && (
        <EditDepositModal
          deposit={editModalDeposit}
          onClose={() => setEditModalDeposit(null)}
          onUpdate={(updatedDeposit) => {
            setDeposits(
              deposits.map((d) =>
                (d._id || d.id) === (updatedDeposit._id || updatedDeposit.id)
                  ? updatedDeposit
                  : d
              )
            );
            setEditModalDeposit(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmDeposit && (
        <DeleteConfirmModal
          depositId={deleteConfirmDeposit}
          onConfirm={handleDeleteDeposit}
          onCancel={() => setDeleteConfirmDeposit(null)}
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
    pending: "bg-orange-100 text-orange-700",
    failed: "bg-red-100 text-red-700",
    cancelled: "bg-gray-100 text-gray-700",
  };
  return (
    <span
      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${
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

// View Deposit Modal
const ViewDepositModal = ({ deposit, onClose }) => {
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

  const user = deposit.userId;
  const account = deposit.tradingAccountId;
  const processedBy = deposit.processedBy;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Deposit Details
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
          {user && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
                <User className="w-4 h-4" />
                User Information
              </h3>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                  {user.firstName?.charAt(0)}
                  {user.lastName?.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                  {user.phoneNumber && (
                    <p className="text-xs text-gray-500">{user.phoneNumber}</p>
                  )}
                  {user.country && (
                    <p className="text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        📍 {user.country}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Deposit Information */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Deposit Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">
                  Transaction ID
                </label>
                <p className="text-sm font-medium text-gray-900 mt-1 font-mono">
                  {deposit.transactionId}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">
                  Status
                </label>
                <div className="mt-1">
                  <StatusBadge status={deposit.status} />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">
                  Amount
                </label>
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  ${parseFloat(deposit.amount || 0).toFixed(2)}{" "}
                  {deposit.currency}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">
                  Payment Method
                </label>
                <p className="text-sm font-medium text-gray-900 mt-1 capitalize">
                  {deposit.paymentMethod?.replace("_", " ")}
                </p>
              </div>
            </div>
          </div>

          {/* Trading Account */}
          {account && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                Trading Account
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">
                    Account Number
                  </label>
                  <p className="text-sm font-mono font-medium text-gray-900 mt-1">
                    {account.accountNumber}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">
                    Login
                  </label>
                  <p className="text-sm font-mono font-medium text-gray-900 mt-1">
                    {account.login}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">
                    Platform
                  </label>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {account.platform}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">
                    Account Type
                  </label>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {account.accountType} • {account.accountClass}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">
                    Balance
                  </label>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    ${parseFloat(account.balance || 0).toFixed(2)}{" "}
                    {account.currency}
                  </p>
                </div>
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
          )}

          {/* Payment Details */}
          {deposit.paymentDetails &&
            Object.keys(deposit.paymentDetails).length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Payment Details
                </h3>
                <div className="space-y-3">
                  {Object.entries(deposit.paymentDetails)
                    .filter(([_, value]) => value)
                    .map(([key, value]) => (
                      <div key={key}>
                        <label className="text-xs text-gray-500 uppercase tracking-wide">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </label>
                        <p className="text-sm font-mono text-gray-900 mt-1 break-all">
                          {value}
                        </p>
                      </div>
                    ))}
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
                  {formatDate(deposit.createdAt)}
                </p>
              </div>
              {deposit.processedAt && (
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">
                    Processed At
                  </label>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {formatDate(deposit.processedAt)}
                  </p>
                </div>
              )}
              {deposit.completedAt && (
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">
                    Completed At
                  </label>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {formatDate(deposit.completedAt)}
                  </p>
                </div>
              )}
              {processedBy && (
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">
                    Processed By
                  </label>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {processedBy.firstName} {processedBy.lastName}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {(deposit.adminNotes || deposit.userNotes) && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
                Notes
              </h3>
              {deposit.userNotes && (
                <div className="mb-3">
                  <label className="text-xs text-gray-500 uppercase tracking-wide">
                    User Notes
                  </label>
                  <p className="text-sm text-gray-700 mt-1 p-3 bg-gray-50 rounded-lg">
                    {deposit.userNotes}
                  </p>
                </div>
              )}
              {deposit.adminNotes && (
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">
                    Admin Notes
                  </label>
                  <p className="text-sm text-gray-700 mt-1 p-3 bg-blue-50 rounded-lg">
                    {deposit.adminNotes}
                  </p>
                </div>
              )}
            </div>
          )}
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

// Edit Deposit Modal
const EditDepositModal = ({ deposit, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    status: deposit.status || "pending",
    amount: deposit.amount || 0,
    currency: deposit.currency || "USD",
    adminNotes: deposit.adminNotes || "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const depositId = deposit._id || deposit.id;

      // Update deposit status and admin notes
      const statusRes = await api.patch(
        `/transactions/admin/deposits/${depositId}/status`,
        {
          status: formData.status,
          adminNotes: formData.adminNotes,
        }
      );

      // If amount or currency changed, make additional update
      if (
        formData.amount !== deposit.amount ||
        formData.currency !== deposit.currency
      ) {
        await api.patch(`/transactions/admin/deposits/${depositId}`, {
          amount: formData.amount,
          currency: formData.currency,
        });
      }

      alert("Deposit updated successfully");

      // Re-populate the data
      const updatedRes = await api.get(
        "/transactions/admin/deposits?limit=1000"
      );
      const updatedDeposit = updatedRes.data.data.find(
        (d) => (d._id || d.id) === depositId
      );

      onUpdate(updatedDeposit || statusRes.data.data);
    } catch (err) {
      console.error("Error updating deposit:", err);
      alert(err.response?.data?.message || "Failed to update deposit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Edit Deposit</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: parseFloat(e.target.value) })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <select
              value={formData.currency}
              onChange={(e) =>
                setFormData({ ...formData, currency: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
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
              Admin Notes
            </label>
            <textarea
              value={formData.adminNotes}
              onChange={(e) =>
                setFormData({ ...formData, adminNotes: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              rows="4"
              placeholder="Add any admin notes here..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteConfirmModal = ({ depositId, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-red-100 rounded-full">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Delete Deposit
          </h2>
        </div>

        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this deposit? This action cannot be
          undone and will refund the amount if the deposit was completed.
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => onConfirm(depositId)}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Deposits;
