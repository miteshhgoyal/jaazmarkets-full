import React, { useState } from "react";
import { Send, Download, ArrowUpDown, Copy, Eye, EyeOff } from "lucide-react";
import { Card, CardHeader, CardContent } from "../ui/Card";
import Button from "../ui/Button";

const CryptoAccountCard = ({ wallet, onDeposit, onWithdraw, onTransfer }) => {
  const [showBalance, setShowBalance] = useState(true);

  const formatBalance = (amount) => {
    if (!showBalance) return "••••••";

    const balance = parseFloat(amount || 0);
    if (balance === 0) return "0.00";

    if (balance < 1) {
      return balance.toFixed(8).replace(/\.?0+$/, "");
    }

    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    }).format(balance);
  };

  const formatUsdValue = (amount) => {
    if (!showBalance) return "••••••";

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parseFloat(amount || 0));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const getCryptoIcon = () => {
    if (wallet.image) {
      return (
        <img
          src={wallet.image}
          alt={wallet.symbol}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
        />
      );
    }

    return (
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-600">
        {wallet.symbol?.charAt(0) || "?"}
      </div>
    );
  };

  return (
    <Card
      variant="default"
      className="hover:shadow-lg transition-shadow duration-200"
    >
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="min-w-0 flex-1 flex items-center gap-3">
            {getCryptoIcon()}

            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                {wallet.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 truncate">
                {wallet.network}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowBalance(!showBalance)}
            className="p-1.5 sm:p-2 flex-shrink-0"
          >
            {showBalance ? (
              <Eye size={14} className="sm:w-4 sm:h-4" />
            ) : (
              <EyeOff size={14} className="sm:w-4 sm:h-4" />
            )}
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-bold text-gray-900 text-lg sm:text-xl lg:text-2xl truncate">
                {formatBalance(wallet.balance)}
              </span>
              <span className="text-gray-500 font-medium text-xs sm:text-sm uppercase tracking-wide flex-shrink-0">
                {wallet.currency}
              </span>
            </div>

            <div className="text-sm sm:text-base text-gray-600">
              ≈ {formatUsdValue(wallet.usdValue)}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => onWithdraw(wallet.id, wallet.currency)}
                className="flex items-center justify-center gap-1.5 flex-1 sm:flex-none text-xs sm:text-sm"
                size="sm"
              >
                <Send size={12} className="sm:w-3.5 sm:h-3.5" />
                Withdraw
              </Button>
            </div>

            <Button
              variant="secondary"
              onClick={() => onTransfer(wallet.id)}
              className="flex items-center justify-center gap-2"
              size="sm"
            >
              <ArrowUpDown size={14} />
              Transfer
            </Button>

            <Button
              variant="primary"
              onClick={() => onDeposit(wallet.id, wallet.currency)}
              className="flex items-center justify-center gap-1.5 flex-1 sm:flex-none"
              size="sm"
            >
              <Download size={12} className="sm:w-3.5 sm:h-3.5" />
              Deposit
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default CryptoAccountCard;
