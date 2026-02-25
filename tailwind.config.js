import { heroui } from "@heroui/theme/plugin";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
        "./node_modules/@tremor/react/dist/**/*.{js,ts,jsx,tsx}", // Specific Tremor path
    ],
    theme: {
        extend: {
            colors: {
                // Landing page custom colors
                'bg-base': '#F0F0F1',
                'bg-dark': '#1C1D1F',
                'bg-dark-hover': '#2C2D31',

                slate: {
                    800: "#2C2D31", // Neutral dark gray for hover/secondary
                    900: "#1C1D1F", // Sidebar/Navbar color requested by user
                },
                tremor: {
                    brand: {
                        faint: "#eff6ff", // blue-50
                        muted: "#bfdbfe", // blue-200
                        subtle: "#60a5fa", // blue-400
                        DEFAULT: "#3b82f6", // blue-500
                        emphasis: "#1d4ed8", // blue-700
                        inverted: "#ffffff", // white
                    },
                    background: {
                        muted: "#f9fafb", // gray-50
                        subtle: "#f3f4f6", // gray-100
                        DEFAULT: "#ffffff", // white
                        emphasis: "#374151", // gray-700
                    },
                    border: {
                        DEFAULT: "#e5e7eb", // gray-200
                    },
                    ring: {
                        DEFAULT: "#e5e7eb", // gray-200
                    },
                    content: {
                        subtle: "#9ca3af", // gray-400
                        DEFAULT: "#6b7280", // gray-500
                        emphasis: "#374151", // gray-700
                        strong: "#111827", // gray-900
                        inverted: "#ffffff", // white
                    },
                },
            },
            keyframes: {
                "pulse-slow": {
                    "0%, 100%": { opacity: 1 },
                    "50%": { opacity: 0.5 },
                },
                "bounce-slow": {
                    "0%, 100%": { transform: "translateY(-5%)" },
                    "50%": { transform: "translateY(5%)" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-10px)" },
                },
                'fade-up': {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
            animation: {
                "pulse-slow": "pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                "bounce-slow": "bounce-slow 3s infinite",
                "float": "float 3s ease-in-out infinite",
                'fade-up': 'fade-up 0.6s ease-out forwards',
            },
        },
    },
    darkMode: "class",
    safelist: [
        {
            pattern:
                /^(bg-|text-|border-|ring-|stroke-|fill-|icon-)+(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900|950)$/,
            variants: ["hover", "ui-selected"],
        },
        {
            pattern:
                /^(ring-|text-|border-|bg-)+(tremor)-(brand|background|border|ring|content)(-.+)?$/,
        },
    ],
    plugins: [heroui()],
};
