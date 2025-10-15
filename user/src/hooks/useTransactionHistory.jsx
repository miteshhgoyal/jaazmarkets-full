// src/hooks/useTransactionHistory.jsx
import { useState, useEffect, useCallback } from "react";
import { transactionHistoryApi } from "../services";

export const useTransactionHistory = (activeTab = "all") => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch transactions
  const fetchTransactions = useCallback(async (type) => {
    setLoading(true);
    setError(null);

    try {
      const result = await transactionHistoryApi.get({ type });
      if (result.success) {
        setTransactions(result.data);
      } else {
        setError(result.error);
        setTransactions([]);
      }
    } catch (err) {
      setError(err.message);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load transactions when type changes
  useEffect(() => {
    fetchTransactions(activeTab);
  }, [activeTab, fetchTransactions]);

  return {
    transactions,
    loading,
    error,
    refetch: () => fetchTransactions(activeTab),
  };
};
