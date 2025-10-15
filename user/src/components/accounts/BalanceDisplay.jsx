import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Button from "../ui/Button";

const BalanceDisplay = ({ balance, currency = "USD", size = "large" }) => {
  const [showBalance, setShowBalance] = useState(true);

  const formatBalance = (amount) => {
    if (!showBalance) return "••••••";
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parseFloat(amount) || 0);
  };

  const sizeClasses = {
    small: "text-base sm:text-lg",
    medium: "text-lg sm:text-xl lg:text-2xl",
    large: "text-2xl sm:text-3xl lg:text-4xl",
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="flex items-baseline gap-1 sm:gap-2 min-w-0">
        <span
          className={`font-bold text-gray-900 ${sizeClasses[size]} truncate`}
        >
          {formatBalance(balance)}
        </span>
        <span className="text-gray-500 font-medium text-xs sm:text-sm uppercase tracking-wide flex-shrink-0">
          {currency}
        </span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowBalance(!showBalance)}
        className="p-1.5 sm:p-2 hover:bg-gray-100 flex-shrink-0"
      >
        {showBalance ? (
          <Eye size={16} className="sm:w-[18px] sm:h-[18px]" />
        ) : (
          <EyeOff size={16} className="sm:w-[18px] sm:h-[18px]" />
        )}
      </Button>
    </div>
  );
};

export default BalanceDisplay;
