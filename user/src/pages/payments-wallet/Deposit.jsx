import React, { useState, useEffect } from "react";
import {
  Copy,
  Check,
  ArrowLeft,
  AlertCircle,
  Loader2,
  CheckCircle,
  XCircle,
  QrCode,
  Info,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import CryptoDepositCard from "../../components/deposits/CryptoDepositCard";
import MetaHead from "../../components/MetaHead";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";

const Deposits = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State for deposit methods and accounts
  const [depositMethods, setDepositMethods] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState("USDT");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [proofOfPayment, setProofOfPayment] = useState("");
  const [userNotes, setUserNotes] = useState("");
  const [showDepositDetails, setShowDepositDetails] = useState(false);
  const [amountError, setAmountError] = useState("");

  // API state
  const [isProcessing, setIsProcessing] = useState(false);
  const [depositStatus, setDepositStatus] = useState(null);
  const [depositResult, setDepositResult] = useState(null);

  // UI state
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  // Fetch deposit methods and accounts on mount
  useEffect(() => {
    fetchDepositData();
  }, []);

  const fetchDepositData = async () => {
    setLoading(true);
    try {
      // Fetch deposit methods
      const methodsResponse = await api.get("/transactions/deposit-methods");

      // Fetch trading accounts (only Real accounts)
      const accountsResponse = await api.get("/account/my-accounts");

      if (methodsResponse.data.success) {
        setDepositMethods(methodsResponse.data.data);
      }

      if (accountsResponse.data.success) {
        const realAccounts = accountsResponse.data.data.filter(
          (acc) => acc.accountType === "Real"
        );
        setAccounts(realAccounts);
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching deposit data:", err);
      setError(err.response?.data?.message || "Failed to load deposit methods");
      toast.error("Failed to load deposit methods");
    } finally {
      setLoading(false);
    }
  };

  // Get currency for method
  const getCurrencyForMethod = (method) => {
    return method?.currencyType || "USDT";
  };

  // Handle method selection
  const handleMethodSelection = (method) => {
    setSelectedCrypto(method);
    const methodCurrency = getCurrencyForMethod(method);
    setSelectedCurrency(methodCurrency);

    // Reset other form fields
    setSelectedAccount(null);
    setDepositAmount("");
    setTransactionHash("");
    setProofOfPayment("");
    setUserNotes("");
    setAmountError("");
    setShowDepositDetails(false);
    setDepositStatus(null);
    setDepositResult(null);
    setShowQRCode(false);
  };

  // Handle query parameters for crypto redirect
  useEffect(() => {
    if (depositMethods.length === 0 || accounts.length === 0) return;

    const searchParams = new URLSearchParams(location.search);
    const methodParam = searchParams.get("method");
    const currencyParam = searchParams.get("pp_currency");
    const accountParam = searchParams.get("pp_account");

    if (methodParam || currencyParam) {
      let targetMethod = null;

      // First try to match by currency
      if (currencyParam) {
        targetMethod = depositMethods.find(
          (option) =>
            option.currencyType === currencyParam ||
            option.id === currencyParam ||
            option.id.includes(currencyParam.toLowerCase())
        );
      }

      // Fallback to method ID
      if (!targetMethod && methodParam) {
        targetMethod = depositMethods.find(
          (option) => option.id === methodParam
        );
      }

      if (targetMethod) {
        handleMethodSelection(targetMethod);
      }
    }

    if (accountParam) {
      const account = accounts.find((acc) => acc._id === accountParam);
      if (account) {
        setSelectedAccount(account);
      }
    }
  }, [location.search, depositMethods, accounts]);

  const handleCopyAddress = (address) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(true);
    toast.success("Address copied to clipboard");
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const resetSelection = () => {
    setSelectedCrypto(null);
    setSelectedCurrency("USDT");
    setSelectedAccount(null);
    setDepositAmount("");
    setTransactionHash("");
    setProofOfPayment("");
    setUserNotes("");
    setShowDepositDetails(false);
    setAmountError("");
    setDepositStatus(null);
    setDepositResult(null);
    setShowQRCode(false);
  };

  const validateAmount = (amount) => {
    const numAmount = parseFloat(amount);

    if (!amount || !amount.trim()) {
      return "Amount is required";
    }

    if (isNaN(numAmount) || numAmount <= 0) {
      return "Please enter a valid amount";
    }

    if (selectedCrypto?.minDeposit && numAmount < selectedCrypto.minDeposit) {
      return `Minimum deposit: ${selectedCrypto.minDeposit} ${selectedCurrency}`;
    }

    if (selectedCrypto?.maxDeposit && numAmount > selectedCrypto.maxDeposit) {
      return `Maximum deposit: ${selectedCrypto.maxDeposit} ${selectedCurrency}`;
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

  const handleContinueToDeposit = () => {
    const error = validateAmount(depositAmount);
    if (error) {
      setAmountError(error);
      return;
    }

    if (!selectedAccount) {
      setAmountError("Please select an account");
      return;
    }

    const isFormComplete =
      selectedCrypto && selectedAccount && depositAmount && !amountError;

    if (isFormComplete) {
      setShowDepositDetails(true);
    }
  };

  // Handle deposit confirmation - Create deposit in DB
  const handleConfirmDeposit = async () => {
    setIsProcessing(true);
    setDepositStatus("pending");

    try {
      const depositData = {
        tradingAccountId: selectedAccount._id,
        amount: parseFloat(depositAmount),
        currency: selectedCurrency,
        paymentMethod: selectedCrypto.type,
        paymentDetails: {
          cryptocurrency: selectedCrypto.currencyType,
          walletAddress: selectedCrypto.walletAddress,
          network: selectedCrypto.network,
          txHash: transactionHash || "",
        },
        proofOfPayment: proofOfPayment || "",
        userNotes:
          userNotes ||
          `Deposit via ${selectedCrypto.name} (${selectedCrypto.network})`,
      };

      const response = await api.post("/transactions/deposits", depositData);

      if (response.data.success) {
        setDepositStatus("success");
        setDepositResult(response.data.data);
        toast.success("Deposit request created successfully");
      } else {
        setDepositStatus("error");
        setDepositResult({ error: response.data.message });
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Deposit creation error:", error);
      setDepositStatus("error");
      setDepositResult({
        error:
          error.response?.data?.message || "Failed to create deposit request",
      });
      toast.error(
        error.response?.data?.message || "Failed to create deposit request"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetryDeposit = () => {
    setDepositStatus(null);
    setDepositResult(null);
    setIsProcessing(false);
  };

  const handleDepositComplete = () => {
    navigate("/payments-and-wallet/history", {
      state: {
        message: "Deposit initiated successfully",
        transactionId: depositResult?.transactionId,
        filter: "deposits",
      },
    });
  };

  const isFormValid =
    selectedCrypto && selectedAccount && depositAmount && !amountError;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader
          title="Deposit Funds"
          subtitle="Loading payment methods..."
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
          subtitle="Error loading payment methods"
        />
        <div className="px-4 py-8">
          <Card className="p-6 text-center text-red-600 max-w-2xl mx-auto">
            <AlertCircle className="mx-auto mb-4" size={48} />
            <p className="text-lg font-semibold mb-2">Error</p>
            <p>{error}</p>
            <Button className="mt-4" onClick={fetchDepositData}>
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
        title="Deposit Funds"
        description="Deposit funds to your trading account instantly. Multiple payment methods including bank transfer, crypto, and e-wallets supported."
        keywords="deposit funds, add money, trading deposit, crypto deposit, payment methods"
      />

      <PageHeader
        title="Deposit Funds"
        subtitle={
          depositStatus === "success"
            ? "Deposit successful"
            : depositStatus === "error"
            ? "Deposit failed"
            : showDepositDetails
            ? "Complete your deposit"
            : selectedCrypto
            ? "Configure your deposit"
            : "Select payment method"
        }
      />

      <div className="max-w-6xl mx-auto py-6 px-4">
        {/* Success Screen */}
        {depositStatus === "success" && (
          <div className="max-w-2xl mx-auto">
            <Card className="p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="text-green-600" size={32} />
                </div>
                <h2 className="text-2xl font-bold mb-4 text-green-900">
                  Deposit Request Created Successfully!
                </h2>

                <div className="space-y-4 mb-8">
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-sm text-green-600">
                      Amount Depositing
                    </div>
                    <div className="text-2xl font-bold text-green-900">
                      {depositAmount} {selectedCurrency}
                    </div>
                  </div>

                  {depositResult?.transactionId && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600">
                        Transaction ID
                      </div>
                      <div className="font-mono text-sm text-gray-900">
                        {depositResult.transactionId}
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-sm text-blue-600 mb-2">
                      Send {selectedCurrency} to this address
                    </div>
                    <div className="font-mono text-sm text-blue-900 break-all mb-3">
                      {selectedCrypto.walletAddress}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleCopyAddress(selectedCrypto.walletAddress)
                      }
                    >
                      {copiedAddress ? (
                        <Check size={16} className="mr-2" />
                      ) : (
                        <Copy size={16} className="mr-2" />
                      )}
                      {copiedAddress ? "Copied!" : "Copy Address"}
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Method</div>
                      <div className="font-medium">{selectedCrypto.name}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Network</div>
                      <div className="font-medium">
                        {selectedCrypto.network}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Status</div>
                      <div className="font-medium text-amber-600">
                        {depositResult?.status || "Pending"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Processing Time</div>
                      <div className="font-medium">
                        {selectedCrypto.processingTime}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleDepositComplete}
                  >
                    View Transaction History
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={resetSelection}
                  >
                    Make Another Deposit
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Info
                      size={20}
                      className="text-blue-600 flex-shrink-0 mt-0.5"
                    />
                    <div className="text-sm text-blue-800 text-left">
                      <strong>What's next?</strong> Send {selectedCurrency} to
                      the address above on the {selectedCrypto.network} network.
                      Your deposit will be reviewed and processed by our team.
                      You'll receive a notification once it's approved and
                      credited to your account.
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
                  Deposit Failed
                </h2>

                <div className="space-y-4 mb-8">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="text-sm text-red-800">
                      {depositResult?.error ||
                        "An error occurred while processing your deposit."}
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
            {!selectedCrypto ? (
              // Step 1: Select Payment Method
              <div className="space-y-6">
                <div className="text-center lg:text-left">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Choose Payment Method
                  </h2>
                  <p className="text-gray-600">
                    Select your preferred cryptocurrency to deposit
                  </p>
                </div>

                {depositMethods.length === 0 && (
                  <Card className="p-12 text-center">
                    <AlertCircle
                      className="mx-auto mb-4 text-gray-400"
                      size={48}
                    />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      No deposit methods available
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Please contact support to enable deposit methods
                    </p>
                    <Button onClick={() => navigate("/support")}>
                      Contact Support
                    </Button>
                  </Card>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  {depositMethods.map((option) => (
                    <CryptoDepositCard
                      key={option.id}
                      option={option}
                      onSelect={handleMethodSelection}
                      isSelected={false}
                    />
                  ))}
                </div>
              </div>
            ) : !showDepositDetails ? (
              // Step 2: Configuration
              <div className="space-y-6">
                <Button
                  variant="ghost"
                  onClick={resetSelection}
                  className="flex items-center gap-2 mb-4 hover:bg-gray-100"
                >
                  <ArrowLeft size={16} />
                  Back to payment methods
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Selected Payment Method */}
                    <Card className="p-6">
                      <h2 className="text-xl font-semibold mb-6">
                        Payment Method
                      </h2>
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <img
                          src={selectedCrypto.image}
                          alt={selectedCrypto.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="font-semibold">
                            {selectedCrypto.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {selectedCrypto.network} •{" "}
                            {selectedCrypto.description}
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Account Selection */}
                    <Card className="p-6">
                      <h3 className="font-semibold mb-4">To Account</h3>
                      {accounts.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-gray-600 mb-4">
                            You don't have any trading accounts yet
                          </p>
                          <Button
                            onClick={() => navigate("/account/create")}
                            size="sm"
                          >
                            Create Account
                          </Button>
                        </div>
                      ) : (
                        <select
                          className={`w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
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
                          <option value="">Select your account</option>
                          {accounts.map((account) => (
                            <option key={account._id} value={account._id}>
                              {account.accountNumber} - {account.platform} (
                              {account.accountType}) - Balance:{" "}
                              {account.balance} {account.currency}
                            </option>
                          ))}
                        </select>
                      )}
                    </Card>

                    {/* Amount Input */}
                    {selectedAccount && (
                      <Card className="p-6">
                        <h3 className="font-semibold mb-4">Deposit Amount</h3>
                        <div className="relative">
                          <input
                            type="number"
                            placeholder="0.00"
                            value={depositAmount}
                            onChange={(e) => handleAmountChange(e.target.value)}
                            className={`w-full pr-16 py-4 text-2xl border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                              amountError
                                ? "border-red-300 bg-red-50"
                                : "border-gray-300"
                            }`}
                            step="0.00000001"
                          />
                          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                            <span className="text-gray-500 text-lg">
                              {selectedCurrency}
                            </span>
                          </div>
                        </div>
                        {amountError && (
                          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center gap-2 text-red-700">
                              <AlertCircle size={16} />
                              <span className="text-sm">{amountError}</span>
                            </div>
                          </div>
                        )}
                        <div className="mt-3 text-sm text-gray-600">
                          Min: {selectedCrypto.minDeposit} {selectedCurrency} |
                          Max: {selectedCrypto.maxDeposit} {selectedCurrency}
                        </div>
                      </Card>
                    )}

                    {/* Transaction Hash (Optional) */}
                    {selectedAccount && depositAmount && (
                      <Card className="p-6">
                        <h3 className="font-semibold mb-4">
                          Transaction Hash (Optional)
                        </h3>
                        <input
                          type="text"
                          placeholder="Enter transaction hash if already sent"
                          value={transactionHash}
                          onChange={(e) => setTransactionHash(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="mt-2 text-sm text-gray-600">
                          You can add this later from transaction history
                        </p>
                      </Card>
                    )}

                    {/* User Notes (Optional) */}
                    {selectedAccount && depositAmount && (
                      <Card className="p-6">
                        <h3 className="font-semibold mb-4">Notes (Optional)</h3>
                        <textarea
                          placeholder="Add any additional notes"
                          value={userNotes}
                          onChange={(e) => setUserNotes(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          rows="3"
                        />
                      </Card>
                    )}
                  </div>

                  {/* Right Column - Summary */}
                  <div className="lg:sticky lg:top-12 lg:self-start">
                    <Card className="p-6">
                      <h3 className="font-semibold mb-6 text-lg">
                        Deposit Summary
                      </h3>
                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Method</span>
                          <span className="font-medium">
                            {selectedCrypto.name}
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Network</span>
                          <span className="font-medium">
                            {selectedCrypto.network}
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Currency</span>
                          <span className="font-medium">
                            {selectedCrypto.currencyType}
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Account</span>
                          <span
                            className={
                              selectedAccount
                                ? "text-green-600 font-medium"
                                : "text-gray-400"
                            }
                          >
                            {selectedAccount
                              ? selectedAccount.accountNumber
                              : "Not selected"}
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Amount</span>
                          <span
                            className={
                              depositAmount && !amountError
                                ? "text-green-600 font-medium"
                                : "text-gray-400"
                            }
                          >
                            {depositAmount && !amountError
                              ? `${depositAmount} ${selectedCurrency}`
                              : "Not entered"}
                          </span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-gray-600">Fee</span>
                          <span className="font-medium text-green-600">
                            {selectedCrypto.fee || 0} {selectedCurrency}
                          </span>
                        </div>
                      </div>

                      <Button
                        className="w-full"
                        onClick={handleContinueToDeposit}
                        disabled={!isFormValid}
                      >
                        {!isFormValid
                          ? "Complete all required fields"
                          : "Continue to Deposit"}
                      </Button>

                      {selectedCrypto && (
                        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-start gap-2">
                            <Info
                              size={16}
                              className="text-blue-600 flex-shrink-0 mt-0.5"
                            />
                            <div className="text-xs text-blue-800">
                              Processing time: {selectedCrypto.processingTime}
                            </div>
                          </div>
                        </div>
                      )}
                    </Card>
                  </div>
                </div>
              </div>
            ) : (
              // Step 3: Confirmation
              <div className="space-y-6">
                <Button
                  variant="ghost"
                  onClick={() => setShowDepositDetails(false)}
                  className="flex items-center gap-2 mb-4"
                  disabled={isProcessing}
                >
                  <ArrowLeft size={16} />
                  Back to configuration
                </Button>

                <div className="max-w-2xl mx-auto">
                  <Card className="p-8">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <img
                          src={selectedCrypto.image}
                          alt={selectedCrypto.name}
                          className="w-10 h-10 rounded-full"
                        />
                      </div>

                      <h2 className="text-2xl font-bold mb-4">
                        Confirm Deposit
                      </h2>

                      <div className="space-y-4 mb-8">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="text-sm text-gray-600">
                            Deposit Amount
                          </div>
                          <div className="text-2xl font-bold">
                            {depositAmount} {selectedCurrency}
                          </div>
                        </div>

                        <div className="bg-blue-50 rounded-lg p-4">
                          <div className="text-sm text-blue-600 mb-2">
                            Send {selectedCurrency} to this address
                          </div>
                          <div className="font-mono text-sm text-blue-900 break-all mb-3">
                            {selectedCrypto.walletAddress}
                          </div>
                          <div className="flex gap-2 justify-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleCopyAddress(selectedCrypto.walletAddress)
                              }
                            >
                              {copiedAddress ? (
                                <Check size={16} className="mr-2" />
                              ) : (
                                <Copy size={16} className="mr-2" />
                              )}
                              {copiedAddress ? "Copied!" : "Copy Address"}
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-gray-600">Method</div>
                            <div className="font-medium">
                              {selectedCrypto.name}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-600">Network</div>
                            <div className="font-medium">
                              {selectedCrypto.network}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-600">Account</div>
                            <div className="font-medium">
                              {selectedAccount.accountNumber}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-600">Processing Time</div>
                            <div className="font-medium">
                              {selectedCrypto.processingTime}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Button
                          className="w-full"
                          size="lg"
                          onClick={handleConfirmDeposit}
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <>
                              <Loader2
                                className="animate-spin mr-2"
                                size={16}
                              />
                              Creating Deposit Request...
                            </>
                          ) : (
                            "Confirm Deposit Request"
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setShowDepositDetails(false)}
                          disabled={isProcessing}
                        >
                          Review Details
                        </Button>
                      </div>

                      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <AlertCircle
                            size={20}
                            className="text-amber-600 flex-shrink-0 mt-0.5"
                          />
                          <div className="text-sm text-amber-800 text-left">
                            <strong>Important:</strong> Send only{" "}
                            {selectedCurrency} to this address on the{" "}
                            {selectedCrypto.network} network. Sending other
                            assets or using a different network may result in
                            permanent loss of funds.
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Deposits;
