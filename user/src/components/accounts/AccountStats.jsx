// user/src/components/accounts/AccountStats.jsx
import React from "react";
import { Copy, Server, CreditCard, Hash, Calendar } from "lucide-react";

const AccountStats = ({ account, onCopyToClipboard }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const stats = [
    {
      icon: Hash,
      label: "Account Number",
      value: account.accountNumber || "N/A",
      copyable: true,
    },
    {
      icon: CreditCard,
      label: "Login",
      value: account.login || "N/A",
      copyable: true,
    },
    {
      icon: Server,
      label: "Server",
      value: account.server || "N/A",
      copyable: true,
    },
    {
      icon: Calendar,
      label: "Created",
      value: formatDate(account.createdAt),
      copyable: false,
    },
  ];

  const handleCopy = (value, label) => {
    if (onCopyToClipboard) {
      onCopyToClipboard(value, label);
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
        >
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <stat.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wide">
                {stat.label}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                {stat.value}
              </p>
            </div>
          </div>
          {stat.copyable && stat.value !== "N/A" && (
            <button
              onClick={() => handleCopy(stat.value, stat.label)}
              className="p-1.5 sm:p-2 hover:bg-white rounded-md transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
              aria-label={`Copy ${stat.label}`}
            >
              <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500" />
            </button>
          )}
        </div>
      ))}

      {/* Equity and Margin */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-2">
        <div className="p-2.5 sm:p-3 bg-green-50 rounded-lg border border-green-100">
          <p className="text-[10px] sm:text-xs text-green-700 uppercase tracking-wide mb-1">
            Equity
          </p>
          <p className="text-sm sm:text-base font-bold text-green-900">
            {account.currency}{" "}
            {(account.equity || 0).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="p-2.5 sm:p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-[10px] sm:text-xs text-blue-700 uppercase tracking-wide mb-1">
            Free Margin
          </p>
          <p className="text-sm sm:text-base font-bold text-blue-900">
            {account.currency}{" "}
            {(account.freeMargin || 0).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountStats;
