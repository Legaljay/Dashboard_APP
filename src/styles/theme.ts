export const theme = {
  colors: {
    primary: {
      DEFAULT: '#1774FD',
      50: '#E6F0FF',
      100: '#CCE0FF',
      200: '#99C2FF',
      300: '#66A3FF',
      400: '#3385FF',
      500: '#1774FD', // Main primary color
      600: '#0055CC',
      700: '#004099',
      800: '#002B66',
      900: '#001633',
    },
    gray: {
      DEFAULT: '#828282',
      50: '#F2F4F7',
      100: '#E5E5E5',
      200: '#CCCCCC',
      300: '#B3B3B3',
      400: '#999999',
      500: '#828282', // Main text color
      600: '#666666',
      700: '#4D4D4D',
      800: '#333333',
      900: '#101828', // Dark text color
    },
    destructive: {
      DEFAULT: '#FF4D4F',
      50: '#FFF1F0',
      100: '#FFCCC7',
      200: '#FFA39E',
      300: '#FF7875',
      400: '#FF4D4F',
      500: '#F5222D',
      600: '#CF1322',
      700: '#A8071A',
      800: '#820014',
      900: '#5C0011',
    },
    success: {
      DEFAULT: '#52C41A',
      50: '#F6FFED',
      100: '#D9F7BE',
      200: '#B7EB8F',
      300: '#95DE64',
      400: '#73D13D',
      500: '#52C41A',
      600: '#389E0D',
      700: '#237804',
      800: '#135200',
      900: '#092B00',
    },
    background: {
      light: '#FFFFFF',
      dark: '#1A1A1A',
    },
  },
  borderRadius: {
    sm: '0.25rem',    // 4px
    DEFAULT: '0.5rem', // 8px
    md: '0.75rem',    // 12px
    lg: '1rem',       // 16px
    xl: '1.5rem',     // 24px
    '2xl': '2rem',    // 32px
    full: '9999px',   // For circular elements
  },
  spacing: {
    0: '0',
    1: '0.25rem',     // 4px
    2: '0.5rem',      // 8px
    3: '0.75rem',     // 12px
    4: '1rem',        // 16px
    5: '1.25rem',     // 20px
    6: '1.5rem',      // 24px
    8: '2rem',        // 32px
    10: '2.5rem',     // 40px
    12: '3rem',       // 48px
    16: '4rem',       // 64px
    20: '5rem',       // 80px
    24: '6rem',       // 96px
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
    fontSize: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
} as const;

// Tailwind CSS configuration types
export type Theme = typeof theme;
export type ThemeColors = typeof theme.colors;
export type ColorScheme = keyof typeof theme.colors;
