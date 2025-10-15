import { useState, useEffect, useCallback } from "react";
import { tradingTerminalsApi } from "../services/index";

export const useTradingTerminals = () => {
  const [terminalsData, setTerminalsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch trading terminals data
  const fetchTerminals = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await tradingTerminalsApi.get();

    if (result.success) {
      setTerminalsData(result.data);
    } else {
      setError(result.error);
      setTerminalsData(null);
    }

    setLoading(false);
  }, []);

  // Update terminal preference
  const updateTerminal = useCallback(
    async (terminalType, terminalData) => {
      setLoading(true);
      setError(null);

      const result = await tradingTerminalsApi.put(terminalType, terminalData);

      if (result.success) {
        await fetchTerminals(); // Refresh data
      } else {
        setError(result.error);
      }

      setLoading(false);
      return result;
    },
    [fetchTerminals]
  );

  // Load terminals data on mount
  useEffect(() => {
    fetchTerminals();
  }, [fetchTerminals]);

  return {
    terminalsData,
    loading,
    error,
    updateTerminal,
    refetch: fetchTerminals,
  };
};
