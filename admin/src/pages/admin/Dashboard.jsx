import React, { useState, useEffect, useMemo } from "react";
import MetaHead from "../../components/MetaHead";
import PageHeader from "../../components/ui/PageHeader";
import { Link } from "react-router-dom";
import {
  Users,
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowUpRight,
  Award,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import api from "../../services/api";

const Dashboard = () => {
  // State management
  const [users, setUsers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch all data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [usersRes, accountsRes, depositsRes, withdrawalsRes] =
        await Promise.all([
          api.get("/admin/users?limit=1000"),
          api.get("/account/admin/all?limit=1000"),
          api.get("/transactions/admin/deposits?limit=1000"),
          api.get("/transactions/admin/withdrawals?limit=1000"),
        ]);

      setUsers(usersRes.data.data || []);
      setAccounts(accountsRes.data.data || []);
      setDeposits(depositsRes.data.data || []);
      setWithdrawals(withdrawalsRes.data.data || []);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAllData();
  };

  // Calculate comprehensive statistics
  const stats = useMemo(() => {
    // User Statistics
    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.status === "active").length;
    const verifiedUsers = users.filter((u) => u.kyc === "approved").length;
    const newUsersThisMonth = users.filter((u) => {
      const createdDate = new Date(u.createdAt);
      const now = new Date();
      return (
        createdDate.getMonth() === now.getMonth() &&
        createdDate.getFullYear() === now.getFullYear()
      );
    }).length;

    // Trader Level Distribution
    const traderLevels = users.reduce((acc, user) => {
      const level = user.traderLevel || "beginner";
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {});

    // Account Statistics
    const realAccounts = accounts.filter((a) => a.accountType === "Real");
    const demoAccounts = accounts.filter((a) => a.accountType === "Demo");
    const archivedAccounts = accounts.filter((a) => a.status === "closed");
    const totalBalance = realAccounts.reduce(
      (sum, acc) => sum + parseFloat(acc.balance || 0),
      0
    );
    const totalEquity = realAccounts.reduce(
      (sum, acc) => sum + parseFloat(acc.equity || acc.balance || 0),
      0
    );

    // Deposit Statistics
    const completedDeposits = deposits.filter((d) => d.status === "completed");
    const pendingDeposits = deposits.filter(
      (d) => d.status === "pending" || d.status === "processing"
    );
    const totalDeposited = completedDeposits.reduce(
      (sum, d) => sum + parseFloat(d.amount || 0),
      0
    );

    const depositsThisMonth = completedDeposits.filter((d) => {
      const depositDate = new Date(d.createdAt);
      const now = new Date();
      return (
        depositDate.getMonth() === now.getMonth() &&
        depositDate.getFullYear() === now.getFullYear()
      );
    });

    const depositsThisMonthAmount = depositsThisMonth.reduce(
      (sum, d) => sum + parseFloat(d.amount || 0),
      0
    );

    // Withdrawal Statistics
    const completedWithdrawals = withdrawals.filter(
      (w) => w.status === "completed"
    );
    const pendingWithdrawals = withdrawals.filter(
      (w) => w.status === "pending" || w.status === "processing"
    );
    const totalWithdrawn = completedWithdrawals.reduce(
      (sum, w) => sum + parseFloat(w.amount || 0),
      0
    );

    const withdrawalsThisMonth = completedWithdrawals.filter((w) => {
      const withdrawalDate = new Date(w.createdAt);
      const now = new Date();
      return (
        withdrawalDate.getMonth() === now.getMonth() &&
        withdrawalDate.getFullYear() === now.getFullYear()
      );
    });

    const withdrawalsThisMonthAmount = withdrawalsThisMonth.reduce(
      (sum, w) => sum + parseFloat(w.amount || 0),
      0
    );

    // Net Flow
    const netFlow = totalDeposited - totalWithdrawn;
    const netFlowThisMonth =
      depositsThisMonthAmount - withdrawalsThisMonthAmount;

    // Recent Activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentDeposits = deposits.filter(
      (d) => new Date(d.createdAt) >= sevenDaysAgo
    ).length;
    const recentWithdrawals = withdrawals.filter(
      (w) => new Date(w.createdAt) >= sevenDaysAgo
    ).length;

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        verified: verifiedUsers,
        newThisMonth: newUsersThisMonth,
        traderLevels,
      },
      accounts: {
        total: accounts.length,
        real: realAccounts.length,
        demo: demoAccounts.length,
        archived: archivedAccounts.length,
        totalBalance: totalBalance.toFixed(2),
        totalEquity: totalEquity.toFixed(2),
      },
      deposits: {
        total: deposits.length,
        completed: completedDeposits.length,
        pending: pendingDeposits.length,
        totalAmount: totalDeposited.toFixed(2),
        thisMonth: depositsThisMonth.length,
        thisMonthAmount: depositsThisMonthAmount.toFixed(2),
        recent: recentDeposits,
      },
      withdrawals: {
        total: withdrawals.length,
        completed: completedWithdrawals.length,
        pending: pendingWithdrawals.length,
        totalAmount: totalWithdrawn.toFixed(2),
        thisMonth: withdrawalsThisMonth.length,
        thisMonthAmount: withdrawalsThisMonthAmount.toFixed(2),
        recent: recentWithdrawals,
      },
      financial: {
        netFlow: netFlow.toFixed(2),
        netFlowThisMonth: netFlowThisMonth.toFixed(2),
      },
    };
  }, [users, accounts, deposits, withdrawals]);

  // Recent transactions (last 5)
  const recentTransactions = useMemo(() => {
    const allTransactions = [
      ...deposits.map((d) => ({ ...d, type: "deposit" })),
      ...withdrawals.map((w) => ({ ...w, type: "withdrawal" })),
    ];
    return allTransactions
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [deposits, withdrawals]);

  // Top users by total deposits
  const topUsers = useMemo(() => {
    return users
      .map((user) => {
        const userDeposits = deposits.filter(
          (d) => d.userId?._id === user._id && d.status === "completed"
        );
        const totalDeposits = userDeposits.reduce(
          (sum, d) => sum + parseFloat(d.amount || 0),
          0
        );
        const tradingAccounts = accounts.filter(
          (a) => a.userId?._id === user._id || a.userId === user._id
        );
        return {
          ...user,
          totalDeposits,
          tradingAccounts,
        };
      })
      .sort((a, b) => b.totalDeposits - a.totalDeposits)
      .slice(0, 5);
  }, [users, deposits, accounts]);

  if (loading) {
    return (
      <>
        <MetaHead
          title="Admin Dashboard"
          description="Manage all trading accounts, view balances, equity, and overall performance."
          keywords="trading accounts, account balance, equity, trading dashboard, portfolio management"
        />
        <PageHeader
          title="Admin Dashboard"
          subtitle="Manage all trading accounts and monitor performance"
        />
        <div className="flex justify-center items-center mt-20">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            <span className="text-gray-600">Loading dashboard...</span>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <MetaHead
          title="Admin Dashboard"
          description="Manage all trading accounts, view balances, equity, and overall performance."
          keywords="trading accounts, account balance, equity, trading dashboard, portfolio management"
        />
        <PageHeader
          title="Admin Dashboard"
          subtitle="Manage all trading accounts and monitor performance"
        />
        <div className="flex flex-col justify-center items-center mt-20 gap-4">
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-red-600">Error: {error}</p>
          </div>
          <button
            onClick={handleRefresh}
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
        title="Admin Dashboard"
        description="Manage all trading accounts, view balances, equity, and overall performance."
        keywords="trading accounts, account balance, equity, trading dashboard, portfolio management"
      />
      <PageHeader
        title="Admin Dashboard"
        subtitle="Manage all trading accounts and monitor performance"
      />

      {/* Main Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
        {/* Total Users */}
        <Link to="/admin/users" className="block">
          <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                  Total Users
                </p>
                <p className="text-2xl font-bold text-gray-900 truncate">
                  {stats.users.total}
                </p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors flex-shrink-0 ml-2">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div>
              <p className="text-xs text-green-600 mb-2 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                {stats.users.newThisMonth} new this month
              </p>
              <div className="pt-2 border-t border-gray-100 flex justify-between text-xs">
                <span className="text-gray-500">
                  Active: {stats.users.active}
                </span>
                <span className="text-gray-500">
                  Verified: {stats.users.verified}
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* Total Accounts */}
        <Link to="/admin/accounts" className="block">
          <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                  Total Accounts
                </p>
                <p className="text-2xl font-bold text-gray-900 truncate">
                  {stats.accounts.total}
                </p>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors flex-shrink-0 ml-2">
                <Wallet className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div>
              <p className="text-xs text-blue-600 mb-2 flex items-center gap-1">
                <Activity className="w-3 h-3" />
                {stats.accounts.real} real accounts
              </p>
              <div className="pt-2 border-t border-gray-100 flex justify-between text-xs">
                <span className="text-gray-500">
                  Demo: {stats.accounts.demo}
                </span>
                <span className="text-gray-500">
                  Archived: {stats.accounts.archived}
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* Total Deposits */}
        <Link to="/admin/deposits" className="block">
          <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                  Total Deposited
                </p>
                <p className="text-2xl font-bold text-gray-900 truncate">
                  ${stats.deposits.totalAmount}
                </p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors flex-shrink-0 ml-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div>
              <p className="text-xs text-green-600 mb-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />$
                {stats.deposits.thisMonthAmount} this month
              </p>
              <div className="pt-2 border-t border-gray-100 flex justify-between text-xs">
                <span className="text-gray-500">
                  Completed: {stats.deposits.completed}
                </span>
                <span className="text-orange-500">
                  Pending: {stats.deposits.pending}
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* Total Withdrawals */}
        <Link to="/admin/withdrawals" className="block">
          <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                  Total Withdrawn
                </p>
                <p className="text-2xl font-bold text-gray-900 truncate">
                  ${stats.withdrawals.totalAmount}
                </p>
              </div>
              <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors flex-shrink-0 ml-2">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <div>
              <p className="text-xs text-red-600 mb-2 flex items-center gap-1">
                <TrendingDown className="w-3 h-3" />$
                {stats.withdrawals.thisMonthAmount} this month
              </p>
              <div className="pt-2 border-t border-gray-100 flex justify-between text-xs">
                <span className="text-gray-500">
                  Completed: {stats.withdrawals.completed}
                </span>
                <span className="text-orange-500">
                  Pending: {stats.withdrawals.pending}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {/* Total Balance */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-wide font-medium opacity-90 mb-1">
                Total Balance
              </p>
              <p className="text-2xl font-bold truncate">
                ${stats.accounts.totalBalance}
              </p>
              <p className="text-xs opacity-80 mt-1">
                Across all real accounts
              </p>
            </div>
            <div className="p-2 bg-white/20 rounded-lg flex-shrink-0 ml-2">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Total Equity */}
        <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl p-4 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-wide font-medium opacity-90 mb-1">
                Total Equity
              </p>
              <p className="text-2xl font-bold truncate">
                ${stats.accounts.totalEquity}
              </p>
              <p className="text-xs opacity-80 mt-1">Current market value</p>
            </div>
            <div className="p-2 bg-white/20 rounded-lg flex-shrink-0 ml-2">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Net Flow */}
        <div
          className={`bg-gradient-to-br ${
            parseFloat(stats.financial.netFlow) >= 0
              ? "from-green-500 to-green-600"
              : "from-red-500 to-red-600"
          } rounded-xl p-4 text-white`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-wide font-medium opacity-90 mb-1">
                Net Flow
              </p>
              <p className="text-2xl font-bold truncate">
                {parseFloat(stats.financial.netFlow) >= 0 ? "+" : ""}$
                {stats.financial.netFlow}
              </p>
              <p className="text-xs opacity-80 mt-1 truncate">
                This month:{" "}
                {parseFloat(stats.financial.netFlowThisMonth) >= 0 ? "+" : ""}$
                {stats.financial.netFlowThisMonth}
              </p>
            </div>
            <div className="p-2 bg-white/20 rounded-lg flex-shrink-0 ml-2">
              <Activity className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        {/* Recent Transactions */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-gray-900">
              Recent Transactions
            </h3>
            <span className="text-xs text-gray-500">
              {stats.deposits.recent + stats.withdrawals.recent} in last 7 days
            </span>
          </div>
          <div className="space-y-2">
            {recentTransactions.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-6">
                No recent transactions
              </p>
            ) : (
              recentTransactions.map((transaction) => {
                const user = users.find(
                  (u) =>
                    u._id === transaction.userId?._id ||
                    u._id === transaction.userId
                );
                return (
                  <div
                    key={transaction._id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div
                        className={`p-1.5 rounded-lg flex-shrink-0 ${
                          transaction.type === "deposit"
                            ? "bg-green-100"
                            : "bg-red-100"
                        }`}
                      >
                        {transaction.type === "deposit" ? (
                          <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5 text-red-600" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user
                            ? `${user.firstName || ""} ${user.lastName || ""}`
                            : "Unknown"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {transaction.paymentMethod ||
                            transaction.withdrawalMethod ||
                            "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p
                        className={`text-sm font-semibold ${
                          transaction.type === "deposit"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type === "deposit" ? "+" : "-"}$
                        {parseFloat(transaction.amount || 0).toFixed(2)}
                      </p>
                      <StatusBadge status={transaction.status} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Top Users by Deposits */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-gray-900">Top Users</h3>
            <Award className="w-4 h-4 text-orange-500" />
          </div>
          <div className="space-y-2">
            {topUsers.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-6">
                No users found
              </p>
            ) : (
              topUsers.map((user, index) => (
                <Link
                  key={user._id}
                  to="/admin/users"
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 text-white font-bold text-xs flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.firstName || ""} {user.lastName || ""}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-sm font-semibold text-gray-900">
                      ${user.totalDeposits.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.tradingAccounts.length} acc
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        {/* Trader Level Distribution */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-3">
            Trader Levels
          </h3>
          <div className="space-y-4.5">
            {Object.entries(stats.users.traderLevels).map(([level, count]) => {
              const percentage = ((count / stats.users.total) * 100).toFixed(1);
              const colors = {
                beginner: "bg-blue-500",
                intermediate: "bg-green-500",
                advanced: "bg-orange-500",
                professional: "bg-purple-500",
              };
              return (
                <div key={level}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {level}
                    </span>
                    <span className="text-xs text-gray-500">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${
                        colors[level] || "bg-gray-500"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-3">
            Quick Stats
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-1.5 mb-1">
                <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xs text-blue-600 font-medium">
                  Deposits
                </span>
              </div>
              <p className="text-xl font-bold text-blue-900">
                {stats.deposits.completed}
              </p>
              <p className="text-xs text-blue-600 mt-0.5 truncate">
                ${stats.deposits.totalAmount}
              </p>
            </div>

            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-1.5 mb-1">
                <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                <span className="text-xs text-green-600 font-medium">
                  Withdrawals
                </span>
              </div>
              <p className="text-xl font-bold text-green-900">
                {stats.withdrawals.completed}
              </p>
              <p className="text-xs text-green-600 mt-0.5 truncate">
                ${stats.withdrawals.totalAmount}
              </p>
            </div>

            <div className="p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5 text-orange-600" />
                <span className="text-xs text-orange-600 font-medium">
                  Pending Deps
                </span>
              </div>
              <p className="text-xl font-bold text-orange-900">
                {stats.deposits.pending}
              </p>
              <p className="text-xs text-orange-600 mt-0.5">Action needed</p>
            </div>

            <div className="p-3 bg-red-50 rounded-lg">
              <div className="flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5 text-red-600" />
                <span className="text-xs text-red-600 font-medium">
                  Pending WDs
                </span>
              </div>
              <p className="text-xl font-bold text-red-900">
                {stats.withdrawals.pending}
              </p>
              <p className="text-xs text-red-600 mt-0.5">Action needed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      {(stats.deposits.pending > 0 || stats.withdrawals.pending > 0) && (
        <div className="mt-4 bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-orange-900">
                Action Required
              </h3>
              <p className="text-sm text-orange-700 mt-1">
                {stats.deposits.pending} pending deposit
                {stats.deposits.pending !== 1 ? "s" : ""} and{" "}
                {stats.withdrawals.pending} pending withdrawal
                {stats.withdrawals.pending !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {stats.deposits.pending > 0 && (
                <Link
                  to="/admin/deposits"
                  className="text-xs font-medium text-orange-900 hover:text-orange-700 underline"
                >
                  View Deposits
                </Link>
              )}
              {stats.withdrawals.pending > 0 && (
                <Link
                  to="/admin/withdrawals"
                  className="text-xs font-medium text-orange-900 hover:text-orange-700 underline"
                >
                  View Withdrawals
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Helper Component
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
      className={`inline-flex px-1.5 py-0.5 text-xs font-medium rounded ${
        styles[status] || styles.pending
      }`}
    >
      {status}
    </span>
  );
};

export default Dashboard;
