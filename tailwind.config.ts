
import type {Config} from 'tailwindcss';

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
      padding: "var(--spacing-md)", // Use spacing token
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        // These are now primarily controlled by CSS variables in globals.css
        // but we can keep them here for Tailwind's IntelliSense and as fallbacks if needed.
        // Or define custom utilities if Tailwind's `font-*` classes are preferred over `font-family: var(...)`
        main: ['var(--font-main)', 'sans-serif'], // Lexend for body
        headline: ['var(--font-headline-comfortaa)', 'sans-serif'], // Comfortaa for headlines
        code: ['var(--font-main)', 'monospace'], // Assuming Lexend can also serve as a monospace alternative if needed
      },
      fontSize: { // Mapped to new tokens, Tailwind will generate classes like text-size-base
        'size-base': 'var(--font-size-base)',
        'size-small': 'var(--font-size-small)',
        'size-large': 'var(--font-size-large)',
        'size-h1': 'var(--font-size-h1)',
        'size-h2': 'var(--font-size-h2)',
      },
      fontWeight: { // Mapped to new tokens
        'weight-regular': 'var(--font-weight-regular)',
        'weight-bold': 'var(--font-weight-bold)',
      },
      spacing: { // Explicitly map spacing tokens if Tailwind's default scale isn't used directly
        'space-xs': 'var(--spacing-xs)',
        'space-sm': 'var(--spacing-sm)',
        'space-md': 'var(--spacing-md)',
        'space-lg': 'var(--spacing-lg)',
        'space-xl': 'var(--spacing-xl)',
      },
      colors: {
        // ShadCN variables, now sourced from :root in globals.css
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
        // Custom tokens directly usable in Tailwind, e.g., bg-background-main-custom
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

        // Command Observatory specific colors (if kept distinct)
        'observatory-bg': 'var(--observatory-bg)',
        'observatory-border': 'var(--observatory-border)',
      },
      boxShadow: {
        'observatory-inner': 'var(--observatory-shadow)',
        'panel-custom': 'var(--panel-box-shadow)', // For custom panel shadow
        'panel-outer': 'var(--shadow-panel-outer)', // New outer shadow utility
      },
      borderRadius: {
        lg: "var(--radius)", // main radius for larger elements: 12px -> 0.75rem
        md: "calc(var(--radius) - 2px)", // (12px - 2px = 10px)
        sm: "var(--border-radius-small)", // small radius for buttons/inputs: 8px -> 0.5rem
        main: "var(--border-radius-main)", // explicit 12px
        small: "var(--border-radius-small)", // explicit 8px
      },
      backdropFilter: { // Custom utility if needed, though direct application in CSS is also fine
        'panel': 'var(--panel-backdrop-filter)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'), // Added for prose styling
    function ({ addUtilities }: { addUtilities: any}) {
      addUtilities({
        '.panel-glass-effect': {
          'background': 'var(--panel-background-color)',
          'border': 'var(--border-width-main) solid var(--border-color-main)',
          'box-shadow': 'var(--panel-box-shadow)',
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
          // Default headline size might be h2 or h3
          'font-size': 'var(--font-size-h2)',
          'font-weight': 'var(--font-weight-bold)',
        },
      })
    }
  ],
} satisfies Config;
```