import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-serif)', 'Merriweather', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['3rem', { lineHeight: '1.2', fontWeight: '700' }],
        'page-title': ['2.25rem', { lineHeight: '1.3', fontWeight: '700' }],
        'section': ['1.875rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-large': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-small': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      lineHeight: {
        'tight': '1.2',
        'snug': '1.3',
        'normal': '1.5',
        'relaxed': '1.6',
        'loose': '1.8',
      },
      colors: {
        neutral: {
          50: '#fafaf9',   // Off-white background
          100: '#f5f5f4',  // Light background
          200: '#e7e5e4',  // Subtle borders
          300: '#d6d3d1',  // Borders
          400: '#a8a29e',  // Disabled text
          500: '#78716c',  // Secondary text
          600: '#57534e',  // Body text
          700: '#44403c',  // Headings
          800: '#292524',  // Dark headings
          900: '#1c1917',  // Maximum contrast
        },
        accent: {
          light: '#60a5fa',   // Light blue for hover states
          DEFAULT: '#2563eb', // Primary blue for links and CTAs (WCAG AA compliant)
          dark: '#1e40af',    // Dark blue for active states
        },
        background: '#fafaf9',      // Page background (neutral-50)
        foreground: '#1c1917',      // Primary text (neutral-900)
        muted: '#f5f5f4',           // Card backgrounds (neutral-100)
        mutedForeground: '#57534e', // Secondary text (neutral-600)
        border: '#e7e5e4',          // Borders and dividers (neutral-200)
      },
      // Spacing scale using 0.5rem (8px) base unit
      spacing: {
        '0.5': '0.125rem',  // 2px
        '1': '0.25rem',     // 4px
        '1.5': '0.375rem',  // 6px
        '2': '0.5rem',      // 8px (base unit)
        '2.5': '0.625rem',  // 10px
        '3': '0.75rem',     // 12px
        '3.5': '0.875rem',  // 14px
        '4': '1rem',        // 16px
        '5': '1.25rem',     // 20px
        '6': '1.5rem',      // 24px
        '7': '1.75rem',     // 28px
        '8': '2rem',        // 32px
        '9': '2.25rem',     // 36px
        '10': '2.5rem',     // 40px
        '11': '2.75rem',    // 44px
        '12': '3rem',       // 48px
        '14': '3.5rem',     // 56px
        '16': '4rem',       // 64px
        '18': '4.5rem',     // 72px
        '20': '5rem',       // 80px
        '24': '6rem',       // 96px
        '28': '7rem',       // 112px
        '32': '8rem',       // 128px
      },
      // Responsive breakpoints
      screens: {
        'sm': '640px',   // Mobile landscape / small tablet
        'md': '768px',   // Tablet
        'lg': '1024px',  // Desktop
        'xl': '1280px',  // Large desktop
        '2xl': '1536px', // Extra large desktop
      },
      // Container max-widths
      maxWidth: {
        'container': '1280px',  // General container max-width
        'reading': '800px',     // Reading content max-width
      },
      // Container configuration
      container: {
        center: true,
        padding: {
          DEFAULT: '1.5rem',  // 24px on mobile
          sm: '2rem',         // 32px on small screens
          lg: '3rem',         // 48px on large screens
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1280px',  // Cap at 1280px even on 2xl screens
        },
      },
      // Animation keyframes
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      // Animation utilities
      animation: {
        'fade-in': 'fade-in 0.6s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
