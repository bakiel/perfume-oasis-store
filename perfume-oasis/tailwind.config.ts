import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors
        emerald: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#0E5C4A', // Primary brand color (Emerald Palm)
        },
        gold: {
          300: '#D4AF37',
          400: '#C8A95B', // Accent color (Royal Gold)
          500: '#B39A4C',
          600: '#9E863D',
        },
        sand: {
          50: '#F6F3EF', // Background color (Soft Sand)
          100: '#EDE7DD',
          200: '#E0D5C7',
        },
        charcoal: {
          700: '#4A4A4A',
          800: '#3A3A3A',
          900: '#2C2C2C', // Text color (Deep Charcoal)
        },
        
        // Legacy colors (keeping for compatibility)
        'emerald-palm': '#0E5C4A',
        'royal-gold': '#C8A95B',
        'soft-sand': '#F6F3EF',
        'deep-charcoal': '#2C2C2C',
        
        // UI colours
        'pearl': '#FAF9F7',
        'champagne': '#F5E6D3',
        'bronze': '#B8956A',
        'forest': '#0A4236',
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
        'accent': ['Italiana', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'pulse-gold': 'pulse-gold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pulse-gold': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.8' },
        },
      },
      backgroundImage: {
        'emerald-gradient': 'linear-gradient(135deg, #0E5C4A 0%, #0A4236 100%)',
        'gold-gradient': 'linear-gradient(135deg, #C8A95B 0%, #B39A4C 100%)',
        'sand-gradient': 'linear-gradient(135deg, #F6F3EF 0%, #EDE7DD 100%)',
      },
    },
  },
  plugins: [],
};
export default config;