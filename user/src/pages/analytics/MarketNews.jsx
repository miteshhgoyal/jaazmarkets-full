// MarketNews.jsx
import React, { useEffect, useRef } from "react";
import MetaHead from "../../components/MetaHead";
import PageHeader from "../../components/ui/PageHeader";

const MarketNews = () => {
  const tradingViewRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      displayMode: "regular",
      feedMode: "all_symbols",
      colorTheme: "light",
      isTransparent: false,
      locale: "en",
      width: "100%",
      height: 800,
    });

    if (tradingViewRef.current) {
      tradingViewRef.current.appendChild(script);
    }

    return () => {
      if (tradingViewRef.current) {
        tradingViewRef.current.innerHTML = "";
      }
    };
  }, []);

  const tags = [
    "EURUSD",
    "GBPUSD",
    "USDJPY",
    "AUDUSD",
    "USDCAD",
    "DollarIndex",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <MetaHead
        title="Financial Market News"
        description="Latest financial market news, economic updates, and trading-relevant headlines. Stay informed with real-time market developments."
        keywords="market news, financial news, trading news, economic updates, market headlines"
      />
      <PageHeader title="Market News" />

      <div className="py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="tradingview-widget-container" ref={tradingViewRef}>
            <div className="tradingview-widget-container__widget"></div>
            <div className="tradingview-widget-copyright text-center py-2 text-xs text-gray-500">
              <a
                href="https://www.tradingview.com/news/top-providers/tradingview/"
                rel="noopener nofollow"
                target="_blank"
                className="text-blue-600 hover:underline"
              >
                Top stories
              </a>
              <span> by TradingView</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketNews;
