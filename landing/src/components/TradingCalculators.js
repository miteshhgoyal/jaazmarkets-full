// app/COMMON/TradingCalculators.js
'use client'
import React, { useState } from 'react'
import { Calculator, BarChart3, TrendingUp, DollarSign, Info, AlertTriangle } from 'lucide-react'

const iconMap = {
    Calculator, BarChart3, TrendingUp, DollarSign
}

export default function TradingCalculators({ data }) {
    const { heading, description, disclaimer } = data
    const [activeTab, setActiveTab] = useState('pip')
    const [tooltipVisible, setTooltipVisible] = useState(null)

    // Calculator states
    const [pipValues, setPipValues] = useState({
        currencyPair: 'EURUSD',
        tradeSize: 1,
        accountCurrency: 'USD'
    })
    const [pipResult, setPipResult] = useState(null)

    const [lotSizeValues, setLotSizeValues] = useState({
        balance: 5000,
        riskPercent: 2,
        stopLoss: 50,
        pipValue: 10
    })
    const [lotSizeResult, setLotSizeResult] = useState(null)

    const [profitValues, setProfitValues] = useState({
        symbol: 'EURUSD',
        entryPrice: 1.20000,
        exitPrice: 1.20500,
        lotSize: 1
    })
    const [profitResult, setProfitResult] = useState(null)

    const [marginValues, setMarginValues] = useState({
        symbol: 'EURUSD',
        lotSize: 1,
        leverage: 100
    })
    const [marginResult, setMarginResult] = useState(null)

    const tabs = [
        { id: 'pip', label: 'Pip Calculator', iconName: 'Calculator' },
        { id: 'lotsize', label: 'Lot Size Calculator', iconName: 'BarChart3' },
        { id: 'profit', label: 'Profit Calculator', iconName: 'TrendingUp' },
        { id: 'margin', label: 'Margin Calculator', iconName: 'DollarSign' }
    ]

    const tooltips = {
        pip: 'Formula: Pip Value = (Pip in decimal × Trade Size × Contract Size) / Exchange Rate',
        lotsize: 'Formula: Lot Size = Risk Amount / (Stop Loss × Pip Value)',
        profit: 'Formula: Profit = (Exit - Entry) × Lot Size × Contract Size',
        margin: 'Formula: Margin = (Lot Size × Contract Size) / Leverage'
    }

    // Calculation functions
    const calculatePip = () => {
        const { currencyPair, tradeSize, accountCurrency } = pipValues
        if (!tradeSize || tradeSize <= 0) {
            alert('Please enter a valid trade size')
            return
        }

        let pipValue = 10 // Standard for USD pairs
        if (currencyPair.includes('JPY')) {
            pipValue = 0.1
        }

        const totalPipValue = pipValue * tradeSize
        setPipResult({
            currencyPair,
            tradeSize,
            pipValue: totalPipValue.toFixed(2),
            accountCurrency
        })
    }

    const calculateLotSize = () => {
        const { balance, riskPercent, stopLoss, pipValue } = lotSizeValues
        if (!balance || !riskPercent || !stopLoss || !pipValue) {
            alert('Please fill in all fields')
            return
        }

        const riskAmount = balance * (riskPercent / 100)
        const lotSize = riskAmount / (stopLoss * pipValue)
        setLotSizeResult({
            riskAmount: riskAmount.toFixed(2),
            riskPercent,
            lotSize: lotSize.toFixed(2)
        })
    }

    const calculateProfit = () => {
        const { symbol, entryPrice, exitPrice, lotSize } = profitValues
        if (!entryPrice || !exitPrice || !lotSize) {
            alert('Please fill in all fields')
            return
        }

        const priceDifference = exitPrice - entryPrice
        const pips = Math.abs(priceDifference * (symbol.includes('JPY') ? 100 : 10000))
        const contractSize = 100000
        const profit = priceDifference * lotSize * contractSize

        setProfitResult({
            pips: pips.toFixed(1),
            direction: profit >= 0 ? 'Long' : 'Short',
            profit: Math.abs(profit).toFixed(2),
            isProfit: profit >= 0
        })
    }

    const calculateMargin = () => {
        const { symbol, lotSize, leverage } = marginValues
        if (!lotSize || !leverage) {
            alert('Please fill in all fields')
            return
        }

        const contractSize = 100000
        const notionalValue = lotSize * contractSize
        const margin = notionalValue / leverage

        setMarginResult({
            notionalValue: notionalValue.toLocaleString(),
            leverage,
            margin: margin.toFixed(2)
        })
    }

    return (
        <section id="calculators" className="py-16 md:py-24 bg-white ">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Introduction */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900  mb-4">
                            {heading}
                        </h2>
                        <p className="text-lg text-gray-600  max-w-3xl mx-auto">
                            {description}
                        </p>

                        {/* Educational Disclaimer */}
                        <div className="mt-6 bg-yellow-50 /20 border border-yellow-200  rounded-lg p-4 max-w-3xl mx-auto">
                            <div className="flex items-center">
                                <AlertTriangle className="w-6 h-6 text-yellow-600  mr-3 flex-shrink-0" />
                                <div className="text-sm text-yellow-800 ">
                                    <strong>Educational Purpose Only:</strong> {disclaimer}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Calculator Container */}
                    <div className="bg-white  rounded-xl shadow-lg overflow-hidden">
                        {/* Tab Navigation */}
                        <div className="border-b border-gray-200  overflow-x-auto">
                            <nav className="flex space-x-8 px-6" aria-label="Tabs">
                                {tabs.map((tab) => {
                                    const IconComp = iconMap[tab.iconName]
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`calculator-tab border-b-2 py-4 px-1 text-sm font-medium flex items-center transition-colors ${activeTab === tab.id
                                                    ? 'border-primary-orange text-primary-orange'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                }`}
                                        >
                                            <IconComp className="w-5 h-5 mr-2" />
                                            {tab.label}
                                        </button>
                                    )
                                })}
                            </nav>
                        </div>

                        {/* Calculator Content */}
                        <div className="p-6">
                            {/* Pip Calculator */}
                            {activeTab === 'pip' && (
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900  mb-4 flex items-center">
                                            <Calculator className="w-5 h-5 mr-2 text-primary-orange" />
                                            Pip Value Calculator
                                            <div className="relative ml-2">
                                                <button
                                                    onMouseEnter={() => setTooltipVisible('pip')}
                                                    onMouseLeave={() => setTooltipVisible(null)}
                                                    className="text-gray-400 hover:text-gray-600"
                                                >
                                                    <Info className="w-4 h-4" />
                                                </button>
                                                {tooltipVisible === 'pip' && (
                                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg w-64 z-10">
                                                        {tooltips.pip}
                                                    </div>
                                                )}
                                            </div>
                                        </h3>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700  mb-2">
                                                    Currency Pair
                                                </label>
                                                <select
                                                    value={pipValues.currencyPair}
                                                    onChange={(e) => setPipValues({ ...pipValues, currencyPair: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300  rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent  "
                                                >
                                                    <option value="EURUSD">EUR/USD</option>
                                                    <option value="GBPUSD">GBP/USD</option>
                                                    <option value="USDJPY">USD/JPY</option>
                                                    <option value="USDCHF">USD/CHF</option>
                                                    <option value="AUDUSD">AUD/USD</option>
                                                    <option value="USDCAD">USD/CAD</option>
                                                    <option value="NZDUSD">NZD/USD</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700  mb-2">
                                                    Trade Size (Lots)
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0.01"
                                                    value={pipValues.tradeSize}
                                                    onChange={(e) => setPipValues({ ...pipValues, tradeSize: parseFloat(e.target.value) || 0 })}
                                                    className="w-full px-3 py-2 border border-gray-300  rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent  "
                                                    placeholder="1.00"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700  mb-2">
                                                    Account Currency
                                                </label>
                                                <select
                                                    value={pipValues.accountCurrency}
                                                    onChange={(e) => setPipValues({ ...pipValues, accountCurrency: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300  rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent  "
                                                >
                                                    <option value="USD">USD</option>
                                                    <option value="EUR">EUR</option>
                                                    <option value="GBP">GBP</option>
                                                    <option value="JPY">JPY</option>
                                                    <option value="CHF">CHF</option>
                                                    <option value="AUD">AUD</option>
                                                    <option value="CAD">CAD</option>
                                                </select>
                                            </div>

                                            <button
                                                onClick={calculatePip}
                                                className="w-full bg-primary-orange text-white py-2 px-4 rounded-lg hover:bg-primary-orange/90 transition font-medium"
                                            >
                                                Calculate Pip Value
                                            </button>
                                        </div>
                                    </div>

                                    {/* Result Section */}
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900  mb-4">Result</h4>
                                        <div className="bg-gray-50  rounded-lg p-4 min-h-32">
                                            {pipResult ? (
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-600 ">Currency Pair:</span>
                                                        <span className="font-semibold text-gray-900 ">{pipResult.currencyPair}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-600 ">Trade Size:</span>
                                                        <span className="font-semibold text-gray-900 ">{pipResult.tradeSize} lots</span>
                                                    </div>
                                                    <div className="flex justify-between items-center border-t pt-3">
                                                        <span className="text-gray-600 ">Pip Value:</span>
                                                        <span className="font-bold text-primary-orange text-lg">{pipResult.accountCurrency} {pipResult.pipValue}</span>
                                                    </div>
                                                    <div className="mt-3 pt-3 border-t text-xs text-gray-500  italic">
                                                        <strong>Educational Example:</strong> Results based on typical market rates. Actual values vary with real-time market conditions.
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-gray-600  text-center">Enter values and click calculate to see the pip value</p>
                                            )}
                                        </div>

                                        {/* Example */}
                                        <div className="mt-4 p-4 bg-blue-50 /20 rounded-lg">
                                            <h5 className="font-medium text-blue-900  mb-2">Example:</h5>
                                            <p className="text-sm text-blue-800 ">1 lot of EUR/USD = $10 per pip for USD account</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Similar structure for other calculators... */}
                            {/* Lot Size Calculator */}
                            {activeTab === 'lotsize' && (
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900  mb-4 flex items-center">
                                            <BarChart3 className="w-5 h-5 mr-2 text-primary-orange" />
                                            Lot Size Calculator
                                            <div className="relative ml-2">
                                                <button
                                                    onMouseEnter={() => setTooltipVisible('lotsize')}
                                                    onMouseLeave={() => setTooltipVisible(null)}
                                                    className="text-gray-400 hover:text-gray-600"
                                                >
                                                    <Info className="w-4 h-4" />
                                                </button>
                                                {tooltipVisible === 'lotsize' && (
                                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg w-64 z-10">
                                                        {tooltips.lotsize}
                                                    </div>
                                                )}
                                            </div>
                                        </h3>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700  mb-2">Account Balance</label>
                                                <input
                                                    type="number"
                                                    step="100"
                                                    min="100"
                                                    value={lotSizeValues.balance}
                                                    onChange={(e) => setLotSizeValues({ ...lotSizeValues, balance: parseFloat(e.target.value) || 0 })}
                                                    className="w-full px-3 py-2 border border-gray-300  rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent  "
                                                    placeholder="5000"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700  mb-2">Risk Percentage (%)</label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    min="0.1"
                                                    max="10"
                                                    value={lotSizeValues.riskPercent}
                                                    onChange={(e) => setLotSizeValues({ ...lotSizeValues, riskPercent: parseFloat(e.target.value) || 0 })}
                                                    className="w-full px-3 py-2 border border-gray-300  rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent  "
                                                    placeholder="2"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700  mb-2">Stop Loss (Pips)</label>
                                                <input
                                                    type="number"
                                                    step="1"
                                                    min="1"
                                                    value={lotSizeValues.stopLoss}
                                                    onChange={(e) => setLotSizeValues({ ...lotSizeValues, stopLoss: parseFloat(e.target.value) || 0 })}
                                                    className="w-full px-3 py-2 border border-gray-300  rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent  "
                                                    placeholder="50"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700  mb-2">Pip Value</label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    min="0.1"
                                                    value={lotSizeValues.pipValue}
                                                    onChange={(e) => setLotSizeValues({ ...lotSizeValues, pipValue: parseFloat(e.target.value) || 0 })}
                                                    className="w-full px-3 py-2 border border-gray-300  rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent  "
                                                    placeholder="10"
                                                />
                                            </div>

                                            <button
                                                onClick={calculateLotSize}
                                                className="w-full bg-primary-orange text-white py-2 px-4 rounded-lg hover:bg-primary-orange/90 transition font-medium"
                                            >
                                                Calculate Lot Size
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900  mb-4">Result</h4>
                                        <div className="bg-gray-50  rounded-lg p-4 min-h-32">
                                            {lotSizeResult ? (
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-600 ">Risk Amount:</span>
                                                        <span className="font-semibold text-gray-900 ">${lotSizeResult.riskAmount}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-600 ">Risk Percentage:</span>
                                                        <span className="font-semibold text-gray-900 ">{lotSizeResult.riskPercent}%</span>
                                                    </div>
                                                    <div className="flex justify-between items-center border-t pt-3">
                                                        <span className="text-gray-600 ">Suggested Lot Size:</span>
                                                        <span className="font-bold text-primary-orange text-lg">{lotSizeResult.lotSize} lots</span>
                                                    </div>
                                                    <div className="mt-3 pt-3 border-t text-xs text-gray-500  italic">
                                                        <strong>Educational Example:</strong> This calculation is for learning purposes. Verify with your broker before trading.
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-gray-600  text-center">Enter values and click calculate to see the suggested lot size</p>
                                            )}
                                        </div>

                                        <div className="mt-4 p-4 bg-blue-50 /20 rounded-lg">
                                            <h5 className="font-medium text-blue-900  mb-2">Example:</h5>
                                            <p className="text-sm text-blue-800 ">$5,000 balance, 2% risk, 50 pips SL → $100 risk → 0.2 lots</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Profit Calculator */}
                            {activeTab === 'profit' && (
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900  mb-4 flex items-center">
                                            <TrendingUp className="w-5 h-5 mr-2 text-primary-orange" />
                                            Profit Calculator
                                            <div className="relative ml-2">
                                                <button
                                                    onMouseEnter={() => setTooltipVisible('profit')}
                                                    onMouseLeave={() => setTooltipVisible(null)}
                                                    className="text-gray-400 hover:text-gray-600"
                                                >
                                                    <Info className="w-4 h-4" />
                                                </button>
                                                {tooltipVisible === 'profit' && (
                                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg w-64 z-10">
                                                        {tooltips.profit}
                                                    </div>
                                                )}
                                            </div>
                                        </h3>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700  mb-2">Symbol</label>
                                                <select
                                                    value={profitValues.symbol}
                                                    onChange={(e) => setProfitValues({ ...profitValues, symbol: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300  rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent  "
                                                >
                                                    <option value="EURUSD">EUR/USD</option>
                                                    <option value="GBPUSD">GBP/USD</option>
                                                    <option value="USDJPY">USD/JPY</option>
                                                    <option value="USDCHF">USD/CHF</option>
                                                    <option value="AUDUSD">AUD/USD</option>
                                                    <option value="USDCAD">USD/CAD</option>
                                                    <option value="NZDUSD">NZD/USD</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700  mb-2">Entry Price</label>
                                                <input
                                                    type="number"
                                                    step="0.00001"
                                                    min="0"
                                                    value={profitValues.entryPrice}
                                                    onChange={(e) => setProfitValues({ ...profitValues, entryPrice: parseFloat(e.target.value) || 0 })}
                                                    className="w-full px-3 py-2 border border-gray-300  rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent  "
                                                    placeholder="1.20000"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700  mb-2">Exit Price</label>
                                                <input
                                                    type="number"
                                                    step="0.00001"
                                                    min="0"
                                                    value={profitValues.exitPrice}
                                                    onChange={(e) => setProfitValues({ ...profitValues, exitPrice: parseFloat(e.target.value) || 0 })}
                                                    className="w-full px-3 py-2 border border-gray-300  rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent  "
                                                    placeholder="1.20500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700  mb-2">Lot Size</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0.01"
                                                    value={profitValues.lotSize}
                                                    onChange={(e) => setProfitValues({ ...profitValues, lotSize: parseFloat(e.target.value) || 0 })}
                                                    className="w-full px-3 py-2 border border-gray-300  rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent  "
                                                    placeholder="1.00"
                                                />
                                            </div>

                                            <button
                                                onClick={calculateProfit}
                                                className="w-full bg-primary-orange text-white py-2 px-4 rounded-lg hover:bg-primary-orange/90 transition font-medium"
                                            >
                                                Calculate Profit
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900  mb-4">Result</h4>
                                        <div className="bg-gray-50  rounded-lg p-4 min-h-32">
                                            {profitResult ? (
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-600 ">Price Movement:</span>
                                                        <span className="font-semibold text-gray-900 ">{profitResult.pips} pips</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-600 ">Direction:</span>
                                                        <span className={`font-semibold ${profitResult.isProfit ? 'text-green-600' : 'text-red-600'}`}>
                                                            {profitResult.direction}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center border-t pt-3">
                                                        <span className="text-gray-600 ">{profitResult.isProfit ? 'Profit' : 'Loss'}:</span>
                                                        <span className={`font-bold text-lg ${profitResult.isProfit ? 'text-green-600' : 'text-red-600'}`}>
                                                            ${profitResult.profit}
                                                        </span>
                                                    </div>
                                                    <div className="mt-3 pt-3 border-t text-xs text-gray-500  italic">
                                                        <strong>Educational Example:</strong> Profit/loss calculations exclude spreads, commissions, and swaps.
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-gray-600  text-center">Enter values and click calculate to see the profit/loss</p>
                                            )}
                                        </div>

                                        <div className="mt-4 p-4 bg-blue-50 /20 rounded-lg">
                                            <h5 className="font-medium text-blue-900  mb-2">Example:</h5>
                                            <p className="text-sm text-blue-800 ">Entry 1.2000 → Exit 1.2050 → Profit = $500 for 1 lot</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Margin Calculator */}
                            {activeTab === 'margin' && (
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900  mb-4 flex items-center">
                                            <DollarSign className="w-5 h-5 mr-2 text-primary-orange" />
                                            Margin Calculator
                                            <div className="relative ml-2">
                                                <button
                                                    onMouseEnter={() => setTooltipVisible('margin')}
                                                    onMouseLeave={() => setTooltipVisible(null)}
                                                    className="text-gray-400 hover:text-gray-600"
                                                >
                                                    <Info className="w-4 h-4" />
                                                </button>
                                                {tooltipVisible === 'margin' && (
                                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg w-64 z-10">
                                                        {tooltips.margin}
                                                    </div>
                                                )}
                                            </div>
                                        </h3>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700  mb-2">Symbol</label>
                                                <select
                                                    value={marginValues.symbol}
                                                    onChange={(e) => setMarginValues({ ...marginValues, symbol: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300  rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent  "
                                                >
                                                    <option value="EURUSD">EUR/USD</option>
                                                    <option value="GBPUSD">GBP/USD</option>
                                                    <option value="USDJPY">USD/JPY</option>
                                                    <option value="USDCHF">USD/CHF</option>
                                                    <option value="AUDUSD">AUD/USD</option>
                                                    <option value="USDCAD">USD/CAD</option>
                                                    <option value="NZDUSD">NZD/USD</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700  mb-2">Lot Size</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0.01"
                                                    value={marginValues.lotSize}
                                                    onChange={(e) => setMarginValues({ ...marginValues, lotSize: parseFloat(e.target.value) || 0 })}
                                                    className="w-full px-3 py-2 border border-gray-300  rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent  "
                                                    placeholder="1.00"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700  mb-2">Leverage</label>
                                                <select
                                                    value={marginValues.leverage}
                                                    onChange={(e) => setMarginValues({ ...marginValues, leverage: parseFloat(e.target.value) })}
                                                    className="w-full px-3 py-2 border border-gray-300  rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent  "
                                                >
                                                    <option value="30">1:30</option>
                                                    <option value="50">1:50</option>
                                                    <option value="100">1:100</option>
                                                    <option value="200">1:200</option>
                                                    <option value="500">1:500</option>
                                                    <option value="1000">1:1000</option>
                                                </select>
                                            </div>

                                            <button
                                                onClick={calculateMargin}
                                                className="w-full bg-primary-orange text-white py-2 px-4 rounded-lg hover:bg-primary-orange/90 transition font-medium"
                                            >
                                                Calculate Margin
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900  mb-4">Result</h4>
                                        <div className="bg-gray-50  rounded-lg p-4 min-h-32">
                                            {marginResult ? (
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-600 ">Notional Value:</span>
                                                        <span className="font-semibold text-gray-900 ">${marginResult.notionalValue}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-600 ">Leverage:</span>
                                                        <span className="font-semibold text-gray-900 ">1:{marginResult.leverage}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center border-t pt-3">
                                                        <span className="text-gray-600 ">Required Margin:</span>
                                                        <span className="font-bold text-primary-orange text-lg">${marginResult.margin}</span>
                                                    </div>
                                                    <div className="mt-3 pt-3 border-t text-xs text-gray-500  italic">
                                                        <strong>Educational Example:</strong> Margin requirements vary by broker and market conditions.
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-gray-600  text-center">Enter values and click calculate to see the required margin</p>
                                            )}
                                        </div>

                                        <div className="mt-4 p-4 bg-blue-50 /20 rounded-lg">
                                            <h5 className="font-medium text-blue-900  mb-2">Example:</h5>
                                            <p className="text-sm text-blue-800 ">1 lot EUR/USD, 1:100 leverage → $1,000 required</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Final Disclaimer */}
                    <div className="mt-12 bg-yellow-50 /20 border border-yellow-200  rounded-lg p-6">
                        <div className="flex">
                            <AlertTriangle className="w-5 h-5 text-yellow-600  mt-0.5 mr-3 flex-shrink-0" />
                            <div>
                                <h4 className="text-sm font-semibold text-yellow-800  mb-1">Important Disclaimer</h4>
                                <p className="text-sm text-yellow-700 ">
                                    These calculators are for educational purposes only and provide estimates based on the inputs provided.
                                    Actual trading results may vary due to market conditions, spreads, commissions, and other factors.
                                    Always consider your risk tolerance and consult with a financial advisor before trading.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
