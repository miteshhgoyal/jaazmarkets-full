import User from "../models/User.js";
import Settings from "../models/Setting.js";

export const calculateAndPayReferralCommission = async (trade) => {
    try {
        // Only process closed trades
        if (trade.status !== "closed") {
            return;
        }

        // Get the trader
        const trader = await User.findById(trade.userId).select("referredBy");

        if (!trader || !trader.referredBy) {
            return; // No referrer
        }

        // Get referral settings
        const settings = await Settings.findOne();

        if (!settings?.referralSettings?.enabled) {
            return; // Referral system disabled
        }

        // Calculate trade amount: volume * openPrice
        const tradeAmount = trade.volume * trade.openPrice;

        const commissionRate = settings.referralSettings.commissionPercentage || 0.01;
        const commissionAmount = (tradeAmount * commissionRate) / 100;

        // Pay commission to referrer
        if (settings.referralSettings.payoutMethod === "wallet") {
            await User.findByIdAndUpdate(trader.referredBy, {
                $inc: {
                    referralEarnings: commissionAmount,
                    walletBalance: commissionAmount,
                },
            });

            console.log(`Referral commission: $${commissionAmount.toFixed(4)} (${commissionRate}% of $${tradeAmount.toFixed(2)}) paid for trade ${trade.tradeId}`);
        }

    } catch (error) {
        console.error("Calculate referral commission error:", error);
    }
};
