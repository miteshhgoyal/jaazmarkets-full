// user/src/pages/settings/Profile.jsx
import React, { useState, useEffect } from "react";
import MetaHead from "../../components/MetaHead";
import PageHeader from "../../components/ui/PageHeader";
import ProfileStatusCard from "../../components/settings/ProfileStatusCard";
import VerificationSteps from "../../components/settings/VerificationSteps";
import api from "../../services/api";
import toast from "react-hot-toast";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch profile data
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/user/profile");
      if (response.data.success) {
        setProfileData(response.data.data);
      } else {
        setError(response.data.message);
        toast.error(response.data.message);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to load profile";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error("Fetch profile error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle verification step update
  const handleStepUpdate = async (stepId, stepData) => {
    try {
      const response = await api.patch(
        `/user/profile/verification/${stepId}`,
        stepData
      );
      if (response.data.success) {
        toast.success("Verification step updated successfully");
        fetchProfile(); // Refresh profile data
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to update verification step";
      toast.error(errorMsg);
      console.error("Failed to update step:", err);
    }
  };

  if (loading && !profileData) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !profileData) {
    return (
      <div className="text-red-600 p-4 bg-red-50 rounded-lg border border-red-200">
        <p className="font-semibold">Error loading profile</p>
        <p className="text-sm mt-1">{error}</p>
        <button
          onClick={fetchProfile}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // Prepare data for cards
  const statusData = profileData
    ? [profileData.status, profileData.depositLimit]
    : [];

  return (
    <div>
      <MetaHead
        title="Account Profile"
        description="Manage your account profile, personal information, and trading preferences. Update your contact details and account settings."
        keywords="account profile, personal settings, account information, profile management"
        noIndex={true}
      />
      <>
        <PageHeader title="Profile" subtitle="Manage your profile here" />

        {profileData && (
          <>
            <div className="flex flex-col sm:flex-row sm:gap-4 gap-2 w-full mt-4">
              {statusData.map((data, index) => (
                <ProfileStatusCard key={index} data={data} />
              ))}
            </div>

            <div className="mt-6">
              <VerificationSteps
                steps={profileData.verificationSteps}
                onStepUpdate={handleStepUpdate}
                loading={loading}
              />
            </div>
          </>
        )}
      </>
    </div>
  );
};

export default Profile;
