import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  darkMode: 'selector',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    borderRadius: {
      lg: '22px',
      md: '14px',
      sm: '6px',
      none: '0',
    },
    fontSize: {
      'h1-mobile-lg': [
        '2rem',
        { lineHeight: '1.15em', letterSpacing: '-0.02em', fontWeight: 700 },
      ],
      'h1-mobile-sm': [
        '1.476rem',
        { lineHeight: '1.15em', letterSpacing: '-0.02em', fontWeight: 700 },
      ],
      'h2-mobile': [
        '1.383rem',
        { lineHeight: '1.15em', letterSpacing: '-0.02em', fontWeight: 700 },
      ],
      'h3-mobile': [
        '1.296rem',
        { lineHeight: '1.15em', letterSpacing: '-0.02em', fontWeight: 700 },
      ],
      'h4-mobile': [
        '1.215rem',
        { lineHeight: '1.15em', letterSpacing: '-0.02em', fontWeight: 700 },
      ],
      'h5-mobile': [
        '1.139rem',
        { lineHeight: '1.15em', letterSpacing: '-0.02em', fontWeight: 400 },
      ],
      'h6-mobile': [
        '1.067rem',
        { lineHeight: '1.15em', letterSpacing: '-0.02em', fontWeight: 400 },
      ],
      'h1-desktop-lg': [
        '4.5rem',
        { lineHeight: '1.15em', letterSpacing: '-0.02em', fontWeight: 700 },
      ],
      'h1-desktop-sm': [
        '2.988rem',
        { lineHeight: '1.15em', letterSpacing: '-0.02em', fontWeight: 700 },
      ],
      'h2-desktop': [
        '2.488rem',
        { lineHeight: '1.15em', letterSpacing: '-0.02em', fontWeight: 700 },
      ],
      'h3-desktop': [
        '2.074rem',
        { lineHeight: '1.15em', letterSpacing: '-0.02em', fontWeight: 700 },
      ],
      'h4-desktop': [
        '1.728rem',
        { lineHeight: '1.15em', letterSpacing: '-0.02em', fontWeight: 700 },
      ],
      'h5-desktop': [
        '1.44rem',
        { lineHeight: '1.15em', letterSpacing: '-0.02em', fontWeight: 400 },
      ],
      'h6-desktop': [
        '1.2rem',
        { lineHeight: '1.15em', letterSpacing: '-0.02em', fontWeight: 400 },
      ],
      button: [
        '1rem',
        { lineHeight: '1.6em', letterSpacing: '-0.02em', fontWeight: 700 },
      ],
      p: ['1rem', { lineHeight: '1.6em', fontWeight: 400 }],
      'small-lg': ['0.831rem', { lineHeight: '1.6em', fontWeight: 400 }],
      'small-lg-bold': ['0.831rem', { lineHeight: '1.6em', fontWeight: 700 }],
      'small-sm': ['0.694rem', { lineHeight: '1.6em', fontWeight: 400 }],
      'small-sm-bold': ['0.694rem', { lineHeight: '1.6em', fontWeight: 700 }],
    },
    extend: {
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        xxl: '2.5rem',
        'content-width': '1080px',
      },
      boxShadow: {
        paper: '0px 4px 17px rgba(0, 0, 0, 0.05)',
      },
      backdropBlur: {
        default: '17px',
      },
      colors: {
        primary: 'rgb(var(--color-primary))',
        secondary: 'rgb(var(--color-secondary))',
        accent: 'rgb(var(--color-accent))',
        background: 'rgb(var(--color-background))',
        page: 'rgb(var(--color-page))',
        text: 'rgb(var(--color-text))',
        neutral: 'rgb(var(--color-neutral))',
        important: 'rgb(var(--color-important))',
        highlight: 'rgb(var(--color-highlight))',
        good: 'rgb(var(--color-good))',
        ok: 'rgb(var(--color-ok))',
        bad: 'rgb(var(--color-bad))',
        border: 'rgb(var(--color-border)/ 0.5)',
        'hovered-border': 'rgb(var(--color-hovered-border)/ 0.5)',
        dark: {
          primary: 'rgb(var(--color-dark-primary))',
          secondary: 'rgb(var(--color-dark-secondary))',
          accent: 'rgb(var(--color-dark-accent))',
          background: 'rgb(var(--color-dark-background))',
          page: 'rgb(var(--color-dark-page))',
          text: 'rgb(var(--color-dark-text))',
          neutral: 'rgb(var(--color-dark-neutral))',
          important: 'rgb(var(--color-dark-important))',
          highlight: 'rgb(var(--color-dark-highlight))',
          good: 'rgb(var(--color-dark-good))',
          ok: 'rgb(var(--color-dark-ok))',
          bad: 'rgb(var(--color-dark-bad))',
          border: 'rgb(var(--color-dark-border)/ 0.5)',
          'hovered-border': 'rgb(var(--color-dark-hovered-border)/ 0.5)',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    plugin(({ addUtilities }) => {
      addUtilities({
        '.animation': {
          '@apply transition-all duration-100 ease-in-out': {},
        },
      });
    }),
  ],
};

export default config;
