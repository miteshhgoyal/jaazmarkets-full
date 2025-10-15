// user/src/pages/settings/Security.jsx
import React, { useState, useEffect } from "react";
import MetaHead from "../../components/MetaHead";
import PageHeader from "../../components/ui/PageHeader";
import GridCard from "../../components/settings/GridCard";
import ChangePasswordForm from "../../components/settings/ChangePasswordForm";
import ChangePhoneForm from "../../components/settings/ChangePhoneForm";
import ForgotPasswordModal from "../../components/settings/ForgotPasswordModal";
import api from "../../services/api";
import toast from "react-hot-toast";

const Security = () => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showPhoneForm, setShowPhoneForm] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [securityData, setSecurityData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch security settings
  useEffect(() => {
    fetchSecuritySettings();
  }, []);

  const fetchSecuritySettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/user/security");
      if (response.data.success) {
        setSecurityData(response.data.data);
      } else {
        setError(response.data.message);
        toast.error(response.data.message);
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to load security settings";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error("Fetch security settings error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (passwordData) => {
    setLoading(true);
    try {
      const response = await api.post(
        "/user/security/change-password",
        passwordData
      );
      if (response.data.success) {
        toast.success("Password changed successfully");
        setShowPasswordForm(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to change password";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Handle forgot password - Send OTP
  const handleForgotPassword = async (email) => {
    try {
      const response = await api.post("/auth/forgot-password", { email });
      if (response.data.success) {
        toast.success("Password reset code sent to your email");
        return { success: true };
      } else {
        toast.error(response.data.message);
        return { success: false, error: response.data.message };
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to send reset code";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Handle reset password with OTP
  const handleResetPassword = async (resetData) => {
    try {
      const response = await api.post("/auth/reset-password", resetData);
      if (response.data.success) {
        toast.success("Password reset successfully");
        setShowForgotPasswordModal(false);
        return { success: true };
      } else {
        toast.error(response.data.message);
        return { success: false, error: response.data.message };
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to reset password";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Handle verification method change
  const handleVerificationChange = async (methodData) => {
    setLoading(true);
    try {
      const response = await api.post(
        "/user/security/verification-method",
        methodData
      );
      if (response.data.success) {
        toast.success("Verification method updated successfully");
        setShowPhoneForm(false);
        fetchSecuritySettings(); // Refresh security data
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to update verification method";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Handle logout from all devices
  const handleLogoutAllDevices = async () => {
    if (
      !window.confirm("Are you sure you want to logout from all other devices?")
    ) {
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/user/security/logout-all");
      if (response.data.success) {
        toast.success(response.data.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to logout from all devices";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !securityData) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !securityData) {
    return (
      <div className="text-red-600 p-4 bg-red-50 rounded-lg border border-red-200">
        <p className="font-semibold">Error loading security settings</p>
        <p className="text-sm mt-1">{error}</p>
        <button
          onClick={fetchSecuritySettings}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // Prepare data for cards
  const securityCardData = securityData
    ? [
        securityData.login,
        {
          ...securityData.password,
          buttonText: "Change",
          buttonAction: () => setShowPasswordForm(true),
          secondaryButtonText: "Forgot Password?",
          secondaryButtonAction: () => setShowForgotPasswordModal(true),
        },
      ]
    : [];

  const securityTypeData = securityData
    ? [
        {
          ...securityData.verificationMethod,
          buttonText: "Change",
          buttonAction: () => setShowPhoneForm(true),
        },
      ]
    : [];

  const logoutData = [
    {
      title:
        "Log out from all other devices except this one to secure your account.",
      buttonAction: handleLogoutAllDevices,
      buttonText: "Log out from other devices",
      buttonColor: "red",
    },
  ];

  return (
    <div>
      <MetaHead
        title="Account Security"
        description="Manage your account security settings, two-factor authentication, and login preferences. Keep your trading account secure."
        keywords="account security, two factor authentication, security settings, account protection"
        noIndex={true}
      />

      <div>
        <PageHeader
          title="Authorization"
          subtitle="Information for logging in to your account."
        />
        <div className="mt-4 space-y-0">
          {securityCardData.map((data, index) => {
            // Show form for password if it's the password field and form is visible
            if (data.title === "Password" && showPasswordForm) {
              return (
                <ChangePasswordForm
                  key={index}
                  onCancel={() => setShowPasswordForm(false)}
                  onSubmit={handlePasswordChange}
                  onForgotPassword={() => {
                    setShowPasswordForm(false);
                    setShowForgotPasswordModal(true);
                  }}
                  loading={loading}
                />
              );
            }
            return (
              <GridCard
                key={index}
                data={data}
                isFormVisible={showPasswordForm && data.title === "Password"}
                loading={loading}
              />
            );
          })}
        </div>
      </div>

      {/* <div className="mt-8">
        <PageHeader
          title="2-Step verification"
          subtitle="2-step verification ensures that all sensitive transactions are authorized by you."
        />

        <div className="mt-4 space-y-0">
          {securityTypeData.map((data, index) => {
            // Show form for phone if form is visible
            if (showPhoneForm) {
              return (
                <ChangePhoneForm
                  key={index}
                  currentPhone={data.value}
                  verificationOptions={securityData?.verificationOptions || []}
                  onCancel={() => setShowPhoneForm(false)}
                  onSubmit={handleVerificationChange}
                  loading={loading}
                />
              );
            }
            return (
              <GridCard
                key={index}
                data={data}
                isFormVisible={showPhoneForm}
                loading={loading}
              />
            );
          })}
        </div>
      </div> */}

      {/* <div className="mt-8">
        <PageHeader title="Account security and termination" />
        <div className="mt-4 space-y-0">
          {logoutData.map((data, index) => (
            <GridCard key={index} data={data} loading={loading} />
          ))}
        </div>
      </div> */}

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
        onSendOTP={handleForgotPassword}
        onResetPassword={handleResetPassword}
        userEmail={securityData?.login?.value}
      />
    </div>
  );
};

export default Security;
