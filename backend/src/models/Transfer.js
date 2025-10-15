// backend/src/models/Transfer.js
import mongoose from 'mongoose';

const transferSchema = new mongoose.Schema({
    // User & Account Information
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    fromAccountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TradingAccount',
        required: true,
        index: true
    },
    toAccountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TradingAccount',
        index: true
    },

    // Transaction Details
    transactionId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        required: true,
        default: 'USD'
    },
    fee: {
        type: Number,
        default: 0,
        min: 0
    },
    netAmount: {
        type: Number,
        required: true
    },

    // Transfer Type & Method
    transferType: {
        type: String,
        enum: ['internal', 'external', 'between_accounts', 'to_another_user'],
        required: true,
        default: 'internal'
    },
    methodId: {
        type: String,
        required: true,
        enum: ['betweenaccounts', 'toanotheruser']
    },
    methodType: {
        type: String,
        required: true,
        default: 'internal'
    },

    // Recipient Information (for to_another_user transfers)
    recipientUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    recipientAccountNumber: {
        type: String,
        index: true
    },
    recipientEmail: {
        type: String,
        index: true
    },
    transferReason: {
        type: String,
        enum: ['investment', 'payment', 'gift', 'loan', 'trading', 'other'],
    },

    // Status & Processing
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'rejected'],
        default: 'pending',
        index: true
    },
    processingTime: {
        type: String,
        default: 'Instant'
    },

    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    completedAt: {
        type: Date
    },
    processedAt: {
        type: Date
    },

    // Processing Details
    processedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    // Metadata
    metadata: {
        note: String,
        ipAddress: String,
        userAgent: String,
        deviceInfo: String
    },

    // Admin Notes
    adminNotes: {
        type: String
    },
    rejectionReason: {
        type: String
    },

    // Audit Trail
    auditLog: [{
        action: {
            type: String,
            enum: ['created', 'processed', 'completed', 'failed', 'cancelled', 'rejected']
        },
        performedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        performedAt: {
            type: Date,
            default: Date.now
        },
        notes: String
    }]
}, {
    timestamps: true
});

// Indexes for better query performance
transferSchema.index({ userId: 1, createdAt: -1 });
transferSchema.index({ fromAccountId: 1, createdAt: -1 });
transferSchema.index({ toAccountId: 1, createdAt: -1 });
transferSchema.index({ status: 1, createdAt: -1 });
transferSchema.index({ transactionId: 1 });
transferSchema.index({ recipientUserId: 1, createdAt: -1 });

// Virtual for formatted amount
transferSchema.virtual('formattedAmount').get(function () {
    return `${this.amount.toFixed(2)} ${this.currency}`;
});

// Pre-save middleware to calculate net amount
transferSchema.pre('save', function (next) {
    if (this.isModified('amount') || this.isModified('fee')) {
        this.netAmount = this.amount - (this.fee || 0);
    }
    next();
});

// Methods
transferSchema.methods.markAsCompleted = function () {
    this.status = 'completed';
    this.completedAt = new Date();
    this.processedAt = new Date();
    return this.save();
};

transferSchema.methods.markAsFailed = function (reason) {
    this.status = 'failed';
    this.rejectionReason = reason;
    this.processedAt = new Date();
    return this.save();
};

transferSchema.methods.markAsCancelled = function (reason) {
    this.status = 'cancelled';
    this.rejectionReason = reason;
    this.processedAt = new Date();
    return this.save();
};

transferSchema.methods.addAuditLog = function (action, performedBy, notes) {
    this.auditLog.push({
        action,
        performedBy,
        notes,
        performedAt: new Date()
    });
    return this.save();
};

// Static methods
transferSchema.statics.findByUser = function (userId, options = {}) {
    const query = this.find({
        $or: [
            { userId: userId },
            { recipientUserId: userId }
        ]
    });

    if (options.status) {
        query.where('status').equals(options.status);
    }

    if (options.limit) {
        query.limit(options.limit);
    }

    return query.sort({ createdAt: -1 });
};

transferSchema.statics.findByAccount = function (accountId) {
    return this.find({
        $or: [
            { fromAccountId: accountId },
            { toAccountId: accountId }
        ]
    }).sort({ createdAt: -1 });
};

transferSchema.statics.getTotalTransferred = function (userId) {
    return this.aggregate([
        {
            $match: {
                userId: mongoose.Types.ObjectId(userId),
                status: 'completed'
            }
        },
        {
            $group: {
                _id: '$currency',
                total: { $sum: '$amount' }
            }
        }
    ]);
};

const Transfer = mongoose.model('Transfer', transferSchema);

export default Transfer;
