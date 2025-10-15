import { useState, useEffect, useCallback } from "react";
import { withdrawalsApi } from "../services/index";

export const useWithdrawals = () => {
  const [withdrawalOptions, setWithdrawalOptions] = useState([]);
  const [walletTypes, setWalletTypes] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch withdrawal options
  const fetchWithdrawalOptions = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await withdrawalsApi.get();
    if (result.success) {
      setWithdrawalOptions(result.data.withdrawalOptions);
      setWalletTypes(result.data.walletTypes);
      setAccounts(result.data.accounts);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  // Validate withdrawal request
  const validateWithdrawal = useCallback(async (withdrawalData) => {
    setLoading(true);
    const result = await withdrawalsApi.post("/validate", withdrawalData);
    setLoading(false);
    return result;
  }, []);

  // Create withdrawal request
  const createWithdrawal = useCallback(async (withdrawalData) => {
    setLoading(true);
    const result = await withdrawalsApi.post("/", {
      ...withdrawalData,
      timestamp: new Date().toISOString(),
      status: "pending",
    });
    setLoading(false);
    return result;
  }, []);

  // Get withdrawal status
  const getWithdrawalStatus = useCallback(async (transactionId) => {
    setLoading(true);
    const result = await withdrawalsApi.get(`/status/${transactionId}`);
    setLoading(false);
    return result;
  }, []);

  // Cancel withdrawal (if supported)
  const cancelWithdrawal = useCallback(async (transactionId) => {
    setLoading(true);
    const result = await withdrawalsApi.put(`/${transactionId}/cancel`);
    setLoading(false);
    return result;
  }, []);

  // Load withdrawal options on mount
  useEffect(() => {
    fetchWithdrawalOptions();
  }, [fetchWithdrawalOptions]);

  return {
    withdrawalOptions,
    walletTypes,
    accounts,
    loading,
    error,
    createWithdrawal,
    validateWithdrawal,
    getWithdrawalStatus,
    cancelWithdrawal,
    refetch: fetchWithdrawalOptions,
  };
};
