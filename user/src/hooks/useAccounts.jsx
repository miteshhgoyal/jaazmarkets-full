import { useState, useEffect, useCallback } from "react";
import { accountsApi } from "../services/index";

export const useAccounts = (accountType = "real") => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch accounts
  const fetchAccounts = useCallback(async (type) => {
    setLoading(true);
    setError(null);

    const result = await accountsApi.get({ type });

    if (result.success) {
      setAccounts(result.data);
    } else {
      setError(result.error);
      setAccounts([]);
    }

    setLoading(false);
  }, []);

  // Create account
  const createAccount = useCallback(
    async (accountData) => {
      setLoading(true);
      const result = await accountsApi.post(accountData);

      if (result.success) {
        await fetchAccounts(accountType);
      } else {
        setError(result.error);
      }

      setLoading(false);
      return result;
    },
    [accountType, fetchAccounts]
  );

  // Account actions
  const accountActions = {
    deposit: useCallback(
      async (accountId, amount) => {
        setLoading(true);
        const result = await accountsApi.post(`/${accountId}/deposit`, {
          amount,
        });
        if (result.success) await fetchAccounts(accountType);
        setLoading(false);
        return result;
      },
      [accountType, fetchAccounts]
    ),

    withdraw: useCallback(
      async (accountId, amount) => {
        setLoading(true);
        const result = await accountsApi.post(`/${accountId}/withdraw`, {
          amount,
        });
        if (result.success) await fetchAccounts(accountType);
        setLoading(false);
        return result;
      },
      [accountType, fetchAccounts]
    ),

    reactivate: useCallback(
      async (accountId) => {
        setLoading(true);
        const result = await accountsApi.put(accountId, { status: "active" });
        if (result.success) await fetchAccounts(accountType);
        setLoading(false);
        return result;
      },
      [accountType, fetchAccounts]
    ),
  };

  // Load accounts on type change
  useEffect(() => {
    fetchAccounts(accountType);
  }, [accountType, fetchAccounts]);

  return {
    accounts,
    loading,
    error,
    createAccount,
    ...accountActions,
    refetch: () => fetchAccounts(accountType),
  };
};
