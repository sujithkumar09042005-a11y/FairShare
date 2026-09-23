import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '420px',
      },
      colors: {
        // Minimalist Modern Design Tokens
        background: '#FAFAFA',
        foreground: '#0F172A',
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#0F172A',
        },
        muted: {
          DEFAULT: '#F1F5F9',
          foreground: '#64748B',
        },
        accent: {
          DEFAULT: '#0052FF',
          secondary: '#4D7CFF',
          foreground: '#FFFFFF',
        },
        primary: {
          DEFAULT: '#0052FF',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#F1F5F9',
          foreground: '#0F172A',
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
        border: '#E2E8F0',
        ring: '#0052FF',

        // Backward compatibility mappings
        neu: {
          base: '#FAFAFA',
          fg: '#0F172A',
          muted: '#64748B',
          accent: '#0052FF',
          'accent-light': '#4D7CFF',
          'accent-hover': '#0043D6',
          secondary: '#F1F5F9',
          'secondary-light': '#FFFFFF',
          danger: '#EF4444',
          'danger-hover': '#DC2626',
          success: '#10B981',
          warning: '#F59E0B',
          shadow: {
            light: 'rgba(255, 255, 255, 0.9)',
            dark: 'rgba(0, 0, 0, 0.05)',
          }
        },
        fintech: {
          bg: '#FAFAFA',
          card: '#FFFFFF',
          dark: '#0F172A',
          black: '#0F172A',
          muted: '#64748B',
          subtle: '#94A3B8',
        },
        brand: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#0052FF',
          600: '#0047DB',
          teal: '#0052FF',
        },
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.07)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.08)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        'accent': '0 4px 14px rgba(0, 82, 255, 0.25)',
        'accent-lg': '0 8px 24px rgba(0, 82, 255, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 82, 255, 0.08)',
        'glass-hover': '0 12px 40px 0 rgba(0, 82, 255, 0.16)',
        'neu-flat': '0 4px 20px rgba(0, 0, 0, 0.04)',
        'neu-extruded': '0 8px 24px rgba(0, 0, 0, 0.06)',
        'neu-extruded-hover': '0 12px 32px rgba(0, 82, 255, 0.12)',
        'neu-inset': 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        'pill': '9999px',
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
        'neu-card': '20px',
        'neu-modal': '24px',
        'neu-btn': '12px',
        'neu-well': '12px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Calistoga', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 5s ease-in-out infinite',
        'spin-slow': 'spin 60s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      }
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant('light', '.light &');
    }),
  ],
};
