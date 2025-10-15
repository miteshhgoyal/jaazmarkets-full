// user/src/pages/trading/Summary.jsx
import React, { useState, useEffect, useMemo } from "react";
import MetaHead from "../../components/MetaHead";
import PageHeader from "../../components/ui/PageHeader";
import Tabs from "../../components/ui/Tabs";
import api from "../../services/api";
import toast from "react-hot-toast";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const getStatsForAccounts = (accounts, dateFilter) => {
  if (!accounts || accounts.length === 0) {
    return {
      netProfit: 0,
      totalProfit: 0,
      totalLoss: 0,
      closedOrders: 0,
      profitableOrders: 0,
      unprofitableOrders: 0,
      tradingVolume: 0,
      lifetimeTradingVolume: 0,
      equity: 0,
      currentEquity: 0,
      totalBalance: 0,
      freeMargin: 0,
    };
  }

  const now = new Date();
  const filtered = accounts.filter((acc) => {
    if (!dateFilter) return true;
    const createdAt = new Date(acc.createdAt);
    const diffDays = (now - createdAt) / (1000 * 3600 * 24);
    return diffDays <= dateFilter;
  });

  // For demo purposes, calculate from account data
  // In production, these would come from trading history/orders
  const totalProfit = filtered.reduce(
    (sum, acc) => sum + parseFloat(acc.totalProfit || 0),
    0
  );

  const totalLoss = filtered.reduce(
    (sum, acc) => sum + parseFloat(acc.totalLoss || 0),
    0
  );

  const netProfit = totalProfit - totalLoss;

  const profitableOrders = filtered.reduce(
    (sum, acc) => sum + (parseInt(acc.profitableOrders) || 0),
    0
  );

  const unprofitableOrders = filtered.reduce(
    (sum, acc) => sum + (parseInt(acc.unprofitableOrders) || 0),
    0
  );

  const closedOrders = profitableOrders + unprofitableOrders;

  const tradingVolume = filtered.reduce(
    (sum, acc) => sum + parseFloat(acc.tradingVolume || 0),
    0
  );

  const lifetimeTradingVolume = filtered.reduce(
    (sum, acc) => sum + parseFloat(acc.lifetimeTradingVolume || 0),
    0
  );

  const equity = filtered.reduce(
    (sum, acc) => sum + parseFloat(acc.equity || 0),
    0
  );

  const currentEquity = filtered.reduce(
    (sum, acc) => sum + parseFloat(acc.equity || 0), // Using equity as current equity
    0
  );

  const totalBalance = filtered.reduce(
    (sum, acc) => sum + parseFloat(acc.balance || 0),
    0
  );

  const freeMargin = filtered.reduce(
    (sum, acc) => sum + parseFloat(acc.freeMargin || 0),
    0
  );

  return {
    netProfit,
    totalProfit,
    totalLoss,
    closedOrders,
    profitableOrders,
    unprofitableOrders,
    tradingVolume,
    lifetimeTradingVolume,
    equity,
    currentEquity,
    totalBalance,
    freeMargin,
  };
};

// Generate chart data based on accounts and date range
const generateChartData = (accounts, dateFilter) => {
  if (!accounts || accounts.length === 0) return [];

  const now = new Date();
  const daysToShow = dateFilter || 365;
  const dataPoints = Math.min(daysToShow, 30);

  const chartData = [];
  for (let i = dataPoints - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    const relevantAccounts = accounts.filter((acc) => {
      const createdAt = new Date(acc.createdAt);
      return createdAt <= date;
    });

    if (relevantAccounts.length > 0) {
      const stats = getStatsForAccounts(relevantAccounts, null);

      chartData.push({
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        netProfit: parseFloat(stats.netProfit.toFixed(2)),
        totalProfit: parseFloat(stats.totalProfit.toFixed(2)),
        totalLoss: parseFloat(stats.totalLoss.toFixed(2)),
        closedOrders: stats.closedOrders,
        profitableOrders: stats.profitableOrders,
        unprofitableOrders: stats.unprofitableOrders,
        tradingVolume: parseFloat(stats.tradingVolume.toFixed(2)),
        lifetimeVolume: parseFloat(stats.lifetimeTradingVolume.toFixed(2)),
        equity: parseFloat(stats.equity.toFixed(2)),
        currentEquity: parseFloat(stats.currentEquity.toFixed(2)),
      });
    }
  }

  return chartData;
};

