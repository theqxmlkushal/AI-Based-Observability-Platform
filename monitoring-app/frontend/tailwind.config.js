/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Yellow shades
        primary: {
          50: 'hsl(48, 100%, 96%)',
          100: 'hsl(48, 96%, 89%)',
          200: 'hsl(48, 97%, 77%)',
          300: 'hsl(46, 97%, 65%)',
          400: 'hsl(43, 96%, 56%)',
          500: 'hsl(38, 92%, 50%)',  // Main yellow
          600: 'hsl(32, 95%, 44%)',
          700: 'hsl(26, 90%, 37%)',
          800: 'hsl(23, 83%, 31%)',
          900: 'hsl(22, 78%, 26%)',
        },
        // Black/Gray shades
        dark: {
          50: 'hsl(0, 0%, 95%)',
          100: 'hsl(0, 0%, 85%)',
          200: 'hsl(0, 0%, 70%)',
          300: 'hsl(0, 0%, 50%)',
          400: 'hsl(0, 0%, 35%)',
          500: 'hsl(0, 0%, 25%)',
          600: 'hsl(0, 0%, 18%)',
          700: 'hsl(0, 0%, 12%)',
          800: 'hsl(0, 0%, 8%)',
          900: 'hsl(0, 0%, 4%)',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, hsl(38, 92%, 50%) 0%, hsl(43, 96%, 56%) 100%)',
        'gradient-dark': 'linear-gradient(135deg, hsl(0, 0%, 8%) 0%, hsl(0, 0%, 12%) 100%)',
      },
      boxShadow: {
        'glow-yellow': '0 0 20px hsla(38, 92%, 50%, 0.3)',
        'glow-yellow-lg': '0 0 40px hsla(38, 92%, 50%, 0.4)',
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-dark-900',
    'bg-dark-800',
    'bg-dark-700',
    'bg-dark-600',
    'bg-dark-500',
    'bg-primary-500',
    'bg-primary-400',
    'bg-primary-300',
    'border-dark-700',
    'border-dark-600',
    'border-primary-500',
    'border-primary-600',
    'border-primary-700',
    'text-dark-50',
    'text-dark-100',
    'text-dark-200',
    'text-dark-300',
    'text-primary-300',
    'text-primary-400',
    'text-primary-500',
    'text-primary-600',
  ],
}