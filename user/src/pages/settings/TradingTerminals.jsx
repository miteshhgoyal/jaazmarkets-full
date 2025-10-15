// user/src/pages/settings/TradingTerminals.jsx
import React, { useState, useEffect } from "react";
import MetaHead from "../../components/MetaHead";
import PageHeader from "../../components/ui/PageHeader";
import GridCard from "../../components/settings/GridCard";
import ChangeTerminalForm from "../../components/settings/ChangeTerminalForm";
import api from "../../services/api";
import toast from "react-hot-toast";

const TradingTerminals = () => {
  const [showMT5Form, setShowMT5Form] = useState(false);
  const [showMT4Form, setShowMT4Form] = useState(false);
  const [terminalsData, setTerminalsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch terminals settings
  useEffect(() => {
    fetchTerminalsSettings();
  }, []);

  const fetchTerminalsSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/user/terminals");
      if (response.data.success) {
        setTerminalsData(response.data.data);
      } else {
        setError(response.data.message);
        toast.error(response.data.message);
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to load terminals settings";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error("Fetch terminals settings error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle terminal update
  const handleUpdateTerminal = async (terminalData) => {
    setLoading(true);
    try {
      const platform = terminalData.terminalType.toLowerCase();
      const response = await api.patch(`/user/terminals/${platform}`, {
        selectedTerminal: terminalData.selectedTerminal,
      });

      if (response.data.success) {
        toast.success(
          `${terminalData.terminalType} terminal updated successfully`
        );

        // Close the form
        if (terminalData.terminalType === "MT5") {
          setShowMT5Form(false);
        } else {
          setShowMT4Form(false);
        }

        // Refresh terminals data
        fetchTerminalsSettings();
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to update terminal preference";
      toast.error(errorMsg);
      console.error("Update terminal error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !terminalsData) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !terminalsData) {
    return (
      <div className="text-red-600 p-4 bg-red-50 rounded-lg border border-red-200">
        <p className="font-semibold">Error loading terminals settings</p>
        <p className="text-sm mt-1">{error}</p>
        <button
          onClick={fetchTerminalsSettings}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // Prepare data for cards
  const accountsData = terminalsData
    ? [
        {
          title: terminalsData.mt5?.title || "MT5 Accounts",
          value:
            terminalsData.mt5?.currentTerminal || "Set your default terminal",
          buttonText: "Change",
          buttonAction: () => setShowMT5Form(true),
        },
        {
          title: terminalsData.mt4?.title || "MT4 Accounts",
          value:
            terminalsData.mt4?.currentTerminal || "Set your default terminal",
          buttonText: "Change",
          buttonAction: () => setShowMT4Form(true),
        },
      ]
    : [];

  return (
    <div>
      <MetaHead
        title="Trading Terminals"
        description="Configure your trading terminal preferences, charting settings, and platform customizations for optimal trading experience."
        keywords="trading terminals, platform settings, trading preferences, terminal configuration"
        noIndex={true}
      />
      <>
        <PageHeader
          title="Trading Terminals"
          subtitle="Set the default trading terminal for all your MT4 and MT5 accounts."
        />
        <div className="mt-4 space-y-0">
          {accountsData.map((data, index) => {
            // Show MT5 form
            if (data.title.includes("MT5") && showMT5Form) {
              return (
                <ChangeTerminalForm
                  key={index}
                  terminalType="MT5"
                  currentTerminal={terminalsData.mt5?.currentTerminal}
                  availableTerminals={
                    terminalsData.mt5?.availableTerminals || []
                  }
                  onCancel={() => setShowMT5Form(false)}
                  onSubmit={handleUpdateTerminal}
                  loading={loading}
                />
              );
            }

            // Show MT4 form
            if (data.title.includes("MT4") && showMT4Form) {
              return (
                <ChangeTerminalForm
                  key={index}
                  terminalType="MT4"
                  currentTerminal={terminalsData.mt4?.currentTerminal}
                  availableTerminals={
                    terminalsData.mt4?.availableTerminals || []
                  }
                  onCancel={() => setShowMT4Form(false)}
                  onSubmit={handleUpdateTerminal}
                  loading={loading}
                />
              );
            }

            // Show card
            return (
              <GridCard
                key={index}
                data={data}
                isFormVisible={
                  (data.title.includes("MT5") && showMT5Form) ||
                  (data.title.includes("MT4") && showMT4Form)
                }
                loading={loading}
              />
            );
          })}
        </div>
      </>
    </div>
  );
};

export default TradingTerminals;
