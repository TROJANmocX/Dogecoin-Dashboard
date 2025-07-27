import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background, 0 0% 100%))',
        foreground: 'hsl(var(--foreground, 0 0% 0%))',
        card: {
          DEFAULT: 'hsl(var(--card, 0 0% 10%))',
          foreground: 'hsl(var(--card-foreground, 0 0% 90%))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover, 0 0% 12%))',
          foreground: 'hsl(var(--popover-foreground, 0 0% 90%))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary, 160 100% 50%))',
          foreground: 'hsl(var(--primary-foreground, 0 0% 10%))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary, 240 5% 16%))',
          foreground: 'hsl(var(--secondary-foreground, 0 0% 90%))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted, 240 5% 20%))',
          foreground: 'hsl(var(--muted-foreground, 0 0% 60%))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent, 280 50% 40%))',
          foreground: 'hsl(var(--accent-foreground, 0 0% 100%))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive, 0 100% 60%))',
          foreground: 'hsl(var(--destructive-foreground, 0 0% 100%))'
        },
        border: 'hsl(var(--border, 0 0% 20%))',
        input: 'hsl(var(--input, 0 0% 24%))',
        ring: 'hsl(var(--ring, 0 0% 80%))',
        chart: {
          '1': 'hsl(var(--chart-1, 200 100% 50%))',
          '2': 'hsl(var(--chart-2, 50 100% 50%))',
          '3': 'hsl(var(--chart-3, 120 100% 50%))',
          '4': 'hsl(var(--chart-4, 340 100% 50%))',
          '5': 'hsl(var(--chart-5, 280 100% 50%))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background, 0 0% 8%))',
          foreground: 'hsl(var(--sidebar-foreground, 0 0% 90%))',
          primary: 'hsl(var(--sidebar-primary, 160 100% 40%))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground, 0 0% 100%))',
          accent: 'hsl(var(--sidebar-accent, 280 100% 40%))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground, 0 0% 100%))',
          border: 'hsl(var(--sidebar-border, 0 0% 20%))',
          ring: 'hsl(var(--sidebar-ring, 0 0% 70%))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      zIndex: {
        max: '9999',
        modal: '1050'
      },
      spacing: {
        '18': '4.5rem'
      },
      screens: {
        xs: '420px'
      },
      boxShadow: {
        soft: '0 4px 24px rgba(0, 0, 0, 0.08)'
      }
    }
  },
  plugins: [
    require("tailwindcss-animate"),
    function ({ addUtilities, theme }) {
      addUtilities({
        '.sidebar-ring': {
          ringColor: theme('colors.sidebar.ring'),
          borderColor: theme('colors.sidebar.border'),
        }
      })
    }
  ]
};

export default config;
