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
        // Neumorphism (Soft UI) Core Tokens
        neu: {
          base: '#E0E5EC',
          fg: '#3D4852',
          muted: '#6B7280',
          accent: '#6C63FF',
          'accent-light': '#8B84FF',
          'accent-hover': '#5A52E0',
          secondary: '#38B2AC',
          'secondary-light': '#4FD1C5',
          danger: '#EF4444',
          'danger-hover': '#DC2626',
          success: '#10B981',
          warning: '#F59E0B',
          shadow: {
            light: 'rgba(255, 255, 255, 0.6)',
            dark: 'rgba(163, 177, 198, 0.65)',
          }
        },
        // Legacy palette mappings for backward compatibility
        midnight: {
          950: '#E0E5EC',
          900: '#E0E5EC',
          800: '#E0E5EC',
          700: '#D1D9E6',
          teal: '#38B2AC',
          glow: '#6C63FF',
          cyan: '#38B2AC',
        },
        sexy: {
          50: '#E0E5EC',
          100: '#E0E5EC',
          200: '#D1D9E6',
          300: '#8B84FF',
          500: '#6C63FF',
          600: '#5A52E0',
          700: '#483FB8',
          800: '#3D4852',
          900: '#2A333C',
        },
        brand: {
          50: '#E0E5EC',
          100: '#E0E5EC',
          200: '#D1D9E6',
          300: '#8B84FF',
          400: '#6C63FF',
          500: '#6C63FF',
          600: '#5A52E0',
          teal: '#38B2AC',
        },
      },
      boxShadow: {
        // Neumorphic dual shadows (dynamic via CSS variables for light & dark Soft UI)
        'neu-flat': 'var(--shadow-card)',
        'neu-extruded': 'var(--shadow-card)',
        'neu-extruded-hover': 'var(--shadow-card-hover)',
        'neu-extruded-sm': 'var(--shadow-sm)',
        'neu-extruded-lg': 'var(--shadow-lg)',
        'neu-inset': 'var(--shadow-inset)',
        'neu-inset-deep': 'var(--shadow-inset-deep)',
        'neu-inset-sm': 'var(--shadow-inset-sm)',
        'neu-pressed': 'var(--shadow-inset-sm)',
        'neu-accent': '6px 6px 14px rgba(108, 99, 255, 0.4), -6px -6px 14px var(--neu-shadow-light)',
        'neu-secondary': '6px 6px 14px rgba(56, 178, 172, 0.4), -6px -6px 14px var(--neu-shadow-light)',
      },
      borderRadius: {
        'neu-card': '32px',
        'neu-modal': '24px',
        'neu-btn': '16px',
        'neu-well': '12px',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-8px) scale(1.01)' },
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
