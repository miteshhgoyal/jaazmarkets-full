import dotenv from 'dotenv';
dotenv.config({ quiet: true });

import express from 'express';
import cors from 'cors';
import connectDB from "./config/db.js";

// Import routes
import authRoutes from "./routes/auth.routes.js";
import accountRoutes from "./routes/account.routes.js";
import tradeRoutes from "./routes/trade.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import referRoutes from "./routes/refer.routes.js";

const app = express();
const PORT = process.env.PORT || 8000;

const allowedOrigins = [
    'https://jaazmarkets-user.vercel.app',
    'https://jaazmarkets-admin.vercel.app',
    'https://jaazmarkets.com',
    'https://client.jaazmarkets.com',
    'https://dashboard.jaazmarkets.com',
    'https://admin.jaazmarkets.com',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:8173'
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (React Native, Postman, curl)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(null, true); // Or set to false to block unknown origins
        }
    },
    methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT', 'OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/auth', authRoutes);
app.use('/account', accountRoutes);
app.use('/trades', tradeRoutes);
app.use('/transactions', transactionRoutes);
app.use('/user', userRoutes);
app.use('/refer', referRoutes);
app.use('/admin', adminRoutes);
app.use('/admin/settings', settingsRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'API is running!',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
    });
});

app.use('/{*splat}', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// Start server
connectDB()
    .then(() => {
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV}`);
        });
    })
    .catch(err => {
        console.error("DB connection failed:", err);
        process.exit(1);
    });

export default app;
