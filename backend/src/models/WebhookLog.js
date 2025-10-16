// models/WebhookLog.js
import mongoose from 'mongoose';

const webhookLogSchema = new mongoose.Schema({
    uuid: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    userId: String,
    type: {
        type: String,
        enum: ['deposit', 'withdrawal', 'other'],
        default: 'other'
    },
    payload: mongoose.Schema.Types.Mixed,
    processed: {
        type: Boolean,
        default: false
    },
    error: String,
    processedAt: Date
}, {
    timestamps: true
});

const WebhookLog = mongoose.model('WebhookLog', webhookLogSchema);
export default WebhookLog;
