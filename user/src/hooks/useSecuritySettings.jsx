import { useState, useEffect, useCallback } from "react";
import { securityApi } from "../services/index";

export const useSecurity = () => {
  const [securityData, setSecurityData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch security data
  const fetchSecurity = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await securityApi.get();

    if (result.success) {
      setSecurityData(result.data);
    } else {
      setError(result.error);
      setSecurityData(null);
    }

    setLoading(false);
  }, []);

  // Change password
  const changePassword = useCallback(
    async (passwordData) => {
      setLoading(true);
      setError(null);

      const result = await securityApi.post(passwordData, "/change-password");

      if (result.success) {
        await fetchSecurity(); // Refresh data
      } else {
        setError(result.error);
      }

      setLoading(false);
      return result;
    },
    [fetchSecurity]
  );

  // Change phone
  const changePhone = useCallback(
    async (phoneData) => {
      setLoading(true);
      setError(null);

      const result = await securityApi.post(phoneData, "/change-phone");

      if (result.success) {
        await fetchSecurity(); // Refresh data
      } else {
        setError(result.error);
      }

      setLoading(false);
      return result;
    },
    [fetchSecurity]
  );

  // Change verification method
  const changeVerificationMethod = useCallback(
    async (methodData) => {
      setLoading(true);
      setError(null);

      const result = await securityApi.post(methodData, "/change-verification");

      if (result.success) {
        await fetchSecurity(); // Refresh data
      } else {
        setError(result.error);
      }

      setLoading(false);
      return result;
    },
    [fetchSecurity]
  );

  // Logout from all devices
  const logoutAllDevices = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await securityApi.post({}, "/logout-all-devices");

    setLoading(false);
    return result;
  }, []);

  // Load security data on mount
  useEffect(() => {
    fetchSecurity();
  }, [fetchSecurity]);

  return {
    securityData,
    loading,
    error,
    changePassword,
    changePhone,
    changeVerificationMethod,
    logoutAllDevices,
    refetch: fetchSecurity,
  };
};
