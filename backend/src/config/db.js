// config/database.js
import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

// const MONGO_URI = 'mongodb://localhost:27017/jaazcrm';
const MONGO_URI = process.env.NODE_ENV === 'development'
    ? process.env.MONGODB_URI
    : process.env.MONGODB_URI_PROD;

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Seed admin user if not exists
        await seedAdminUser();
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

const seedAdminUser = async () => {
    try {
        const adminUserId = process.env.ADMIN_ID || 'JZMADMIN';
        const adminUsername = process.env.ADMIN_USERNAME || 'superadmin';
        const adminPassword = process.env.ADMIN_PASSWORD || 'superadmin';
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@jaaz.com';
        const adminPhone = process.env.ADMIN_PHONE || '+1234567890';

        if (!adminPassword) {
            console.warn('ADMIN_PASSWORD not set in environment variables');
            return;
        }

        // Check if admin user already exists
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('✓ Admin user already exists');
            return;
        }

        // Create admin user (password will be auto-hashed by pre-save hook)
        const admin = new User({
            userId: adminUserId,
            email: adminEmail,
            phoneNumber: adminPhone,
            password: adminPassword,
            role: 'superadmin',
            firstName: 'Super',
            lastName: 'Admin',
            accountStatus: 'active',
            isVerified: true,
            kycStatus: 'approved'
        });

        await admin.save();
        console.log('✓ Admin user created successfully');
        console.log(`  Email: ${adminEmail}`);
    } catch (error) {
        console.error('Error seeding admin user:', error.message);
    }
};

export default connectDB;
