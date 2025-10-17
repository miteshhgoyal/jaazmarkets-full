// user/src/pages/trading/Accounts.jsx
import React, { useState, useEffect } from "react";
import { Plus, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Components
import { Card } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Tabs from "../../components/ui/Tabs";
import PageHeader from "../../components/ui/PageHeader";
import ActiveAccountCard from "../../components/accounts/ActiveAccountCard";
import ArchivedAccountCard from "../../components/accounts/ArchivedAccountCard";
import MetaHead from "../../components/MetaHead";

// API
import api from "../../services/api";

const Accounts = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Real");

  // State
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [balanceRangeFilter, setBalanceRangeFilter] = useState("all");

  // Fetch accounts on mount and when tab changes
  useEffect(() => {
    fetchAccounts();
  }, [activeTab]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/account/my-accounts");

      if (response.data.success) {
        setAccounts(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch accounts:", err);
      setError(err.response?.data?.message || "Failed to load accounts");
      toast.error("Failed to load accounts");
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort accounts
  const getFilteredAccounts = () => {
    let filtered = accounts;

    // Filter by account type (tab)
    filtered = filtered.filter((acc) => {
      if (activeTab === "Real") return acc.accountType === "Real";
      if (activeTab === "Demo") return acc.accountType === "Demo";
      if (activeTab === "Archived") return acc.status === "closed";
      return true;
    });

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (acc) =>
          acc.accountNumber?.toLowerCase().includes(searchLower) ||
          acc.login?.toLowerCase().includes(searchLower) ||
          acc.platform?.toLowerCase().includes(searchLower) ||
          acc.accountClass?.toLowerCase().includes(searchLower) ||
          acc.server?.toLowerCase().includes(searchLower)
      );
    }

    // Platform filter
    if (platformFilter !== "all") {
      filtered = filtered.filter((acc) => acc.platform === platformFilter);
    }

    // Class filter
    if (classFilter !== "all") {
      filtered = filtered.filter((acc) => acc.accountClass === classFilter);
    }

    // Balance range filter
    if (balanceRangeFilter !== "all") {
      const [min, max] = balanceRangeFilter.split("-").map(Number);
      filtered = filtered.filter((acc) => {
        const balance = acc.balance || 0;
        return balance >= min && (max ? balance <= max : true);
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "balance-high":
          return (b.balance || 0) - (a.balance || 0);
        case "balance-low":
          return (a.balance || 0) - (b.balance || 0);
        case "name-asc":
          return (a.accountNumber || "").localeCompare(b.accountNumber || "");
        case "name-desc":
          return (b.accountNumber || "").localeCompare(a.accountNumber || "");
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredAccounts = getFilteredAccounts();

  // Get unique values for filters
  const platformOptions = [
    ...new Set(accounts.map((acc) => acc.platform)),
  ].filter(Boolean);
  const classOptions = [
    ...new Set(accounts.map((acc) => acc.accountClass)),
  ].filter(Boolean);

  // Check if filters are active
  const hasActiveFilters =
    searchTerm !== "" ||
    platformFilter !== "all" ||
    classFilter !== "all" ||
    balanceRangeFilter !== "all" ||
    sortBy !== "newest";

  const clearFilters = () => {
    setSearchTerm("");
    setSortBy("newest");
    setPlatformFilter("all");
    setClassFilter("all");
    setBalanceRangeFilter("all");
  };

  // Count accounts by type
  const realCount = accounts.filter(
    (acc) => acc.accountType === "Real" && acc.status !== "closed"
  ).length;
  const demoCount = accounts.filter(
    (acc) => acc.accountType === "Demo" && acc.status !== "closed"
  ).length;
  const archivedCount = accounts.filter(
    (acc) => acc.status === "closed"
  ).length;

  // Tab configuration
  const accountTabs = [
    { id: "Real", label: "Real Accounts", count: realCount },
    { id: "Demo", label: "Demo Accounts", count: demoCount },
    { id: "Archived", label: "Archived", count: archivedCount },
  ];

  // Action handlers
  const handleTrade = (accountId) => {
    toast.success(`Opening trading terminal for account ${accountId}`);
    // Navigate to trading terminal or open modal
  };

  const handleDeposit = (accountId) => {
    navigate(`/deposit?account=${accountId}`);
  };

  const handleWithdraw = (accountId) => {
    navigate(`/withdraw?account=${accountId}`);
  };

  const handleReactivate = async (accountId) => {
    try {
      const response = await api.patch(`/account/${accountId}/status`, {
        status: "active",
      });

      if (response.data.success) {
        toast.success("Account reactivated successfully");
        fetchAccounts(); // Refresh accounts
      }
    } catch (err) {
      console.error("Failed to reactivate account:", err);
      toast.error(
        err.response?.data?.message || "Failed to reactivate account"
      );
    }
  };

  const handleCopyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MetaHead
        title="Trading Accounts"
        description="Manage your trading accounts, view balances, equity, and account performance. Monitor all your live and demo trading accounts in one dashboard."
        keywords="trading accounts, account balance, equity, trading dashboard, portfolio management"
      />

      <PageHeader
        title="Trading Accounts"
        subtitle="Manage your trading accounts and monitor performance"
        showButton={true}
        buttonText="Open New Account"
        buttonIcon={Plus}
        onButtonClick={() => navigate("/trading/new-account")}
      />

      <div className="py-8">
        {/* Tabs */}
        <Card className="mb-8 overflow-hidden">
          <Tabs
            tabs={accountTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </Card>

        {/* Filters Bar */}
        <Card className="mb-6 p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search accounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-white w-full"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="balance-high">Highest Balance</option>
              <option value="balance-low">Lowest Balance</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
            </select>

            {/* Platform Filter */}
            {platformOptions.length > 0 && (
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-white"
              >
                <option value="all">All Platforms</option>
                {platformOptions.map((platform) => (
                  <option key={platform} value={platform}>
                    {platform}
                  </option>
                ))}
              </select>
            )}

            {/* Account Class Filter */}
            {classOptions.length > 0 && (
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-white"
              >
                <option value="all">All Classes</option>
                {classOptions.map((accountClass) => (
                  <option key={accountClass} value={accountClass}>
                    {accountClass}
                  </option>
                ))}
              </select>
            )}

            {/* Balance Range Filter */}
            <select
              value={balanceRangeFilter}
              onChange={(e) => setBalanceRangeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-white"
            >
              <option value="all">All Balances</option>
              <option value="0-1000">$0 - $1,000</option>
              <option value="1000-5000">$1,000 - $5,000</option>
              <option value="5000-999999">$5,000+</option>
            </select>

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
            Showing {filteredAccounts.length} of{" "}
            {
              accounts.filter((acc) => {
                if (activeTab === "Real")
                  return acc.accountType === "Real" && acc.status !== "closed";
                if (activeTab === "Demo")
                  return acc.accountType === "Demo" && acc.status !== "closed";
                if (activeTab === "Archived") return acc.status === "closed";
                return true;
              }).length
            }{" "}
            accounts
            {hasActiveFilters && (
              <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                Filtered
              </span>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="p-8 text-center">
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
              <h3 className="text-xl font-semibold mb-2">
                Failed to Load Accounts
              </h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={fetchAccounts}>Try Again</Button>
            </div>
          </Card>
        )}

        {/* Accounts List */}
        {!loading && !error && (
          <div className="space-y-6">
            {filteredAccounts.map((account) => (
              <div key={account._id}>
                {activeTab === "Archived" ? (
                  <ArchivedAccountCard
                    account={{
                      ...account,
                      id: account._id,
                      archivedDate: account.updatedAt,
                    }}
                    onReactivate={() => handleReactivate(account._id)}
                  />
                ) : (
                  <ActiveAccountCard
                    account={{
                      ...account,
                      id: account._id,
                      spreadType:
                        account.accountClass?.includes("Raw") ||
                        account.accountClass?.includes("Zero")
                          ? "Raw Spread"
                          : "Variable",
                      commission: account.accountClass?.includes("Standard")
                        ? "No commission"
                        : "$3.5 per lot",
                    }}
                    onTrade={() => handleTrade(account._id)}
                    onDeposit={() => navigate("/payments-and-wallet/deposit")}
                    onWithdraw={() =>
                      navigate("/payments-and-wallet/withdrawal")
                    }
                    onCopyToClipboard={handleCopyToClipboard}
                  />
                )}
              </div>
            ))}

            {/* Empty State */}
            {filteredAccounts.length === 0 && !loading && (
              <Card className="p-12 text-center">
                <div className="max-w-md mx-auto">
                  <svg
                    className="w-20 h-20 mx-auto mb-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No accounts found
                  </h3>
                  <p className="text-gray-500 mb-8">
                    {hasActiveFilters
                      ? "Try adjusting your filters to see more results"
                      : `You don't have any ${activeTab.toLowerCase()} accounts yet`}
                  </p>
                  {!hasActiveFilters && activeTab !== "Archived" && (
                    <Button
                      onClick={() => navigate("/trading/new-account")}
                      size="lg"
                      className="bg-yellow-400 hover:bg-yellow-500"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Create Your First Account
                    </Button>
                  )}
                  {hasActiveFilters && (
                    <Button onClick={clearFilters} variant="outline" size="lg">
                      Clear Filters
                    </Button>
                  )}
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Accounts;
