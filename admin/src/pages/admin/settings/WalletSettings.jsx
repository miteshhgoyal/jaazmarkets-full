import React, { useState } from "react";
import MetaHead from "../../../components/MetaHead";
import PageHeader from "../../../components/ui/PageHeader";
import {
  Wallet,
  CreditCard,
  DollarSign,
  Shield,
  Settings,
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
} from "lucide-react";

const WalletSettings = () => {
  const [activeTab, setActiveTab] = useState("payment-methods");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(null);

  // Payment Methods State
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      name: "Bitcoin (BTC)",
      enabled: true,
      fee: 0,
      minAmount: 10,
      maxAmount: 200000,
    },
    {
      id: 2,
      name: "USDT (ERC20)",
      enabled: true,
      fee: 0,
      minAmount: 10,
      maxAmount: 200000,
    },
    {
      id: 3,
      name: "USDT (TRC20)",
      enabled: true,
      fee: 0,
      minAmount: 10,
      maxAmount: 200000,
    },
    {
      id: 4,
      name: "Ethereum (ETH)",
      enabled: true,
      fee: 0,
      minAmount: 10,
      maxAmount: 200000,
    },
    {
      id: 5,
      name: "Bank Transfer",
      enabled: true,
      fee: 0,
      minAmount: 15,
      maxAmount: 1000,
    },
  ]);

  // Wallet Addresses State
  const [walletAddresses, setWalletAddresses] = useState([
    {
      id: 1,
      currency: "Bitcoin (BTC)",
      address: "bc1q90055qfqu5ncz5rghuk4clhy8funvkc5snhj9j",
      network: "Bitcoin Network",
    },
    {
      id: 2,
      currency: "USDT (ERC20)",
      address: "0x742d35Cc6634C0532925a3b8D4031267c4e7C2Ed",
      network: "Ethereum (ERC20)",
    },
    {
      id: 3,
      currency: "USDT (TRC20)",
      address: "TQrZ8ty4fx4hC4gx7mKhTGE5CqMF4ZV7mp",
      network: "TRON (TRC20)",
    },
    {
      id: 4,
      currency: "Ethereum (ETH)",
      address: "0x742d35Cc6634C0532925a3b8D4031267c4e7C2Ed",
      network: "Ethereum Network",
    },
  ]);

  // Transaction Settings State
  const [transactionSettings, setTransactionSettings] = useState({
    depositMin: 10,
    depositMax: 200000,
    withdrawalMin: 10,
    withdrawalMax: 50000,
    dailyWithdrawalLimit: 100000,
    processingFeeDeposit: 0,
    processingFeeWithdrawal: 0,
    autoApprovalEnabled: false,
    autoApprovalLimit: 1000,
  });

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    require2FA: true,
    requireKYC: true,
    kycLevelForWithdrawal: "approved",
    maxFailedAttempts: 3,
    sessionTimeout: 30,
    ipWhitelisting: false,
  });

  const handleCopyAddress = (address) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const handleSaveSettings = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const tabs = [
    { id: "payment-methods", label: "Payment Methods", icon: CreditCard },
    { id: "wallet-addresses", label: "Wallet Addresses", icon: Wallet },
    { id: "transaction-limits", label: "Transaction Limits", icon: DollarSign },
    { id: "security", label: "Security Settings", icon: Shield },
  ];

  return (
    <>
      <MetaHead
        title="Wallet Settings"
        description="Configure wallet and payment settings"
        keywords="wallet settings, payment methods, transaction limits"
      />

      <PageHeader
        title="Wallet Settings"
        subtitle="Configure payment methods, wallet addresses, and transaction settings"
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
          {/* Payment Methods Tab */}
          {activeTab === "payment-methods" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Payment Methods
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Enable or disable payment methods and configure their
                    settings
                  </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  <Plus className="w-4 h-4" />
                  Add Method
                </button>
              </div>

              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {method.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Fee: {method.fee}% • Min: ${method.minAmount} • Max: $
                          {method.maxAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          setPaymentMethods((prev) =>
                            prev.map((m) =>
                              m.id === method.id
                                ? { ...m, enabled: !m.enabled }
                                : m
                            )
                          );
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          method.enabled ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            method.enabled ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Wallet Addresses Tab */}
          {activeTab === "wallet-addresses" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Wallet Addresses
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Manage cryptocurrency wallet addresses for deposits
                  </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  <Plus className="w-4 h-4" />
                  Add Address
                </button>
              </div>

              <div className="space-y-4">
                {walletAddresses.map((wallet) => (
                  <div
                    key={wallet.id}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {wallet.currency}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {wallet.network}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200">
                      <code className="flex-1 text-xs font-mono text-gray-700 break-all">
                        {wallet.address}
                      </code>
                      <button
                        onClick={() => handleCopyAddress(wallet.address)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                      >
                        {copiedAddress === wallet.address ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transaction Limits Tab */}
          {activeTab === "transaction-limits" && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Transaction Limits & Fees
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Configure transaction limits and processing fees
                </p>
              </div>

              <div className="space-y-6">
                {/* Deposit Settings */}
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <h4 className="text-sm font-semibold text-green-900">
                      Deposit Settings
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Minimum Amount ($)
                      </label>
                      <input
                        type="number"
                        value={transactionSettings.depositMin}
                        onChange={(e) =>
                          setTransactionSettings({
                            ...transactionSettings,
                            depositMin: parseFloat(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Maximum Amount ($)
                      </label>
                      <input
                        type="number"
                        value={transactionSettings.depositMax}
                        onChange={(e) =>
                          setTransactionSettings({
                            ...transactionSettings,
                            depositMax: parseFloat(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Processing Fee (%)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={transactionSettings.processingFeeDeposit}
                        onChange={(e) =>
                          setTransactionSettings({
                            ...transactionSettings,
                            processingFeeDeposit: parseFloat(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Withdrawal Settings */}
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                    <h4 className="text-sm font-semibold text-red-900">
                      Withdrawal Settings
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Minimum Amount ($)
                      </label>
                      <input
                        type="number"
                        value={transactionSettings.withdrawalMin}
                        onChange={(e) =>
                          setTransactionSettings({
                            ...transactionSettings,
                            withdrawalMin: parseFloat(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Maximum Amount ($)
                      </label>
                      <input
                        type="number"
                        value={transactionSettings.withdrawalMax}
                        onChange={(e) =>
                          setTransactionSettings({
                            ...transactionSettings,
                            withdrawalMax: parseFloat(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Daily Limit ($)
                      </label>
                      <input
                        type="number"
                        value={transactionSettings.dailyWithdrawalLimit}
                        onChange={(e) =>
                          setTransactionSettings({
                            ...transactionSettings,
                            dailyWithdrawalLimit: parseFloat(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Processing Fee (%)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={transactionSettings.processingFeeWithdrawal}
                        onChange={(e) =>
                          setTransactionSettings({
                            ...transactionSettings,
                            processingFeeWithdrawal: parseFloat(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Auto-Approval Settings */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <h4 className="text-sm font-semibold text-blue-900">
                        Auto-Approval
                      </h4>
                    </div>
                    <button
                      onClick={() =>
                        setTransactionSettings({
                          ...transactionSettings,
                          autoApprovalEnabled:
                            !transactionSettings.autoApprovalEnabled,
                        })
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        transactionSettings.autoApprovalEnabled
                          ? "bg-blue-600"
                          : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          transactionSettings.autoApprovalEnabled
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Auto-Approve withdrawals up to ($)
                    </label>
                    <input
                      type="number"
                      value={transactionSettings.autoApprovalLimit}
                      onChange={(e) =>
                        setTransactionSettings({
                          ...transactionSettings,
                          autoApprovalLimit: parseFloat(e.target.value),
                        })
                      }
                      disabled={!transactionSettings.autoApprovalEnabled}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Withdrawals above this amount will require manual approval
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings Tab */}
          {activeTab === "security" && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Security Settings
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Configure security requirements for wallet transactions
                </p>
              </div>

              <div className="space-y-4">
                {/* 2FA Requirement */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Require 2FA for Withdrawals
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Users must have 2FA enabled to make withdrawals
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setSecuritySettings({
                        ...securitySettings,
                        require2FA: !securitySettings.require2FA,
                      })
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      securitySettings.require2FA
                        ? "bg-blue-600"
                        : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        securitySettings.require2FA
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* KYC Requirement */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Require KYC Verification
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Users must complete KYC to make withdrawals
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setSecuritySettings({
                        ...securitySettings,
                        requireKYC: !securitySettings.requireKYC,
                      })
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      securitySettings.requireKYC
                        ? "bg-blue-600"
                        : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        securitySettings.requireKYC
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* KYC Level */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Minimum KYC Level for Withdrawal
                  </label>
                  <select
                    value={securitySettings.kycLevelForWithdrawal}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        kycLevelForWithdrawal: e.target.value,
                      })
                    }
                    disabled={!securitySettings.requireKYC}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="submitted">Submitted</option>
                    <option value="approved">Approved</option>
                  </select>
                </div>

                {/* Max Failed Attempts */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Max Failed Login Attempts
                  </label>
                  <input
                    type="number"
                    value={securitySettings.maxFailedAttempts}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        maxFailedAttempts: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Account will be temporarily locked after this many failed
                    attempts
                  </p>
                </div>

                {/* Session Timeout */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        sessionTimeout: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Users will be logged out after this period of inactivity
                  </p>
                </div>

                {/* IP Whitelisting */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        IP Whitelisting
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Only allow withdrawals from whitelisted IP addresses
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setSecuritySettings({
                        ...securitySettings,
                        ipWhitelisting: !securitySettings.ipWhitelisting,
                      })
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      securitySettings.ipWhitelisting
                        ? "bg-blue-600"
                        : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        securitySettings.ipWhitelisting
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleSaveSettings}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Save className="w-4 h-4" />
              Save All Settings
            </button>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-900">
              Important Information
            </p>
            <p className="text-sm text-blue-700 mt-1">
              Changes to wallet settings will affect all users immediately. Make
              sure to test changes in a staging environment before applying to
              production.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default WalletSettings;
