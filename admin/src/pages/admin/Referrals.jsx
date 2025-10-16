import React, { useState, useEffect } from "react";
import {
  Users,
  TrendingUp,
  DollarSign,
  Award,
  Search,
  Eye,
  X,
} from "lucide-react";
import MetaHead from "../../components/MetaHead";
import PageHeader from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import api from "../../services/api";
import toast from "react-hot-toast";

const Referrals = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [topReferrers, setTopReferrers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userReferrals, setUserReferrals] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchReferralStats();
  }, []);

  const fetchReferralStats = async () => {
    try {
      setLoading(true);
      const response = await api.get("/refer/admin/stats");
      if (response.data.success) {
        setStats(response.data.data);
        setTopReferrers(response.data.data.topReferrers || []);
      }
    } catch (error) {
      toast.error("Failed to load referral stats");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReferrals = async (userId) => {
    try {
      const response = await api.get(`/refer/admin/user/${userId}/referrals`);
      if (response.data.success) {
        setUserReferrals(response.data.data.referrals);
        setSelectedUser(response.data.data.user);
        setShowDetailsModal(true);
      }
    } catch (error) {
      toast.error("Failed to load user referrals");
    }
  };

  const filteredReferrers = topReferrers.filter((user) =>
    `${user.firstName} ${user.lastName} ${user.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <MetaHead
        title="Referral Management"
        description="Manage referral program and track referrer performance"
        keywords="referrals, commission, admin"
      />

      <PageHeader
        title="Referral Management"
        subtitle="Track and manage the referral program"
      />

      <div className="py-8 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Referrers</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.totalReferrers || 0}
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
                <p className="text-sm text-gray-600 mb-1">
                  Total Referred Users
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.totalReferred || 0}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Paid</p>
                <p className="text-3xl font-bold text-green-600">
                  ${stats?.totalEarningsPaid?.toFixed(2) || "0.00"}
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
                <p className="text-sm text-gray-600 mb-1">Avg per Referrer</p>
                <p className="text-3xl font-bold text-purple-600">
                  $
                  {stats?.totalReferrers > 0
                    ? (stats.totalEarningsPaid / stats.totalReferrers).toFixed(
                        2
                      )
                    : "0.00"}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Award className="text-purple-600" size={24} />
              </div>
            </div>
          </Card>
        </div>

        {/* Top Referrers Table */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Top Referrers
            </h3>
            <div className="relative w-64">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search referrers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Rank
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    User
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Total Referrals
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Earnings
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredReferrers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">
                      No referrers found
                    </td>
                  </tr>
                ) : (
                  filteredReferrers.map((user, index) => (
                    <tr
                      key={user._id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                          {index + 1}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{user.email}</td>
                      <td className="py-3 px-4 text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {user.totalReferrals}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-green-600">
                        ${user.referralEarnings?.toFixed(2) || "0.00"}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => fetchUserReferrals(user._id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                        >
                          <Eye size={14} />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedUser.firstName} {selectedUser.lastName}'s Referrals
                </h3>
                <p className="text-sm text-gray-600">{selectedUser.email}</p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Referrals</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {userReferrals.length}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${selectedUser.referralEarnings?.toFixed(2) || "0.00"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Avg per Referral</p>
                  <p className="text-2xl font-bold text-purple-600">
                    $
                    {userReferrals.length > 0
                      ? (
                          selectedUser.referralEarnings / userReferrals.length
                        ).toFixed(2)
                      : "0.00"}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {userReferrals.map((referral) => (
                  <div
                    key={referral.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">
                          {referral.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {referral.email}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Joined:{" "}
                          {new Date(referral.joinedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Commission</p>
                        <p className="text-lg font-semibold text-green-600">
                          ${referral.stats.myCommission.toFixed(4)}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-600">Accounts</p>
                        <p className="text-sm font-semibold">
                          {referral.stats.totalAccounts}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Trades</p>
                        <p className="text-sm font-semibold">
                          {referral.stats.totalTrades}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Volume</p>
                        <p className="text-sm font-semibold">
                          ${referral.stats.totalTradeAmount.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">P/L</p>
                        <p
                          className={`text-sm font-semibold ${
                            referral.stats.totalProfitLoss >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          ${referral.stats.totalProfitLoss.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Referrals;
