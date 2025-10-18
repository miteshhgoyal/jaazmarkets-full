import React, { useState, useEffect } from "react";
import {
  Copy,
  Check,
  ArrowLeft,
  AlertCircle,
  Loader2,
  CheckCircle,
  XCircle,
  Info,
  Zap,
  Wallet,
  DollarSign,
  RefreshCw,
  Clock,
  Download,
  QrCode,
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
  const [selectedCrypto, setSelectedCrypto] = useState("bep20/usdt");

  // BlockBee direct payment state
  const [paymentAddress, setPaymentAddress] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [depositId, setDepositId] = useState(null);
  const [transactionId, setTransactionId] = useState(null);

  // API state
  const [isProcessing, setIsProcessing] = useState(false);
  const [depositStatus, setDepositStatus] = useState(null);
  const [depositResult, setDepositResult] = useState(null);
  const [copied, setCopied] = useState(false);

  // Payment verification state
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [paymentReceived, setPaymentReceived] = useState(false);
  const [confirmations, setConfirmations] = useState(0);

  // UI state
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Crypto options
  const cryptoOptions = [
    {
      value: "bep20/usdt",
      label: "USDT (BEP20)",
      network: "Binance Smart Chain",
      icon: "💰",
      color: "from-orange-400 to-orange-600",
    },
    {
      value: "trc20/usdt",
      label: "USDT (TRC20)",
      network: "Tron Network",
      icon: "💰",
      color: "from-red-400 to-red-600",
    },
  ];

  // Fetch trading accounts on mount
  useEffect(() => {
    fetchAccounts();
  }, []);

  // Start payment verification polling when deposit is created
  useEffect(() => {
    let pollInterval;
    let progressInterval;

    if (depositStatus === "success" && depositId && !paymentReceived) {
      setIsVerifying(true);

      // Initial check after 5 seconds
      const initialTimeout = setTimeout(() => {
        checkPaymentStatus();
      }, 5000);

      // Poll every 10 seconds
      pollInterval = setInterval(() => {
        checkPaymentStatus();
      }, 10000);

      // Simulate progress bar animation
      progressInterval = setInterval(() => {
        setVerificationProgress((prev) => {
          if (prev >= 95) return 95;
          return prev + 1;
        });
      }, 1000);

      return () => {
        clearTimeout(initialTimeout);
        if (pollInterval) clearInterval(pollInterval);
        if (progressInterval) clearInterval(progressInterval);
      };
    }
  }, [depositStatus, depositId, paymentReceived]);

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

  // Check payment status from backend
  const checkPaymentStatus = async () => {
    try {
      const response = await api.get(`/transactions/deposits/${depositId}`);

      if (response.data.success) {
        const deposit = response.data.data;

        if (deposit.blockBee?.confirmations) {
          setConfirmations(deposit.blockBee.confirmations);
        }

        if (deposit.status === "completed") {
          setPaymentReceived(true);
          setIsVerifying(false);
          setVerificationProgress(100);
          toast.success("Payment received and confirmed! 🎉");
        } else if (
          deposit.blockBee?.blockBeeStatus === "pending_confirmation"
        ) {
          toast.info("Payment detected! Waiting for confirmations...");
        }
      }
    } catch (error) {
      console.error("Payment status check error:", error);
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
    setPaymentAddress(null);
    setQrCode(null);
    setQrCodeUrl(null);
    setDepositId(null);
    setTransactionId(null);
    setSelectedCrypto("bep20/usdt");
    setCopied(false);
    setIsVerifying(false);
    setVerificationProgress(0);
    setPaymentReceived(false);
    setConfirmations(0);
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

  const handleCreateDeposit = async () => {
    setIsProcessing(true);
    setDepositStatus("pending");

    try {
      const depositData = {
        tradingAccountId: selectedAccount._id,
        amount: parseFloat(depositAmount),
        ticker: selectedCrypto,
      };

      console.log("Creating deposit with:", depositData);

      const response = await api.post(
        "/transactions/deposits/blockbee/create",
        depositData
      );

      console.log("BlockBee API Response:", response.data);

      if (response.data.success) {
        setDepositStatus("success");
        setDepositResult(response.data.data);
        setPaymentAddress(response.data.data.paymentAddress);

        console.log("QR Code (base64):", response.data.data.qrCode);
        console.log("QR Code URL:", response.data.data.qrCodeUrl);

        setQrCode(response.data.data.qrCode);
        setQrCodeUrl(response.data.data.qrCodeUrl);
        setDepositId(response.data.data.depositId);
        setTransactionId(response.data.data.transactionId);
        toast.success("Payment address created successfully!");
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
          error.response?.data?.message || "Failed to create payment address",
      });
      toast.error(
        error.response?.data?.message || "Failed to create payment address"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyAddress = () => {
    if (paymentAddress) {
      navigator.clipboard.writeText(paymentAddress);
      setCopied(true);
      toast.success("Address copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadQR = () => {
    if (qrCode) {
      const link = document.createElement("a");
      link.href = `data:image/png;base64,${qrCode}`;
      link.download = `payment-qr-${transactionId}.png`;
      link.click();
      toast.success("QR code downloaded!");
    } else if (paymentAddress) {
      const link = document.createElement("a");
      link.href = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(
        paymentAddress
      )}`;
      link.download = `payment-qr-${transactionId}.png`;
      link.click();
      toast.success("QR code downloaded!");
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

  const getSelectedCryptoInfo = () => {
    return cryptoOptions.find((c) => c.value === selectedCrypto);
  };

  // QR Code Display Component with Multiple Fallbacks
  const QRCodeDisplay = ({ address, qrCodeBase64, qrCodeURL }) => {
    const [qrError, setQrError] = useState(false);
    const [useGenerated, setUseGenerated] = useState(false);

    let qrSource = null;

    if (qrCodeBase64 && !qrError && !useGenerated) {
      qrSource = `data:image/png;base64,${qrCodeBase64}`;
    } else if (qrCodeURL && !qrError && !useGenerated) {
      qrSource = qrCodeURL;
    } else if (address) {
      qrSource = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
        address
      )}&format=png&margin=10`;
    }

    if (!qrSource) return null;

    return (
      <div className="mb-8">
        <div className="bg-white p-6 rounded-xl border-2 border-gray-200 inline-block shadow-lg">
          <img
            src={qrSource}
            alt="Payment QR Code"
            className="w-64 h-64 mx-auto"
            onError={(e) => {
              console.error("QR Code failed to load, trying fallback");
              setQrError(true);
              setUseGenerated(true);
            }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-3 mb-3">
          <QrCode size={16} className="inline mr-2" />
          Scan this QR code with your crypto wallet
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadQR}
          className="text-xs"
        >
          <Download size={14} className="mr-2" />
          Download QR Code
        </Button>
      </div>
    );
  };

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
        description="Deposit funds to your trading account using cryptocurrency. Support for multiple cryptocurrencies with instant confirmation."
        keywords="deposit funds, crypto deposit, bitcoin deposit, cryptocurrency payment, instant deposit"
      />

      <PageHeader
        title="Deposit Funds"
        subtitle={
          depositStatus === "success"
            ? paymentReceived
              ? "✅ Payment received and confirmed!"
              : "Payment address created - Send crypto to complete deposit"
            : depositStatus === "error"
            ? "Failed to create payment address"
            : showConfirmation
            ? "Confirm your deposit"
            : "Choose account, amount, and cryptocurrency"
        }
      />

      <div className="max-w-4xl mx-auto py-6 px-4">
        {/* Success Screen - Show Payment Address & QR Code */}
        {depositStatus === "success" && paymentAddress && (
          <div className="max-w-2xl mx-auto">
            <Card className="p-8">
              <div className="text-center">
                {paymentReceived ? (
                  <>
                    <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                      <CheckCircle className="text-white" size={40} />
                    </div>
                    <h2 className="text-3xl font-bold mb-2 text-green-900">
                      Payment Confirmed! 🎉
                    </h2>
                    <p className="text-gray-600 mb-8">
                      Your deposit has been successfully credited to your
                      account
                    </p>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-8">
                      <div className="text-4xl font-bold text-green-900 mb-2">
                        ${depositAmount} USD
                      </div>
                      <div className="text-sm text-green-700">
                        Credited to {selectedAccount?.accountNumber}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                        size="lg"
                        onClick={handleViewHistory}
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
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Wallet className="text-white" size={40} />
                    </div>
                    <h2 className="text-3xl font-bold mb-2 text-gray-900">
                      Payment Address Created!
                    </h2>
                    <p className="text-gray-600 mb-8">
                      Send {getSelectedCryptoInfo()?.label} to the address below
                    </p>

                    {isVerifying && (
                      <div className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                        <div className="flex items-center justify-center gap-3 mb-4">
                          <Loader2
                            className="animate-spin text-blue-600"
                            size={24}
                          />
                          <span className="text-blue-900 font-semibold">
                            Verifying Payment...
                          </span>
                        </div>

                        <div className="relative w-full h-3 bg-blue-200 rounded-full overflow-hidden">
                          <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-1000 ease-out"
                            style={{ width: `${verificationProgress}%` }}
                          >
                            <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between text-sm">
                          <div className="text-blue-700 flex items-center gap-2">
                            <Clock size={16} />
                            <span>Checking blockchain...</span>
                          </div>
                          <span className="text-blue-900 font-semibold">
                            {verificationProgress}%
                          </span>
                        </div>

                        {confirmations > 0 && (
                          <div className="mt-3 p-3 bg-green-100 border border-green-300 rounded-lg">
                            <div className="flex items-center gap-2 text-green-800">
                              <CheckCircle size={16} />
                              <span className="text-sm font-medium">
                                {confirmations} confirmation
                                {confirmations > 1 ? "s" : ""} received
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <QRCodeDisplay
                      address={paymentAddress}
                      qrCodeBase64={qrCode}
                      qrCodeURL={qrCodeUrl}
                    />

                    <div className="mb-8">
                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
                        <div className="text-sm text-blue-600 font-medium mb-3">
                          {getSelectedCryptoInfo()?.label} Payment Address
                        </div>
                        <div className="bg-white rounded-lg p-4 mb-4">
                          <div className="font-mono text-sm break-all text-gray-900">
                            {paymentAddress}
                          </div>
                        </div>
                        <Button
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                          onClick={handleCopyAddress}
                        >
                          {copied ? (
                            <>
                              <Check size={18} className="mr-2" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy size={18} className="mr-2" />
                              Copy Address
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4 mb-8">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                        <div className="text-sm text-green-600 font-medium mb-2">
                          Amount to Send
                        </div>
                        <div className="text-4xl font-bold text-green-900 mb-2">
                          ${depositAmount} USD
                        </div>
                        <div className="text-xs text-green-700">
                          (Equivalent in {getSelectedCryptoInfo()?.label})
                        </div>
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
                          <div className="text-gray-600 mb-1">Network</div>
                          <div className="font-medium">
                            {getSelectedCryptoInfo()?.network}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 border">
                          <div className="text-gray-600 mb-1">Status</div>
                          <div className="font-medium text-amber-600 flex items-center gap-1">
                            <Loader2 size={14} className="animate-spin" />
                            Awaiting Payment
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
                            Important Instructions:
                          </div>
                          <ul className="text-sm text-blue-800 space-y-2">
                            <li className="flex items-start gap-2">
                              <span className="text-blue-600 font-bold">
                                1.
                              </span>
                              <span>
                                Send the exact amount to the payment address
                                above
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-blue-600 font-bold">
                                2.
                              </span>
                              <span>
                                Verify you're sending on{" "}
                                <strong>
                                  {getSelectedCryptoInfo()?.network}
                                </strong>
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-blue-600 font-bold">
                                3.
                              </span>
                              <span>
                                Auto-credit after 1 blockchain confirmation
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-blue-600 font-bold">
                                4.
                              </span>
                              <span>Processing: Usually 5-30 minutes</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </>
                )}
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
                  Failed to Create Payment Address
                </h2>

                <div className="space-y-4 mb-8">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="text-sm text-red-800">
                      {depositResult?.error ||
                        "An error occurred while creating your payment address."}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleRetryDeposit}
                  >
                    <RefreshCw size={18} className="mr-2" />
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

        {/* Main deposit flow - COMPLETE FORM */}
        {!depositStatus && (
          <>
            {!showConfirmation ? (
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Info Banner */}
                <Card className="p-6 bg-gradient-to-br from-orange-400 to-orange-600 text-white">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Zap size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">
                        Cryptocurrency Deposits via BlockBee
                      </h3>
                      <ul className="text-sm space-y-1 opacity-90">
                        <li>✓ Direct wallet-to-wallet payment</li>
                        <li>✓ Automatic confirmation & instant credit</li>
                        <li>✓ Secure blockchain transactions</li>
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

                {/* Cryptocurrency Selection */}
                {selectedAccount && (
                  <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl">₿</span>
                      </div>
                      <h3 className="text-xl font-semibold">
                        Choose Cryptocurrency
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {cryptoOptions.map((crypto) => (
                        <button
                          key={crypto.value}
                          onClick={() => setSelectedCrypto(crypto.value)}
                          className={`p-4 border-2 rounded-lg text-left transition-all hover:border-blue-400 ${
                            selectedCrypto === crypto.value
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-200 bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-3xl">{crypto.icon}</div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900">
                                {crypto.label}
                              </div>
                              <div className="text-xs text-gray-600">
                                {crypto.network}
                              </div>
                            </div>
                            {selectedCrypto === crypto.value && (
                              <CheckCircle
                                size={20}
                                className="text-blue-600"
                              />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </Card>
                )}

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
                            You'll send {getSelectedCryptoInfo()?.label}
                          </span>
                        </div>
                        <div className="text-xs text-blue-700">
                          The exact crypto amount will be calculated based on
                          current market rates
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
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Zap className="text-white" size={32} />
                    </div>

                    <h2 className="text-2xl font-bold mb-2">
                      Confirm Your Deposit
                    </h2>
                    <p className="text-gray-600 mb-8">
                      Review details before generating payment address
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
                            Cryptocurrency
                          </div>
                          <div className="font-semibold text-gray-900">
                            {getSelectedCryptoInfo()?.label}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {getSelectedCryptoInfo()?.network}
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
                            Generating Payment Address...
                          </>
                        ) : (
                          <>
                            <Zap size={18} className="mr-2" />
                            Generate Payment Address
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
                          <strong>Note:</strong> After clicking "Generate
                          Payment Address", you'll receive a unique crypto
                          wallet address and QR code. Send your payment to that
                          address to complete the deposit.
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
