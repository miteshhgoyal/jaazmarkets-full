import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MetaHead from "../../components/MetaHead";
import PageHeader from "../../components/ui/PageHeader";
import { ArrowLeft, Check, Eye, EyeOff, CheckCircle, Copy } from "lucide-react";
import api from "../../services/api";
import toast from "react-hot-toast";

const NewAccount = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accountType, setAccountType] = useState("Demo");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createdAccount, setCreatedAccount] = useState(null);

  // Settings from backend
  const [settings, setSettings] = useState(null);
  const [loadingSettings, setLoadingSettings] = useState(true);

  const [formData, setFormData] = useState({
    currency: "USD",
    startingBalance: "10000",
    nickname: "",
    leverage: "1:100",
    platform: "MT5",
    traderPassword: "",
  });

  // Fetch settings from backend
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoadingSettings(true);
      const response = await api.get("/account/settings");

      if (response.data.success) {
        setSettings(response.data.data);

        // Set defaults
        if (response.data.data.platforms.length > 0) {
          setFormData((prev) => ({
            ...prev,
            platform: response.data.data.platforms[0].name,
          }));
        }
        if (response.data.data.currencies.length > 0) {
          setFormData((prev) => ({
            ...prev,
            currency: response.data.data.currencies[0].code,
          }));
        }
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      toast.error("Failed to load account options");
    } finally {
      setLoadingSettings(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAccountSelect = (account) => {
    setSelectedAccount(account);
  };

  const handleContinue = () => {
    if (selectedAccount) {
      setStep(2);
      setFormData({ ...formData, nickname: selectedAccount.name });
    }
  };

  const handleBack = () => {
    setStep(1);
    setSelectedAccount(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password if provided
    if (formData.traderPassword) {
      const checks = validatePassword(formData.traderPassword);
      const allValid = Object.values(checks).every((v) => v);
      if (!allValid) {
        toast.error("Please meet all password requirements");
        return;
      }
    }

    setLoading(true);

    try {
      const payload = {
        accountType: accountType,
        platform: formData.platform,
        accountClass: selectedAccount.name,
        currency: formData.currency,
        leverage: formData.leverage,
        startingBalance:
          accountType === "Demo" ? Number(formData.startingBalance) : undefined,
        nickname: formData.nickname,
      };

      const response = await api.post("/account/create", payload);

      if (response.data.success) {
        setCreatedAccount(response.data.data);
        setStep(3); // Success step
        toast.success("Account created successfully!");
      }
    } catch (error) {
      console.error("Account creation error:", error);
      toast.error(error.response?.data?.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (password) => {
    return {
      length: password.length >= 8 && password.length <= 15,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  };

  // Updated copy function with proper async/await and fallback
  const copyToClipboard = async (text, label) => {
    // Modern approach with Async Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard`);
      } catch (err) {
        console.error("Failed to copy:", err);
        fallbackCopyTextToClipboard(text, label);
      }
    } else {
      // Fallback for older browsers or HTTP contexts
      fallbackCopyTextToClipboard(text, label);
    }
  };

  // Fallback method using document.execCommand
  const fallbackCopyTextToClipboard = (text, label) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand("copy");
      if (successful) {
        toast.success(`${label} copied to clipboard`);
      } else {
        toast.error("Failed to copy to clipboard");
      }
    } catch (err) {
      console.error("Fallback: Could not copy text", err);
      toast.error("Failed to copy to clipboard");
    }

    document.body.removeChild(textArea);
  };

  const passwordChecks = validatePassword(formData.traderPassword);

  if (loadingSettings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400"></div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600">Failed to load settings</p>
          <button
            onClick={fetchSettings}
            className="mt-4 px-4 py-2 bg-orange-500 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaHead
        title="Open New Trading Account"
        description="Open a new trading account with competitive spreads and leverage."
        keywords="new trading account, open account, forex account"
      />

      <div className="min-h-screen bg-gray-50">
        {/* Step 1: Account Selection */}
        {step === 1 && (
          <>
            <PageHeader title="Open Account" />

            <div className="py-6 sm:py-8">
              {/* Standard Accounts */}
              <div className="mb-8 sm:mb-12">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                  Standard accounts
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {settings.accountTypes
                    .filter((acc) => acc.category === "Standard accounts")
                    .map((account) => (
                      <AccountCard
                        key={account.id}
                        account={account}
                        isSelected={selectedAccount?.id === account.id}
                        onSelect={handleAccountSelect}
                      />
                    ))}
                </div>
              </div>

              {/* Professional Accounts */}
              <div className="mb-8">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                  Professional accounts
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {settings.accountTypes
                    .filter((acc) => acc.category === "Professional accounts")
                    .map((account) => (
                      <AccountCard
                        key={account.id}
                        account={account}
                        isSelected={selectedAccount?.id === account.id}
                        onSelect={handleAccountSelect}
                      />
                    ))}
                </div>
              </div>

              {/* Continue Button */}
              <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 sm:p-6 lg:relative lg:border-0 lg:bg-transparent lg:p-0">
                <div className="max-w-md mx-auto lg:max-w-none">
                  <button
                    onClick={handleContinue}
                    disabled={!selectedAccount}
                    className={`w-full py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all ${
                      selectedAccount
                        ? "bg-orange-500 hover:bg-orange-500 text-gray-900"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Step 2: Account Setup Form */}
        {step === 2 && (
          <>
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                  <button
                    onClick={handleBack}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Set up your account
                  </h1>
                </div>
              </div>
            </div>

            <div className="py-6 sm:py-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                {/* Form Section */}
                <div className="lg:col-span-2">
                  {/* Demo/Real Toggle */}
                  <div className="bg-white rounded-lg shadow-sm mb-6 p-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setAccountType("Demo")}
                        className={`py-3 font-semibold transition-colors rounded-lg ${
                          accountType === "Demo"
                            ? "bg-orange-500 text-gray-900"
                            : "bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        Demo
                      </button>
                      <button
                        onClick={() => setAccountType("Real")}
                        className={`py-3 font-semibold transition-colors rounded-lg ${
                          accountType === "Real"
                            ? "bg-orange-500 text-gray-900"
                            : "bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        Real
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-6">
                    {accountType === "Demo"
                      ? "Risk-free account. Trade with virtual money"
                      : "Trade with real money and withdraw any profit you may make"}
                  </p>

                  {/* Form */}
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-6 bg-white p-6 rounded-xl shadow-md"
                  >
                    {/* Currency */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Currency <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white"
                        required
                      >
                        {settings.currencies.map((currency) => (
                          <option key={currency.code} value={currency.code}>
                            {currency.code} - {currency.name} ({currency.symbol}
                            )
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Starting Balance (Demo only) */}
                    {accountType === "Demo" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Starting balance{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="startingBalance"
                          value={formData.startingBalance}
                          onChange={handleInputChange}
                          min="100"
                          max="100000"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                          required
                        />
                      </div>
                    )}

                    {/* Nickname */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nickname <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="nickname"
                        value={formData.nickname}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                        maxLength={36}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.nickname.length}/36 characters
                      </p>
                    </div>

                    {/* Max Leverage */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max leverage <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="leverage"
                        value={formData.leverage}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white"
                        required
                      >
                        {settings.leverageOptions.map((leverage) => (
                          <option key={leverage} value={leverage}>
                            {leverage}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Platform */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Platform <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="platform"
                        value={formData.platform}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white"
                        required
                      >
                        {settings.platforms.map((platform) => (
                          <option key={platform.name} value={platform.name}>
                            {platform.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Trader Password (Optional) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trader password (Optional)
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="traderPassword"
                          value={formData.traderPassword}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>

                      {/* Password Requirements */}
                      {formData.traderPassword && (
                        <div className="mt-3 space-y-2 text-sm">
                          <PasswordCheck
                            check={passwordChecks.length}
                            label="Between 8-15 characters"
                          />
                          <PasswordCheck
                            check={
                              passwordChecks.uppercase &&
                              passwordChecks.lowercase
                            }
                            label="Upper and lower case letters"
                          />
                          <PasswordCheck
                            check={passwordChecks.number}
                            label="At least one number"
                          />
                          <PasswordCheck
                            check={passwordChecks.special}
                            label="At least one special character"
                          />
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 sm:py-4 bg-orange-500 hover:bg-orange-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-gray-900 font-semibold rounded-lg transition-colors text-base sm:text-lg"
                      >
                        {loading ? "Creating account..." : "Create account"}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Account Info Sidebar */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 sticky top-24">
                    <img
                      src={selectedAccount?.image}
                      alt={selectedAccount?.name}
                      className="w-16 h-16 mx-auto mb-4"
                    />
                    <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
                      {selectedAccount?.name}
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-gray-600 mb-1">Min deposit</p>
                        <p className="font-semibold text-gray-900">
                          {selectedAccount?.minDeposit}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Min spread</p>
                        <p className="font-semibold text-gray-900">
                          {selectedAccount?.minSpread}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Max leverage</p>
                        <p className="font-semibold text-gray-900">
                          {selectedAccount?.maxLeverage}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Commission</p>
                        <p className="font-semibold text-gray-900">
                          {selectedAccount?.commission}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Step 3: Success Screen */}
        {step === 3 && createdAccount && (
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 max-w-2xl w-full">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Account Created Successfully!
                </h1>
                <p className="text-gray-600">
                  Your trading account has been created. Save these credentials
                  securely.
                </p>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-orange-800 font-semibold mb-1">
                  ⚠Important: Save your credentials
                </p>
                <p className="text-sm text-orange-700">
                  Your password will only be shown once. Please save it
                  securely.
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <CredentialRow
                  label="Account Number"
                  value={createdAccount.accountNumber}
                  onCopy={copyToClipboard}
                />
                <CredentialRow
                  label="Login"
                  value={createdAccount.login}
                  onCopy={copyToClipboard}
                />
                <CredentialRow
                  label="Password"
                  value={createdAccount.password}
                  onCopy={copyToClipboard}
                  highlight
                />
                <CredentialRow
                  label="Server"
                  value={createdAccount.server}
                  onCopy={copyToClipboard}
                />
                <CredentialRow
                  label="Platform"
                  value={createdAccount.platform}
                />
                <CredentialRow
                  label="Account Type"
                  value={createdAccount.accountType}
                />
                <CredentialRow
                  label="Balance"
                  value={`${createdAccount.currency} ${createdAccount.balance}`}
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => navigate("/trading/accounts")}
                  className="flex-1 py-3 bg-orange-500 hover:bg-orange-500 text-gray-900 font-semibold rounded-lg transition-colors"
                >
                  View My Accounts
                </button>
                <button
                  onClick={() => {
                    setStep(1);
                    setSelectedAccount(null);
                    setCreatedAccount(null);
                    setFormData({
                      currency: "USD",
                      startingBalance: "10000",
                      nickname: "",
                      leverage: "1:100",
                      platform: "MT5",
                      traderPassword: "",
                    });
                  }}
                  className="flex-1 py-3 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-900 font-semibold rounded-lg transition-colors"
                >
                  Create Another
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// Helper Components
const AccountCard = ({ account, isSelected, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(account)}
      className={`bg-white rounded-lg border-2 p-4 sm:p-6 cursor-pointer transition-all hover:shadow-lg ${
        isSelected
          ? "border-orange-400 shadow-md"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 pt-1">
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              isSelected
                ? "border-orange-400 bg-orange-500"
                : "border-gray-300 bg-white"
            }`}
          >
            {isSelected && (
              <div className="w-2 h-2 bg-white rounded-full"></div>
            )}
          </div>
        </div>
        <div className="flex-shrink-0">
          <img
            src={account.image}
            alt={account.name}
            className="w-12 h-12 sm:w-16 sm:h-16"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
            {account.name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
            {account.description}
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:text-sm">
            <div>
              <p className="text-gray-500">Min deposit</p>
              <p className="font-semibold text-gray-900">
                {account.minDeposit}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Min spread</p>
              <p className="font-semibold text-gray-900">{account.minSpread}</p>
            </div>
            <div>
              <p className="text-gray-500">Max leverage</p>
              <p className="font-semibold text-gray-900">
                {account.maxLeverage}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Commission</p>
              <p className="font-semibold text-gray-900">
                {account.commission}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PasswordCheck = ({ check, label }) => (
  <div className="flex items-center gap-2">
    <div
      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
        check ? "border-green-500 bg-green-500" : "border-gray-300"
      }`}
    >
      {check && <Check className="w-3 h-3 text-white" />}
    </div>
    <span className={check ? "text-green-700" : "text-gray-600"}>{label}</span>
  </div>
);

const CredentialRow = ({ label, value, onCopy, highlight }) => (
  <div
    className={`flex items-center justify-between p-4 rounded-lg ${
      highlight ? "bg-orange-50 border border-orange-200" : "bg-gray-50"
    }`}
  >
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p
        className={`font-mono font-semibold ${
          highlight ? "text-orange-700" : "text-gray-900"
        }`}
      >
        {value}
      </p>
    </div>
    {onCopy && (
      <button
        onClick={() => onCopy(value, label)}
        className="p-2 hover:bg-white rounded-lg transition-colors"
      >
        <Copy className="w-5 h-5 text-gray-600" />
      </button>
    )}
  </div>
);

export default NewAccount;
