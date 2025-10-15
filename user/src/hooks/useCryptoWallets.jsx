import { useState, useEffect, useCallback } from "react";
import { cryptoWalletsApi } from "../services/index";

export const useCryptoWallets = (activeTab = "accounts") => {
  const [wallets, setWallets] = useState([]);
  const [externalWallets, setExternalWallets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalBalance, setTotalBalance] = useState(0);

  const fetchWallets = useCallback(async (type) => {
    setLoading(true);
    setError(null);

    const result = await cryptoWalletsApi.get({ type });

    if (result.success) {
      if (type === "accounts") {
        setWallets(result.data.accounts || []);
        setTotalBalance(result.data.totalBalance || 0);
      } else {
        setExternalWallets(result.data.externalWallets || []);
      }
    } else {
      setError(result.error);
      if (type === "accounts") {
        setWallets([]);
        setTotalBalance(0);
      } else {
        setExternalWallets([]);
      }
    }

    setLoading(false);
  }, []);

  const walletActions = {
    deposit: useCallback(
      async (walletId, amount, currency) => {
        setLoading(true);
        const result = await cryptoWalletsApi.post(`/${walletId}/deposit`, {
          amount,
          currency,
        });
        if (result.success) await fetchWallets("accounts");
        setLoading(false);
        return result;
      },
      [fetchWallets]
    ),

    withdraw: useCallback(
      async (walletId, amount, currency, address) => {
        setLoading(true);
        const result = await cryptoWalletsApi.post(`/${walletId}/withdraw`, {
          amount,
          currency,
          address,
        });
        if (result.success) await fetchWallets("accounts");
        setLoading(false);
        return result;
      },
      [fetchWallets]
    ),

    transfer: useCallback(
      async (fromWalletId, toWalletId, amount, currency) => {
        setLoading(true);
        const result = await cryptoWalletsApi.post(
          `/${fromWalletId}/transfer`,
          { toWalletId, amount, currency }
        );
        if (result.success) await fetchWallets("accounts");
        setLoading(false);
        return result;
      },
      [fetchWallets]
    ),

    addExternalWallet: useCallback(
      async (walletData) => {
        setLoading(true);
        const result = await cryptoWalletsApi.post("/external", walletData);
        if (result.success) await fetchWallets("external-wallets");
        setLoading(false);
        return result;
      },
      [fetchWallets]
    ),

    removeExternalWallet: useCallback(
      async (walletId) => {
        setLoading(true);
        const result = await cryptoWalletsApi.delete(`/external/${walletId}`);
        if (result.success) await fetchWallets("external-wallets");
        setLoading(false);
        return result;
      },
      [fetchWallets]
    ),
  };

  useEffect(() => {
    fetchWallets(activeTab);
  }, [activeTab, fetchWallets]);

  return {
    wallets,
    externalWallets,
    loading,
    error,
    totalBalance,
    ...walletActions,
    refetch: () => fetchWallets(activeTab),
  };
};
