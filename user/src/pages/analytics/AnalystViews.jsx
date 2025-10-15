import React, { useState, useEffect, useRef } from "react";
import MetaHead from "../../components/MetaHead";
import Tabs from "../../components/ui/Tabs";
import { TrendingUp, Bitcoin, BarChart3, Activity, Gem } from "lucide-react";

const AnalystViews = () => {
  const [activeTab, setActiveTab] = useState("forex");
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = [
    { id: "forex", label: "Forex", icon: TrendingUp },
    { id: "crypto", label: "Crypto", icon: Bitcoin },
    { id: "stocks", label: "Stocks", icon: BarChart3 },
    { id: "indices", label: "Indices", icon: Activity },
    { id: "commodities", label: "Commodities", icon: Gem },
  ];

  // Sample analyst data
  const analystData = {
    forex: [
      {
        id: 1,
        pair: "USD/CHF",
        timeframe: "30 MIN",
        timestamp: "Friday, October 10, 2025 11:13:36 AM CET",
        timezone: "2:43 PM (UTC+5:30)",
        expectedMove: "UP",
        pipsRange: "26 - 46 PIPS",
        target: "0.8095",
        chart: { symbol: "FX:USDCHF", interval: "30" },
      },
      {
        id: 2,
        pair: "AUD/USD",
        timeframe: "30 MIN",
        timestamp: "Friday, October 10, 2025 11:12:28 AM CET",
        timezone: "2:42 PM (UTC+5:30)",
        expectedMove: "DOWN",
        pipsRange: "14 - 29 PIPS",
        target: "0.6525",
        chart: { symbol: "FX:AUDUSD", interval: "30" },
      },
      {
        id: 3,
        pair: "EUR/USD",
        timeframe: "1 HOUR",
        timestamp: "Friday, October 10, 2025 10:45:12 AM CET",
        timezone: "2:15 PM (UTC+5:30)",
        expectedMove: "UP",
        pipsRange: "35 - 52 PIPS",
        target: "1.0875",
        chart: { symbol: "FX:EURUSD", interval: "60" },
      },
      {
        id: 4,
        pair: "GBP/JPY",
        timeframe: "15 MIN",
        timestamp: "Friday, October 10, 2025 11:30:45 AM CET",
        timezone: "3:00 PM (UTC+5:30)",
        expectedMove: "DOWN",
        pipsRange: "18 - 34 PIPS",
        target: "189.45",
        chart: { symbol: "FX:GBPJPY", interval: "15" },
      },
    ],
    crypto: [
      {
        id: 1,
        pair: "BTC/USD",
        timeframe: "1 HOUR",
        timestamp: "Friday, October 10, 2025 11:00:00 AM CET",
        timezone: "2:30 PM (UTC+5:30)",
        expectedMove: "UP",
        pipsRange: "450 - 680 POINTS",
        target: "62,500",
        chart: { symbol: "BINANCE:BTCUSDT", interval: "60" },
      },
      {
        id: 2,
        pair: "ETH/USD",
        timeframe: "30 MIN",
        timestamp: "Friday, October 10, 2025 11:15:00 AM CET",
        timezone: "2:45 PM (UTC+5:30)",
        expectedMove: "UP",
        pipsRange: "25 - 42 POINTS",
        target: "2,650",
        chart: { symbol: "BINANCE:ETHUSDT", interval: "30" },
      },
    ],
    stocks: [
      {
        id: 1,
        pair: "AAPL",
        timeframe: "1 DAY",
        timestamp: "Friday, October 10, 2025 09:30:00 AM EST",
        timezone: "7:00 PM (UTC+5:30)",
        expectedMove: "UP",
        pipsRange: "2.5 - 4.2 POINTS",
        target: "178.50",
        chart: { symbol: "NASDAQ:AAPL", interval: "D" },
      },
      {
        id: 2,
        pair: "TSLA",
        timeframe: "4 HOUR",
        timestamp: "Friday, October 10, 2025 10:00:00 AM EST",
        timezone: "7:30 PM (UTC+5:30)",
        expectedMove: "DOWN",
        pipsRange: "3.8 - 6.5 POINTS",
        target: "245.20",
        chart: { symbol: "NASDAQ:TSLA", interval: "240" },
      },
    ],
    indices: [
      {
        id: 1,
        pair: "S&P 500",
        timeframe: "4 HOUR",
        timestamp: "Friday, October 10, 2025 10:00:00 AM EST",
        timezone: "7:30 PM (UTC+5:30)",
        expectedMove: "UP",
        pipsRange: "25 - 45 POINTS",
        target: "5,685",
        chart: { symbol: "SP:SPX", interval: "240" },
      },
    ],
    commodities: [
      {
        id: 1,
        pair: "GOLD",
        timeframe: "1 HOUR",
        timestamp: "Friday, October 10, 2025 11:15:00 AM CET",
        timezone: "2:45 PM (UTC+5:30)",
        expectedMove: "DOWN",
        pipsRange: "8 - 15 POINTS",
        target: "2,625",
        chart: { symbol: "OANDA:XAUUSD", interval: "60" },
      },
    ],
  };

  const currentData = analystData[activeTab] || [];

  return (
    <>
      <MetaHead
        title="Market Analysis & Expert Views"
        description="Professional market analysis, expert trading insights, and analyst recommendations. Stay informed with daily market commentary."
        keywords="market analysis, analyst views, trading insights, market commentary, expert opinions"
      />

      <div className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Analyst Views</h1>
          </div>
        </div>

        <div className=" py-6">
          {/* Tabs */}
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            className="mb-6 rounded-lg shadow-sm"
          />

          {/* Analysis Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentData.map((analysis) => (
              <AnalysisCard key={analysis.id} data={analysis} />
            ))}
          </div>

          {currentData.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500 text-lg">
                No analyst views available for this category yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Analysis Card Component with TradingView Chart
const AnalysisCard = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      // Clear previous content
      chartRef.current.innerHTML = "";

      const script = document.createElement("script");
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        autosize: true,
        symbol: data.chart.symbol,
        interval: data.chart.interval,
        timezone: "Etc/UTC",
        theme: "light",
        style: "1",
        locale: "en",
        enable_publishing: false,
        allow_symbol_change: false,
        calendar: false,
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: false,
        backgroundColor: "#ffffff",
        gridColor: "rgba(46, 46, 46, 0.06)",
        studies: ["MAExp@tv-basicstudies", "BB@tv-basicstudies"],
        support_host: "https://www.tradingview.com",
      });

      chartRef.current.appendChild(script);
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.innerHTML = "";
      }
    };
  }, [data]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-gray-900">{data.pair}</h3>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
              {data.timeframe}
            </span>
          </div>
          <span className="text-sm text-gray-600">{data.timezone}</span>
        </div>
        <p className="text-xs text-gray-500">{data.timestamp}</p>
      </div>

      {/* Chart Container */}
      <div className="relative" style={{ height: "400px" }}>
        <div
          ref={chartRef}
          className="tradingview-widget-container"
          style={{ height: "100%", width: "100%" }}
        >
          <div
            className="tradingview-widget-container__widget"
            style={{ height: "calc(100% - 32px)", width: "100%" }}
          ></div>
        </div>
      </div>

      {/* Analysis Details */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Expected Move</p>
            <p
              className={`text-lg font-bold flex items-center gap-2 ${
                data.expectedMove === "UP" ? "text-green-600" : "text-red-600"
              }`}
            >
              {data.expectedMove === "UP" ? (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {data.pipsRange}
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {data.pipsRange}
                </>
              )}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Target</p>
            <p className="text-lg font-bold text-gray-900">{data.target}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalystViews;
