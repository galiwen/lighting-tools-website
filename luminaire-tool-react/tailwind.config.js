/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Extracted from current CSS custom properties
        'bg-primary': '#FAFBFC',
        'bg-secondary': '#FFFFFF',
        'metric-green': '#6B8E4E',
        'metric-blue': '#5B9BD5',
        'metric-purple': '#9B7EC7',
        'metric-peach': '#E8A87C',
        'chart-primary': '#E07B68',
        'chart-trend': '#2C3E50',
        'text-primary': '#1A202C',
        'text-secondary': '#718096',
        'text-light': '#A0AEC0',
        'border': '#E2E8F0',
        'border-light': '#F0F4F8',
        'success': '#48BB78',
        'error': '#F56565',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        'xxl': '48px',
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
        'md': '0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05)',
        'lg': '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)',
      },
      transitionDuration: {
        'fast': '150ms',
        'base': '250ms',
        'slow': '350ms',
      },
      fontFamily: {
        'inter': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}