module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          soft: 'rgba(245, 158, 11, 0.1)',
        },
        dark: {
          primary: '#0A0A0B',
          secondary: '#1C1C1E',
          tertiary: '#2C2C2E',
          light: '#3A3A3C',
          lighter: '#48484A',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#A1A1AA',
          tertiary: '#71717A',
        }
      },
    },
  },
  plugins: [],
};
