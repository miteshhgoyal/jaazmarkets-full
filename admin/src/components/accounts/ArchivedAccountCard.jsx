import React from "react";
import { RotateCcw, Calendar } from "lucide-react";
import { Card, CardHeader, CardContent } from "../ui/Card";
import Button from "../ui/Button";
import AccountBadges from "./AccountBadges";
import BalanceDisplay from "./BalanceDisplay";

const ArchivedAccountCard = ({ account, onReactivate }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="opacity-75 hover:opacity-100 transition-opacity duration-200">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 sm:mb-4 gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <AccountBadges account={account} />
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500 flex-shrink-0">
            <Calendar size={12} className="sm:w-[14px] sm:h-[14px]" />
            <span className="whitespace-nowrap">
              {formatDate(account.archivedDate)}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0">
            <BalanceDisplay
              balance={account.balance}
              currency={account.currency}
              size="medium"
            />
          </div>
          <Button
            variant="primary"
            onClick={() => onReactivate(account.id)}
            className="flex items-center justify-center gap-2 w-full sm:w-auto"
            size="sm"
          >
            <RotateCcw size={12} className="sm:w-[14px] sm:h-[14px]" />
            <span className="text-sm">Reactivate</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 pt-0">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-400 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
            <div className="min-w-0 flex-1">
              <p className="text-amber-800 text-xs sm:text-sm font-medium leading-relaxed">
                {account.archiveReason || "Account archived due to inactivity"}
              </p>
              <p className="text-amber-700 text-xs mt-1">
                Archived on {formatDate(account.archivedDate)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArchivedAccountCard;
