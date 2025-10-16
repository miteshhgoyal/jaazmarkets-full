import React, { useState, useEffect } from "react";
import {
  Copy,
  Check,
  ArrowLeft,
  AlertCircle,
  Loader2,
  CheckCircle,
  XCircle,
  ExternalLink,
  Info,
  Zap,
  Wallet,
  DollarSign,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import MetaHead from "../../components/MetaHead";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";

const Deposits = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State for accounts
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [amountError, setAmountError] = useState("");

  // BlockBee state
  const [blockBeePaymentUrl, setBlockBeePaymentUrl] = useState(null);
  const [blockBeePaymentId, setBlockBeePaymentId] = useState(null);
  const [depositId, setDepositId] = useState(null);
  const [transactionId, setTransactionId] = useState(null);

  // API state
  const [isProcessing, setIsProcessing] = useState(false);
  const [depositStatus, setDepositStatus] = useState(null);
  const [depositResult, setDepositResult] = useState(null);

  // UI state
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Fetch trading accounts on mount
  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const accountsResponse = await api.get("/account/my-accounts");

      if (accountsResponse.data.success) {
        const realAccounts = accountsResponse.data.data.filter(
          (acc) => acc.accountType === "Real"
        );
        setAccounts(realAccounts);
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching accounts:", err);
      setError(
        err.response?.data?.message || "Failed to load trading accounts"
      );
      toast.error("Failed to load trading accounts");
    } finally {
      setLoading(false);
    }
  };

  // Handle query parameters for account pre-selection
  useEffect(() => {
    if (accounts.length === 0) return;

    const searchParams = new URLSearchParams(location.search);
    const accountParam = searchParams.get("account");

    if (accountParam) {
      const account = accounts.find((acc) => acc._id === accountParam);
      if (account) {
        setSelectedAccount(account);
      }
    }
  }, [location.search, accounts]);

  const resetSelection = () => {
    setSelectedAccount(null);
    setDepositAmount("");
    setAmountError("");
    setDepositStatus(null);
    setDepositResult(null);
    setShowConfirmation(false);
    setBlockBeePaymentUrl(null);
    setBlockBeePaymentId(null);
    setDepositId(null);
    setTransactionId(null);
  };

  const validateAmount = (amount) => {
    const numAmount = parseFloat(amount);

    if (!amount || !amount.trim()) {
      return "Amount is required";
    }

    if (isNaN(numAmount) || numAmount <= 0) {
      return "Please enter a valid amount";
    }

    if (numAmount < 10) {
      return "Minimum deposit: $10 USD";
    }

    if (numAmount > 100000) {
      return "Maximum deposit: $100,000 USD";
    }

    return "";
  };

  const handleAmountChange = (value) => {
    setDepositAmount(value);
    if (selectedAccount) {
      const error = validateAmount(value);
      setAmountError(error);
    }
  };

  const handleContinueToConfirmation = () => {
    const error = validateAmount(depositAmount);
    if (error) {
      setAmountError(error);
      return;
    }

    if (!selectedAccount) {
      setAmountError("Please select an account");
      return;
    }

    setShowConfirmation(true);
  };

  // Create BlockBee deposit link
  const handleCreateDeposit = async () => {
    setIsProcessing(true);
    setDepositStatus("pending");

    try {
      const depositData = {
        tradingAccountId: selectedAccount._id,
        suggestedAmount: parseFloat(depositAmount),
        description: `Deposit to ${selectedAccount.accountNumber} (${selectedAccount.platform})`,
      };

      const response = await api.post(
        "/transactions/blockbee/deposit/create",
        depositData
      );

      if (response.data.success) {
        setDepositStatus("success");
        setDepositResult(response.data.data);
        setBlockBeePaymentUrl(response.data.data.paymentUrl);
        setBlockBeePaymentId(response.data.data.paymentId);
        setDepositId(response.data.data.depositId);
        setTransactionId(response.data.data.transactionId);
        toast.success("Deposit link created successfully!");
      } else {
        setDepositStatus("error");
        setDepositResult({ error: response.data.message });
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Deposit creation error:", error);
      setDepositStatus("error");
      setDepositResult({
        error: error.response?.data?.message || "Failed to create deposit link",
      });
      toast.error(
        error.response?.data?.message || "Failed to create deposit link"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetryDeposit = () => {
    setDepositStatus(null);
    setDepositResult(null);
    setIsProcessing(false);
    setShowConfirmation(false);
  };

  const handleViewHistory = () => {
    navigate("/payments-and-wallet/history", {
      state: {
        message: "Deposit initiated successfully",
        transactionId: transactionId,
        filter: "deposits",
      },
    });
  };

  const isFormValid = selectedAccount && depositAmount && !amountError;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader
          title="Deposit Funds"
          subtitle="Loading trading accounts..."
        />
        <div className="flex justify-center items-center py-16">
          <Loader2 className="animate-spin text-blue-600" size={48} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader
          title="Deposit Funds"
          subtitle="Error loading trading accounts"
        />
        <div className="px-4 py-8">
          <Card className="p-6 text-center text-red-600 max-w-2xl mx-auto">
            <AlertCircle className="mx-auto mb-4" size={48} />
            <p className="text-lg font-semibold mb-2">Error</p>
            <p>{error}</p>
            <Button className="mt-4" onClick={fetchAccounts}>
              Try Again
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MetaHead
        title="Deposit Funds - Cryptocurrency Payment"
        description="Deposit funds to your trading account using cryptocurrency. Support for 100+ cryptocurrencies with instant confirmation."
        keywords="deposit funds, crypto deposit, bitcoin deposit, cryptocurrency payment, instant deposit"
      />

      <PageHeader
        title="Deposit Funds"
        subtitle={
          depositStatus === "success"
            ? "Payment link created successfully"
            : depositStatus === "error"
            ? "Failed to create deposit link"
            : showConfirmation
            ? "Confirm your deposit"
            : "Choose account and amount"
        }
      />

      <div className="max-w-4xl mx-auto py-6 px-4">
        {/* Success Screen - BlockBee Payment Link Created */}
        {depositStatus === "success" && blockBeePaymentUrl && (
          <div className="max-w-2xl mx-auto">
            <Card className="p-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="text-white" size={40} />
                </div>
                <h2 className="text-3xl font-bold mb-2 text-gray-900">
                  Payment Link Created!
                </h2>
                <p className="text-gray-600 mb-8">
                  Your secure cryptocurrency payment link is ready
                </p>

                <div className="space-y-4 mb-8">
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                    <div className="text-sm text-blue-600 font-medium mb-2">
                      Suggested Amount
                    </div>
                    <div className="text-4xl font-bold text-blue-900 mb-4">
                      ${depositAmount} USD
                    </div>
                    <div className="text-xs text-blue-700 mb-6">
                      You can pay with any supported cryptocurrency
                    </div>

                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      size="lg"
                      onClick={() => window.open(blockBeePaymentUrl, "_blank")}
                    >
                      <ExternalLink size={18} className="mr-2" />
                      Open Payment Page
                    </Button>
                  </div>

                  {transactionId && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-xs text-gray-600 mb-1">
                        Transaction ID
                      </div>
                      <div className="font-mono text-sm text-gray-900 break-all">
                        {transactionId}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-white rounded-lg p-4 border">
                      <div className="text-gray-600 mb-1">Account</div>
                      <div className="font-medium">
                        {selectedAccount?.accountNumber}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border">
                      <div className="text-gray-600 mb-1">Platform</div>
                      <div className="font-medium">
                        {selectedAccount?.platform}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border">
                      <div className="text-gray-600 mb-1">Status</div>
                      <div className="font-medium text-amber-600">
                        Awaiting Payment
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border">
                      <div className="text-gray-600 mb-1">Payment ID</div>
                      <div className="font-mono text-xs">
                        {blockBeePaymentId?.slice(0, 10)}...
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    size="lg"
                    onClick={handleViewHistory}
                  >
                    View Transaction History
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={resetSelection}
                  >
                    Make Another Deposit
                  </Button>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Info size={20} className="text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-blue-900 mb-2">
                        How it works:
                      </div>
                      <ul className="text-sm text-blue-800 space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 font-bold">1.</span>
                          <span>
                            Click "Open Payment Page" to access BlockBee's
                            secure checkout
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 font-bold">2.</span>
                          <span>
                            Choose from 100+ supported cryptocurrencies
                            (Bitcoin, Ethereum, USDT, etc.)
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 font-bold">3.</span>
                          <span>
                            Scan QR code or copy the wallet address provided
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 font-bold">4.</span>
                          <span>Send payment from your crypto wallet</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 font-bold">5.</span>
                          <span>
                            Your account will be credited automatically after
                            blockchain confirmation (usually within minutes)
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Error Screen */}
        {depositStatus === "error" && (
          <div className="max-w-2xl mx-auto">
            <Card className="p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <XCircle className="text-red-600" size={32} />
                </div>
                <h2 className="text-2xl font-bold mb-4 text-red-900">
                  Failed to Create Deposit Link
                </h2>

                <div className="space-y-4 mb-8">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="text-sm text-red-800">
                      {depositResult?.error ||
                        "An error occurred while creating your deposit link."}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleRetryDeposit}
                  >
                    Try Again
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={resetSelection}
                  >
                    Start Over
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Main deposit flow */}
        {!depositStatus && (
          <>
            {!showConfirmation ? (
              // Step 1: Account & Amount Selection
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Info Banner */}
                <Card className="p-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Zap size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">
                        Cryptocurrency Deposits via BlockBee
                      </h3>
                      <ul className="text-sm space-y-1 opacity-90">
                        <li>✓ 100+ cryptocurrencies supported</li>
                        <li>✓ Automatic confirmation & instant credit</li>
                        <li>✓ Secure payment gateway with QR codes</li>
                        <li>✓ No manual approval required</li>
                      </ul>
                    </div>
                  </div>
                </Card>

                {/* Account Selection */}
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Wallet size={20} className="text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold">
                      Select Trading Account
                    </h3>
                  </div>

                  {accounts.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <AlertCircle
                        className="mx-auto mb-4 text-gray-400"
                        size={48}
                      />
                      <p className="text-gray-700 font-medium mb-2">
                        No Trading Accounts Found
                      </p>
                      <p className="text-gray-600 mb-6 text-sm">
                        You need a trading account to make deposits
                      </p>
                      <Button
                        onClick={() => navigate("/account/create")}
                        size="lg"
                      >
                        Create Trading Account
                      </Button>
                    </div>
                  ) : (
                    <select
                      className={`w-full p-4 border rounded-lg text-base focus:ring-2 focus:ring-blue-500 transition ${
                        selectedAccount
                          ? "border-green-300 bg-green-50"
                          : "border-gray-300"
                      }`}
                      value={selectedAccount?._id || ""}
                      onChange={(e) => {
                        const account = accounts.find(
                          (acc) => acc._id === e.target.value
                        );
                        setSelectedAccount(account);
                        setDepositAmount("");
                        setAmountError("");
                      }}
                    >
                      <option value="">Choose account to deposit to</option>
                      {accounts.map((account) => (
                        <option key={account._id} value={account._id}>
                          {account.accountNumber} - {account.platform} (
                          {account.accountType}) • Balance: ${account.balance}{" "}
                          {account.currency}
                        </option>
                      ))}
                    </select>
                  )}

                  {selectedAccount && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-green-800 text-sm">
                        <CheckCircle size={16} className="text-green-600" />
                        <span className="font-medium">Account Selected</span>
                      </div>
                      <div className="mt-2 text-xs text-green-700">
                        Funds will be deposited to:{" "}
                        {selectedAccount.accountNumber} (
                        {selectedAccount.platform})
                      </div>
                    </div>
                  )}
                </Card>

                {/* Amount Input */}
                {selectedAccount && (
                  <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <DollarSign size={20} className="text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold">Enter Amount</h3>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-gray-500 text-2xl">$</span>
                      </div>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={depositAmount}
                        onChange={(e) => handleAmountChange(e.target.value)}
                        className={`w-full pl-12 pr-20 py-5 text-3xl font-semibold border rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
                          amountError
                            ? "border-red-300 bg-red-50"
                            : depositAmount && !amountError
                            ? "border-green-300 bg-green-50"
                            : "border-gray-300"
                        }`}
                        step="0.01"
                        min="10"
                      />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                        <span className="text-gray-500 text-xl font-medium">
                          USD
                        </span>
                      </div>
                    </div>

                    {amountError && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2 text-red-700">
                          <AlertCircle size={16} />
                          <span className="text-sm font-medium">
                            {amountError}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                      <span>Minimum: $10 USD</span>
                      <span>Maximum: $100,000 USD</span>
                    </div>

                    {depositAmount && !amountError && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2 text-blue-800 text-sm mb-1">
                          <Info size={16} className="text-blue-600" />
                          <span className="font-medium">
                            You can pay with any cryptocurrency
                          </span>
                        </div>
                        <div className="text-xs text-blue-700">
                          The exact amount in crypto will be calculated on the
                          payment page based on current market rates
                        </div>
                      </div>
                    )}
                  </Card>
                )}

                {/* Continue Button */}
                {selectedAccount && (
                  <Card className="p-6">
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleContinueToConfirmation}
                      disabled={!isFormValid}
                    >
                      {!isFormValid
                        ? "Complete all required fields"
                        : "Continue to Confirmation"}
                    </Button>
                  </Card>
                )}
              </div>
            ) : (
              // Step 2: Confirmation
              <div className="max-w-2xl mx-auto space-y-6">
                <Button
                  variant="ghost"
                  onClick={() => setShowConfirmation(false)}
                  className="flex items-center gap-2"
                  disabled={isProcessing}
                >
                  <ArrowLeft size={16} />
                  Back to form
                </Button>

                <Card className="p-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Zap className="text-white" size={32} />
                    </div>

                    <h2 className="text-2xl font-bold mb-2">
                      Confirm Your Deposit
                    </h2>
                    <p className="text-gray-600 mb-8">
                      Review details before creating payment link
                    </p>

                    <div className="space-y-4 mb-8">
                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
                        <div className="text-sm text-blue-600 font-medium mb-1">
                          Deposit Amount
                        </div>
                        <div className="text-4xl font-bold text-blue-900">
                          ${depositAmount} USD
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-left">
                        <div className="bg-white rounded-lg p-4 border">
                          <div className="text-xs text-gray-600 mb-1">
                            Trading Account
                          </div>
                          <div className="font-semibold text-gray-900">
                            {selectedAccount.accountNumber}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {selectedAccount.platform}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 border">
                          <div className="text-xs text-gray-600 mb-1">
                            Account Type
                          </div>
                          <div className="font-semibold text-gray-900">
                            {selectedAccount.accountType}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            Current: ${selectedAccount.balance}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 border col-span-2">
                          <div className="text-xs text-gray-600 mb-1">
                            Payment Method
                          </div>
                          <div className="font-semibold text-gray-900">
                            BlockBee Cryptocurrency Gateway
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            100+ cryptocurrencies • Instant confirmation
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        size="lg"
                        onClick={handleCreateDeposit}
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="animate-spin mr-2" size={18} />
                            Creating Payment Link...
                          </>
                        ) : (
                          <>
                            <Zap size={18} className="mr-2" />
                            Create Payment Link
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setShowConfirmation(false)}
                        disabled={isProcessing}
                      >
                        Review Details
                      </Button>
                    </div>

                    <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-left">
                      <div className="flex items-start gap-3">
                        <AlertCircle
                          size={18}
                          className="text-amber-600 flex-shrink-0 mt-0.5"
                        />
                        <div className="text-sm text-amber-800">
                          <strong>Note:</strong> After clicking "Create Payment
                          Link", you'll receive a secure BlockBee checkout page
                          where you can choose your preferred cryptocurrency and
                          complete the payment.
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Deposits;
