// user/src/components/accounts/AccountBadges.jsx
import React from "react";

const AccountBadges = ({ account }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "suspended":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getTypeColor = (type) => {
    return type === "Real"
      ? "bg-purple-100 text-purple-800 border-purple-200"
      : "bg-blue-100 text-blue-800 border-blue-200";
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Account Type */}
      <span
        className={`px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-full border ${getTypeColor(
          account.accountType
        )}`}
      >
        {account.accountType}
      </span>

      {/* Platform */}
      <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-full bg-gray-100 text-gray-800 border border-gray-200">
        {account.platform}
      </span>

      {/* Account Class */}
      <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
        {account.accountClass}
      </span>

      {/* Status */}
      <span
        className={`px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-full border ${getStatusColor(
          account.status
        )}`}
      >
        {account.status?.charAt(0).toUpperCase() + account.status?.slice(1) ||
          "Active"}
      </span>
    </div>
  );
};

export default AccountBadges;
