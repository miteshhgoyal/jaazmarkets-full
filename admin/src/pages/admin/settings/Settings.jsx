import React, { useState, useEffect } from "react";
import MetaHead from "../../../components/MetaHead";
import PageHeader from "../../../components/ui/PageHeader";
import {
  Wallet,
  CreditCard,
  DollarSign,
  Shield,
  Settings as SettingsIcon,
  Save,
  Plus,
  Edit,
  Trash2,
  Copy,
  Check,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Lock,
  Unlock,
  Globe,
  Clock,
  ChevronDown,
  X,
} from "lucide-react";
import api from "../../../services/api";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("deposit-methods");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // State for all settings
  const [depositMethods, setDepositMethods] = useState([]);
  const [withdrawalMethods, setWithdrawalMethods] = useState([]);
  const [accountTypes, setAccountTypes] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [leverageOptions, setLeverageOptions] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [tradingSettings, setTradingSettings] = useState({});
  const [fees, setFees] = useState({});
  const [systemSettings, setSystemSettings] = useState({});
  const [paymentMethods, setPaymentMethods] = useState({});
  const [referralSettings, setReferralSettings] = useState({});

  // Modal states
  const [showDepositMethodModal, setShowDepositMethodModal] = useState(false);
  const [showWithdrawalMethodModal, setShowWithdrawalMethodModal] =
    useState(false);
  const [showAccountTypeModal, setShowAccountTypeModal] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showPlatformModal, setShowPlatformModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form states
  const [depositMethodForm, setDepositMethodForm] = useState({
    name: "",
    type: "crypto",
    currencyType: "",
    network: "",
    walletAddress: "",
    minDeposit: 10,
    maxDeposit: "",
    fee: 0,
    feePercentage: 0,
    processingTime: "",
    image: "",
    description: "",
    isActive: true,
    recommended: false,
  });

  const [withdrawalMethodForm, setWithdrawalMethodForm] = useState({
    name: "",
    type: "crypto",
    currencyType: "",
    network: "",
    minWithdrawal: 10,
    maxWithdrawal: "",
    fee: 0,
    feePercentage: 0,
    processingTime: "",
    image: "",
    description: "",
    limits: "",
    isActive: true,
    recommended: false,
  });

  const [accountTypeForm, setAccountTypeForm] = useState({
    name: "",
    category: "Standard accounts",
    description: "",
    image: "",
    minDeposit: "",
    minSpread: "",
    maxLeverage: "",
    commission: "",
    features: [],
    isActive: true,
  });

  const [currencyForm, setCurrencyForm] = useState({
    code: "",
    name: "",
    symbol: "",
    isActive: true,
  });

  const [platformForm, setPlatformForm] = useState({
    name: "MT4",
    isActive: true,
    serverUrl: "",
  });

  // Fetch all settings on component mount
  useEffect(() => {
    fetchAllSettings();
  }, []);

  const fetchAllSettings = async () => {
    setLoading(true);
    try {
      const [
        depositRes,
        withdrawalRes,
        accountTypesRes,
        currenciesRes,
        leverageRes,
        platformsRes,
        tradingRes,
        feesRes,
        systemRes,
        paymentRes,
        referralRes,
      ] = await Promise.all([
        api.get("/admin/settings/deposit-methods"),
        api.get("/admin/settings/withdrawal-methods"),
        api.get("/admin/settings/account-types"),
        api.get("/admin/settings/currencies"),
        api.get("/admin/settings/leverage-options"),
        api.get("/admin/settings/platforms"),
        api.get("/admin/settings/trading-settings"),
        api.get("/admin/settings/fees"),
        api.get("/admin/settings/system-settings"),
        api.get("/admin/settings/payment-methods"),
        api.get("/refer/admin/settings"),
      ]);

      setDepositMethods(depositRes.data.data || []);
      setWithdrawalMethods(withdrawalRes.data.data || []);
      setAccountTypes(accountTypesRes.data.data || []);
      setCurrencies(currenciesRes.data.data || []);
      setLeverageOptions(leverageRes.data.data || []);
      setPlatforms(platformsRes.data.data || []);
      setTradingSettings(tradingRes.data.data || {});
      setFees(feesRes.data.data || {});
      setSystemSettings(systemRes.data.data || {});
      setPaymentMethods(paymentRes.data.data || {});
      setReferralSettings(referralRes.data.data || {});
    } catch (err) {
      console.error("Error fetching settings:", err);
      setError("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  // ==================== DEPOSIT METHODS ====================

  const handleCreateDepositMethod = async () => {
    try {
      const res = await api.post(
        "/admin/settings/deposit-methods",
        depositMethodForm
      );
      setDepositMethods([...depositMethods, res.data.data]);
      setShowDepositMethodModal(false);
      resetDepositMethodForm();
      showSuccessMessage();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create deposit method"
      );
    }
  };

  const handleUpdateDepositMethod = async () => {
    try {
      const res = await api.put(
        `/admin/settings/deposit-methods/${editingItem.id}`,
        depositMethodForm
      );
      setDepositMethods(
        depositMethods.map((m) => (m.id === editingItem.id ? res.data.data : m))
      );
      setShowDepositMethodModal(false);
      setEditingItem(null);
      resetDepositMethodForm();
      showSuccessMessage();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update deposit method"
      );
    }
  };

  const handleDeleteDepositMethod = async (id) => {
    if (!window.confirm("Are you sure you want to delete this deposit method?"))
      return;

    try {
      await api.delete(`/admin/settings/deposit-methods/${id}`);
      setDepositMethods(depositMethods.filter((m) => m.id !== id));
      showSuccessMessage();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to delete deposit method"
      );
    }
  };

  const resetDepositMethodForm = () => {
    setDepositMethodForm({
      name: "",
      type: "crypto",
      currencyType: "",
      network: "",
      walletAddress: "",
      minDeposit: 10,
      maxDeposit: "",
      fee: 0,
      feePercentage: 0,
      processingTime: "",
      image: "",
      description: "",
      isActive: true,
      recommended: false,
    });
  };

  // ==================== WITHDRAWAL METHODS ====================

  const handleCreateWithdrawalMethod = async () => {
    try {
      const res = await api.post(
        "/admin/settings/withdrawal-methods",
        withdrawalMethodForm
      );
      setWithdrawalMethods([...withdrawalMethods, res.data.data]);
      setShowWithdrawalMethodModal(false);
      resetWithdrawalMethodForm();
      showSuccessMessage();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create withdrawal method"
      );
    }
  };

  const handleUpdateWithdrawalMethod = async () => {
    try {
      const res = await api.put(
        `/admin/settings/withdrawal-methods/${editingItem.id}`,
        withdrawalMethodForm
      );
      setWithdrawalMethods(
        withdrawalMethods.map((m) =>
          m.id === editingItem.id ? res.data.data : m
        )
      );
      setShowWithdrawalMethodModal(false);
      setEditingItem(null);
      resetWithdrawalMethodForm();
      showSuccessMessage();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update withdrawal method"
      );
    }
  };

  const handleDeleteWithdrawalMethod = async (id) => {
    if (
      !window.confirm("Are you sure you want to delete this withdrawal method?")
    )
      return;

    try {
      await api.delete(`/admin/settings/withdrawal-methods/${id}`);
      setWithdrawalMethods(withdrawalMethods.filter((m) => m.id !== id));
      showSuccessMessage();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to delete withdrawal method"
      );
    }
  };

  const resetWithdrawalMethodForm = () => {
    setWithdrawalMethodForm({
      name: "",
      type: "crypto",
      currencyType: "",
      network: "",
      minWithdrawal: 10,
      maxWithdrawal: "",
      fee: 0,
      feePercentage: 0,
      processingTime: "",
      image: "",
      description: "",
      limits: "",
      isActive: true,
      recommended: false,
    });
  };

  // ==================== ACCOUNT TYPES ====================

  const handleCreateAccountType = async () => {
    try {
      const res = await api.post(
        "/admin/settings/account-types",
        accountTypeForm
      );
      setAccountTypes([...accountTypes, res.data.data]);
      setShowAccountTypeModal(false);
      resetAccountTypeForm();
      showSuccessMessage();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create account type");
    }
  };

  const handleUpdateAccountType = async () => {
    try {
      const res = await api.put(
        `/admin/settings/account-types/${editingItem.id}`,
        accountTypeForm
      );
      setAccountTypes(
        accountTypes.map((at) =>
          at.id === editingItem.id ? res.data.data : at
        )
      );
      setShowAccountTypeModal(false);
      setEditingItem(null);
      resetAccountTypeForm();
      showSuccessMessage();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update account type");
    }
  };

  const handleDeleteAccountType = async (id) => {
    if (!window.confirm("Are you sure you want to delete this account type?"))
      return;

    try {
      await api.delete(`/admin/settings/account-types/${id}`);
      setAccountTypes(accountTypes.filter((at) => at.id !== id));
      showSuccessMessage();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete account type");
    }
  };

  const resetAccountTypeForm = () => {
    setAccountTypeForm({
      name: "",
      category: "Standard accounts",
      description: "",
      image: "",
      minDeposit: "",
      minSpread: "",
      maxLeverage: "",
      commission: "",
      features: [],
      isActive: true,
    });
  };

  // ==================== CURRENCIES ====================

  const handleCreateCurrency = async () => {
    try {
      const res = await api.post("/admin/settings/currencies", currencyForm);
      setCurrencies([...currencies, res.data.data]);
      setShowCurrencyModal(false);
      resetCurrencyForm();
      showSuccessMessage();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create currency");
    }
  };

  const handleUpdateCurrency = async () => {
    try {
      const res = await api.put(
        `/admin/settings/currencies/${editingItem.code}`,
        currencyForm
      );
      setCurrencies(
        currencies.map((c) => (c.code === editingItem.code ? res.data.data : c))
      );
      setShowCurrencyModal(false);
      setEditingItem(null);
      resetCurrencyForm();
      showSuccessMessage();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update currency");
    }
  };

  const handleDeleteCurrency = async (code) => {
    if (!window.confirm("Are you sure you want to delete this currency?"))
      return;

    try {
      await api.delete(`/admin/settings/currencies/${code}`);
      setCurrencies(currencies.filter((c) => c.code !== code));
      showSuccessMessage();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete currency");
    }
  };

  const resetCurrencyForm = () => {
    setCurrencyForm({
      code: "",
      name: "",
      symbol: "",
      isActive: true,
    });
  };

  // ==================== PLATFORMS ====================

  const handleCreatePlatform = async () => {
    try {
      const res = await api.post("/admin/settings/platforms", platformForm);
      setPlatforms([...platforms, res.data.data]);
      setShowPlatformModal(false);
      resetPlatformForm();
      showSuccessMessage();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create platform");
    }
  };

  const handleUpdatePlatform = async () => {
    try {
      const res = await api.put(
        `/admin/settings/platforms/${editingItem.name}`,
        platformForm
      );
      setPlatforms(
        platforms.map((p) => (p.name === editingItem.name ? res.data.data : p))
      );
      setShowPlatformModal(false);
      setEditingItem(null);
      resetPlatformForm();
      showSuccessMessage();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update platform");
    }
  };

  const handleDeletePlatform = async (name) => {
    if (!window.confirm("Are you sure you want to delete this platform?"))
      return;

    try {
      await api.delete(`/admin/settings/platforms/${name}`);
      setPlatforms(platforms.filter((p) => p.name !== name));
      showSuccessMessage();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete platform");
    }
  };

  const resetPlatformForm = () => {
    setPlatformForm({
      name: "MT4",
      isActive: true,
      serverUrl: "",
    });
  };

  // ==================== LEVERAGE OPTIONS ====================

  const handleAddLeverageOption = async () => {
    const option = prompt("Enter leverage option (e.g., 1:100):");
    if (!option) return;

    try {
      await api.post("/admin/settings/leverage-options", { option });
      setLeverageOptions([...leverageOptions, option]);
      showSuccessMessage();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add leverage option");
    }
  };

  const handleDeleteLeverageOption = async (option) => {
    if (!window.confirm(`Delete leverage option ${option}?`)) return;

    try {
      await api.delete(`/admin/settings/leverage-options/${option}`);
      setLeverageOptions(leverageOptions.filter((o) => o !== option));
      showSuccessMessage();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to delete leverage option"
      );
    }
  };

  // ==================== TRADING SETTINGS ====================

  const handleUpdateTradingSettings = async () => {
    try {
      await api.put("/admin/settings/trading-settings", tradingSettings);
      showSuccessMessage();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update trading settings"
      );
    }
  };

  // ==================== FEES ====================

  const handleUpdateFees = async () => {
    try {
      await api.put("/admin/settings/fees", fees);
      showSuccessMessage();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update fees");
    }
  };

  // ==================== SYSTEM SETTINGS ====================

  const handleUpdateSystemSettings = async () => {
    try {
      await api.put("/admin/settings/system-settings", systemSettings);
      showSuccessMessage();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update system settings"
      );
    }
  };

  // ==================== UTILITY FUNCTIONS ====================

  const showSuccessMessage = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const openEditDepositMethodModal = (method) => {
    setEditingItem(method);
    setDepositMethodForm(method);
    setShowDepositMethodModal(true);
  };

  const openEditWithdrawalMethodModal = (method) => {
    setEditingItem(method);
    setWithdrawalMethodForm(method);
    setShowWithdrawalMethodModal(true);
  };

  const openEditAccountTypeModal = (accountType) => {
    setEditingItem(accountType);
    setAccountTypeForm(accountType);
    setShowAccountTypeModal(true);
  };

  const openEditCurrencyModal = (currency) => {
    setEditingItem(currency);
    setCurrencyForm(currency);
    setShowCurrencyModal(true);
  };

  const openEditPlatformModal = (platform) => {
    setEditingItem(platform);
    setPlatformForm(platform);
    setShowPlatformModal(true);
  };

  const tabs = [
    { id: "deposit-methods", label: "Deposit Methods", icon: Wallet },
    {
      id: "withdrawal-methods",
      label: "Withdrawal Methods",
      icon: CreditCard,
    },
    { id: "account-types", label: "Account Types", icon: DollarSign },
    { id: "currencies", label: "Currencies", icon: Globe },
    { id: "leverage", label: "Leverage Options", icon: TrendingUp },
    { id: "platforms", label: "Platforms", icon: SettingsIcon },
    { id: "trading-settings", label: "Trading Settings", icon: Shield },
    { id: "fees", label: "Fees", icon: DollarSign },
    { id: "system-settings", label: "System Settings", icon: Clock },
    { id: "referral-settings", label: "Referral Settings", icon: Users },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaHead
        title="Platform Settings"
        description="Configure platform settings, payment methods, and account types"
        keywords="Settings, configuration, admin"
      />

      <PageHeader
        title="Platform Settings"
        subtitle="Configure all platform settings including payment methods, account types, and system preferences"
      />

      {/* Success Message */}
      {saveSuccess && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-2">
          <Check className="w-5 h-5 text-green-600" />
          <span className="text-sm text-green-800 font-medium">
            Settings saved successfully!
          </span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-sm text-red-800 font-medium">{error}</span>
          </div>
          <button onClick={() => setError("")}>
            <X className="w-4 h-4 text-red-600" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="mt-6 bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex overflow-x-auto border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* DEPOSIT METHODS TAB */}
          {activeTab === "deposit-methods" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Deposit Methods
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Configure deposit payment methods for users
                  </p>
                </div>
                <button
                  onClick={() => {
                    resetDepositMethodForm();
                    setEditingItem(null);
                    setShowDepositMethodModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Method
                </button>
              </div>

              <div className="space-y-4">
                {depositMethods.map((method) => (
                  <div
                    key={method.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {method.name}
                        {method.recommended && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                            Recommended
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Type: {method.type} • Min: ${method.minDeposit} • Fee:{" "}
                        {method.fee}% •{" "}
                        {method.isActive ? "Active" : "Inactive"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditDepositMethodModal(method)}
                        className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteDepositMethod(method.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* WITHDRAWAL METHODS TAB */}
          {activeTab === "withdrawal-methods" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Withdrawal Methods
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Configure withdrawal payment methods for users
                  </p>
                </div>
                <button
                  onClick={() => {
                    resetWithdrawalMethodForm();
                    setEditingItem(null);
                    setShowWithdrawalMethodModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Method
                </button>
              </div>

              <div className="space-y-4">
                {withdrawalMethods.map((method) => (
                  <div
                    key={method.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {method.name}
                        {method.recommended && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                            Recommended
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Type: {method.type} • Min: ${method.minWithdrawal} •
                        Fee: {method.fee}% •{" "}
                        {method.isActive ? "Active" : "Inactive"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditWithdrawalMethodModal(method)}
                        className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteWithdrawalMethod(method.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACCOUNT TYPES TAB */}
          {activeTab === "account-types" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Account Types
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Configure trading account types
                  </p>
                </div>
                <button
                  onClick={() => {
                    resetAccountTypeForm();
                    setEditingItem(null);
                    setShowAccountTypeModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Account Type
                </button>
              </div>

              <div className="space-y-4">
                {accountTypes.map((accountType) => (
                  <div
                    key={accountType.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {accountType.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Category: {accountType.category} • Min Deposit:{" "}
                        {accountType.minDeposit} • Leverage:{" "}
                        {accountType.maxLeverage}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditAccountTypeModal(accountType)}
                        className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAccountType(accountType.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Referral Settings Tab */}
          {activeTab === "referral-settings" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">
                Referral Program Settings
              </h3>

              <div className="space-y-4">
                {/* Enable/Disable */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="font-medium text-gray-900">
                      Enable Referral Program
                    </label>
                    <p className="text-sm text-gray-600">
                      Allow users to refer others and earn commissions
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={referralSettings.enabled || false}
                      onChange={(e) =>
                        setReferralSettings({
                          ...referralSettings,
                          enabled: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Commission Percentage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Commission Percentage (% of trade amount)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    max="5"
                    value={referralSettings.commissionPercentage || 0.01}
                    onChange={(e) =>
                      setReferralSettings({
                        ...referralSettings,
                        commissionPercentage: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Referrers earn this % of total trade amount (volume × price)
                  </p>
                </div>

                {/* Min Payout Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Payout Amount ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={referralSettings.minPayoutAmount || 10}
                    onChange={(e) =>
                      setReferralSettings({
                        ...referralSettings,
                        minPayoutAmount: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Payout Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payout Method
                  </label>
                  <select
                    value={referralSettings.payoutMethod || "wallet"}
                    onChange={(e) =>
                      setReferralSettings({
                        ...referralSettings,
                        payoutMethod: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="wallet">Automatic (To Wallet)</option>
                    <option value="manual">Manual Approval</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    {referralSettings.payoutMethod === "wallet"
                      ? "Commissions are automatically added to referrer's wallet"
                      : "Admin must manually approve commission payouts"}
                  </p>
                </div>

                {/* Save Button */}
                <button
                  onClick={async () => {
                    try {
                      const res = await api.put(
                        "/refer/admin/settings",
                        referralSettings
                      );
                      if (res.data.success) {
                        setSaveSuccess(true);
                        setTimeout(() => setSaveSuccess(false), 3000);
                      }
                    } catch (err) {
                      setError("Failed to save settings");
                    }
                  }}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Save Referral Settings
                </button>
              </div>
            </div>
          )}

          {/* CURRENCIES TAB */}
          {activeTab === "currencies" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Currencies
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Configure supported currencies
                  </p>
                </div>
                <button
                  onClick={() => {
                    resetCurrencyForm();
                    setEditingItem(null);
                    setShowCurrencyModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Currency
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currencies.map((currency) => (
                  <div
                    key={currency.code}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {currency.code}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {currency.name} ({currency.symbol})
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditCurrencyModal(currency)}
                          className="p-1.5 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCurrency(currency.code)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LEVERAGE OPTIONS TAB */}
          {activeTab === "leverage" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Leverage Options
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Configure available leverage options
                  </p>
                </div>
                <button
                  onClick={handleAddLeverageOption}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Leverage
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {leverageOptions.map((option) => (
                  <div
                    key={option}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between"
                  >
                    <span className="text-sm font-semibold text-gray-900">
                      {option}
                    </span>
                    <button
                      onClick={() => handleDeleteLeverageOption(option)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PLATFORMS TAB */}
          {activeTab === "platforms" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Platforms
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Configure trading platforms
                  </p>
                </div>
                <button
                  onClick={() => {
                    resetPlatformForm();
                    setEditingItem(null);
                    setShowPlatformModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Platform
                </button>
              </div>

              <div className="space-y-4">
                {platforms.map((platform) => (
                  <div
                    key={platform.name}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {platform.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {platform.serverUrl || "No server URL"} •{" "}
                        {platform.isActive ? "Active" : "Inactive"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditPlatformModal(platform)}
                        className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePlatform(platform.name)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TRADING SETTINGS TAB */}
          {activeTab === "trading" && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Trading Settings
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Configure trading limits and defaults
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Min Trade Size
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={tradingSettings.minTradeSize || ""}
                      onChange={(e) =>
                        setTradingSettings({
                          ...tradingSettings,
                          minTradeSize: parseFloat(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Max Trade Size
                    </label>
                    <input
                      type="number"
                      value={tradingSettings.maxTradeSize || ""}
                      onChange={(e) =>
                        setTradingSettings({
                          ...tradingSettings,
                          maxTradeSize: parseFloat(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Max Open Trades
                    </label>
                    <input
                      type="number"
                      value={tradingSettings.maxOpenTrades || ""}
                      onChange={(e) =>
                        setTradingSettings({
                          ...tradingSettings,
                          maxOpenTrades: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Default Stop Loss
                    </label>
                    <input
                      type="number"
                      value={tradingSettings.defaultStopLoss || ""}
                      onChange={(e) =>
                        setTradingSettings({
                          ...tradingSettings,
                          defaultStopLoss: parseFloat(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Default Take Profit
                    </label>
                    <input
                      type="number"
                      value={tradingSettings.defaultTakeProfit || ""}
                      onChange={(e) =>
                        setTradingSettings({
                          ...tradingSettings,
                          defaultTakeProfit: parseFloat(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={handleUpdateTradingSettings}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Save className="w-4 h-4" />
                  Save Trading Settings
                </button>
              </div>
            </div>
          )}

          {/* FEES TAB */}
          {activeTab === "fees" && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Fees & Charges
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Configure platform fees and charges
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Withdrawal Fee ($)
                    </label>
                    <input
                      type="number"
                      value={fees.withdrawalFee || ""}
                      onChange={(e) =>
                        setFees({
                          ...fees,
                          withdrawalFee: parseFloat(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Withdrawal Fee (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={fees.withdrawalFeePercentage || ""}
                      onChange={(e) =>
                        setFees({
                          ...fees,
                          withdrawalFeePercentage: parseFloat(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Inactivity Fee ($)
                    </label>
                    <input
                      type="number"
                      value={fees.inactivityFee || ""}
                      onChange={(e) =>
                        setFees({
                          ...fees,
                          inactivityFee: parseFloat(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Inactivity Days
                    </label>
                    <input
                      type="number"
                      value={fees.inactivityDays || ""}
                      onChange={(e) =>
                        setFees({
                          ...fees,
                          inactivityDays: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={handleUpdateFees}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Save className="w-4 h-4" />
                  Save Fees
                </button>
              </div>
            </div>
          )}

          {/* SYSTEM SETTINGS TAB */}
          {activeTab === "system" && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  System Settings
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Configure system-wide settings
                </p>
              </div>

              <div className="space-y-4">
                {/* Toggles */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Maintenance Mode
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Enable maintenance mode for the platform
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setSystemSettings({
                          ...systemSettings,
                          maintenanceMode: !systemSettings.maintenanceMode,
                        })
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        systemSettings.maintenanceMode
                          ? "bg-blue-600"
                          : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          systemSettings.maintenanceMode
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Registration Enabled
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Allow new user registrations
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setSystemSettings({
                          ...systemSettings,
                          registrationEnabled:
                            !systemSettings.registrationEnabled,
                        })
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        systemSettings.registrationEnabled
                          ? "bg-blue-600"
                          : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          systemSettings.registrationEnabled
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        KYC Required
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Require KYC verification for users
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setSystemSettings({
                          ...systemSettings,
                          kycRequired: !systemSettings.kycRequired,
                        })
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        systemSettings.kycRequired
                          ? "bg-blue-600"
                          : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          systemSettings.kycRequired
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Number Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Min Withdrawal ($)
                    </label>
                    <input
                      type="number"
                      value={systemSettings.minWithdrawal || ""}
                      onChange={(e) =>
                        setSystemSettings({
                          ...systemSettings,
                          minWithdrawal: parseFloat(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Max Withdrawal ($)
                    </label>
                    <input
                      type="number"
                      value={systemSettings.maxWithdrawal || ""}
                      onChange={(e) =>
                        setSystemSettings({
                          ...systemSettings,
                          maxWithdrawal: parseFloat(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={handleUpdateSystemSettings}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Save className="w-4 h-4" />
                  Save System Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODALS */}
      {/* Deposit Method Modal */}
      {showDepositMethodModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingItem ? "Edit" : "Add"} Deposit Method
              </h3>
              <button
                onClick={() => {
                  setShowDepositMethodModal(false);
                  setEditingItem(null);
                }}
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={depositMethodForm.name}
                    onChange={(e) =>
                      setDepositMethodForm({
                        ...depositMethodForm,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Type *
                  </label>
                  <select
                    value={depositMethodForm.type}
                    onChange={(e) =>
                      setDepositMethodForm({
                        ...depositMethodForm,
                        type: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="crypto">Crypto</option>
                    <option value="bank">Bank</option>
                    <option value="card">Card</option>
                    <option value="wallet">Wallet</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Currency Type
                  </label>
                  <input
                    type="text"
                    value={depositMethodForm.currencyType}
                    onChange={(e) =>
                      setDepositMethodForm({
                        ...depositMethodForm,
                        currencyType: e.target.value,
                      })
                    }
                    placeholder="BTC, USDT, INR, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Network
                  </label>
                  <input
                    type="text"
                    value={depositMethodForm.network}
                    onChange={(e) =>
                      setDepositMethodForm({
                        ...depositMethodForm,
                        network: e.target.value,
                      })
                    }
                    placeholder="ERC20, TRC20, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Wallet Address
                  </label>
                  <input
                    type="text"
                    value={depositMethodForm.walletAddress}
                    onChange={(e) =>
                      setDepositMethodForm({
                        ...depositMethodForm,
                        walletAddress: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Min Deposit * ($)
                  </label>
                  <input
                    type="number"
                    value={depositMethodForm.minDeposit}
                    onChange={(e) =>
                      setDepositMethodForm({
                        ...depositMethodForm,
                        minDeposit: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Max Deposit ($)
                  </label>
                  <input
                    type="number"
                    value={depositMethodForm.maxDeposit}
                    onChange={(e) =>
                      setDepositMethodForm({
                        ...depositMethodForm,
                        maxDeposit: parseFloat(e.target.value) || "",
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Fee ($)
                  </label>
                  <input
                    type="number"
                    value={depositMethodForm.fee}
                    onChange={(e) =>
                      setDepositMethodForm({
                        ...depositMethodForm,
                        fee: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Fee Percentage (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={depositMethodForm.feePercentage}
                    onChange={(e) =>
                      setDepositMethodForm({
                        ...depositMethodForm,
                        feePercentage: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Processing Time
                  </label>
                  <input
                    type="text"
                    value={depositMethodForm.processingTime}
                    onChange={(e) =>
                      setDepositMethodForm({
                        ...depositMethodForm,
                        processingTime: e.target.value,
                      })
                    }
                    placeholder="e.g., Instant, 1-3 hours"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={depositMethodForm.image}
                    onChange={(e) =>
                      setDepositMethodForm({
                        ...depositMethodForm,
                        image: e.target.value,
                      })
                    }
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={depositMethodForm.description}
                    onChange={(e) =>
                      setDepositMethodForm({
                        ...depositMethodForm,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={depositMethodForm.isActive}
                      onChange={(e) =>
                        setDepositMethodForm({
                          ...depositMethodForm,
                          isActive: e.target.checked,
                        })
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">Active</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={depositMethodForm.recommended}
                      onChange={(e) =>
                        setDepositMethodForm({
                          ...depositMethodForm,
                          recommended: e.target.checked,
                        })
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">Recommended</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowDepositMethodModal(false);
                  setEditingItem(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={
                  editingItem
                    ? handleUpdateDepositMethod
                    : handleCreateDepositMethod
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingItem ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdrawal Method Modal */}
      {showWithdrawalMethodModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingItem ? "Edit" : "Add"} Withdrawal Method
              </h3>
              <button
                onClick={() => {
                  setShowWithdrawalMethodModal(false);
                  setEditingItem(null);
                }}
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={withdrawalMethodForm.name}
                    onChange={(e) =>
                      setWithdrawalMethodForm({
                        ...withdrawalMethodForm,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Type *
                  </label>
                  <select
                    value={withdrawalMethodForm.type}
                    onChange={(e) =>
                      setWithdrawalMethodForm({
                        ...withdrawalMethodForm,
                        type: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="crypto">Crypto</option>
                    <option value="bank">Bank</option>
                    <option value="card">Card</option>
                    <option value="wallet">Wallet</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Currency Type
                  </label>
                  <input
                    type="text"
                    value={withdrawalMethodForm.currencyType}
                    onChange={(e) =>
                      setWithdrawalMethodForm({
                        ...withdrawalMethodForm,
                        currencyType: e.target.value,
                      })
                    }
                    placeholder="BTC, USDT, INR, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Network
                  </label>
                  <input
                    type="text"
                    value={withdrawalMethodForm.network}
                    onChange={(e) =>
                      setWithdrawalMethodForm({
                        ...withdrawalMethodForm,
                        network: e.target.value,
                      })
                    }
                    placeholder="ERC20, TRC20, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Min Withdrawal * ($)
                  </label>
                  <input
                    type="number"
                    value={withdrawalMethodForm.minWithdrawal}
                    onChange={(e) =>
                      setWithdrawalMethodForm({
                        ...withdrawalMethodForm,
                        minWithdrawal: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Max Withdrawal ($)
                  </label>
                  <input
                    type="number"
                    value={withdrawalMethodForm.maxWithdrawal}
                    onChange={(e) =>
                      setWithdrawalMethodForm({
                        ...withdrawalMethodForm,
                        maxWithdrawal: parseFloat(e.target.value) || "",
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Fee ($)
                  </label>
                  <input
                    type="number"
                    value={withdrawalMethodForm.fee}
                    onChange={(e) =>
                      setWithdrawalMethodForm({
                        ...withdrawalMethodForm,
                        fee: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Fee Percentage (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={withdrawalMethodForm.feePercentage}
                    onChange={(e) =>
                      setWithdrawalMethodForm({
                        ...withdrawalMethodForm,
                        feePercentage: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Processing Time
                  </label>
                  <input
                    type="text"
                    value={withdrawalMethodForm.processingTime}
                    onChange={(e) =>
                      setWithdrawalMethodForm({
                        ...withdrawalMethodForm,
                        processingTime: e.target.value,
                      })
                    }
                    placeholder="e.g., 1-3 business days"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={withdrawalMethodForm.image}
                    onChange={(e) =>
                      setWithdrawalMethodForm({
                        ...withdrawalMethodForm,
                        image: e.target.value,
                      })
                    }
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={withdrawalMethodForm.description}
                    onChange={(e) =>
                      setWithdrawalMethodForm({
                        ...withdrawalMethodForm,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Limits
                  </label>
                  <input
                    type="text"
                    value={withdrawalMethodForm.limits}
                    onChange={(e) =>
                      setWithdrawalMethodForm({
                        ...withdrawalMethodForm,
                        limits: e.target.value,
                      })
                    }
                    placeholder="e.g., Max 3 withdrawals per day"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={withdrawalMethodForm.isActive}
                      onChange={(e) =>
                        setWithdrawalMethodForm({
                          ...withdrawalMethodForm,
                          isActive: e.target.checked,
                        })
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">Active</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={withdrawalMethodForm.recommended}
                      onChange={(e) =>
                        setWithdrawalMethodForm({
                          ...withdrawalMethodForm,
                          recommended: e.target.checked,
                        })
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">Recommended</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowWithdrawalMethodModal(false);
                  setEditingItem(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={
                  editingItem
                    ? handleUpdateWithdrawalMethod
                    : handleCreateWithdrawalMethod
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingItem ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Account Type Modal */}
      {showAccountTypeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingItem ? "Edit" : "Add"} Account Type
              </h3>
              <button
                onClick={() => {
                  setShowAccountTypeModal(false);
                  setEditingItem(null);
                }}
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={accountTypeForm.name}
                    onChange={(e) =>
                      setAccountTypeForm({
                        ...accountTypeForm,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={accountTypeForm.category}
                    onChange={(e) =>
                      setAccountTypeForm({
                        ...accountTypeForm,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="Standard accounts">Standard accounts</option>
                    <option value="Professional accounts">
                      Professional accounts
                    </option>
                    <option value="Premium accounts">Premium accounts</option>
                    <option value="VIP accounts">VIP accounts</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={accountTypeForm.description}
                    onChange={(e) =>
                      setAccountTypeForm({
                        ...accountTypeForm,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={accountTypeForm.image}
                    onChange={(e) =>
                      setAccountTypeForm({
                        ...accountTypeForm,
                        image: e.target.value,
                      })
                    }
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Min Deposit
                  </label>
                  <input
                    type="text"
                    value={accountTypeForm.minDeposit}
                    onChange={(e) =>
                      setAccountTypeForm({
                        ...accountTypeForm,
                        minDeposit: e.target.value,
                      })
                    }
                    placeholder="e.g., $100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Min Spread
                  </label>
                  <input
                    type="text"
                    value={accountTypeForm.minSpread}
                    onChange={(e) =>
                      setAccountTypeForm({
                        ...accountTypeForm,
                        minSpread: e.target.value,
                      })
                    }
                    placeholder="e.g., 0.1 pips"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Max Leverage
                  </label>
                  <input
                    type="text"
                    value={accountTypeForm.maxLeverage}
                    onChange={(e) =>
                      setAccountTypeForm({
                        ...accountTypeForm,
                        maxLeverage: e.target.value,
                      })
                    }
                    placeholder="e.g., 1:500"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Commission
                  </label>
                  <input
                    type="text"
                    value={accountTypeForm.commission}
                    onChange={(e) =>
                      setAccountTypeForm({
                        ...accountTypeForm,
                        commission: e.target.value,
                      })
                    }
                    placeholder="e.g., 0% or $5 per lot"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Features (comma separated)
                  </label>
                  <input
                    type="text"
                    value={accountTypeForm.features.join(", ")}
                    onChange={(e) =>
                      setAccountTypeForm({
                        ...accountTypeForm,
                        features: e.target.value
                          .split(",")
                          .map((f) => f.trim()),
                      })
                    }
                    placeholder="e.g., Fixed spreads, No commission, 24/7 support"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={accountTypeForm.isActive}
                      onChange={(e) =>
                        setAccountTypeForm({
                          ...accountTypeForm,
                          isActive: e.target.checked,
                        })
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">Active</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowAccountTypeModal(false);
                  setEditingItem(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={
                  editingItem
                    ? handleUpdateAccountType
                    : handleCreateAccountType
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingItem ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Currency Modal */}
      {showCurrencyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingItem ? "Edit" : "Add"} Currency
              </h3>
              <button
                onClick={() => {
                  setShowCurrencyModal(false);
                  setEditingItem(null);
                }}
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Currency Code * (e.g., USD, EUR, GBP)
                </label>
                <input
                  type="text"
                  value={currencyForm.code}
                  onChange={(e) =>
                    setCurrencyForm({
                      ...currencyForm,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  disabled={editingItem !== null}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Currency Name
                </label>
                <input
                  type="text"
                  value={currencyForm.name}
                  onChange={(e) =>
                    setCurrencyForm({
                      ...currencyForm,
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g., US Dollar"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Symbol
                </label>
                <input
                  type="text"
                  value={currencyForm.symbol}
                  onChange={(e) =>
                    setCurrencyForm({
                      ...currencyForm,
                      symbol: e.target.value,
                    })
                  }
                  placeholder="e.g., $"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={currencyForm.isActive}
                    onChange={(e) =>
                      setCurrencyForm({
                        ...currencyForm,
                        isActive: e.target.checked,
                      })
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowCurrencyModal(false);
                  setEditingItem(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={
                  editingItem ? handleUpdateCurrency : handleCreateCurrency
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingItem ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Platform Modal */}
      {showPlatformModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingItem ? "Edit" : "Add"} Platform
              </h3>
              <button
                onClick={() => {
                  setShowPlatformModal(false);
                  setEditingItem(null);
                }}
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Platform Name *
                </label>
                <select
                  value={platformForm.name}
                  onChange={(e) =>
                    setPlatformForm({
                      ...platformForm,
                      name: e.target.value,
                    })
                  }
                  disabled={editingItem !== null}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-100"
                >
                  <option value="MT4">MetaTrader 4 (MT4)</option>
                  <option value="MT5">MetaTrader 5 (MT5)</option>
                  <option value="cTrader">cTrader</option>
                  <option value="WebTrader">WebTrader</option>
                  <option value="Mobile">Mobile App</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Server URL
                </label>
                <input
                  type="text"
                  value={platformForm.serverUrl}
                  onChange={(e) =>
                    setPlatformForm({
                      ...platformForm,
                      serverUrl: e.target.value,
                    })
                  }
                  placeholder="e.g., mt4.yourbroker.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={platformForm.isActive}
                    onChange={(e) =>
                      setPlatformForm({
                        ...platformForm,
                        isActive: e.target.checked,
                      })
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowPlatformModal(false);
                  setEditingItem(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={
                  editingItem ? handleUpdatePlatform : handleCreatePlatform
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingItem ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;
