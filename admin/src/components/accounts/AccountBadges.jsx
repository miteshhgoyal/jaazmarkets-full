import React from "react";
import Badge from "../ui/Badge";

const AccountBadges = ({ account }) => {
  const getBadgeVariant = (type) => {
    const variants = {
      Real: "success",
      Demo: "warning",
      MT4: "info",
      MT5: "info",
      Pro: "default",
      Standard: "default",
    };
    return variants[type] || "default";
  };

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
      <Badge
        variant={getBadgeVariant(account.accountType)}
        size="xs"
        className="sm:text-xs"
      >
        {account.accountType}
      </Badge>
      <Badge
        variant={getBadgeVariant(account.platform)}
        size="xs"
        className="sm:text-xs"
      >
        {account.platform}
      </Badge>
      <Badge
        variant={getBadgeVariant(account.accountClass)}
        size="xs"
        className="sm:text-xs"
      >
        {account.accountClass}
      </Badge>
      <Badge variant="default" className="font-mono text-xs" size="xs">
        #{account.id}
      </Badge>
      {account.leverage && (
        <Badge variant="primary" size="xs">
          {account.leverage}
        </Badge>
      )}
    </div>
  );
};

export default AccountBadges;
