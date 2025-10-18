/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                // Primary Colors
                primary: '#f97316',
                secondary: '#eab308',

                // Base Colors
                white: '#ffffff',
                black: '#000000',

                // Background Colors
                'bg-light': '#fef3c7',
                'bg-dark': '#111111',
                'surface-light': '#ffffff',
                'surface-dark': '#0f172a',

                // Text Colors
                'text-light': '#0f172a',
                'text-dark': '#fefefe',
                'text-muted': '#64748b',

                // Input Colors
                'input-light': '#f8fafc',
                'input-dark': '#1e293b',
                'border-light': '#e2e8f0',
                'border-dark': '#334155',

                // Status Colors
                success: '#10b981',
                danger: '#ef4444',
                warning: '#f59e0b',

                // Indian Theme
                saffron: '#ff9933',
                green: '#138808',
            },

            spacing: {
                'safe-top': '44px',
                'safe-bottom': '34px',
            },

            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
                '3xl': '2rem',
            },

            fontFamily: {
                'primary': ['System'],
            },
        },
    },
    plugins: [],
}