const DAY_FILTERS = [
  { label: "Last 7 days", value: 7 },
  { label: "Last 30 days", value: 30 },
  { label: "Last 90 days", value: 90 },
  { label: "Last 365 days", value: 365 },
  { label: "All time", value: null },
];

const Summary = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState("all");
  const [selectedDays, setSelectedDays] = useState(365);
  const [activeChartTab, setActiveChartTab] = useState("netprofit");

  // Fetch accounts on mount
  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/account/my-accounts");

      if (response.data.success) {
        // Filter only active Real accounts for summary
        const realAccounts = response.data.data.filter(
          (acc) => acc.accountType === "Real" && acc.status === "active"
        );
        setAccounts(realAccounts);
      }
    } catch (err) {
      console.error("Failed to fetch accounts:", err);
      setError(err.response?.data?.message || "Failed to load accounts");
      toast.error("Failed to load accounts");
    } finally {
      setLoading(false);
    }
  };

  const chartTabs = [
    { id: "netprofit", label: "Net Profit" },
    { id: "closedorders", label: "Closed Orders" },
    { id: "tradingvolume", label: "Trading Volume" },
    { id: "equity", label: "Equity" },
  ];

  const filteredAccounts = useMemo(() => {
    if (selectedAccount === "all") return accounts;
    return accounts.filter((acc) => acc._id === selectedAccount);
  }, [accounts, selectedAccount]);

  const stats = useMemo(
    () => getStatsForAccounts(filteredAccounts, selectedDays),
    [filteredAccounts, selectedDays]
  );

  const chartData = useMemo(
    () => generateChartData(filteredAccounts, selectedDays),
    [filteredAccounts, selectedDays]
  );

  if (loading) {
    return (
      <>
        <MetaHead
          title="Trading Summary"
          description="Comprehensive trading summary with P&L, open positions, account equity, and performance analytics. Track your trading success."
          keywords="trading summary, profit loss, portfolio performance, trading analytics, account overview"
        />
        <PageHeader title="Summary" />
        <div className="flex justify-center items-center mt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <MetaHead
          title="Trading Summary"
          description="Comprehensive trading summary with P&L, open positions, account equity, and performance analytics. Track your trading success."
          keywords="trading summary, profit loss, portfolio performance, trading analytics, account overview"
        />
        <PageHeader title="Summary" />
        <div className="flex flex-col justify-center items-center mt-20">
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
            <p className="text-center">Error loading accounts: {error}</p>
          </div>
          <button
            onClick={fetchAccounts}
            className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 rounded-lg font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      </>
    );
  }

  const renderChart = () => {
    switch (activeChartTab) {
      case "netprofit":
        return <NetProfitChart data={chartData} />;
      case "closedorders":
        return <ClosedOrdersChart data={chartData} />;
      case "tradingvolume":
        return <TradingVolumeChart data={chartData} />;
      case "equity":
        return <EquityChart data={chartData} />;
      default:
        return null;
    }
  };

  return (
    <>
      <MetaHead
        title="Trading Summary"
        description="Comprehensive trading summary with P&L, open positions, account equity, and performance analytics. Track your trading success."
        keywords="trading summary, profit loss, portfolio performance, trading analytics, account overview"
      />
      <PageHeader title="Summary" />

      <div className="">
        <h3 className="text-gray-800 text-sm font-medium mt-6">Accounts</h3>

        <div className="flex flex-col md:flex-row md:items-center gap-2 mt-2">
          <select
            className="w-full md:w-auto px-3 py-2 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-yellow-400"
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
          >
            <option value="all">All accounts</option>
            {accounts.map((acc) => (
              <option key={acc._id} value={acc._id}>
                {acc.accountClass} {acc.platform} #{acc.login}
              </option>
            ))}
          </select>
          <select
            className="w-full md:w-auto px-3 py-2 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-yellow-400"
            value={selectedDays || "all"}
            onChange={(e) =>
              setSelectedDays(
                e.target.value === "all" ? null : Number(e.target.value)
              )
            }
          >
            {DAY_FILTERS.map((f) => (
              <option key={f.value || "all"} value={f.value || "all"}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {accounts.length === 0 ? (
          <div className="flex flex-col justify-center items-center mt-10 bg-white rounded-xl border border-gray-200 p-12">
            <svg
              className="w-20 h-20 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <p className="text-gray-500 text-lg mb-4">
              No active real accounts found
            </p>
            <p className="text-gray-400 text-sm mb-6">
              Create a real trading account to see your summary statistics
            </p>
            <button
              onClick={() => (window.location.href = "/trading/new-account")}
              className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-lg transition-colors"
            >
              Create Account
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <MainStatCard
                label="Net Profit"
                value={`${stats.netProfit.toFixed(2)} USD`}
                subStats={[
                  {
                    label: "Total Profit",
                    value: `${stats.totalProfit.toFixed(2)} USD`,
                  },
                  {
                    label: "Total Loss",
                    value: `${stats.totalLoss.toFixed(2)} USD`,
                  },
                ]}
                valueColor={
                  stats.netProfit >= 0 ? "text-green-600" : "text-red-600"
                }
              />
              <MainStatCard
                label="Balance & Equity"
                value={`${stats.totalBalance.toFixed(2)} USD`}
                subStats={[
                  {
                    label: "Equity",
                    value: `${stats.equity.toFixed(2)} USD`,
                  },
                  {
                    label: "Free Margin",
                    value: `${stats.freeMargin.toFixed(2)} USD`,
                  },
                ]}
                valueColor="text-blue-600"
              />
              <MainStatCard
                label="Closed Orders"
                value={stats.closedOrders}
                subStats={[
                  { label: "Profitable", value: stats.profitableOrders },
                  { label: "Unprofitable", value: stats.unprofitableOrders },
                ]}
              />
              <MainStatCard
                label="Trading Volume"
                value={`${stats.tradingVolume.toFixed(2)} USD`}
                subStats={[
                  {
                    label: "Lifetime Volume",
                    value: `${stats.lifetimeTradingVolume.toFixed(2)} USD`,
                  },
                ]}
                valueColor="text-purple-600"
              />
            </div>

            <h3 className="text-gray-800 text-xl font-semibold mt-8 mb-4">
              Charts
            </h3>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <Tabs
                tabs={chartTabs}
                activeTab={activeChartTab}
                onTabChange={setActiveChartTab}
              />
              <div className="mt-6">
                {chartData.length > 0 ? (
                  renderChart()
                ) : (
                  <div className="flex justify-center items-center h-96 text-gray-400">
                    <div className="text-center">
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
                          d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p>No data available for the selected period</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

const MainStatCard = ({
  label,
  value,
  subStats = [],
  valueColor = "text-gray-900",
}) => (
  <div className="bg-white border border-gray-200 rounded-xl px-6 py-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="text-gray-500 text-xs font-medium mb-2">{label}</div>
    <div className={`text-xl font-bold ${valueColor} mb-4`}>{value}</div>
    <div className="space-y-1">
      {subStats.map((sub, idx) => (
        <div key={idx} className="flex justify-between items-center text-xs">
          <span className="text-gray-500">{sub.label}</span>
          <span className="text-gray-700 font-medium">{sub.value}</span>
        </div>
      ))}
    </div>
  </div>
);

// Net Profit Chart - Line Chart
const NetProfitChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={400}>
    <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
      <XAxis
        dataKey="date"
        tick={{ fontSize: 11, fill: "#6b7280" }}
        stroke="#9ca3af"
      />
      <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} stroke="#9ca3af" />
      <Tooltip
        contentStyle={{
          backgroundColor: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          fontSize: "12px",
        }}
      />
      <Legend wrapperStyle={{ fontSize: "12px" }} iconSize={10} />
      <Line
        type="monotone"
        dataKey="netProfit"
        stroke="#10b981"
        strokeWidth={2}
        dot={{ r: 3 }}
        name="Net Profit"
      />
      <Line
        type="monotone"
        dataKey="totalProfit"
        stroke="#3b82f6"
        strokeWidth={2}
        dot={{ r: 3 }}
        name="Total Profit"
      />
      <Line
        type="monotone"
        dataKey="totalLoss"
        stroke="#ef4444"
        strokeWidth={2}
        dot={{ r: 3 }}
        name="Total Loss"
      />
    </LineChart>
  </ResponsiveContainer>
);

// Closed Orders Chart - Bar Chart
const ClosedOrdersChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={400}>
    <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
      <XAxis
        dataKey="date"
        tick={{ fontSize: 11, fill: "#6b7280" }}
        stroke="#9ca3af"
      />
      <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} stroke="#9ca3af" />
      <Tooltip
        contentStyle={{
          backgroundColor: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          fontSize: "12px",
        }}
      />
      <Legend wrapperStyle={{ fontSize: "12px" }} iconSize={10} />
      <Bar
        dataKey="profitableOrders"
        fill="#10b981"
        name="Profitable"
        barSize={30}
      />
      <Bar
        dataKey="unprofitableOrders"
        fill="#ef4444"
        name="Unprofitable"
        barSize={30}
      />
    </BarChart>
  </ResponsiveContainer>
);

// Trading Volume Chart - Line Chart
const TradingVolumeChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={400}>
    <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
      <XAxis
        dataKey="date"
        tick={{ fontSize: 11, fill: "#6b7280" }}
        stroke="#9ca3af"
      />
      <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} stroke="#9ca3af" />
      <Tooltip
        contentStyle={{
          backgroundColor: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          fontSize: "12px",
        }}
      />
      <Legend wrapperStyle={{ fontSize: "12px" }} iconSize={10} />
      <Line
        type="monotone"
        dataKey="tradingVolume"
        stroke="#8b5cf6"
        strokeWidth={2}
        dot={{ r: 3 }}
        name="Trading Volume"
      />
      <Line
        type="monotone"
        dataKey="lifetimeVolume"
        stroke="#f59e0b"
        strokeWidth={2}
        dot={{ r: 3 }}
        name="Lifetime Volume"
      />
    </LineChart>
  </ResponsiveContainer>
);

// Equity Chart - Line Chart
const EquityChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={400}>
    <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
      <XAxis
        dataKey="date"
        tick={{ fontSize: 11, fill: "#6b7280" }}
        stroke="#9ca3af"
      />
      <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} stroke="#9ca3af" />
      <Tooltip
        contentStyle={{
          backgroundColor: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          fontSize: "12px",
        }}
      />
      <Legend wrapperStyle={{ fontSize: "12px" }} iconSize={10} />
      <Line
        type="monotone"
        dataKey="equity"
        stroke="#06b6d4"
        strokeWidth={2}
        dot={{ r: 3 }}
        name="Equity"
      />
      <Line
        type="monotone"
        dataKey="currentEquity"
        stroke="#8b5cf6"
        strokeWidth={2}
        dot={{ r: 3 }}
        name="Current Equity"
      />
    </LineChart>
  </ResponsiveContainer>
);

export default Summary;
