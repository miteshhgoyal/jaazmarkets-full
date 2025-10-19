// app/trading/deposit-withdrawal/page.js
import StartTradingBanner from '@/components/StartTradingBanner'
import StartTradingCTA from '@/components/StartTradingCTA'
import PaymentFeatures from '@/components/PaymentFeatures'
import PaymentMethods from '@/components/PaymentMethods'
import ProcessingTimesTable from '@/components/ProcessingTimesTable'
import PaymentProcess from '@/components/PaymentProcess'
import React from 'react'

const PaymentFeaturesData = {
    heading: 'Seamless Money Management',
    description: 'Experience the fastest and most secure way to manage your trading funds with our comprehensive payment solutions.',
    features: [
        {
            iconName: 'Zap',
            title: 'Instant Deposits',
            description: 'Funds available immediately in your trading account',
            iconBg: 'bg-green-100 /30',
            iconColor: 'text-green-600'
        },
        {
            iconName: 'DollarSign',
            title: 'Same-Day Withdrawals',
            description: 'Get your profits within 24 hours',
            iconBg: 'bg-blue-100 /30',
            iconColor: 'text-blue-600'
        },
        {
            iconName: 'Target',
            title: 'No Hidden Fees',
            description: 'Transparent pricing with no surprise charges',
            iconBg: 'bg-primary-orange/10',
            iconColor: 'text-primary-orange'
        },
        {
            iconName: 'Shield',
            title: 'Bank-Grade Security',
            description: 'SSL encryption and PCI DSS compliance',
            iconBg: 'bg-purple-100 /30',
            iconColor: 'text-purple-600'
        }
    ]
}

const PaymentMethodsData = {
    heading: 'Payment Methods',
    description: 'Choose from our wide range of secure payment methods. All major credit cards, bank transfers, and e-wallets accepted.',
    categories: [
        {
            title: 'Credit & Debit Cards',
            gridCols: 'lg:grid-cols-6',
            methods: [
                { name: 'Visa', shortName: 'VISA', bgColor: 'bg-blue-600' },
                { name: 'Mastercard', shortName: 'MC', bgColor: 'bg-red-600' },
                { name: 'American Express', shortName: 'AMEX', bgColor: 'bg-blue-500' },
                { name: 'Discover', shortName: 'DISC', bgColor: 'bg-orange-500' },
                { name: 'JCB', shortName: 'JCB', bgColor: 'bg-purple-600' },
                { name: 'UnionPay', shortName: 'UPI', bgColor: 'bg-gray-600' }
            ]
        },
        {
            title: 'E-Wallets',
            gridCols: 'lg:grid-cols-6',
            methods: [
                { name: 'PayPal', shortName: 'PP', bgColor: 'bg-blue-700' },
                { name: 'Skrill', shortName: 'SK', bgColor: 'bg-black' },
                { name: 'Neteller', shortName: 'NT', bgColor: 'bg-green-600' },
                { name: 'Perfect Money', shortName: 'PM', bgColor: 'bg-red-500' },
                { name: 'WebMoney', shortName: 'WM', bgColor: 'bg-indigo-600' },
                { name: 'AdvCash', shortName: 'AD', bgColor: 'bg-yellow-500' }
            ]
        },
        {
            title: 'Bank Transfers',
            gridCols: 'lg:grid-cols-3',
            methods: [
                { name: 'Wire Transfer', shortName: 'WIRE', bgColor: 'bg-blue-800' },
                { name: 'SEPA Transfer', shortName: 'SEPA', bgColor: 'bg-green-700' },
                { name: 'ACH Transfer', shortName: 'ACH', bgColor: 'bg-purple-700' }
            ]
        },
        {
            title: 'Cryptocurrencies',
            gridCols: 'lg:grid-cols-6',
            methods: [
                { name: 'Bitcoin', shortName: 'BTC', bgColor: 'bg-orange-500' },
                { name: 'Ethereum', shortName: 'ETH', bgColor: 'bg-gray-700' },
                { name: 'Litecoin', shortName: 'LTC', bgColor: 'bg-yellow-400' },
                { name: 'Tether', shortName: 'USDT', bgColor: 'bg-green-500' },
                { name: 'USD Coin', shortName: 'USDC', bgColor: 'bg-blue-600' },
                { name: 'Cardano', shortName: 'ADA', bgColor: 'bg-red-600' }
            ]
        }
    ]
}

const ProcessingTimesTableData = {
    heading: 'Processing Times & Limits',
    description: 'Transparent information about processing times and transaction limits for all payment methods.',
    tableHeaders: [
        'Payment Method',
        'Deposit Time',
        'Withdrawal Time',
        'Min Deposit',
        'Min Withdrawal',
        'Fees'
    ],
    tableRows: [
        {
            method: 'Credit/Debit Cards',
            depositTime: 'Instant',
            withdrawalTime: '1-3 business days',
            minDeposit: '$10',
            minWithdrawal: '$10',
            fees: 'Free'
        },
        {
            method: 'PayPal',
            depositTime: 'Instant',
            withdrawalTime: 'Within 24 hours',
            minDeposit: '$10',
            minWithdrawal: '$10',
            fees: 'Free'
        },
        {
            method: 'Skrill/Neteller',
            depositTime: 'Instant',
            withdrawalTime: 'Within 24 hours',
            minDeposit: '$10',
            minWithdrawal: '$10',
            fees: 'Free'
        },
        {
            method: 'Bank Transfer',
            depositTime: '1-3 business days',
            withdrawalTime: '1-5 business days',
            minDeposit: '$100',
            minWithdrawal: '$100',
            fees: 'Free'
        },
        {
            method: 'Cryptocurrencies',
            depositTime: 'Instant',
            withdrawalTime: 'Within 1 hour',
            minDeposit: '$50',
            minWithdrawal: '$50',
            fees: 'Network fees'
        }
    ]
}

const PaymentProcessData = {
    heading: 'How It Works',
    description: 'Simple 3-step process to fund your account and start trading within minutes.',
    steps: [
        {
            number: '1',
            title: 'Choose Payment Method',
            description: 'Select your preferred payment method from our comprehensive list of options.',
            bgColor: 'bg-primary-orange'
        },
        {
            number: '2',
            title: 'Enter Amount',
            description: 'Specify the amount you want to deposit or withdraw from your trading account.',
            bgColor: 'bg-blue-600'
        },
        {
            number: '3',
            title: 'Confirm Transaction',
            description: 'Review and confirm your transaction. Funds will be processed according to the method\'s timeline.',
            bgColor: 'bg-green-600'
        }
    ]
}

const ctaData = {
    heading: 'Ready to Fund Your Account?',
    description: 'Start trading today with instant deposits and same-day withdrawals. Your funds are secure with bank-grade protection.',
    buttons: [
        {
            text: 'Deposit Funds',
            href: '/deposit',
            variant: 'primary',
            icon: 'dollar',
        },
        {
            text: 'Open Account',
            href: 'https://client.jaazmarkets.com/account?tab=register',
            variant: 'secondary',
            icon: 'monitor',
        },
    ],
}

const page = () => {
    return (
        <main>
            <StartTradingBanner />
            <PaymentFeatures data={PaymentFeaturesData} />
            <PaymentMethods data={PaymentMethodsData} />
            <ProcessingTimesTable data={ProcessingTimesTableData} />
            <PaymentProcess data={PaymentProcessData} />
            <StartTradingCTA {...ctaData} />
        </main>
    )
}

export default page
