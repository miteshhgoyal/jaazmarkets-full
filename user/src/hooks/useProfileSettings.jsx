import { useState, useEffect, useCallback } from "react";
import { profileApi } from "../services/index";

export const useProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch profile data
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await profileApi.get();

    if (result.success) {
      console.log(result.data);
      setProfileData(result.data);
    } else {
      setError(result.error);
      setProfileData(null);
    }

    setLoading(false);
  }, []);

  // Update profile data
  const updateProfile = useCallback(
    async (updates) => {
      setLoading(true);
      const result = await profileApi.put("", updates);

      if (result.success) {
        await fetchProfile(); // Refresh data
      } else {
        setError(result.error);
      }

      setLoading(false);
      return result;
    },
    [fetchProfile]
  );

  // Update verification step
  const updateVerificationStep = useCallback(
    async (stepId, stepData) => {
      setLoading(true);
      const result = await profileApi.put(`/verification/${stepId}`, stepData);

      if (result.success) {
        await fetchProfile(); // Refresh data
      } else {
        setError(result.error);
      }

      setLoading(false);
      return result;
    },
    [fetchProfile]
  );

  // Load profile on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profileData,
    loading,
    error,
    updateProfile,
    updateVerificationStep,
    refetch: fetchProfile,
  };
};
