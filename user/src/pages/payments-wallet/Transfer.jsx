// user/src/pages/payments-wallet/Transfer.jsx
import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  AlertCircle,
  Loader2,
  CheckCircle,
  XCircle,
  ArrowRightLeft,
  Users,
  Info,
  Mail,
  Hash,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import CryptoDepositCard from "../../components/deposits/CryptoDepositCard";
import MetaHead from "../../components/MetaHead";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";

const Transfer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Data state
  const [accounts, setAccounts] = useState([]);
  const [transferOptions, setTransferOptions] = useState([]);
  const [transferReasons, setTransferReasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [selectedFromAccount, setSelectedFromAccount] = useState(null);
  const [selectedToAccount, setSelectedToAccount] = useState(null);
  const [recipientAccountNumber, setRecipientAccountNumber] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [transferReason, setTransferReason] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferNote, setTransferNote] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Validation errors
  const [amountError, setAmountError] = useState("");
  const [accountError, setAccountError] = useState("");
  const [recipientError, setRecipientError] = useState("");

  // Transfer status
  const [isProcessing, setIsProcessing] = useState(false);
  const [transferStatus, setTransferStatus] = useState(null);
  const [transferResult, setTransferResult] = useState(null);

  useEffect(() => {
    fetchTransferData();
  }, []);

  // Handle query parameters
  useEffect(() => {
    if (accounts.length === 0) return;

    const searchParams = new URLSearchParams(location.search);
    const accountParam = searchParams.get("pp_account");

    if (accountParam) {
      const account = accounts.find((acc) => acc._id === accountParam);
      if (account) {
        setSelectedFromAccount(account);
        // Auto-select between accounts method if coming from wallet
        if (!selectedMethod && transferOptions.length > 0) {
          const betweenAccountsMethod = transferOptions.find(
            (opt) => opt.id === "betweenaccounts"
          );
          if (betweenAccountsMethod) {
            handleMethodSelection(betweenAccountsMethod);
          }
        }
      }
    }
  }, [location.search, accounts, transferOptions]);

  const fetchTransferData = async () => {
    try {
      setLoading(true);
      setError(null);

      const accountsResponse = await api.get("/account/my-accounts");

      if (accountsResponse.data.success) {
        const realAccounts = accountsResponse.data.data.filter(
          (acc) => acc.accountType === "Real"
        );
        setAccounts(realAccounts);
      }

      // Set transfer options
      setTransferOptions([
        {
          id: "betweenaccounts",
          name: "Between My Accounts",
          type: "internal",
          description: "Transfer between your trading accounts",
          network: "Internal",
          image: "https://img.icons8.com/3d-fluency/94/exchange.png",
          fee: 0,
          processingTime: "Instant",
          isActive: true,
          recommended: true,
        },
        {
          id: "toanotheruser",
          name: "To Another User",
          type: "internal",
          description: "Transfer to another user account",
          network: "Internal",
          image: "https://img.icons8.com/3d-fluency/94/user-group-man-man.png",
          fee: 0,
          processingTime: "5-10 minutes",
          isActive: true,
          recommended: false,
        },
      ]);

      // Set transfer reasons
      setTransferReasons([
        { id: "investment", name: "Investment" },
        { id: "payment", name: "Payment for services" },
        { id: "gift", name: "Gift" },
        { id: "loan", name: "Loan repayment" },
        { id: "trading", name: "Trading capital" },
        { id: "other", name: "Other" },
      ]);
    } catch (err) {
      console.error("Error fetching transfer data:", err);
      setError(err.response?.data?.message || "Failed to load transfer data");
      toast.error("Failed to load transfer data");
    } finally {
      setLoading(false);
    }
  };

  const validateAmount = (amount, account) => {
    const numAmount = parseFloat(amount);

    if (!amount || amount.trim() === "") {
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

    // Minimum transfer amount check
    if (numAmount < 1) {
      return "Minimum transfer amount is 1";
    }

    return "";
  };

  const handleMethodSelection = (method) => {
    setSelectedMethod(method);
    // Don't reset selectedFromAccount if it was set via query params
    if (!location.search.includes("pp_account")) {
      setSelectedFromAccount(null);
    }
    setSelectedToAccount(null);
    setRecipientAccountNumber("");
    setRecipientEmail("");
    setTransferReason("");
    setTransferAmount("");
    setTransferNote("");
    setAmountError("");
    setAccountError("");
    setRecipientError("");
    setShowConfirmation(false);
  };

  const handleContinueToConfirmation = () => {
    // Validate
    const amountErr = validateAmount(transferAmount, selectedFromAccount);
    if (amountErr) {
      setAmountError(amountErr);
      return;
    }

    if (selectedMethod?.id === "betweenaccounts") {
      if (!selectedFromAccount || !selectedToAccount) {
        setAccountError("Please select both source and destination accounts");
        return;
      }
      if (selectedFromAccount._id === selectedToAccount._id) {
        setAccountError("Source and destination accounts must be different");
        return;
      }
    }

    if (selectedMethod?.id === "toanotheruser") {
      if (!recipientAccountNumber || !recipientEmail || !transferReason) {
        setRecipientError("Please fill all required fields");
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(recipientEmail)) {
        setRecipientError("Please enter a valid email address");
        return;
      }
    }

    setShowConfirmation(true);
  };

  const handleConfirmTransfer = async () => {
    setIsProcessing(true);
    setTransferStatus("pending");

    try {
      const transferData = {
        methodId: selectedMethod.id,
        methodType: selectedMethod.type,
        fromAccountId: selectedFromAccount._id,
        amount: parseFloat(transferAmount),
        currency: selectedFromAccount.currency,
        metadata: {
          note: transferNote,
        },
      };

      if (selectedMethod.id === "betweenaccounts") {
        transferData.toAccountId = selectedToAccount._id;
      }

      if (selectedMethod.id === "toanotheruser") {
        transferData.recipientAccountNumber = recipientAccountNumber;
        transferData.recipientEmail = recipientEmail;
        transferData.transferReason = transferReason;
      }

      const response = await api.post("/transactions/transfers", transferData);

      if (response.data.success) {
        setTransferStatus("success");
        setTransferResult(response.data.data);
        toast.success("Transfer completed successfully");

        // Refresh accounts to show updated balances
        fetchTransferData();
      } else {
        throw new Error(response.data.message || "Transfer failed");
      }
    } catch (error) {
      console.error("Transfer error:", error);
      setTransferStatus("error");
      setTransferResult({
        error:
          error.message || error.response?.data?.message || "Transfer failed",
      });
      toast.error(
        error.message || error.response?.data?.message || "Transfer failed"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const resetSelection = () => {
    setSelectedMethod(null);
    setSelectedFromAccount(null);
    setSelectedToAccount(null);
    setRecipientAccountNumber("");
    setRecipientEmail("");
    setTransferReason("");
    setTransferAmount("");
    setTransferNote("");
    setAmountError("");
    setAccountError("");
    setRecipientError("");
    setShowConfirmation(false);
    setTransferStatus(null);
    setTransferResult(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MetaHead
          title="Transfer Funds"
          description="Transfer funds between accounts"
        />
        <PageHeader title="Transfer Funds" subtitle="Loading..." />
        <div className="flex justify-center items-center py-16">
          <Loader2 className="animate-spin text-blue-600" size={48} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MetaHead title="Transfer Funds" description="Transfer funds" />
        <PageHeader title="Transfer Funds" subtitle="Error loading data" />
        <div className="px-4 py-8 max-w-2xl mx-auto">
          <Card className="p-6 text-center text-red-600">
            <AlertCircle className="mx-auto mb-4" size={48} />
            <p className="text-lg font-semibold mb-2">Error</p>
            <p>{error}</p>
            <Button className="mt-4" onClick={fetchTransferData}>
              Try Again
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // Success Screen
  if (transferStatus === "success") {
    return (
      <div className="min-h-screen bg-gray-50">
        <MetaHead title="Transfer Complete" />
        <PageHeader title="Transfer Funds" subtitle="Transfer successful" />
        <div className="max-w-2xl mx-auto py-8 px-4">
          <Card className="p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-green-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-green-900">
                Transfer Completed!
              </h2>

              <div className="space-y-4 mb-8">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-sm text-green-600">
                    Amount Transferred
                  </div>
                  <div className="text-2xl font-bold text-green-900">
                    {transferAmount} {selectedFromAccount.currency}
                  </div>
                </div>

                {transferResult?.transactionId && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600">Transaction ID</div>
                    <div className="font-mono text-sm text-gray-900">
                      {transferResult.transactionId}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">From</div>
                    <div className="font-medium">
                      {transferResult?.from ||
                        selectedFromAccount.accountNumber}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">To</div>
                    <div className="font-medium">
                      {transferResult?.to ||
                        selectedToAccount?.accountNumber ||
                        recipientAccountNumber}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Status</div>
                    <div className="font-medium text-green-600">
                      {transferResult?.status || "Completed"}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Processing Time</div>
                    <div className="font-medium">
                      {selectedMethod.processingTime}
                    </div>
                  </div>
                </div>

                {transferResult?.reason && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-sm text-blue-600">Reason</div>
                    <div className="text-sm text-blue-900">
                      {transferResult.reason}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() =>
                    navigate("/payments-and-wallet/history", {
                      state: {
                        message: "Transfer completed successfully",
                        filter: "transfers",
                      },
                    })
                  }
                >
                  View Transaction History
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={resetSelection}
                >
                  Make Another Transfer
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Error Screen
  if (transferStatus === "error") {
    return (
      <div className="min-h-screen bg-gray-50">
        <MetaHead title="Transfer Failed" />
        <PageHeader title="Transfer Funds" subtitle="Transfer failed" />
        <div className="max-w-2xl mx-auto py-8 px-4">
          <Card className="p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="text-red-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-red-900">
                Transfer Failed
              </h2>

              <div className="space-y-4 mb-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="text-sm text-red-800">
                    {transferResult?.error || "An error occurred"}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => {
                    setTransferStatus(null);
                    setShowConfirmation(false);
                  }}
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MetaHead
        title="Transfer Funds"
        description="Transfer funds between accounts or to other users"
        keywords="transfer, funds, accounts, send money"
      />

      <PageHeader
        title="Transfer Funds"
        subtitle={
          showConfirmation
            ? "Confirm your transfer"
            : selectedMethod
            ? "Configure your transfer"
            : "Select transfer method"
        }
      />

      <div className="max-w-6xl mx-auto py-6 px-4">
        {!selectedMethod ? (
          // Step 1: Select Transfer Method
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Choose Transfer Method
              </h2>
              <p className="text-gray-600">
                Select how you want to transfer your funds
              </p>
            </div>

            {accounts.length === 0 && (
              <Card className="p-12 text-center">
                <AlertCircle className="mx-auto mb-4 text-gray-400" size={48} />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No trading accounts found
                </h3>
                <p className="text-gray-500 mb-6">
                  You need at least one trading account to transfer funds
                </p>
                <Button onClick={() => navigate("/account/create")}>
                  Create Account
                </Button>
              </Card>
            )}

            {accounts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                {transferOptions.map((option) => (
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
        ) : !showConfirmation ? (
          // Step 2: Configuration
          <div className="space-y-6">
            <Button
              variant="ghost"
              onClick={resetSelection}
              className="flex items-center gap-2 mb-4 hover:bg-gray-100"
            >
              <ArrowLeft size={16} />
              Back to transfer methods
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Selected Method */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-6">
                    Transfer Method
                  </h2>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={selectedMethod.image}
                      alt={selectedMethod.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <div className="font-semibold">{selectedMethod.name}</div>
                      <div className="text-sm text-gray-600">
                        {selectedMethod.description}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* From Account */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">From Account</h3>
                  <select
                    className={`w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      selectedFromAccount
                        ? "border-green-300 bg-green-50"
                        : "border-gray-300"
                    }`}
                    value={selectedFromAccount?._id || ""}
                    onChange={(e) => {
                      const account = accounts.find(
                        (acc) => acc._id === e.target.value
                      );
                      setSelectedFromAccount(account);
                      setTransferAmount("");
                      setAmountError("");
                      setAccountError("");
                    }}
                  >
                    <option value="">Select source account</option>
                    {accounts.map((account) => (
                      <option key={account._id} value={account._id}>
                        {account.accountNumber} - {account.platform} (Balance:{" "}
                        {account.balance.toFixed(2)} {account.currency})
                      </option>
                    ))}
                  </select>
                </Card>

                {/* To Account (for between accounts) */}
                {selectedMethod.id === "betweenaccounts" &&
                  selectedFromAccount && (
                    <Card className="p-6">
                      <h3 className="font-semibold mb-4">To Account</h3>
                      <select
                        className={`w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          selectedToAccount
                            ? "border-green-300 bg-green-50"
                            : "border-gray-300"
                        }`}
                        value={selectedToAccount?._id || ""}
                        onChange={(e) => {
                          const account = accounts.find(
                            (acc) => acc._id === e.target.value
                          );
                          setSelectedToAccount(account);
                          setAccountError("");
                        }}
                      >
                        <option value="">Select destination account</option>
                        {accounts
                          .filter((acc) => acc._id !== selectedFromAccount._id)
                          .map((account) => (
                            <option key={account._id} value={account._id}>
                              {account.accountNumber} - {account.platform}{" "}
                              (Balance: {account.balance.toFixed(2)}{" "}
                              {account.currency})
                            </option>
                          ))}
                      </select>
                      {accountError && (
                        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center gap-2 text-red-700">
                            <AlertCircle size={16} />
                            <span className="text-sm">{accountError}</span>
                          </div>
                        </div>
                      )}
                    </Card>
                  )}

                {/* Recipient Details (for to another user) */}
                {selectedMethod.id === "toanotheruser" &&
                  selectedFromAccount && (
                    <Card className="p-6">
                      <h3 className="font-semibold mb-4">Recipient Details</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center gap-2">
                              <Hash size={16} />
                              Recipient Account Number
                            </div>
                          </label>
                          <input
                            type="text"
                            placeholder="Enter account number"
                            value={recipientAccountNumber}
                            onChange={(e) => {
                              setRecipientAccountNumber(e.target.value);
                              setRecipientError("");
                            }}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center gap-2">
                              <Mail size={16} />
                              Recipient Email
                            </div>
                          </label>
                          <input
                            type="email"
                            placeholder="Enter email"
                            value={recipientEmail}
                            onChange={(e) => {
                              setRecipientEmail(e.target.value);
                              setRecipientError("");
                            }}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Transfer Reason *
                          </label>
                          <select
                            value={transferReason}
                            onChange={(e) => {
                              setTransferReason(e.target.value);
                              setRecipientError("");
                            }}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select reason</option>
                            {transferReasons.map((reason) => (
                              <option key={reason.id} value={reason.id}>
                                {reason.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      {recipientError && (
                        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center gap-2 text-red-700">
                            <AlertCircle size={16} />
                            <span className="text-sm">{recipientError}</span>
                          </div>
                        </div>
                      )}
                    </Card>
                  )}

                {/* Amount */}
                {selectedFromAccount && (
                  <Card className="p-6">
                    <h3 className="font-semibold mb-4">Transfer Amount</h3>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="0.00"
                        value={transferAmount}
                        onChange={(e) => {
                          setTransferAmount(e.target.value);
                          const err = validateAmount(
                            e.target.value,
                            selectedFromAccount
                          );
                          setAmountError(err);
                        }}
                        className={`w-full pr-16 py-4 text-2xl border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          amountError
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        }`}
                        step="0.01"
                      />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                        <span className="text-gray-500 text-lg">
                          {selectedFromAccount.currency}
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
                      Available: {selectedFromAccount.balance.toFixed(2)}{" "}
                      {selectedFromAccount.currency}
                    </div>
                  </Card>
                )}

                {/* Note (optional) */}
                {selectedFromAccount && (
                  <Card className="p-6">
                    <h3 className="font-semibold mb-4">Note (Optional)</h3>
                    <textarea
                      placeholder="Add a note for this transfer"
                      value={transferNote}
                      onChange={(e) => setTransferNote(e.target.value)}
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
                    Transfer Summary
                  </h3>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Method</span>
                      <span className="font-medium">{selectedMethod.name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">From</span>
                      <span
                        className={
                          selectedFromAccount
                            ? "text-green-600 font-medium"
                            : "text-gray-400"
                        }
                      >
                        {selectedFromAccount
                          ? selectedFromAccount.accountNumber
                          : "Not selected"}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">To</span>
                      <span
                        className={
                          selectedToAccount || recipientAccountNumber
                            ? "text-green-600 font-medium"
                            : "text-gray-400"
                        }
                      >
                        {selectedToAccount?.accountNumber ||
                          recipientAccountNumber ||
                          "Not selected"}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Amount</span>
                      <span
                        className={
                          transferAmount && !amountError
                            ? "text-green-600 font-medium"
                            : "text-gray-400"
                        }
                      >
                        {transferAmount && !amountError
                          ? `${transferAmount} ${
                              selectedFromAccount?.currency || ""
                            }`
                          : "Not entered"}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Fee</span>
                      <span className="font-medium text-green-600">
                        {selectedMethod.fee || 0}{" "}
                        {selectedFromAccount?.currency || "USD"}
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Processing Time</span>
                      <span className="font-medium">
                        {selectedMethod.processingTime}
                      </span>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleContinueToConfirmation}
                    disabled={
                      !selectedFromAccount ||
                      !transferAmount ||
                      amountError ||
                      (selectedMethod.id === "betweenaccounts" &&
                        !selectedToAccount) ||
                      (selectedMethod.id === "toanotheruser" &&
                        (!recipientAccountNumber ||
                          !recipientEmail ||
                          !transferReason))
                    }
                  >
                    {!selectedFromAccount || !transferAmount
                      ? "Complete required fields"
                      : "Continue to Confirmation"}
                  </Button>

                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Info
                        size={16}
                        className="text-blue-600 flex-shrink-0 mt-0.5"
                      />
                      <div className="text-xs text-blue-800">
                        {selectedMethod.id === "betweenaccounts"
                          ? "Transfers between your accounts are instant and free"
                          : "Transfers to other users are reviewed for security and may take 5-10 minutes"}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          // Step 3: Confirmation
          <div className="space-y-6">
            <Button
              variant="ghost"
              onClick={() => setShowConfirmation(false)}
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
                    <ArrowRightLeft className="text-blue-600" size={32} />
                  </div>

                  <h2 className="text-2xl font-bold mb-4">Confirm Transfer</h2>

                  <div className="space-y-4 mb-8">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600">
                        Transfer Amount
                      </div>
                      <div className="text-2xl font-bold">
                        {transferAmount} {selectedFromAccount.currency}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">From</div>
                        <div className="font-medium">
                          {selectedFromAccount.accountNumber}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">To</div>
                        <div className="font-medium">
                          {selectedToAccount?.accountNumber ||
                            recipientAccountNumber}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Method</div>
                        <div className="font-medium">{selectedMethod.name}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Processing Time</div>
                        <div className="font-medium">
                          {selectedMethod.processingTime}
                        </div>
                      </div>
                    </div>

                    {selectedMethod.id === "toanotheruser" && (
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="text-sm text-blue-600 mb-2">
                          Recipient Details
                        </div>
                        <div className="text-sm text-blue-900 space-y-1">
                          <div>Email: {recipientEmail}</div>
                          <div>
                            Reason:{" "}
                            {
                              transferReasons.find(
                                (r) => r.id === transferReason
                              )?.name
                            }
                          </div>
                        </div>
                      </div>
                    )}

                    {transferNote && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-600 mb-1">Note</div>
                        <div className="text-sm text-gray-900">
                          {transferNote}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleConfirmTransfer}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="animate-spin mr-2" size={16} />
                          Processing Transfer...
                        </>
                      ) : (
                        "Confirm Transfer"
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

                  <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle
                        size={20}
                        className="text-amber-600 flex-shrink-0 mt-0.5"
                      />
                      <div className="text-sm text-amber-800 text-left">
                        <strong>Important:</strong> Please review all details
                        carefully.{" "}
                        {selectedMethod.id === "betweenaccounts"
                          ? "This transfer is instant and cannot be reversed."
                          : "Transfers to other users are reviewed for security purposes."}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transfer;
