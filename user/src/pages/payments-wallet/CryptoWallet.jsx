// user/src/pages/payments-wallet/CryptoWallet.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  X,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Tabs from "../../components/ui/Tabs";
import PageHeader from "../../components/ui/PageHeader";
import CryptoAccountCard from "../../components/cryptowallet/CryptoAccountCard";
import ExternalWalletCard from "../../components/cryptowallet/ExternalWalletCard";
import AddExternalWalletModal from "../../components/cryptowallet/AddExternalWalletModal";
import MetaHead from "../../components/MetaHead";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";

const CryptoWallet = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("accounts");
  const [showAddWalletModal, setShowAddWalletModal] = useState(false);

  // Data state
  const [wallets, setWallets] = useState([]);
  const [externalWallets, setExternalWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalBalance, setTotalBalance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("balance-high");
  const [currencyFilter, setCurrencyFilter] = useState("all");

  // Fetch data on mount
  useEffect(() => {
    fetchWallets();
    loadExternalWallets();
  }, []);

  const fetchWallets = async (showRefreshToast = false) => {
    try {
      if (showRefreshToast) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await api.get("/account/my-accounts");

      if (response.data.success) {
        const accounts = response.data.data;
        const realAccounts = accounts.filter(
          (acc) => acc.accountType === "Real"
        );

        // Transform trading accounts into wallet format
        const formattedWallets = realAccounts.map((account) => ({
          id: account._id,
          name: `${account.platform} ${account.accountType}`,
          symbol: account.currency,
          currency: account.currency,
          balance: account.balance || 0,
          usdValue: account.equity || 0,
          network: account.platform,
          image: getCryptoImage(account.currency),
          accountNumber: account.accountNumber,
          createdAt: account.createdAt,
          platform: account.platform,
          accountType: account.accountType,
          leverage: account.leverage,
          freeMargin: account.freeMargin,
        }));

        setWallets(formattedWallets);

        const total = formattedWallets.reduce(
          (sum, wallet) => sum + (wallet.usdValue || 0),
          0
        );
        setTotalBalance(total);

        if (showRefreshToast) {
          toast.success("Wallets refreshed successfully");
        }
      }
    } catch (err) {
      console.error("Error fetching crypto wallets:", err);
      setError(err.response?.data?.message || "Failed to load crypto wallets");
      toast.error("Failed to load crypto wallets");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadExternalWallets = () => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("externalWallets") || "[]"
      );
      setExternalWallets(stored);
    } catch (error) {
      console.error("Error loading external wallets:", error);
      setExternalWallets([]);
    }
  };

  const getCryptoImage = (currency) => {
    const images = {
      BTC: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/btc.png",
      ETH: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/eth.png",
      USDT: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/usdt.png",
      USDC: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/usdc.png",
      TRX: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/trx.png",
      USD: "https://img.icons8.com/3d-fluency/94/bank-building.png",
    };
    return images[currency] || "https://via.placeholder.com/48";
  };

  const handleAddExternalWallet = async (walletData) => {
    try {
      const newWallet = {
        id: Date.now().toString(),
        name: walletData.name || `External Wallet`,
        currency: walletData.currency || "USDT",
        network: walletData.network || "ERC20",
        address: walletData.address,
        type: "selfhosted",
        description: walletData.description || "",
        provider: walletData.provider || "",
        notes: walletData.notes || "",
        status: "active",
        image: getCryptoImage(walletData.currency || "USDT"),
        createdAt: new Date().toISOString(),
      };

      const existing = JSON.parse(
        localStorage.getItem("externalWallets") || "[]"
      );
      const updated = [...existing, newWallet];
      localStorage.setItem("externalWallets", JSON.stringify(updated));

      setExternalWallets(updated);
      toast.success("External wallet added successfully");
      setShowAddWalletModal(false);
    } catch (error) {
      console.error("Error adding external wallet:", error);
      toast.error("Failed to add external wallet");
      throw error;
    }
  };

  const handleRemoveExternalWallet = async (walletId) => {
    try {
      const existing = JSON.parse(
        localStorage.getItem("externalWallets") || "[]"
      );
      const updated = existing.filter((w) => w.id !== walletId);
      localStorage.setItem("externalWallets", JSON.stringify(updated));

      setExternalWallets(updated);
      toast.success("External wallet removed");
    } catch (error) {
      console.error("Error removing external wallet:", error);
      toast.error("Failed to remove external wallet");
    }
  };

  const handleDeposit = (accountId, currency) => {
    navigate(
      `/payments-and-wallet/deposit?pp_account=${accountId}&pp_currency=${currency}`
    );
  };

  const handleWithdraw = (accountId, currency) => {
    navigate(
      `/payments-and-wallet/withdrawal?pp_account=${accountId}&pp_currency=${currency}`
    );
  };

  const handleTransfer = (accountId) => {
    navigate(`/payments-and-wallet/transfer?pp_account=${accountId}`);
  };

  const handleRefresh = () => {
    fetchWallets(true);
  };

  // Filter and sort wallets
  const filteredWallets = useMemo(() => {
    const data = activeTab === "accounts" ? wallets : externalWallets;
    let filtered = [...data];

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (wallet) =>
          wallet.symbol?.toLowerCase().includes(searchLower) ||
          wallet.name?.toLowerCase().includes(searchLower) ||
          wallet.network?.toLowerCase().includes(searchLower) ||
          wallet.currency?.toLowerCase().includes(searchLower) ||
          wallet.accountNumber?.toLowerCase().includes(searchLower)
      );
    }

    // Currency filter
    if (currencyFilter !== "all") {
      filtered = filtered.filter(
        (wallet) => wallet.currency === currencyFilter
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "balance-high":
          return (b.balance || 0) - (a.balance || 0);
        case "balance-low":
          return (a.balance || 0) - (b.balance || 0);
        case "name-asc":
          return (a.name || "").localeCompare(b.name || "");
        case "name-desc":
          return (b.name || "").localeCompare(a.name || "");
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        default:
          return 0;
      }
    });

    return filtered;
  }, [wallets, externalWallets, activeTab, searchTerm, currencyFilter, sortBy]);

  const currencyOptions = [
    ...new Set(wallets.map((wallet) => wallet.currency)),
  ];

  const hasActiveFilters =
    searchTerm !== "" || currencyFilter !== "all" || sortBy !== "balance-high";

  const clearFilters = () => {
    setSearchTerm("");
    setCurrencyFilter("all");
    setSortBy("balance-high");
  };

  const formatTotalBalance = (balance) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(balance);
  };

  const walletTabs = [
    { id: "accounts", label: "Trading Accounts", count: wallets.length },
    {
      id: "external-wallets",
      label: "External Wallets",
      count: externalWallets.length,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MetaHead
          title="Crypto Wallet"
          description="Manage your cryptocurrency holdings"
          keywords="crypto wallet, cryptocurrency"
        />
        <PageHeader title="Crypto Wallet" subtitle="Loading..." />
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MetaHead
        title="Crypto Wallet"
        description="Manage your cryptocurrency holdings, view balances, and execute crypto trades."
        keywords="crypto wallet, cryptocurrency, digital wallet, bitcoin, ethereum"
      />

      <PageHeader
        title="Crypto Wallet"
        subtitle={`Total Balance: ${formatTotalBalance(totalBalance)}`}
        showButton={activeTab === "external-wallets"}
        buttonText="Add External Wallet"
        buttonIcon={Plus}
        onButtonClick={() => setShowAddWalletModal(true)}
      />

      <div className="py-8">
        {/* Tabs */}
        <Card className="mb-8 overflow-hidden">
          <Tabs
            tabs={walletTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </Card>

        {/* Filters Bar */}
        {activeTab === "accounts" && (
          <Card className="mb-6 p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search wallets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white w-full"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="balance-high">Highest Balance</option>
                <option value="balance-low">Lowest Balance</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>

              {currencyOptions.length > 1 && (
                <select
                  value={currencyFilter}
                  onChange={(e) => setCurrencyFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="all">All Currencies</option>
                  {currencyOptions.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2"
              >
                <RefreshCw
                  size={16}
                  className={refreshing ? "animate-spin" : ""}
                />
                Refresh
              </Button>

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
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-600">
            Showing {filteredWallets.length} of{" "}
            {activeTab === "accounts" ? wallets.length : externalWallets.length}{" "}
            {activeTab === "accounts" ? "trading accounts" : "external wallets"}
            {hasActiveFilters && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                Filtered
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        {error && (
          <div className="text-center py-8 text-red-600">Error: {error}</div>
        )}

        {!error && (
          <div className="space-y-6">
            {filteredWallets.map((wallet) => (
              <div key={wallet.id}>
                {activeTab === "accounts" ? (
                  <CryptoAccountCard
                    wallet={wallet}
                    onDeposit={handleDeposit}
                    onWithdraw={handleWithdraw}
                    onTransfer={handleTransfer}
                  />
                ) : (
                  <ExternalWalletCard
                    wallet={wallet}
                    onRemove={() => handleRemoveExternalWallet(wallet.id)}
                    onEdit={() =>
                      navigate(
                        `/payments-and-wallet/external-wallet/edit/${wallet.id}`
                      )
                    }
                  />
                )}
              </div>
            ))}

            {filteredWallets.length === 0 && (
              <Card className="p-12 text-center">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No{" "}
                  {activeTab === "accounts"
                    ? "trading accounts"
                    : "external wallets"}{" "}
                  found
                </h3>
                <p className="text-gray-500 mb-8">
                  {hasActiveFilters
                    ? "Try adjusting your filters to see more results"
                    : activeTab === "accounts"
                    ? "Your trading accounts will appear here once you create one"
                    : "Add your first external wallet to get started"}
                </p>

                {activeTab === "external-wallets" && !hasActiveFilters && (
                  <Button
                    onClick={() => setShowAddWalletModal(true)}
                    className="flex items-center gap-2 mx-auto"
                  >
                    <Plus size={16} />
                    Add External Wallet
                  </Button>
                )}

                {activeTab === "accounts" && !hasActiveFilters && (
                  <Button
                    onClick={() => navigate("/account/create")}
                    className="flex items-center gap-2 mx-auto"
                  >
                    <Plus size={16} />
                    Create Trading Account
                  </Button>
                )}
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Add External Wallet Modal */}
      <AddExternalWalletModal
        isOpen={showAddWalletModal}
        onClose={() => setShowAddWalletModal(false)}
        onAdd={handleAddExternalWallet}
      />
    </div>
  );
};

export default CryptoWallet;
