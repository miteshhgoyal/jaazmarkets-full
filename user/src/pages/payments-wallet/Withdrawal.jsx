// user/src/pages/payments-wallet/Withdrawal.jsx
import React, { useState, useEffect } from "react";
import {
  Copy,
  Check,
  ArrowLeft,
  AlertCircle,
  Loader2,
  CheckCircle,
  XCircle,
  Wallet,
  Info,
  Building2,
  Bitcoin,
  Zap,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import CryptoDepositCard from "../../components/deposits/CryptoDepositCard";
import MetaHead from "../../components/MetaHead";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";

const Withdrawal = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State for withdrawal methods and accounts
  const [withdrawalMethods, setWithdrawalMethods] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [selectedWithdrawalMethod, setSelectedWithdrawalMethod] =
    useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState("USDT");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [showWithdrawalDetails, setShowWithdrawalDetails] = useState(false);
  const [amountError, setAmountError] = useState("");

  // Crypto wallet specific state
  const [cryptoWalletAddress, setCryptoWalletAddress] = useState("");
  const [walletAddressError, setWalletAddressError] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("");

  // Bank details state for bank transfers
  const [bankDetails, setBankDetails] = useState({
    accountNumber: "",
    accountHolderName: "",
    ifscCode: "",
    bankName: "",
    branch: "",
  });

  // API state
  const [isProcessing, setIsProcessing] = useState(false);
  const [withdrawalStatus, setWithdrawalStatus] = useState(null);
  const [withdrawalResult, setWithdrawalResult] = useState(null);

  // UI state
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Fetch withdrawal methods and accounts on mount
  useEffect(() => {
    fetchWithdrawalData();
  }, []);

  const fetchWithdrawalData = async () => {
    setLoading(true);
    try {
      // Fetch withdrawal methods
      const methodsResponse = await api.get("/transactions/withdrawal-methods");

      // Fetch trading accounts
      const accountsResponse = await api.get("/account/my-accounts");

      if (methodsResponse.data.success) {
        setWithdrawalMethods(methodsResponse.data.data);
      }

      if (accountsResponse.data.success) {
        // Filter for real accounts only (no demo)
        const realAccounts = accountsResponse.data.data.filter(
          (acc) => acc.accountType === "Real"
        );
        setAccounts(realAccounts);
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching withdrawal data:", err);
      setError(
        err.response?.data?.message || "Failed to load withdrawal methods"
      );
      toast.error("Failed to load withdrawal methods");
    } finally {
      setLoading(false);
    }
  };

  // Check if current method is crypto
  const isCryptoMethod = () => {
    return selectedWithdrawalMethod?.type === "crypto";
  };

  // Check if current method is bank
  const isBankMethod = () => {
    return selectedWithdrawalMethod?.type === "bank";
  };

  // Get currency for method
  const getCurrencyForMethod = (method) => {
    return method?.currencyType || "USDT";
  };

  // Handle method selection
  const handleMethodSelection = (method) => {
    setSelectedWithdrawalMethod(method);
    const methodCurrency = getCurrencyForMethod(method);
    setSelectedCurrency(methodCurrency);
    setSelectedNetwork(method?.network || "");

    // Reset other form fields
    setSelectedAccount(null);
    setWithdrawalAmount("");
    setCryptoWalletAddress("");
    setBankDetails({
      accountNumber: "",
      accountHolderName: "",
      ifscCode: "",
      bankName: "",
      branch: "",
    });

    setAmountError("");
    setWalletAddressError("");
    setShowWithdrawalDetails(false);
    setWithdrawalStatus(null);
    setWithdrawalResult(null);
  };

  // Handle query parameters for method redirect from other pages
  useEffect(() => {
    if (withdrawalMethods.length === 0 || accounts.length === 0) return;

    const searchParams = new URLSearchParams(location.search);
    const methodParam = searchParams.get("method");
    const currencyParam = searchParams.get("pp_currency");
    const accountParam = searchParams.get("pp_account");

    // Auto-select method based on query params
    if (methodParam || currencyParam) {
      let targetMethod = null;

      // First try to match by currency
      if (currencyParam) {
        targetMethod = withdrawalMethods.find(
          (option) =>
            option.currencyType === currencyParam ||
            option.id === currencyParam ||
            option.id.includes(currencyParam.toLowerCase())
        );
      }

      // Fallback to method ID
      if (!targetMethod && methodParam) {
        targetMethod = withdrawalMethods.find(
          (option) => option.id === methodParam
        );
      }

      if (targetMethod) {
        handleMethodSelection(targetMethod);
      }
    }

    // Auto-select account based on query params
    if (accountParam) {
      const account = accounts.find((acc) => acc._id === accountParam);
      if (account) {
        setSelectedAccount(account);
      }
    }
  }, [location.search, withdrawalMethods, accounts]);

  const handleCopyAddress = (address) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(true);
    toast.success("Address copied to clipboard");
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const resetSelection = () => {
    setSelectedWithdrawalMethod(null);
    setSelectedCurrency("USDT");
    setSelectedAccount(null);
    setWithdrawalAmount("");
    setCryptoWalletAddress("");
    setSelectedNetwork("");
    setBankDetails({
      accountNumber: "",
      accountHolderName: "",
      ifscCode: "",
      bankName: "",
      branch: "",
    });
    setAmountError("");
    setWalletAddressError("");
    setShowWithdrawalDetails(false);
    setWithdrawalStatus(null);
    setWithdrawalResult(null);
  };

  // Crypto wallet address validation
  const validateWalletAddress = (address, currency) => {
    if (!address || !address.trim()) {
      return "Wallet address is required";
    }

    // Basic validation patterns for different cryptocurrencies
    const validationPatterns = {
      BTC: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/,
      ETH: /^0x[a-fA-F0-9]{40}$/,
      USDT: /^0x[a-fA-F0-9]{40}$|^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^T[A-Za-z1-9]{33}$/,
      USDC: /^0x[a-fA-F0-9]{40}$/,
      TRX: /^T[A-Za-z1-9]{33}$/,
      LTC: /^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$|^ltc1[a-z0-9]{39,59}$/,
    };

    const pattern = validationPatterns[currency];
    if (pattern && !pattern.test(address)) {
      return `Invalid ${currency} wallet address format`;
    }

    if (address.length < 10) {
      return "Wallet address is too short";
    }

    if (address.length > 100) {
      return "Wallet address is too long";
    }

    return "";
  };

  const handleWalletAddressChange = (address) => {
    setCryptoWalletAddress(address);
    if (isCryptoMethod()) {
      const error = validateWalletAddress(address, selectedCurrency);
      setWalletAddressError(error);
    }
  };

  const validateAmount = (amount, account) => {
    const numAmount = parseFloat(amount);

    if (!amount || !amount.trim()) {
      return "Amount is required";
    }

    if (isNaN(numAmount) || numAmount <= 0) {
      return "Please enter a valid amount";
    }

    if (account && numAmount > account.balance) {
      return `Insufficient balance. Available: ${account.balance.toFixed(2)} ${
        account.currency
      }`;
    }

    if (
      selectedWithdrawalMethod?.minWithdrawal &&
      numAmount < selectedWithdrawalMethod.minWithdrawal
    ) {
      return `Minimum withdrawal: ${selectedWithdrawalMethod.minWithdrawal} ${
        selectedAccount?.currency || "USD"
      }`;
    }

    if (
      selectedWithdrawalMethod?.maxWithdrawal &&
      numAmount > selectedWithdrawalMethod.maxWithdrawal
    ) {
      return `Maximum withdrawal: ${selectedWithdrawalMethod.maxWithdrawal} ${
        selectedAccount?.currency || "USD"
      }`;
    }

    return "";
  };

  const handleAmountChange = (value) => {
    setWithdrawalAmount(value);
    if (selectedAccount) {
      const error = validateAmount(value, selectedAccount);
      setAmountError(error);
    }
  };

  const handleContinueToWithdrawal = () => {
    const error = validateAmount(withdrawalAmount, selectedAccount);
    if (error) {
      setAmountError(error);
      return;
    }

    // Validate crypto wallet address if needed
    if (isCryptoMethod()) {
      const addressError = validateWalletAddress(
        cryptoWalletAddress,
        selectedCurrency
      );
      if (addressError) {
        setWalletAddressError(addressError);
        return;
      }
    }

    // Validate bank details if needed
    if (isBankMethod()) {
      if (
        !bankDetails.accountNumber ||
        !bankDetails.accountHolderName ||
        !bankDetails.bankName
      ) {
        toast.error("Please fill all required bank details");
        return;
      }
    }

    const isFormComplete =
      selectedWithdrawalMethod &&
      selectedAccount &&
      withdrawalAmount &&
      !amountError &&
      (!isCryptoMethod() || (cryptoWalletAddress && !walletAddressError)) &&
      (!isBankMethod() ||
        (bankDetails.accountNumber && bankDetails.accountHolderName));

    if (isFormComplete) {
      setShowWithdrawalDetails(true);
    }
  };

  // Map crypto ticker to BlockBee format
  const mapCoinToBlockBeeTicker = (currency, network) => {
    const tickerMap = {
      USDT_ERC20: "usdt_erc20",
      USDT_TRC20: "usdt_trc20",
      BTC: "btc",
      ETH: "eth",
      LTC: "ltc",
      TRX: "trx",
    };

    // Try exact match first
    const key = `${currency}_${network}`.toUpperCase();
    if (tickerMap[key]) {
      return tickerMap[key];
    }

    // Fallback to currency only
    return tickerMap[currency.toUpperCase()] || currency.toLowerCase();
  };

  // Handle withdrawal confirmation - Create withdrawal in DB
  const handleConfirmWithdrawal = async () => {
    setIsProcessing(true);
    setWithdrawalStatus("pending");

    try {
      // Determine if this is a BlockBee crypto withdrawal
      const isBlockBeeCrypto = isCryptoMethod();

      let withdrawalData = {
        tradingAccountId: selectedAccount._id,
        amount: parseFloat(withdrawalAmount),
        currency: selectedAccount.currency,
        withdrawalMethod: selectedWithdrawalMethod.type,
        withdrawalDetails: {},
      };

      // Add crypto-specific details for BlockBee
      if (isBlockBeeCrypto) {
        const blockBeeCoin = mapCoinToBlockBeeTicker(
          selectedCurrency,
          selectedNetwork
        );

        withdrawalData = {
          tradingAccountId: selectedAccount._id,
          amount: parseFloat(withdrawalAmount),
          coin: blockBeeCoin,
          walletAddress: cryptoWalletAddress,
          network: selectedNetwork,
        };

        // Call BlockBee withdrawal API
        const response = await api.post(
          "/transactions/blockbee/withdrawal/request",
          withdrawalData
        );

        if (response.data.success) {
          setWithdrawalStatus("success");
          setWithdrawalResult(response.data.data);
          toast.success("Withdrawal request created successfully");

          // Update local account balance optimistically
          if (selectedAccount) {
            selectedAccount.balance =
              selectedAccount.balance - parseFloat(withdrawalAmount);
          }
        } else {
          setWithdrawalStatus("error");
          setWithdrawalResult({ error: response.data.message });
          toast.error(response.data.message);
        }
      } else if (isBankMethod()) {
        // Bank transfer - manual approval flow
        withdrawalData.withdrawalDetails = {
          bankName: bankDetails.bankName,
          accountNumber: bankDetails.accountNumber,
          accountHolderName: bankDetails.accountHolderName,
          ifscCode: bankDetails.ifscCode || "",
          branch: bankDetails.branch || "",
        };

        const response = await api.post(
          "/transactions/withdrawals",
          withdrawalData
        );

        if (response.data.success) {
          setWithdrawalStatus("success");
          setWithdrawalResult(response.data.data);
          toast.success("Withdrawal request submitted successfully");

          // Update local account balance optimistically
          if (selectedAccount) {
            selectedAccount.balance =
              selectedAccount.balance - parseFloat(withdrawalAmount);
          }
        } else {
          setWithdrawalStatus("error");
          setWithdrawalResult({ error: response.data.message });
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.error("Withdrawal creation error:", error);
      setWithdrawalStatus("error");
      setWithdrawalResult({
        error:
          error.response?.data?.message ||
          "Failed to create withdrawal request",
      });
      toast.error(
        error.response?.data?.message || "Failed to create withdrawal request"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetryWithdrawal = () => {
    setWithdrawalStatus(null);
    setWithdrawalResult(null);
    setIsProcessing(false);
  };

  const handleWithdrawalComplete = () => {
    navigate("/payments-and-wallet/history", {
      state: {
        message: "Withdrawal submitted successfully",
        transactionId: withdrawalResult?.transactionId,
        filter: "withdrawals",
      },
    });
  };

  const isFormValid =
    selectedWithdrawalMethod &&
    selectedAccount &&
    withdrawalAmount &&
    !amountError &&
    (!isCryptoMethod() || (cryptoWalletAddress && !walletAddressError)) &&
    (!isBankMethod() ||
      (bankDetails.accountNumber && bankDetails.accountHolderName));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MetaHead
          title="Withdraw Funds"
          description="Withdraw funds from your trading account"
          keywords="withdraw, withdrawal, crypto withdrawal"
        />
        <PageHeader
          title="Withdraw Funds"
          subtitle="Loading withdrawal methods..."
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
        <MetaHead
          title="Withdraw Funds"
          description="Withdraw funds from your trading account"
          keywords="withdraw, withdrawal"
        />
        <PageHeader
          title="Withdraw Funds"
          subtitle="Error loading withdrawal methods"
        />
        <div className="px-4 py-8">
          <Card className="p-6 text-center text-red-600 max-w-2xl mx-auto">
            <AlertCircle className="mx-auto mb-4" size={48} />
            <p className="text-lg font-semibold mb-2">Error</p>
            <p>{error}</p>
            <Button className="mt-4" onClick={fetchWithdrawalData}>
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
        title="Withdraw Funds"
        description="Withdraw funds from your trading account. Cryptocurrency and bank transfer withdrawals supported."
        keywords="withdraw funds, withdrawal, crypto withdrawal, bank transfer"
      />

      <PageHeader
        title="Withdraw Funds"
        subtitle={
          withdrawalStatus === "success"
            ? "Withdrawal request submitted"
            : withdrawalStatus === "error"
            ? "Withdrawal failed"
            : showWithdrawalDetails
            ? "Confirm your withdrawal"
            : selectedWithdrawalMethod
            ? "Configure your withdrawal"
            : "Select withdrawal method"
        }
      />

      <div className="max-w-6xl mx-auto py-6 px-4">
        {/* Success Screen */}
        {withdrawalStatus === "success" && (
          <div className="max-w-2xl mx-auto">
            <Card className="p-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="text-white" size={40} />
                </div>
                <h2 className="text-3xl font-bold mb-2 text-gray-900">
                  Withdrawal Request Submitted!
                </h2>
                <p className="text-gray-600 mb-8">
                  {isCryptoMethod()
                    ? "Your cryptocurrency withdrawal is being processed"
                    : "Your withdrawal is pending review"}
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <div className="text-sm text-green-600 font-medium mb-2">
                    Amount Withdrawing
                  </div>
                  <div className="text-4xl font-bold text-green-900 mb-1">
                    ${withdrawalAmount}
                  </div>
                  <div className="text-xs text-green-700">
                    {selectedAccount.currency}
                  </div>
                </div>

                {withdrawalResult?.transactionId && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-600 mb-1">
                      Transaction ID
                    </div>
                    <div className="font-mono text-sm text-gray-900 break-all">
                      {withdrawalResult.transactionId}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white rounded-lg p-4 border">
                    <div className="text-gray-600 mb-1">Method</div>
                    <div className="font-medium">
                      {selectedWithdrawalMethod.name}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border">
                    <div className="text-gray-600 mb-1">Fee</div>
                    <div className="font-medium">
                      ${withdrawalResult?.fee || 0}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border">
                    <div className="text-gray-600 mb-1">Status</div>
                    <div className="font-medium text-amber-600">
                      {withdrawalResult?.status === "pending"
                        ? "Pending Review"
                        : withdrawalResult?.status || "Pending"}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border">
                    <div className="text-gray-600 mb-1">Processing Time</div>
                    <div className="font-medium text-sm">
                      {isCryptoMethod()
                        ? "Automated (within hours)"
                        : selectedWithdrawalMethod.processingTime}
                    </div>
                  </div>
                </div>

                {isCryptoMethod() && cryptoWalletAddress && (
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="text-sm text-blue-600 font-medium mb-2">
                      Your {selectedCurrency} Wallet
                    </div>
                    <div className="font-mono text-sm text-blue-900 break-all mb-2">
                      {cryptoWalletAddress}
                    </div>
                    <div className="text-xs text-blue-700">
                      Network: {selectedNetwork}
                    </div>
                  </div>
                )}

                {isBankMethod() && (
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="text-sm text-blue-600 font-medium mb-2">
                      Bank Details
                    </div>
                    <div className="text-sm space-y-1">
                      <div>
                        <span className="text-gray-600">Bank: </span>
                        <span className="font-medium">
                          {bankDetails.bankName}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Account: </span>
                        <span className="font-medium">
                          {bankDetails.accountNumber}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Name: </span>
                        <span className="font-medium">
                          {bankDetails.accountHolderName}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleWithdrawalComplete}
                >
                  View Transaction History
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={resetSelection}
                >
                  Make Another Withdrawal
                </Button>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Info size={20} className="text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-blue-900 mb-2">
                      What's next:
                    </div>
                    {isCryptoMethod() ? (
                      <div className="text-sm text-blue-800">
                        Your cryptocurrency withdrawal will be processed
                        automatically by our system. The funds will be sent to
                        your wallet address once approved. This typically takes
                        a few hours. You'll receive a notification when
                        completed.
                      </div>
                    ) : (
                      <div className="text-sm text-blue-800">
                        Your withdrawal request is being reviewed by our team.
                        You'll receive a notification once it's processed and
                        the funds are transferred to your bank account.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Error Screen */}
        {withdrawalStatus === "error" && (
          <div className="max-w-2xl mx-auto">
            <Card className="p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <XCircle className="text-red-600" size={32} />
                </div>
                <h2 className="text-2xl font-bold mb-4 text-red-900">
                  Withdrawal Failed
                </h2>
              </div>

              <div className="space-y-4 mb-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="text-sm text-red-800">
                    {withdrawalResult?.error ||
                      "An error occurred while processing your withdrawal."}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleRetryWithdrawal}
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
            </Card>
          </div>
        )}

        {/* Main withdrawal flow - CONTINUES IN NEXT PART */}
        {!withdrawalStatus && (
          <>
            {!selectedWithdrawalMethod ? (
              /* Step 1: Select Withdrawal Method */
              <div className="space-y-6">
                {/* Info Banner for Crypto */}
                <Card className="p-6 bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Zap size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">
                        Automated Cryptocurrency Withdrawals
                      </h3>
                      <ul className="text-sm space-y-1 opacity-90">
                        <li>✓ Automated processing via BlockBee</li>
                        <li>✓ Fast withdrawals (typically within hours)</li>
                        <li>✓ Secure blockchain transactions</li>
                        <li>✓ Multiple cryptocurrencies supported</li>
                      </ul>
                    </div>
                  </div>
                </Card>

                <div className="text-center lg:text-left">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Choose Withdrawal Method
                  </h2>
                  <p className="text-gray-600">
                    Select your preferred method to withdraw funds
                  </p>
                </div>

                {withdrawalMethods.length === 0 ? (
                  <Card className="p-12 text-center">
                    <AlertCircle
                      className="mx-auto mb-4 text-gray-400"
                      size={48}
                    />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      No withdrawal methods available
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Please contact support to enable withdrawal methods
                    </p>
                    <Button onClick={() => navigate("/support")}>
                      Contact Support
                    </Button>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    {withdrawalMethods.map((option) => (
                      <CryptoDepositCard
                        key={option.id}
                        option={option}
                        onSelect={handleMethodSelection}
                        isSelected={false}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : !showWithdrawalDetails ? (
              /* Step 2: Configuration - SAME AS BEFORE BUT CONTINUES... */
              <div className="space-y-6">
                <Button
                  variant="ghost"
                  onClick={resetSelection}
                  className="flex items-center gap-2 mb-4 hover:bg-gray-100"
                >
                  <ArrowLeft size={16} />
                  Back to withdrawal methods
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Selected Withdrawal Method */}
                    <Card className="p-6">
                      <h2 className="text-xl font-semibold mb-6">
                        Withdrawal Method
                      </h2>
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <img
                          src={selectedWithdrawalMethod.image}
                          alt={selectedWithdrawalMethod.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="font-semibold">
                            {selectedWithdrawalMethod.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {selectedWithdrawalMethod.description}
                          </div>
                        </div>
                      </div>

                      {/* BlockBee Badge for Crypto */}
                      {isCryptoMethod() && (
                        <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg">
                          <div className="flex items-center gap-2 text-purple-800 text-sm">
                            <Zap size={16} className="text-purple-600" />
                            <span className="font-medium">
                              Automated via BlockBee • Fast Processing
                            </span>
                          </div>
                        </div>
                      )}
                    </Card>

                    {/* Account Selection */}
                    <Card className="p-6">
                      <h3 className="font-semibold mb-4">From Account</h3>
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
                          className={`w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
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
                            setWithdrawalAmount("");
                            setAmountError("");
                          }}
                        >
                          <option value="">Select your account</option>
                          {accounts.map((account) => (
                            <option key={account._id} value={account._id}>
                              {account.accountNumber} - {account.platform} (
                              {account.accountType}) - Balance: $
                              {account.balance.toFixed(2)} {account.currency}
                            </option>
                          ))}
                        </select>
                      )}
                      {selectedAccount && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-2 text-green-800 text-sm">
                            <CheckCircle size={16} className="text-green-600" />
                            <span className="font-medium">
                              Available: ${selectedAccount.balance.toFixed(2)}{" "}
                              {selectedAccount.currency}
                            </span>
                          </div>
                        </div>
                      )}
                    </Card>

                    {/* Amount Input */}
                    {selectedAccount && (
                      <Card className="p-6">
                        <h3 className="font-semibold mb-4">
                          Withdrawal Amount
                        </h3>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <span className="text-gray-500 text-2xl">$</span>
                          </div>
                          <input
                            type="number"
                            placeholder="0.00"
                            value={withdrawalAmount}
                            onChange={(e) => handleAmountChange(e.target.value)}
                            className={`w-full pl-12 pr-20 py-5 text-3xl font-semibold border rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
                              amountError
                                ? "border-red-300 bg-red-50"
                                : withdrawalAmount && !amountError
                                ? "border-green-300 bg-green-50"
                                : "border-gray-300"
                            }`}
                            step="0.01"
                          />
                          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                            <span className="text-gray-500 text-xl font-medium">
                              {selectedAccount.currency}
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
                          <span>
                            Min: ${selectedWithdrawalMethod.minWithdrawal || 10}
                          </span>
                          <span>
                            Max: $
                            {selectedWithdrawalMethod.maxWithdrawal || 100000}
                          </span>
                        </div>
                      </Card>
                    )}

                    {/* Crypto Wallet Address */}
                    {selectedAccount &&
                      withdrawalAmount &&
                      isCryptoMethod() && (
                        <Card className="p-6">
                          <h3 className="font-semibold mb-4">
                            Your {selectedCurrency} Wallet Address
                          </h3>
                          <input
                            type="text"
                            placeholder={`Enter your ${selectedCurrency} wallet address`}
                            value={cryptoWalletAddress}
                            onChange={(e) =>
                              handleWalletAddressChange(e.target.value)
                            }
                            className={`w-full p-4 border rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 transition ${
                              walletAddressError
                                ? "border-red-300 bg-red-50"
                                : cryptoWalletAddress && !walletAddressError
                                ? "border-green-300 bg-green-50"
                                : "border-gray-300"
                            }`}
                          />

                          {walletAddressError && (
                            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                              <div className="flex items-center gap-2 text-red-700">
                                <AlertCircle size={16} />
                                <span className="text-sm font-medium">
                                  {walletAddressError}
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center gap-2 text-blue-800 text-sm">
                              <Info size={16} className="text-blue-600" />
                              <div>
                                <span className="font-medium">Network:</span>{" "}
                                {selectedNetwork}
                              </div>
                            </div>
                          </div>
                        </Card>
                      )}

                    {/* Bank Details - Same as before */}
                    {selectedAccount && withdrawalAmount && isBankMethod() && (
                      <Card className="p-6">
                        <h3 className="font-semibold mb-4">Bank Details</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Bank Name *
                            </label>
                            <input
                              type="text"
                              placeholder="Enter bank name"
                              value={bankDetails.bankName}
                              onChange={(e) =>
                                setBankDetails({
                                  ...bankDetails,
                                  bankName: e.target.value,
                                })
                              }
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Account Number *
                            </label>
                            <input
                              type="text"
                              placeholder="Enter account number"
                              value={bankDetails.accountNumber}
                              onChange={(e) =>
                                setBankDetails({
                                  ...bankDetails,
                                  accountNumber: e.target.value,
                                })
                              }
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Account Holder Name *
                            </label>
                            <input
                              type="text"
                              placeholder="Enter account holder name"
                              value={bankDetails.accountHolderName}
                              onChange={(e) =>
                                setBankDetails({
                                  ...bankDetails,
                                  accountHolderName: e.target.value,
                                })
                              }
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              IFSC Code (Optional)
                            </label>
                            <input
                              type="text"
                              placeholder="Enter IFSC code"
                              value={bankDetails.ifscCode}
                              onChange={(e) =>
                                setBankDetails({
                                  ...bankDetails,
                                  ifscCode: e.target.value,
                                })
                              }
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Branch (Optional)
                            </label>
                            <input
                              type="text"
                              placeholder="Enter branch name"
                              value={bankDetails.branch}
                              onChange={(e) =>
                                setBankDetails({
                                  ...bankDetails,
                                  branch: e.target.value,
                                })
                              }
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </Card>
                    )}
                  </div>

                  {/* Right Column - Summary */}
                  <div className="lg:sticky lg:top-12 lg:self-start">
                    <Card className="p-6">
                      <h3 className="font-semibold mb-6 text-lg">
                        Withdrawal Summary
                      </h3>

                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Method</span>
                          <span className="font-medium">
                            {selectedWithdrawalMethod.name}
                          </span>
                        </div>

                        {selectedNetwork && (
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Network</span>
                            <span className="font-medium">
                              {selectedNetwork}
                            </span>
                          </div>
                        )}

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
                              withdrawalAmount && !amountError
                                ? "text-green-600 font-medium"
                                : "text-gray-400"
                            }
                          >
                            {withdrawalAmount && !amountError
                              ? `$${withdrawalAmount}`
                              : "Not entered"}
                          </span>
                        </div>

                        <div className="flex justify-between py-2">
                          <span className="text-gray-600">Fee</span>
                          <span className="font-medium text-green-600">
                            ${selectedWithdrawalMethod.fee || 0}
                          </span>
                        </div>

                        {withdrawalAmount &&
                          selectedWithdrawalMethod.fee > 0 && (
                            <div className="flex justify-between py-2 border-t-2 border-gray-200">
                              <span className="text-gray-900 font-semibold">
                                Net Amount
                              </span>
                              <span className="font-bold text-lg">
                                $
                                {(
                                  parseFloat(withdrawalAmount) -
                                  selectedWithdrawalMethod.fee
                                ).toFixed(2)}
                              </span>
                            </div>
                          )}
                      </div>

                      <Button
                        className="w-full"
                        onClick={handleContinueToWithdrawal}
                        disabled={!isFormValid}
                      >
                        {!isFormValid
                          ? "Complete all required fields"
                          : "Continue to Withdrawal"}
                      </Button>

                      {selectedWithdrawalMethod && (
                        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-start gap-2">
                            <Info
                              size={16}
                              className="text-blue-600 flex-shrink-0 mt-0.5"
                            />
                            <div className="text-xs text-blue-800">
                              {isCryptoMethod()
                                ? "Automated processing • Typically completed within hours"
                                : `Processing time: ${selectedWithdrawalMethod.processingTime}`}
                            </div>
                          </div>
                        </div>
                      )}
                    </Card>
                  </div>
                </div>
              </div>
            ) : (
              /* Step 3: Confirmation */
              <div className="space-y-6">
                <Button
                  variant="ghost"
                  onClick={() => setShowWithdrawalDetails(false)}
                  className="flex items-center gap-2 mb-4"
                  disabled={isProcessing}
                >
                  <ArrowLeft size={16} />
                  Back to configuration
                </Button>

                <div className="max-w-2xl mx-auto">
                  <Card className="p-8">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <img
                          src={selectedWithdrawalMethod.image}
                          alt={selectedWithdrawalMethod.name}
                          className="w-10 h-10 rounded-full"
                        />
                      </div>
                      <h2 className="text-2xl font-bold mb-2">
                        Confirm Withdrawal
                      </h2>
                      <p className="text-gray-600 mb-8">
                        Review details before submitting
                      </p>
                    </div>

                    <div className="space-y-4 mb-8">
                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
                        <div className="text-sm text-blue-600 font-medium mb-1">
                          Withdrawal Amount
                        </div>
                        <div className="text-4xl font-bold text-blue-900">
                          ${withdrawalAmount}
                        </div>
                      </div>

                      {isCryptoMethod() && (
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <div className="text-sm text-blue-600 font-medium mb-2">
                            Your {selectedCurrency} Wallet
                          </div>
                          <div className="font-mono text-sm text-blue-900 break-all mb-2">
                            {cryptoWalletAddress}
                          </div>
                          <div className="text-xs text-blue-700">
                            Network: {selectedNetwork}
                          </div>
                        </div>
                      )}

                      {isBankMethod() && (
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <div className="text-sm text-blue-600 font-medium mb-2">
                            Bank Details
                          </div>
                          <div className="text-sm space-y-1">
                            <div>
                              <span className="text-gray-600">Bank: </span>
                              <span className="font-medium">
                                {bankDetails.bankName}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Account: </span>
                              <span className="font-medium">
                                {bankDetails.accountNumber}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Name: </span>
                              <span className="font-medium">
                                {bankDetails.accountHolderName}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-white rounded-lg p-4 border">
                          <div className="text-gray-600 mb-1">Method</div>
                          <div className="font-medium">
                            {selectedWithdrawalMethod.name}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 border">
                          <div className="text-gray-600 mb-1">Account</div>
                          <div className="font-medium">
                            {selectedAccount.accountNumber}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 border">
                          <div className="text-gray-600 mb-1">Fee</div>
                          <div className="font-medium">
                            ${selectedWithdrawalMethod.fee || 0}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 border">
                          <div className="text-gray-600 mb-1">Net Amount</div>
                          <div className="font-medium text-green-600">
                            $
                            {(
                              parseFloat(withdrawalAmount) -
                              (selectedWithdrawalMethod.fee || 0)
                            ).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        size="lg"
                        onClick={handleConfirmWithdrawal}
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="animate-spin mr-2" size={18} />
                            Processing Withdrawal...
                          </>
                        ) : (
                          <>
                            {isCryptoMethod() && (
                              <Zap size={18} className="mr-2" />
                            )}
                            Confirm Withdrawal
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setShowWithdrawalDetails(false)}
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
                          <strong>Important:</strong> Please verify all details
                          carefully before confirming.{" "}
                          {isCryptoMethod() &&
                            `Ensure the wallet address is correct for the ${selectedNetwork} network. `}
                          Withdrawals cannot be reversed once processed.
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

export default Withdrawal;
