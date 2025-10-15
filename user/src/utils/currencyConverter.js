const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes cache
const CACHE_KEY_PREFIX = 'exchange_rates_';

// Multiple free API providers as fallbacks
const API_PROVIDERS = [
    {
        name: 'exchangerate-api',
        url: (base) => `https://api.exchangerate-api.com/v4/latest/${base}`,
        transform: (data) => data.rates,
    },
    {
        name: 'fawazahmed0',
        url: (base) => `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${base.toLowerCase()}.json`,
        transform: (data) => {
            const baseKey = Object.keys(data)[0];
            return data[baseKey];
        },
    },
    {
        name: 'frankfurter',
        url: (base) => `https://api.frankfurter.dev/latest?from=${base}`,
        transform: (data) => ({ [data.base]: 1, ...data.rates }),
    },
    {
        name: 'exchangerate-host',
        url: (base) => `https://api.exchangerate.host/latest?base=${base}`,
        transform: (data) => data.rates,
    }
];

// Default fallback rates (updated as of Sept 2025)
const FALLBACK_RATES = {
    USD: { INR: 83.25, EUR: 0.85, USD: 1 },
    EUR: { INR: 97.94, USD: 1.18, EUR: 1 },
    INR: { USD: 0.012, EUR: 0.0102, INR: 1 },
};

class CurrencyConverter {
    constructor() {
        this.cache = new Map();
        this.lastFetchTime = new Map();
    }

    // Get cache key
    getCacheKey(baseCurrency) {
        return `${CACHE_KEY_PREFIX}${baseCurrency}`;
    }

    // Check if cache is still valid
    isCacheValid(baseCurrency) {
        const lastFetch = this.lastFetchTime.get(baseCurrency);
        return lastFetch && (Date.now() - lastFetch) < CACHE_DURATION;
    }

    // Get rates from cache
    getCachedRates(baseCurrency) {
        if (this.isCacheValid(baseCurrency)) {
            return this.cache.get(baseCurrency);
        }
        return null;
    }

    // Store rates in cache
    setCachedRates(baseCurrency, rates) {
        this.cache.set(baseCurrency, rates);
        this.lastFetchTime.set(baseCurrency, Date.now());

        // Also store in localStorage for persistence
        try {
            localStorage.setItem(this.getCacheKey(baseCurrency), JSON.stringify({
                rates,
                timestamp: Date.now()
            }));
        } catch (error) {
            console.warn('Failed to cache exchange rates in localStorage:', error);
        }
    }

    // Get rates from localStorage
    getStoredRates(baseCurrency) {
        try {
            const stored = localStorage.getItem(this.getCacheKey(baseCurrency));
            if (stored) {
                const { rates, timestamp } = JSON.parse(stored);
                if (Date.now() - timestamp < CACHE_DURATION) {
                    return rates;
                }
            }
        } catch (error) {
            console.warn('Failed to retrieve cached rates from localStorage:', error);
        }
        return null;
    }

    // Fetch rates from API with fallback providers
    async fetchRatesFromAPI(baseCurrency) {
        for (const provider of API_PROVIDERS) {
            try {
                const response = await fetch(provider.url(baseCurrency), {
                    headers: {
                        'Accept': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                const rates = provider.transform(data);

                return rates;

            } catch (error) {
                console.warn(`${provider.name} API failed:`, error.message);
                continue; // Try next provider
            }
        }

        throw new Error('All API providers failed');
    }

    // Get exchange rates with multiple fallbacks
    async getExchangeRates(baseCurrency = 'INR') {
        const upperBase = baseCurrency.toUpperCase();

        // 1. Try memory cache first
        const cachedRates = this.getCachedRates(upperBase);
        if (cachedRates) {
            return cachedRates;
        }

        // 2. Try localStorage cache
        const storedRates = this.getStoredRates(upperBase);
        if (storedRates) {
            this.cache.set(upperBase, storedRates);
            this.lastFetchTime.set(upperBase, Date.now());
            return storedRates;
        }

        try {
            // 3. Try fetching from APIs
            const rates = await this.fetchRatesFromAPI(upperBase);
            this.setCachedRates(upperBase, rates);
            return rates;

        } catch (error) {
            console.error('All exchange rate APIs failed:', error.message);

            // 4. Use fallback rates as last resort
            return FALLBACK_RATES[upperBase] || FALLBACK_RATES.INR;
        }
    }

    async convertCurrency(amount, fromCurrency, toCurrency) {
        if (fromCurrency === toCurrency) {
            return parseFloat(amount);
        }

        try {
            const rates = await this.getExchangeRates(fromCurrency);
            const rate = rates[toCurrency.toUpperCase()];

            if (!rate) {
                console.warn(`Rate not found for ${fromCurrency} to ${toCurrency}, trying fallback`);
                throw new Error(`Exchange rate not found for ${fromCurrency} to ${toCurrency}`);
            }

            const result = parseFloat(amount) * rate;
            return result;

        } catch (error) {
            console.error('Currency conversion failed:', error);

            // Enhanced fallback with better USD handling
            const enhancedFallbackRates = {
                USD: { INR: 83.25, EUR: 0.85, USD: 1 },
                EUR: { INR: 97.94, USD: 1.18, EUR: 1 },
                INR: { USD: 0.012, EUR: 0.0102, INR: 1 },
            };

            const fallbackRate = enhancedFallbackRates[fromCurrency]?.[toCurrency];
            if (fallbackRate) {
                const result = parseFloat(amount) * fallbackRate;
                return result;
            }

            // Return original amount if all else fails
            return parseFloat(amount);
        }
    }

    // Get formatted conversion with currency symbols
    async getFormattedConversion(amount, fromCurrency, toCurrency) {
        const convertedAmount = await this.convertCurrency(amount, fromCurrency, toCurrency);

        const currencySymbols = {
            INR: '₹',
            USD: '$',
            EUR: '€',
            GBP: '£',
            JPY: '¥',
        };

        const fromSymbol = currencySymbols[fromCurrency.toUpperCase()] || fromCurrency;
        const toSymbol = currencySymbols[toCurrency.toUpperCase()] || toCurrency;

        return {
            originalAmount: parseFloat(amount),
            convertedAmount: convertedAmount,
            fromCurrency: fromCurrency.toUpperCase(),
            toCurrency: toCurrency.toUpperCase(),
            fromSymbol,
            toSymbol,
            formatted: `${fromSymbol}${amount} ${fromCurrency} = ${toSymbol}${convertedAmount.toFixed(2)} ${toCurrency}`,
            rate: convertedAmount / parseFloat(amount)
        };
    }

    // Clear cache (useful for testing or manual refresh)
    clearCache() {
        this.cache.clear();
        this.lastFetchTime.clear();

        // Clear localStorage cache
        try {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith(CACHE_KEY_PREFIX)) {
                    localStorage.removeItem(key);
                }
            });
        } catch (error) {
            console.warn('Failed to clear localStorage cache:', error);
        }
    }
}

// Create singleton instance
const currencyConverter = new CurrencyConverter();

// Export functions for easy use
export const getExchangeRates = (baseCurrency) => currencyConverter.getExchangeRates(baseCurrency);
export const convertCurrency = (amount, from, to) => currencyConverter.convertCurrency(amount, from, to);
export const getFormattedConversion = (amount, from, to) => currencyConverter.getFormattedConversion(amount, from, to);
export const clearCurrencyCache = () => currencyConverter.clearCache();

export default currencyConverter;
