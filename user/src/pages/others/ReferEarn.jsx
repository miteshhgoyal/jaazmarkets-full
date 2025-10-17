import React, { useState, useEffect } from "react";
import {
  Copy,
  Check,
  Users,
  TrendingUp,
  DollarSign,
  Mail,
  Share2,
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

  useEffect(() => {
    fetchReferralData();
    fetchReferrals();
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

  const fetchUserTrades = async (userId) => {
    try {
      const response = await api.get(`/refer/referral/${userId}/trades`);
      if (response.data.success) {
        setUserTrades(response.data.data.trades);
        setSelectedUser(userId);
      }
    } catch (error) {
      toast.error("Failed to load trades");
      console.error(error);
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
    const shareText = `Join this trading platform using my referral link and start trading: ${referralData.referralLink}`;

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

  const totalCommissionEarned = referrals.reduce(
    (sum, ref) => sum + (ref.stats?.myCommission || 0),
    0
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MetaHead
        title="Refer & Earn"
        description="Refer friends and earn commissions on their trades"
        keywords="referral, earn commission, refer friends"
      />

      <PageHeader
        title="Refer & Earn"
        subtitle={`Earn ${commissionRate}% commission on every trade your referrals make`}
      />

      <div className="py-8 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Referrals</p>
                <p className="text-3xl font-bold text-gray-900">
                  {referralData?.totalReferrals || 0}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="text-blue-600" size={24} />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
                <p className="text-3xl font-bold text-green-600">
                  ${referralData?.totalEarnings?.toFixed(2) || "0.00"}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="text-green-600" size={24} />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Commission</p>
                <p className="text-3xl font-bold text-orange-600">
                  ${totalCommissionEarned.toFixed(2)}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <TrendingUp className="text-orange-600" size={24} />
              </div>
            </div>
          </Card>
        </div>

        {/* Referral Link Card */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Your Referral Details</h3>

          <div className="space-y-4">
            {/* Referral Code */}
            <div>
              <label className="text-sm text-gray-600 mb-2 block">
                Referral Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={referralData?.referralCode || ""}
                  readOnly
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                />
                <Button onClick={handleCopyCode} variant="outline">
                  {copiedCode ? <Check size={20} /> : <Copy size={20} />}
                </Button>
              </div>
            </div>

            {/* Referral Link */}
            <div>
              <label className="text-sm text-gray-600 mb-2 block">
                Referral Link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={referralData?.referralLink || ""}
                  readOnly
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                />
                <Button onClick={handleCopyLink} variant="outline">
                  {copiedLink ? <Check size={20} /> : <Copy size={20} />}
                </Button>
                <Button
                  onClick={handleShare}
                  className="bg-orange-400 hover:bg-orange-500"
                >
                  <Share2 size={20} />
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>How it works:</strong> Share your referral link with
              friends. When they register and trade, you earn {commissionRate}%
              commission on their total trade amount (volume × price)
              automatically!
            </p>
          </div>
        </Card>

        {/* Referred Users List */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            My Referrals ({referrals.length})
          </h3>

          {referrals.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No referrals yet</p>
              <p className="text-sm text-gray-500 mt-2">
                Start sharing your referral link to earn commissions!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {referrals.map((referral) => (
                <div
                  key={referral.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {referral.name}
                      </h4>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Mail size={14} />
                        {referral.email}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Joined:{" "}
                        {new Date(referral.joinedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">My Commission</p>
                      <p className="text-xl font-bold text-green-600">
                        ${referral.stats.myCommission.toFixed(4)}
                      </p>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-600">Accounts</p>
                      <p className="text-lg font-semibold">
                        {referral.stats.totalAccounts}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-600">Total Trades</p>
                      <p className="text-lg font-semibold">
                        {referral.stats.totalTrades}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-600">Trade Volume</p>
                      <p className="text-lg font-semibold">
                        ${referral.stats.totalTradeAmount.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-600">Their P/L</p>
                      <p
                        className={`text-lg font-semibold ${
                          referral.stats.totalProfitLoss >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        ${referral.stats.totalProfitLoss.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Accounts */}
                  {referral.accounts.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Trading Accounts:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {referral.accounts.map((account, idx) => (
                          <div
                            key={idx}
                            className="bg-white border border-gray-200 p-2 rounded text-xs"
                          >
                            <p className="font-medium">
                              {account.accountNumber}
                            </p>
                            <p className="text-gray-600">
                              {account.type} • {account.platform} • 1:
                              {account.leverage}
                            </p>
                            <p className="text-gray-900">
                              Balance: ${account.balance?.toFixed(2)} | Equity:
                              ${account.equity?.toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* View Trades Button */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      selectedUser === referral.id
                        ? setSelectedUser(null)
                        : fetchUserTrades(referral.id)
                    }
                    className="w-full"
                  >
                    {selectedUser === referral.id
                      ? "Hide Trades"
                      : "View Their Trades"}
                  </Button>

                  {/* Trades List */}
                  {selectedUser === referral.id && userTrades.length > 0 && (
                    <div className="mt-4 border-t pt-4">
                      <p className="text-sm font-medium mb-2">Recent Trades:</p>
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
                              <p className="text-blue-600">
                                Trade Amount: ${trade.tradeAmount.toFixed(2)}
                              </p>
                              <p className="text-gray-500">
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
                                Commission: +${trade.myCommission.toFixed(4)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ReferEarn;
