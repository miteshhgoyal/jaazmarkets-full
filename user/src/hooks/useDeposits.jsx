import { useState, useEffect, useCallback } from "react";
import { depositsApi } from "../services/index";

export const useDeposits = () => {
  const [cryptoOptions, setCryptoOptions] = useState([]);
  const [walletTypes, setWalletTypes] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch deposit options
  const fetchDepositOptions = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await depositsApi.get();
    if (result.success) {
      setCryptoOptions(result.data.cryptoOptions);
      setWalletTypes(result.data.walletTypes);
      setAccounts(result.data.accounts);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  // Create deposit request
  const createDeposit = useCallback(async (depositData) => {
    setLoading(true);
    const result = await depositsApi.post(depositData);
    setLoading(false);
    return result;
  }, []);

  // Get crypto option by ID
  const getCryptoOption = useCallback(
    (id) => {
      return cryptoOptions.find((option) => option.id === id);
    },
    [cryptoOptions]
  );

  // Get wallet address for crypto option
  const getWalletAddress = useCallback(async (cryptoId) => {
    setLoading(true);
    const result = await depositsApi.get(`/address/${cryptoId}`);
    setLoading(false);
    return result;
  }, []);

  // Load deposit options on mount
  useEffect(() => {
    fetchDepositOptions();
  }, [fetchDepositOptions]);

  return {
    cryptoOptions,
    walletTypes,
    accounts,
    loading,
    error,
    createDeposit,
    getCryptoOption,
    getWalletAddress,
    refetch: fetchDepositOptions,
  };
};
