/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 'currentBgTheme': "#2B2B2B",
        'currentBgTheme': "#09090B",
        'secondaryBgTheme': "#212123",
        'borderColors': '#C5C5C5',
        'white': '#FFF',
        'black': '#000'
      },
      animation: {
        'spin-slow': 'spin 16s linear infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
