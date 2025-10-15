import { useState, useEffect, useCallback } from "react";
import { transfersApi } from "../services/index";

export const useTransfers = () => {
  const [transferOptions, setTransferOptions] = useState([]);
  const [transferReasons, setTransferReasons] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch transfer data
  const fetchTransferData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await transfersApi.get();
    if (result.success) {
      setTransferOptions(result.data.transferOptions || []);
      setTransferReasons(result.data.transferReasons || []);
      setAccounts(result.data.accounts || []);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  // Validate transfer request
  const validateTransfer = useCallback(async (transferData) => {
    setLoading(true);
    const result = await transfersApi.validate(transferData);
    setLoading(false);
    return result;
  }, []);

  // Create transfer request
  const createTransfer = useCallback(async (transferData) => {
    setLoading(true);
    const result = await transfersApi.post(transferData);
    setLoading(false);
    return result;
  }, []);

  // Get transfer status
  const getTransferStatus = useCallback(async (transactionId) => {
    setLoading(true);
    const result = await transfersApi.getStatus(transactionId);
    setLoading(false);
    return result;
  }, []);

  // Cancel transfer (if supported)
  const cancelTransfer = useCallback(async (transactionId) => {
    setLoading(true);
    const result = await transfersApi.cancel(transactionId);
    setLoading(false);
    return result;
  }, []);

  // Load transfer data on mount
  useEffect(() => {
    fetchTransferData();
  }, [fetchTransferData]);

  return {
    transferOptions,
    transferReasons,
    accounts,
    loading,
    error,
    createTransfer,
    validateTransfer,
    getTransferStatus,
    cancelTransfer,
    refetch: fetchTransferData,
  };
};
