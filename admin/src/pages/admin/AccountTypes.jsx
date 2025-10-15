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
  Percent,
  CheckCircle,
  XCircle,
} from "lucide-react";

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

const STATUS_FILTERS = [
  { label: "All Status", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const AccountTypes = () => {
  const [accountTypes, setAccountTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal states
  const [viewModalAccountType, setViewModalAccountType] = useState(null);
  const [editModalAccountType, setEditModalAccountType] = useState(null);
  const [deleteModalAccountType, setDeleteModalAccountType] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Fetch all account types from API
  const fetchAccountTypes = async () => {
    try {
      setError(null);
      const response = await api.get("/admin/account-types");

      if (response.data.data && Array.isArray(response.data.data)) {
        setAccountTypes(response.data.data);
      } else {
        setAccountTypes([]);
      }
    } catch (err) {
      console.error("Error fetching account types:", err);
      setError(err.response?.data?.message || "Failed to fetch account types");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAccountTypes();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAccountTypes();
  };

  // Fetch single account type by ID
  const fetchAccountTypeById = async (accountTypeId) => {
    try {
      const response = await api.get(`/admin/account-types/${accountTypeId}`);
      return response.data.data;
    } catch (err) {
      console.error("Error fetching account type:", err);
      throw err;
    }
  };

  // Open view modal and fetch full details
  const handleViewAccountType = async (accountType) => {
    try {
      const fullData = await fetchAccountTypeById(accountType.id);
      setViewModalAccountType(fullData);
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to fetch account type details"
      );
    }
  };

  // Open edit modal and fetch full details
  const handleEditAccountType = async (accountType) => {
    try {
      const fullData = await fetchAccountTypeById(accountType.id);
      setEditModalAccountType(fullData);
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to fetch account type details"
      );
    }
  };

  // Create account type
  const handleCreateAccountType = async (newData) => {
    try {
      const response = await api.post("/admin/account-types", newData);

      if (response.data.status === 200) {
        await fetchAccountTypes();
        return true;
      }
    } catch (err) {
      console.error("Error creating account type:", err);
      throw err;
    }
  };

  // Update account type
  const handleUpdateAccountType = async (accountTypeId, updatedData) => {
    try {
      const response = await api.put(
        `/admin/account-types/${accountTypeId}`,
        updatedData
      );

      if (response.data.status === 200) {
        await fetchAccountTypes();
        return true;
      }
    } catch (err) {
      console.error("Error updating account type:", err);
      throw err;
    }
  };

  // Delete account type
  const handleDeleteAccountType = async (accountTypeId) => {
    try {
      const response = await api.delete(
        `/admin/account-types/${accountTypeId}`
      );

      if (response.data.status === 200) {
        setAccountTypes(accountTypes.filter((at) => at.id !== accountTypeId));
        return true;
      }
    } catch (err) {
      console.error("Error deleting account type:", err);
      throw err;
    }
  };

  // Filter and search
  const filteredAccountTypes = useMemo(() => {
    return accountTypes.filter((accountType) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        accountType.name?.toLowerCase().includes(searchLower) ||
        accountType.description?.toLowerCase().includes(searchLower) ||
        accountType.leverage?.toLowerCase().includes(searchLower);

      const matchesStatus =
        statusFilter === "all" || accountType.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [accountTypes, searchQuery, statusFilter]);

  // Sort
  const sortedAccountTypes = useMemo(() => {
    if (!sortField) return filteredAccountTypes;

    return [...filteredAccountTypes].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (aValue == null) aValue = "";
      if (bValue == null) bValue = "";

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
  }, [filteredAccountTypes, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedAccountTypes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAccountTypes = sortedAccountTypes.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, itemsPerPage]);

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
    { label: "ID", key: "id" },
    { label: "Name", key: "name" },
    { label: "Description", key: "description" },
    { label: "Leverage", key: "leverage" },
    { label: "Spread Type", key: "spread_type" },
    { label: "Spread Value", key: "spread_value" },
    { label: "Commission", key: "commission" },
    { label: "Margin Call", key: "margin_call" },
    { label: "Stop Out", key: "stop_out" },
    { label: "Min Amount", key: "min_amount" },
    { label: "Status", key: "status" },
  ];

  if (loading) {
    return (
      <>
        <MetaHead
          title="Account Types"
          description="Manage trading account types"
          keywords="account types, trading accounts, forex"
        />
        <PageHeader
          title="Account Types"
          subtitle="Manage trading account types and configurations"
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
          title="Account Types"
          description="Manage trading account types"
          keywords="account types, trading accounts, forex"
        />
        <PageHeader
          title="Account Types"
          subtitle="Manage trading account types and configurations"
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
        title="Account Types"
        description="Manage trading account types"
        keywords="account types, trading accounts, forex"
      />

      <PageHeader
        title="Account Types"
        subtitle="Manage trading account types and configurations"
      />

      {/* Filters and Actions */}
      <div className="mt-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, description, or leverage..."
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
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Account Type
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
              data={sortedAccountTypes}
              headers={csvHeaders}
              filename={`account-types-${
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
            Showing {paginatedAccountTypes.length} of{" "}
            {sortedAccountTypes.length} account types
            {sortedAccountTypes.length !== accountTypes.length &&
              ` (filtered from ${accountTypes.length} total)`}
          </span>
        </div>
      </div>

      {/* Account Types Table */}
      {sortedAccountTypes.length === 0 ? (
        <div className="mt-6 bg-white border border-gray-200 rounded-xl p-12">
          <div className="text-center">
            <p className="text-gray-500">No account types found</p>
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
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-1">
                      Name
                      <SortIcon
                        field="name"
                        sortField={sortField}
                        sortDirection={sortDirection}
                      />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("leverage")}
                  >
                    <div className="flex items-center gap-1">
                      Leverage
                      <SortIcon
                        field="leverage"
                        sortField={sortField}
                        sortDirection={sortDirection}
                      />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Spread
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("min_amount")}
                  >
                    <div className="flex items-center gap-1">
                      Min Amount
                      <SortIcon
                        field="min_amount"
                        sortField={sortField}
                        sortDirection={sortDirection}
                      />
                    </div>
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
                {paginatedAccountTypes.map((accountType) => (
                  <tr key={accountType.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-semibold text-xs">
                          {accountType.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {accountType.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-700 max-w-xs truncate">
                        {accountType.description}
                      </p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-900">
                        <TrendingUp className="w-3 h-3 text-blue-600" />
                        {accountType.leverage}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        <span className="font-medium capitalize">
                          {accountType.spread_type}
                        </span>
                        {accountType.spread_value && (
                          <span className="text-gray-500 ml-1">
                            ({accountType.spread_value})
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {accountType.commission || "None"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-900">
                        <DollarSign className="w-3 h-3 text-green-600" />
                        {accountType.min_amount}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={accountType.status} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewAccountType(accountType)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditAccountType(accountType)}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteModalAccountType(accountType)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
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
                {startIndex + 1}-{Math.min(endIndex, sortedAccountTypes.length)}{" "}
                of {sortedAccountTypes.length}
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
      {viewModalAccountType && (
        <ViewAccountTypeModal
          accountType={viewModalAccountType}
          onClose={() => setViewModalAccountType(null)}
        />
      )}

      {editModalAccountType && (
        <EditAccountTypeModal
          accountType={editModalAccountType}
          onClose={() => setEditModalAccountType(null)}
          onSave={handleUpdateAccountType}
        />
      )}

      {deleteModalAccountType && (
        <DeleteAccountTypeModal
          accountType={deleteModalAccountType}
          onClose={() => setDeleteModalAccountType(null)}
          onConfirm={handleDeleteAccountType}
        />
      )}

      {createModalOpen && (
        <CreateAccountTypeModal
          onClose={() => setCreateModalOpen(false)}
          onCreate={handleCreateAccountType}
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
    active: "bg-green-100 text-green-700",
    inactive: "bg-gray-100 text-gray-700",
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

// View Modal
const ViewAccountTypeModal = ({ accountType, onClose }) => {
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
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Account Type Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoField label="Account Type ID" value={accountType.id} mono />
              <InfoField label="Name" value={accountType.name} />
              <InfoField
                label="Description"
                value={accountType.description}
                className="md:col-span-2"
              />
              <InfoField label="Leverage" value={accountType.leverage} />
              <InfoField label="Status" badge>
                <StatusBadge status={accountType.status} />
              </InfoField>
            </div>
          </div>

          {/* Trading Parameters */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
              Trading Parameters
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoField
                label="Spread Type"
                value={accountType.spread_type}
                className="capitalize"
              />
              <InfoField
                label="Spread Value"
                value={accountType.spread_value || "N/A"}
              />
              <InfoField
                label="Commission"
                value={accountType.commission || "None"}
              />
              <InfoField
                label="Minimum Amount"
                value={`$${accountType.min_amount}`}
              />
              <InfoField
                label="Margin Call Level"
                value={accountType.margin_call}
              />
              <InfoField label="Stop Out Level" value={accountType.stop_out} />
            </div>
          </div>

          {/* Timestamps */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
              Timestamps
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoField
                label="Created At"
                value={formatDate(accountType.created_at)}
              />
              <InfoField
                label="Updated At"
                value={formatDate(accountType.updated_at)}
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

// Info Field Component
const InfoField = ({
  label,
  value,
  icon,
  mono = false,
  badge,
  children,
  className,
}) => (
  <div className={className}>
    <label className="text-xs text-gray-500 uppercase tracking-wide flex items-center gap-1">
      {icon && <span className="text-gray-400">{icon}</span>}
      {label}
    </label>
    {badge ? (
      <div className="mt-1">{children}</div>
    ) : (
      <p
        className={`text-sm font-medium text-gray-900 mt-1 ${
          mono ? "font-mono text-xs" : ""
        }`}
      >
        {value || "Not provided"}
      </p>
    )}
  </div>
);

// Create Modal
const CreateAccountTypeModal = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    leverage: "1:100",
    spread_type: "variable",
    spread_value: "1.5 pips",
    commission: "$7 per lot",
    margin_call: "50%",
    stop_out: "20%",
    status: "active",
    min_amount: 100,
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
      setError(err.response?.data?.message || "Failed to create account type");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Create Account Type
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

          {/* Basic Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Standard Account"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
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
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Describe the account type..."
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Spread Type *
                </label>
                <select
                  name="spread_type"
                  value={formData.spread_type}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="fixed">Fixed</option>
                  <option value="variable">Variable</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Spread Value *
                </label>
                <input
                  type="text"
                  name="spread_value"
                  value={formData.spread_value}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 1.5 pips"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Commission
                </label>
                <input
                  type="text"
                  name="commission"
                  value={formData.commission}
                  onChange={handleChange}
                  placeholder="e.g., $7 per lot or None"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Amount *
                </label>
                <input
                  type="number"
                  name="min_amount"
                  value={formData.min_amount}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Margin Call Level *
                </label>
                <input
                  type="text"
                  name="margin_call"
                  value={formData.margin_call}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 50%"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stop Out Level *
                </label>
                <input
                  type="text"
                  name="stop_out"
                  value={formData.stop_out}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 20%"
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
                Status *
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
                  Create Account Type
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Modal (similar to Create, but with existing data)
const EditAccountTypeModal = ({ accountType, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: accountType.name || "",
    description: accountType.description || "",
    leverage: accountType.leverage || "",
    spread_type: accountType.spread_type || "variable",
    spread_value: accountType.spread_value || "",
    commission: accountType.commission || "",
    margin_call: accountType.margin_call || "",
    stop_out: accountType.stop_out || "",
    status: accountType.status || "active",
    min_amount: accountType.min_amount || 0,
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
      await onSave(accountType.id, formData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update account type");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Edit Account Type
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

          {/* Same form fields as Create Modal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
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
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
              Trading Parameters
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Spread Type *
                </label>
                <select
                  name="spread_type"
                  value={formData.spread_type}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="fixed">Fixed</option>
                  <option value="variable">Variable</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Spread Value *
                </label>
                <input
                  type="text"
                  name="spread_value"
                  value={formData.spread_value}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Commission
                </label>
                <input
                  type="text"
                  name="commission"
                  value={formData.commission}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Amount *
                </label>
                <input
                  type="number"
                  name="min_amount"
                  value={formData.min_amount}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Margin Call Level *
                </label>
                <input
                  type="text"
                  name="margin_call"
                  value={formData.margin_call}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stop Out Level *
                </label>
                <input
                  type="text"
                  name="stop_out"
                  value={formData.stop_out}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
              Status
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status *
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
              </select>
            </div>
          </div>

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

// Delete Modal
const DeleteAccountTypeModal = ({ accountType, onClose, onConfirm }) => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setError("");
    setDeleting(true);

    try {
      await onConfirm(accountType.id);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete account type");
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
            Delete Account Type
          </h2>

          <p className="text-sm text-gray-600 text-center mb-4">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{accountType.name}</span>? This
            action cannot be undone.
          </p>

          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-xs text-red-800">
              <strong>Warning:</strong> Deleting this account type may affect
              existing user accounts using this type.
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
                "Delete Account Type"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountTypes;
