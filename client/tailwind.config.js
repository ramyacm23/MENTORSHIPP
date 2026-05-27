/** @type {import('tailwindcss').Config} */
const withOpacity = (variableName) => {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variableName}))`;
    }

    return `rgb(var(${variableName}) / ${opacityValue})`;
  };
};

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: withOpacity('--background'),
        'surface-dim': withOpacity('--surface-dim'),
        surface: withOpacity('--surface'),
        'surface-container': withOpacity('--surface-container'),
        'surface-container-low': withOpacity('--surface-container-low'),
        'surface-container-high': withOpacity('--surface-container-high'),
        'surface-container-highest': withOpacity('--surface-container-highest'),
        'on-background': withOpacity('--on-background'),
        'on-surface': withOpacity('--on-surface'),
        'on-surface-variant': withOpacity('--on-surface-variant'),
        primary: withOpacity('--primary'),
        'primary-container': withOpacity('--primary-container'),
        'on-primary': withOpacity('--on-primary'),
        secondary: withOpacity('--secondary'),
        tertiary: withOpacity('--tertiary'),
        outline: withOpacity('--outline'),
        error: withOpacity('--error'),
        'surface-tint': withOpacity('--primary'),
      },
      borderRadius: {
        DEFAULT: '8px',
        lg: '12px',
        xl: '16px',
        full: '9999px',
      },
      fontFamily: {
        headline: ['Manrope'],
        body: ['Inter'],
        label: ['Inter'],
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
