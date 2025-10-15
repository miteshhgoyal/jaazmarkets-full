import React from "react";
import { TrendingUp, Plus, Minus, MoreVertical } from "lucide-react";
import { Card, CardHeader, CardContent } from "../ui/Card";
import Button from "../ui/Button";
import AccountBadges from "./AccountBadges";
import BalanceDisplay from "./BalanceDisplay";
import AccountStats from "./AccountStats";

const ActiveAccountCard = ({
  account,
  onTrade,
  onDeposit,
  onWithdraw,
  onCopyToClipboard,
}) => {
  return (
    <Card
      variant="default"
      className="hover:shadow-lg transition-shadow duration-200"
    >
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="min-w-0 flex-1">
            <AccountBadges account={account} />
          </div>
          {/* <Button
            variant="ghost"
            size="sm"
            className="p-1.5 sm:p-2 flex-shrink-0"
          >
            <MoreVertical size={14} className="sm:w-4 sm:h-4" />
          </Button> */}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0">
            <BalanceDisplay
              balance={account.balance}
              currency={account.currency}
            />
          </div>

          {/* Mobile: Stack buttons vertically, Desktop: Horizontal */}
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              variant="primary"
              onClick={() => onTrade(account.id)}
              className="flex items-center justify-center gap-2 shadow-sm text-sm"
              size="sm"
            >
              <TrendingUp size={14} />
              Trade
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => onDeposit(account.id)}
                className="flex items-center justify-center gap-1.5 flex-1 sm:flex-none text-xs sm:text-sm"
                size="sm"
              >
                <Plus size={12} className="sm:w-[14px] sm:h-[14px]" />
                Deposit
              </Button>
              <Button
                variant="ghost"
                onClick={() => onWithdraw(account.id)}
                className="flex items-center justify-center gap-1.5 flex-1 sm:flex-none text-xs sm:text-sm"
                size="sm"
              >
                <Minus size={12} className="sm:w-[14px] sm:h-[14px]" />
                Withdraw
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <AccountStats
            account={account}
            onCopyToClipboard={onCopyToClipboard}
          />
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-3 sm:p-4 border border-primary/20">
              <h4 className="font-semibold text-primary mb-2 sm:mb-3 text-xs sm:text-sm uppercase tracking-wide">
                Trading Info
              </h4>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-xs sm:text-sm">
                    Leverage
                  </span>
                  <span className="font-bold text-primary text-sm sm:text-base">
                    {account.leverage}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-xs sm:text-sm">
                    Spread
                  </span>
                  <span className="font-medium text-gray-900 text-sm">
                    {account.spreadType}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-xs sm:text-sm">
                    Commission
                  </span>
                  <span className="font-medium text-gray-900 text-sm">
                    {account.commission}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveAccountCard;
