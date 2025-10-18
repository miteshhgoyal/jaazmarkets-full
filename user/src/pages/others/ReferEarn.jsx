import React, { useState, useEffect } from "react";
import {
  Copy,
  Check,
  Users,
  DollarSign,
  Mail,
  Share2,
  ChevronDown,
  ChevronUp,
  Activity,
  Calendar,
  TrendingUp,
  Wallet,
  AlertCircle,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import MetaHead from "../../components/MetaHead";
import PageHeader from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import api from "../../services/api";

const ReferEarn = () => {
  const [loading, setLoading] = useState(true);
  const [referralData, setReferralData] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [commissionRate, setCommissionRate] = useState(0.01);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userTrades, setUserTrades] = useState([]);
  const [loadingTrades, setLoadingTrades] = useState(false);
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);

  // Payout modal state
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("TRC20");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchReferralData();
    fetchReferrals();
    fetchWithdrawalHistory();
  }, []);

  const fetchReferralData = async () => {
    try {
      const response = await api.get("/refer/my-referral");
      if (response.data.success) {
        setReferralData(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to load referral data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReferrals = async () => {
    try {
      const response = await api.get("/refer/my-referrals");
      if (response.data.success) {
        setReferrals(response.data.data.referrals);
        setCommissionRate(response.data.data.commissionRate || 0.01);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchWithdrawalHistory = async () => {
    try {
      const response = await api.get("/refer/commission-withdrawals");
      if (response.data.success) {
        setWithdrawalHistory(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserTrades = async (userId) => {
    if (selectedUser === userId) {
      setSelectedUser(null);
      setUserTrades([]);
      return;
    }

    setLoadingTrades(true);
    try {
      const response = await api.get(`/refer/referral/${userId}/trades`);
      if (response.data.success) {
        setUserTrades(response.data.data.trades);
        setSelectedUser(userId);
      }
    } catch (error) {
      toast.error("Failed to load trades");
      console.error(error);
      setUserTrades([]);
    } finally {
      setLoadingTrades(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralData.referralLink);
    setCopiedLink(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralData.referralCode);
    setCopiedCode(true);
    toast.success("Referral code copied!");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleShare = async () => {
    const shareText = `Join this trading platform using my referral link: ${referralData.referralLink}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join Trading Platform",
          text: shareText,
          url: referralData.referralLink,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      handleCopyLink();
    }
  };

  const handlePayoutSubmit = async (e) => {
    e.preventDefault();

    if (!payoutAmount || !walletAddress) {
      toast.error("Please fill all fields");
      return;
    }

    const amount = parseFloat(payoutAmount);
    if (amount <= 0 || amount > (referralData?.totalEarnings || 0)) {
      toast.error("Invalid amount");
      return;
    }

    // Validate TRC20 wallet address format
    if (selectedNetwork === "TRC20" && !walletAddress.startsWith("T")) {
      toast.error("Invalid TRC20 wallet address");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await api.post("/refer/withdraw-commission", {
        amount,
        walletAddress,
        currency: "USDT",
        network: selectedNetwork,
      });

      if (response.data.success) {
        toast.success("Withdrawal request submitted successfully!");
        setShowPayoutModal(false);
        setPayoutAmount("");
        setWalletAddress("");
        fetchReferralData();
        fetchWithdrawalHistory();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Withdrawal failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      processing: "bg-blue-100 text-blue-800 border-blue-200",
      completed: "bg-green-100 text-green-800 border-green-200",
      failed: "bg-red-100 text-red-800 border-red-200",
      cancelled: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return (
      <span
        className={`text-xs px-3 py-1 rounded-full font-medium border ${
          styles[status] || styles.pending
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MetaHead
        title="Refer & Earn"
        description="Refer friends and earn commissions"
        keywords="referral, earn commission"
      />

      <PageHeader
        title="Refer & Earn"
        subtitle={`Earn ${commissionRate.toFixed(3)}% commission on trades`}
      />

      <div className="py-6 space-y-6 px-4 max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Total Referrals</p>
                <p className="text-2xl font-bold text-gray-900">
                  {referralData?.totalReferrals || 0}
                </p>
              </div>
              <Users className="text-blue-500" size={24} />
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Available Balance</p>
                <p className="text-2xl font-bold text-green-600">
                  ${referralData?.totalEarnings?.toFixed(2) || "0.00"}
                </p>
              </div>
              <DollarSign className="text-green-500" size={24} />
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Total Volume</p>
                <p className="text-2xl font-bold text-orange-600">
                  ${referralData?.totalVolume?.toFixed(2) || "0.00"}
                </p>
              </div>
              <TrendingUp className="text-orange-500" size={24} />
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Commission Rate</p>
                <p className="text-2xl font-bold text-purple-600">
                  {commissionRate.toFixed(3)}%
                </p>
              </div>
              <Wallet className="text-purple-500" size={24} />
            </div>
          </Card>
        </div>

        {/* Referral Link Card */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">
              Referral Details
            </h3>
            <Button
              onClick={() => setShowPayoutModal(true)}
              className="bg-green-600 hover:bg-green-700"
              size="sm"
              disabled={(referralData?.totalEarnings || 0) < 10}
            >
              <Wallet size={16} className="mr-2" />
              Withdraw
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Referral Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={referralData?.referralCode || ""}
                  readOnly
                  className="flex-1 px-3 py-2 border rounded-lg bg-gray-50 font-mono"
                />
                <Button onClick={handleCopyCode} variant="outline" size="sm">
                  {copiedCode ? <Check size={18} /> : <Copy size={18} />}
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Referral Link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={referralData?.referralLink || ""}
                  readOnly
                  className="flex-1 px-3 py-2 border rounded-lg bg-gray-50 text-sm truncate"
                />
                <Button onClick={handleCopyLink} variant="outline" size="sm">
                  {copiedLink ? <Check size={18} /> : <Copy size={18} />}
                </Button>
                <Button
                  onClick={handleShare}
                  className="bg-orange-500 hover:bg-orange-600"
                  size="sm"
                >
                  <Share2 size={18} />
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>How it works:</strong> Share your link with friends. When
              they register and trade, you earn {commissionRate.toFixed(3)}%
              commission on their trade volume. Minimum withdrawal: $10. Admin
              processes withdrawals within 24 hours.
            </p>
          </div>
        </Card>

        {/* Withdrawal History */}
        {withdrawalHistory.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock size={20} />
              Withdrawal History
            </h3>
            <div className="space-y-3">
              {withdrawalHistory.map((w) => (
                <div
                  key={w._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      ${w.amount.toFixed(2)} {w.currency}
                    </p>
                    <p className="text-xs text-gray-600 font-mono mt-1">
                      {w.transactionId}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(w.createdAt).toLocaleString()}
                    </p>
                    {w.withdrawalDetails?.walletAddress && (
                      <p className="text-xs text-gray-600 mt-1 font-mono">
                        To: {w.withdrawalDetails.walletAddress.slice(0, 10)}...
                        {w.withdrawalDetails.walletAddress.slice(-6)}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    {getStatusBadge(w.status)}
                    {w.status === "pending" && (
                      <p className="text-xs text-gray-500 mt-2">
                        Processing...
                      </p>
                    )}
                    {w.status === "completed" && (
                      <p className="text-xs text-green-600 mt-2">✓ Sent</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Referrals List */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            My Referrals ({referrals.length})
          </h3>

          {referrals.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No referrals yet</p>
              <p className="text-sm text-gray-500 mt-2">
                Start sharing your referral link to earn commissions!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {referrals.map((referral) => (
                <div
                  key={referral.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {referral.name}
                      </h4>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Mail size={12} />
                        {referral.email}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Calendar size={10} />
                        {new Date(referral.joinedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                      <p className="text-xs text-green-700 font-medium">
                        Commission
                      </p>
                      <p className="text-lg font-bold text-green-600">
                        ${referral.stats.myCommission.toFixed(4)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 mb-3">
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <p className="text-xs text-gray-600">Accounts</p>
                      <p className="font-semibold">
                        {referral.stats.totalAccounts}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <p className="text-xs text-gray-600">Trades</p>
                      <p className="font-semibold">
                        {referral.stats.totalTrades}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <p className="text-xs text-gray-600">Volume</p>
                      <p className="font-semibold text-sm">
                        ${referral.stats.totalTradeAmount.toFixed(0)}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <p className="text-xs text-gray-600">P/L</p>
                      <p
                        className={`font-semibold text-sm ${
                          referral.stats.totalProfitLoss >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        ${referral.stats.totalProfitLoss.toFixed(0)}
                      </p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => fetchUserTrades(referral.id)}
                    disabled={loadingTrades}
                    className="w-full"
                  >
                    {loadingTrades && selectedUser === referral.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500 mr-2"></div>
                        Loading...
                      </>
                    ) : selectedUser === referral.id ? (
                      <>
                        Hide Trades <ChevronUp size={14} className="ml-1" />
                      </>
                    ) : (
                      <>
                        View Trades <ChevronDown size={14} className="ml-1" />
                      </>
                    )}
                  </Button>

                  {selectedUser === referral.id && userTrades.length > 0 && (
                    <div className="mt-3 border-t pt-3">
                      <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                        <Activity size={14} />
                        Recent Trades ({userTrades.length})
                      </p>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {userTrades.map((trade) => (
                          <div
                            key={trade.id}
                            className="bg-gray-50 p-3 rounded text-xs flex justify-between"
                          >
                            <div>
                              <p className="font-medium">
                                {trade.symbol} • {trade.type} • {trade.volume}{" "}
                                lots
                              </p>
                              <p className="text-gray-600">
                                {trade.openPrice} → {trade.closePrice}
                              </p>
                              <p className="text-gray-500 mt-1">
                                {new Date(trade.closeTime).toLocaleString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p
                                className={`font-semibold ${
                                  trade.profitLoss >= 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                ${trade.profitLoss.toFixed(2)}
                              </p>
                              <p className="text-green-600 text-xs mt-1">
                                +${trade.myCommission.toFixed(4)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedUser === referral.id &&
                    userTrades.length === 0 &&
                    !loadingTrades && (
                      <p className="text-center text-gray-500 text-sm mt-3 py-2">
                        No trades yet
                      </p>
                    )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Payout Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Withdraw Commission</h3>

            <form onSubmit={handlePayoutSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Available Balance
                </label>
                <p className="text-3xl font-bold text-green-600 mb-1">
                  ${referralData?.totalEarnings?.toFixed(2) || "0.00"}
                </p>
                <p className="text-xs text-gray-500">USDT equivalent</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Withdrawal Amount (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="10"
                  max={referralData?.totalEarnings || 0}
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  className="w-full px-4 py-3 border-2 rounded-lg focus:border-orange-500 focus:outline-none"
                  placeholder="Min: $10"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum withdrawal: $10
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Network
                </label>
                <select
                  value={selectedNetwork}
                  onChange={(e) => setSelectedNetwork(e.target.value)}
                  className="w-full px-4 py-3 border-2 rounded-lg focus:border-orange-500 focus:outline-none"
                >
                  <option value="TRC20">
                    USDT TRC20 (Recommended - Low Fee)
                  </option>
                  <option value="ERC20">USDT ERC20 (Higher Fee)</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Wallet Address ({selectedNetwork})
                </label>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="w-full px-4 py-3 border-2 rounded-lg font-mono text-sm focus:border-orange-500 focus:outline-none"
                  placeholder={
                    selectedNetwork === "TRC20"
                      ? "T... (starts with T)"
                      : "0x... (starts with 0x)"
                  }
                  required
                />
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 flex gap-2">
                <AlertCircle
                  size={18}
                  className="text-yellow-600 flex-shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-xs text-yellow-800 font-medium">
                    Important:
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Admin will manually process your withdrawal within 24 hours.
                    Please ensure your wallet address is correct.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    "Submit Withdrawal"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPayoutModal(false)}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ReferEarn;
