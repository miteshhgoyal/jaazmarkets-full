import React, { useState } from "react";
import MetaHead from "../../components/MetaHead";
import PageHeader from "../../components/ui/PageHeader";

const TERMINAL = "https://metatraderweb.app/trade";

const TradingTerminal = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <>
      <MetaHead
        title="Web Trading Terminal"
        description="Advanced web-based trading terminal. Execute trades, analyze markets, and manage positions with professional trading tools."
        keywords="web terminal, trading platform, live trading, market analysis, trading tools"
      />

      <PageHeader title="Web Trading Terminal" />

      <div
        className="relative w-full mt-4 rounded-2xl overflow-hidden"
        style={{ height: "calc(100vh - 120px)" }}
      >
        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
              <p className="text-white text-lg font-semibold">
                Loading Trading Terminal...
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Connecting to MetaTrader 5 platform
              </p>
            </div>
          </div>
        )}

        {/* MT5 Web Terminal Iframe */}
        <iframe
          src={TERMINAL}
          className="w-full h-full border-0 bg-gray-900"
          title="MetaTrader 5 Web Trading Terminal"
          allow="clipboard-read; clipboard-write; payment"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
          loading="eager"
          onLoad={handleIframeLoad}
        />
      </div>
    </>
  );
};

export default TradingTerminal;
