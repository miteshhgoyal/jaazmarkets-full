import React, { useState } from "react";
import {
  Edit2,
  Trash2,
  Copy,
  ExternalLink,
  Wallet,
  Shield,
} from "lucide-react";
import { Card, CardHeader, CardContent } from "../ui/Card";
import Button from "../ui/Button";

const ExternalWalletCard = ({ wallet, onRemove, onEdit }) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleRemove = async () => {
    if (
      window.confirm("Are you sure you want to remove this external wallet?")
    ) {
      setIsRemoving(true);
      try {
        await onRemove();
      } catch (error) {
        console.error("Failed to remove wallet:", error);
      } finally {
        setIsRemoving(false);
      }
    }
  };

  const getWalletTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "exchange":
        return <ExternalLink size={16} className="text-blue-600" />;
      case "selfhosted":
      case "self-hosted":
        return <Shield size={16} className="text-green-600" />;
      default:
        return <Wallet size={16} className="text-gray-600" />;
    }
  };

  const getWalletTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "exchange":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "selfhosted":
      case "self-hosted":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const maskAddress = (address) => {
    if (!address || address.length < 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Card
      variant="default"
      className="hover:shadow-lg transition-shadow duration-200"
    >
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                {wallet.name || `${wallet.currency} Wallet`}
              </h3>
              <div
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getWalletTypeColor(
                  wallet.type
                )}`}
              >
                {getWalletTypeIcon(wallet.type)}
                <span className="capitalize">
                  {wallet.type === "selfhosted"
                    ? "Self-hosted"
                    : wallet.type || "Unknown"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-500">
              <span className="font-medium">{wallet.currency}</span>
              {wallet.network && (
                <>
                  <span>•</span>
                  <span>{wallet.network}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="p-1.5 sm:p-2"
              title="Edit wallet"
            >
              <Edit2 size={14} className="sm:w-4 sm:h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              disabled={isRemoving}
              className="p-1.5 sm:p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              title="Remove wallet"
            >
              <Trash2 size={14} className="sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>

        {wallet.description && (
          <p className="text-sm text-gray-600 mb-4">{wallet.description}</p>
        )}
      </CardHeader>

      <CardContent className="p-4 sm:p-6 pt-0">
        <div className="space-y-4">
          {wallet.address && (
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-2 text-xs sm:text-sm uppercase tracking-wide">
                Wallet Address
              </h4>
              <div className="flex items-center justify-between bg-white rounded-md p-2 sm:p-3 border">
                <div className="min-w-0 flex-1 mr-2">
                  <div className="font-mono text-xs sm:text-sm text-gray-600">
                    <span className="hidden sm:inline">{wallet.address}</span>
                    <span className="sm:hidden">
                      {maskAddress(wallet.address)}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(wallet.address)}
                  className="p-1.5 flex-shrink-0"
                  title="Copy address"
                >
                  <Copy size={12} />
                </Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-xs text-blue-600 font-medium mb-1">
                Added
              </div>
              <div className="text-sm font-semibold text-blue-900">
                {new Date(wallet.createdAt || Date.now()).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }
                )}
              </div>
            </div>

            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-xs text-green-600 font-medium mb-1">
                Status
              </div>
              <div className="text-sm font-semibold text-green-900">
                {wallet.status === "active" ? "Active" : "Inactive"}
              </div>
            </div>
          </div>

          {(wallet.provider || wallet.notes) && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4">
              <div className="space-y-2">
                {wallet.provider && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-amber-700 font-medium">
                      Provider:
                    </span>
                    <span className="text-xs sm:text-sm text-amber-900">
                      {wallet.provider}
                    </span>
                  </div>
                )}

                {wallet.notes && (
                  <div>
                    <div className="text-xs sm:text-sm text-amber-700 font-medium mb-1">
                      Notes:
                    </div>
                    <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                      {wallet.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExternalWalletCard;
