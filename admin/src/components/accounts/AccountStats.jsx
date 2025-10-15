import React from "react";
import { Copy } from "lucide-react";
import Button from "../ui/Button";

const StatItem = ({ label, value, copyable = false, onCopy }) => (
  <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-100 last:border-b-0">
    <span className="text-gray-600 text-xs sm:text-sm flex-shrink-0 mr-2">
      {label}
    </span>
    <div className="flex items-center gap-1 sm:gap-2 min-w-0">
      <span className="font-medium text-gray-900 text-xs sm:text-sm truncate">
        {value}
      </span>
      {copyable && (
        <Button
          variant="ghost"
          size="xs"
          onClick={() => onCopy(value)}
          className="p-1 sm:p-1.5 hover:bg-gray-100 flex-shrink-0"
        >
          <Copy size={10} className="sm:w-3 sm:h-3" />
        </Button>
      )}
    </div>
  </div>
);

const AccountStats = ({ account, onCopyToClipboard }) => {
  const stats = [
    {
      label: "Free Margin",
      value: `${account.freeMargin} ${account.currency}`,
    },
    { label: "Equity", value: `${account.equity} ${account.currency}` },
    { label: "Floating P/L", value: account.floatingPL },
    { label: "Margin Level", value: account.marginLevel || "∞" },
    { label: "Server", value: account.server, copyable: true },
    { label: "Login", value: account.login, copyable: true },
  ];

  return (
    <div className="bg-gray-50/50 rounded-lg p-3 sm:p-4">
      <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-xs sm:text-sm uppercase tracking-wide">
        Account Details
      </h4>
      <div className="space-y-0.5 sm:space-y-1">
        {stats.map((stat, index) => (
          <StatItem
            key={index}
            label={stat.label}
            value={stat.value}
            copyable={stat.copyable}
            onCopy={onCopyToClipboard}
          />
        ))}
      </div>
    </div>
  );
};

export default AccountStats;
