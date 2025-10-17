// user/src/pages/transactions/TransactionHistory.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Download,
  Filter,
  Search,
  X,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Banknote,
  Coins,
} from "lucide-react";
import MetaHead from "../../components/MetaHead";
import { Card } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import Tabs from "../../components/ui/Tabs";
import api from "../../services/api";
import toast from "react-hot-toast";

const TransactionHistory = () => {
  const [activeTab, setActiveTab] = useState("all");

  // Data state
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filters, setFilters] = useState({
    type: "",
    status: "",
    method: "",
    currency: "",
  });

  // Fetch data on mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both deposits and withdrawals
      const [depositsRes, withdrawalsRes] = await Promise.all([
        api.get("/transactions/deposits", { params: { limit: 1000 } }),
        api.get("/transactions/withdrawals", { params: { limit: 1000 } }),
      ]);

      if (depositsRes.data.success) {
        setDeposits(depositsRes.data.data);
      }

      if (withdrawalsRes.data.success) {
        setWithdrawals(withdrawalsRes.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      setError(err.response?.data?.message || "Failed to load transactions");
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  // Combine and format transactions
  const transactions = useMemo(() => {
    const formattedDeposits = deposits.map((dep) => ({
      _id: dep._id,
      transactionId: dep.transactionId,
      type: "deposit",
      amount: dep.amount,
      currency: dep.currency,
      method: dep.paymentMethod,
      methodDetails: dep.paymentDetails?.cryptocurrency || dep.paymentMethod,
      network: dep.paymentDetails?.network || "",
      status: dep.status,
      createdAt: dep.createdAt,
      completedAt: dep.completedAt,
      fee: 0,
      description: dep.userNotes || "",
      accountNumber: dep.tradingAccountId?.accountNumber || "N/A",
    }));

    const formattedWithdrawals = withdrawals.map((wd) => ({
      _id: wd._id,
      transactionId: wd.transactionId,
      type: "withdrawal",
      amount: wd.amount,
      currency: wd.currency,
      method: wd.withdrawalMethod,
      methodDetails:
        wd.withdrawalDetails?.cryptocurrency || wd.withdrawalMethod,
      network: wd.withdrawalDetails?.network || "",
      walletAddress: wd.withdrawalDetails?.walletAddress || "",
      status: wd.status,
      createdAt: wd.createdAt,
      completedAt: wd.completedAt,
      fee: wd.fee || 0,
      netAmount: wd.netAmount,
      description: wd.adminNotes || wd.rejectionReason || "",
      accountNumber: wd.tradingAccountId?.accountNumber || "N/A",
    }));

    return [...formattedDeposits, ...formattedWithdrawals];
  }, [deposits, withdrawals]);

  // Filter transactions by tab
  const filteredByTab = useMemo(() => {
    switch (activeTab) {
      case "deposits":
        return transactions.filter((tx) => tx.type === "deposit");
      case "withdrawals":
        return transactions.filter((tx) => tx.type === "withdrawal");
      case "transfers":
        return transactions.filter((tx) => tx.type === "transfer");
      default:
        return transactions;
    }
  }, [transactions, activeTab]);

  // Apply search and filters
  const filteredTransactions = useMemo(() => {
    let filtered = filteredByTab;

    // Search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (tx) =>
          tx.transactionId?.toLowerCase().includes(searchLower) ||
          tx.method?.toLowerCase().includes(searchLower) ||
          tx.currency?.toLowerCase().includes(searchLower) ||
          tx.status?.toLowerCase().includes(searchLower) ||
          tx.type?.toLowerCase().includes(searchLower)
      );
    }

    // Type filter
    if (filters.type) {
      filtered = filtered.filter((tx) => tx.type === filters.type);
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter((tx) => tx.status === filters.status);
    }

    // Method filter
    if (filters.method) {
      filtered = filtered.filter((tx) => tx.method === filters.method);
    }

    // Currency filter
    if (filters.currency) {
      filtered = filtered.filter((tx) => tx.currency === filters.currency);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "amount-high":
          return b.amount - a.amount;
        case "amount-low":
          return a.amount - b.amount;
        case "status-asc":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    return filtered;
  }, [filteredByTab, searchTerm, filters, sortBy]);

  const setFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSortBy("newest");
    setFilters({
      type: "",
      status: "",
      method: "",
      currency: "",
    });
  };

  const hasActiveFilters =
    searchTerm !== "" ||
    filters.type !== "" ||
    filters.status !== "" ||
    filters.method !== "" ||
    filters.currency !== "" ||
    sortBy !== "newest";

  const totalCount = filteredByTab.length;
  const filteredCount = filteredTransactions.length;

  // Get unique values for filter dropdowns
  const typeOptions = [...new Set(transactions.map((tx) => tx.type))];
  const statusOptions = [...new Set(transactions.map((tx) => tx.status))];
  const methodOptions = [...new Set(transactions.map((tx) => tx.method))];
  const currencyOptions = [...new Set(transactions.map((tx) => tx.currency))];

  // Tab configuration
  const transactionTabs = [
    { id: "all", label: "All Transactions", count: transactions.length },
    {
      id: "deposits",
      label: "Deposits",
      count: transactions.filter((tx) => tx.type === "deposit").length,
    },
    {
      id: "withdrawals",
      label: "Withdrawals",
      count: transactions.filter((tx) => tx.type === "withdrawal").length,
    },
    {
      id: "transfers",
      label: "Transfers",
      count: transactions.filter((tx) => tx.type === "transfer").length,
    },
  ];

  // FIXED: Calculate summary stats properly
  const summaryStats = useMemo(() => {
    // Get all unique currencies
    const allCurrencies = [...new Set(transactions.map((t) => t.currency))];
    const primaryCurrency = allCurrencies[0] || "USD";

    // Total deposited (completed only)
    const completedDeposits = deposits.filter((d) => d.status === "completed");
    const totalDeposited = completedDeposits.reduce(
      (sum, d) => sum + d.amount,
      0
    );

    // Total withdrawn (completed only)
    const completedWithdrawals = withdrawals.filter(
      (w) => w.status === "completed"
    );
    const totalWithdrawn = completedWithdrawals.reduce(
      (sum, w) => sum + w.amount,
      0
    );

    // Pending counts
    const pendingDepositsCount = deposits.filter(
      (d) => d.status === "pending"
    ).length;
    const pendingWithdrawalsCount = withdrawals.filter(
      (w) => w.status === "pending"
    ).length;
    const pendingTransactions = pendingDepositsCount + pendingWithdrawalsCount;

    // Today's transactions
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.createdAt);
      transactionDate.setHours(0, 0, 0, 0);
      return transactionDate.getTime() === today.getTime();
    });

    const completedToday = todayTransactions.length;

    return {
      totalDeposited,
      totalWithdrawn,
      pendingTransactions,
      completedToday,
      primaryCurrency,
      pendingDepositsCount,
      pendingWithdrawalsCount,
    };
  }, [deposits, withdrawals, transactions]);

  const formatCurrency = (amount, currency) => {
    const formatted = parseFloat(amount).toFixed(2);
    return `${formatted} ${currency}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="text-green-600" size={16} />;
      case "pending":
        return <Clock className="text-orange-600" size={16} />;
      case "failed":
        return <XCircle className="text-red-600" size={16} />;
      default:
        return <AlertCircle className="text-gray-600" size={16} />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "deposit":
        return <ArrowDownRight className="text-green-600" size={16} />;
      case "withdrawal":
        return <ArrowUpRight className="text-red-600" size={16} />;
      case "transfer":
        return <ArrowUpRight className="text-blue-600" size={16} />;
      default:
        return <Banknote className="text-gray-600" size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const exportTransactions = () => {
    const csvContent = [
      [
        "Transaction ID",
        "Type",
        "Amount",
        "Currency",
        "Method",
        "Status",
        "Date",
      ],
      ...filteredTransactions.map((tx) => [
        tx.transactionId,
        tx.type,
        tx.amount,
        tx.currency,
        tx.method,
        tx.status,
        formatDate(tx.createdAt),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Transactions exported successfully!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MetaHead
          title="Transaction History"
          description="Complete record of all deposits, withdrawals, and account transactions. Track your payment history and account funding."
          keywords="transaction history, payment history, deposit history, withdrawal history, account transactions"
        />
        <PageHeader
          title="Transaction History"
          subtitle="Loading transaction data..."
        />
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MetaHead
          title="Transaction History"
          description="Complete record of all deposits, withdrawals, and account transactions. Track your payment history and account funding."
          keywords="transaction history, payment history, deposit history, withdrawal history, account transactions"
        />
        <PageHeader
          title="Transaction History"
          subtitle="Error loading transactions"
        />
        <div className="px-4 py-8">
          <Card className="p-6 text-center text-red-600 max-w-2xl mx-auto">
            <AlertCircle className="mx-auto mb-4" size={48} />
            <p className="mb-4">Error: {error}</p>
            <Button onClick={fetchTransactions}>Retry</Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MetaHead
        title="Transaction History"
        description="Complete record of all deposits, withdrawals, and account transactions. Track your payment history and account funding."
        keywords="transaction history, payment history, deposit history, withdrawal history, account transactions"
      />

      <PageHeader
        title="Transaction History"
        subtitle="Complete record of all your financial transactions"
        showButton={true}
        buttonText="Export CSV"
        buttonIcon={Download}
        onButtonClick={exportTransactions}
      />

      <div className="py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Deposited</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">
                  {formatCurrency(
                    summaryStats.totalDeposited,
                    summaryStats.primaryCurrency
                  )}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <ArrowDownRight className="text-green-600" size={20} />
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Withdrawn</p>
                <p className="text-xl sm:text-2xl font-bold text-red-600">
                  {formatCurrency(
                    summaryStats.totalWithdrawn,
                    summaryStats.primaryCurrency
                  )}
                </p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <ArrowUpRight className="text-red-600" size={20} />
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-xl sm:text-2xl font-bold text-orange-600">
                  {summaryStats.pendingTransactions}
                </p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Clock className="text-orange-600" size={20} />
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Today</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">
                  {summaryStats.completedToday}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="text-blue-600" size={20} />
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Card className="mb-8 overflow-hidden">
          <Tabs
            tabs={transactionTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </Card>

        {/* Filters */}
        <Card className="mb-6 p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white w-64"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount-high">Highest Amount</option>
              <option value="amount-low">Lowest Amount</option>
              <option value="status-asc">Status A-Z</option>
            </select>

            {/* Type Filter */}
            {typeOptions.length > 0 && (
              <select
                value={filters.type || "all"}
                onChange={(e) =>
                  setFilter(
                    "type",
                    e.target.value === "all" ? "" : e.target.value
                  )
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white"
              >
                <option value="all">All Types</option>
                {typeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            )}

            {/* Status Filter */}
            {statusOptions.length > 0 && (
              <select
                value={filters.status || "all"}
                onChange={(e) =>
                  setFilter(
                    "status",
                    e.target.value === "all" ? "" : e.target.value
                  )
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white"
              >
                <option value="all">All Status</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            )}

            {/* Currency Filter */}
            {currencyOptions.length > 0 && (
              <select
                value={filters.currency || "all"}
                onChange={(e) =>
                  setFilter(
                    "currency",
                    e.target.value === "all" ? "" : e.target.value
                  )
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white"
              >
                <option value="all">All Currencies</option>
                {currencyOptions.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            )}

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="flex items-center gap-2"
              >
                <X size={16} />
                Clear All
              </Button>
            )}
          </div>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-600">
            Showing {filteredCount} of {totalCount} transactions
            {hasActiveFilters && (
              <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                Filtered
              </span>
            )}
          </div>
        </div>

        {/* Transaction List */}
        {!loading && !error && (
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <Card
                key={transaction.transactionId}
                className="p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Left Section - Transaction Info */}
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      {getTypeIcon(transaction.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                          {transaction.type.charAt(0).toUpperCase() +
                            transaction.type.slice(1)}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            transaction.status
                          )}`}
                        >
                          {transaction.status.charAt(0).toUpperCase() +
                            transaction.status.slice(1)}
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                        <div className="flex items-center gap-4 flex-wrap">
                          <span>ID: {transaction.transactionId}</span>
                          <span>Method: {transaction.method}</span>
                          {transaction.network && (
                            <span>Network: {transaction.network}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar size={12} />
                          {formatDate(transaction.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Amount and Status */}
                  <div className="flex items-center justify-between lg:flex-col lg:items-end gap-4 lg:gap-2">
                    <div className="text-right">
                      <div
                        className={`text-lg sm:text-xl font-bold ${
                          transaction.type === "deposit"
                            ? "text-green-600"
                            : transaction.type === "withdrawal"
                            ? "text-red-600"
                            : "text-blue-600"
                        }`}
                      >
                        {transaction.type === "deposit"
                          ? "+"
                          : transaction.type === "withdrawal"
                          ? "-"
                          : ""}
                        {formatCurrency(
                          transaction.amount,
                          transaction.currency
                        )}
                      </div>
                      {transaction.fee > 0 && (
                        <div className="text-xs text-gray-500">
                          Fee:{" "}
                          {formatCurrency(
                            transaction.fee,
                            transaction.currency
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(transaction.status)}
                      <span className="text-xs text-gray-500">
                        {transaction.status === "pending" &&
                          transaction.processingTime &&
                          `ETA: ${transaction.processingTime}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Additional Details (Expandable) */}
                {(transaction.description || transaction.walletAddress) && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-600">
                      {transaction.description && (
                        <div>
                          <span className="font-medium">Description:</span>
                          <p className="mt-1">{transaction.description}</p>
                        </div>
                      )}
                      {transaction.walletAddress && (
                        <div>
                          <span className="font-medium">Address:</span>
                          <p className="mt-1 font-mono break-all">
                            {transaction.walletAddress}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            ))}

            {filteredTransactions.length === 0 && !loading && (
              <Card className="p-12 text-center">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No transactions found
                </h3>
                <p className="text-gray-500 mb-8">
                  {hasActiveFilters
                    ? "Try adjusting your filters to see more results"
                    : "Your transaction history will appear here once you make your first deposit or withdrawal"}
                </p>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
