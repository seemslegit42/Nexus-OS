import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: 'var(--spacing-md)', // Use spacing token
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        main: ['var(--font-main)', 'sans-serif'],
        headline: ['var(--font-headline)', 'sans-serif'],
        code: ['var(--font-main)', 'monospace'],
      },
      fontSize: {
        'size-base': 'var(--font-size-base)',
        'size-small': 'var(--font-size-small)',
        'size-large': 'var(--font-size-large)',
        'size-h1': 'var(--font-size-h1)',
        'size-h2': 'var(--font-size-h2)',
      },
      fontWeight: {
        'weight-regular': 'var(--font-weight-regular)',
        'weight-bold': 'var(--font-weight-bold)',
      },
      spacing: {
        'space-xs': 'var(--spacing-xs)',
        'space-sm': 'var(--spacing-sm)',
        'space-md': 'var(--spacing-md)',
        'space-lg': 'var(--spacing-lg)',
        'space-xl': 'var(--spacing-xl)',
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        'background-main-custom': 'var(--background-main-color)',
        'panel-background-custom': 'var(--panel-background-color)',
        'accent-primary-custom': 'var(--accent-primary-color)',
        'accent-secondary-custom': 'var(--accent-secondary-color)',
        'text-primary-custom': 'var(--text-primary-color)',
        'text-secondary-custom': 'var(--text-secondary-color)',
        'status-success-custom': 'var(--status-success-color)',
        'status-in-progress-custom': 'var(--status-in-progress-color)',
        'status-error-custom': 'var(--status-error-color)',
        'border-color-main-custom': 'var(--border-color-main)',
        'observatory-bg': 'var(--observatory-bg)',
        'observatory-border': 'var(--observatory-border)',
      },
      boxShadow: {
        'observatory-inner': 'var(--observatory-shadow)',
        'panel-custom': 'var(--panel-box-shadow)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'var(--border-radius-small)',
        main: 'var(--border-radius-main)',
        small: 'var(--border-radius-small)',
      },
      backdropFilter: {
        panel: 'var(--panel-backdrop-filter)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'pulse-glow-purple': {
          '0%, 100%': {
            boxShadow:
              'var(--panel-box-shadow), 0 8px 32px hsla(var(--primary-hsl) / 0.1), 0 4px 12px hsla(var(--primary-hsl) / 0.08)',
          },
          '50%': {
            boxShadow:
              'var(--panel-box-shadow), 0 8px 45px hsla(var(--primary-hsl) / 0.18), 0 4px 20px hsla(var(--primary-hsl) / 0.12)',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-glow-purple': 'pulse-glow-purple 4s infinite ease-in-out',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
    function ({ addUtilities }: { addUtilities: any }) {
      addUtilities({
        '.panel-glass-effect': {
          background: 'var(--panel-background-color)',
          border: 'var(--border-width-main) solid var(--border-color-main)',
          'box-shadow':
            'var(--panel-box-shadow), 0 8px 32px hsla(var(--primary-hsl) / 0.1), 0 4px 12px hsla(var(--primary-hsl) / 0.08)', // Added static outer glow here
          'backdrop-filter': 'var(--panel-backdrop-filter)',
          'border-radius': 'var(--border-radius-main)',
        },
        '.text-body': {
          'font-family': 'var(--font-main)',
          'font-size': 'var(--font-size-base)',
          'font-weight': 'var(--font-weight-regular)',
        },
        '.text-headline': {
          'font-family': 'var(--font-headline-comfortaa)',
          'font-size': 'var(--font-size-h2)',
          'font-weight': 'var(--font-weight-bold)',
        },
      });
    },
  ],
} satisfies Config;
