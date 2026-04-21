import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',

  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './pages/**/*.{ts,tsx}'],

  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: {
        '2xl': '1280px',
      },
    },

    extend: {
      colors: {
        /* Core semantic tokens */
        background: {
          DEFAULT: 'var(--color-background)',
        },
        foreground: {
          DEFAULT: 'var(--color-foreground)',
        },

        border: {
          DEFAULT: 'var(--color-border)',
        },

        ring: {
          DEFAULT: 'var(--color-ring)',
        },

        primary: {
          DEFAULT: 'var(--color-primary)',
          foreground: 'var(--color-primary-foreground)',
        },

        accent: {
          DEFAULT: 'var(--color-accent)',
          foreground: 'var(--color-accent-foreground)',
        },

        muted: {
          DEFAULT: 'var(--color-muted)',
          foreground: 'var(--color-muted-foreground)',
        },

        surface: {
          DEFAULT: 'var(--color-surface)',
        },
      },

      borderRadius: {
        lg: 'var(--radius-lg)',
        md: 'var(--radius-md)',
        sm: 'var(--radius-sm)',
      },

      boxShadow: {
        soft: 'var(--shadow-soft)',
        elevation: 'var(--shadow-elevation)',
      },

      fontFamily: {
        sans: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
    },
  },

  plugins: [],
}

export default config
