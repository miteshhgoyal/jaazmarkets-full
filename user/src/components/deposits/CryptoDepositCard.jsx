import React from "react";
import { Card } from "../ui/Card";

const CryptoDepositCard = ({ option, onSelect, isSelected }) => {
  const getCryptoIcon = (icon) => {
    const iconMap = {
      bitcoin: "₿",
      tether: "₮",
      ethereum: "Ξ",
      tron: "⊿",
      usdc: "◉",
    };
    return iconMap[icon] || "◉";
  };

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${
        isSelected
          ? "border-primary shadow-lg bg-primary/5"
          : "border-gray-200 hover:border-gray-300"
      }`}
      onClick={() => onSelect(option)}
    >
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold`}
            >
              <img src={option.image} className="w-10 h-10" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                {option.name}
              </h3>
            </div>
          </div>
          {option.recommended && (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              Recommended
            </span>
          )}
        </div>

        <div className="space-y-2 text-xs sm:text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Processing time</span>
            <span className="font-medium">{option.processingTime}</span>
          </div>
          <div className="flex justify-between">
            <span>Fee</span>
            <span className="font-medium text-green-600">{option.fee}</span>
          </div>
          <div className="flex justify-between">
            <span>Limits</span>
            <span className="font-medium">{option.limits}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CryptoDepositCard;
