/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "error": "#ba1a1a",
        "primary": "rgb(var(--color-primary) / <alpha-value>)",
        "secondary": "rgb(var(--color-secondary) / <alpha-value>)",
        "outline": "rgb(var(--color-outline) / <alpha-value>)",
        "on-primary-fixed": "#211a13",
        "tertiary-container": "#9d988a",
        "primary-container": "#a1968c",
        "surface": "rgb(var(--color-surface) / <alpha-value>)",
        "background": "rgb(var(--color-background) / <alpha-value>)",
        "surface-dim": "rgb(var(--color-surface-dim) / <alpha-value>)",
        "surface-container-lowest": "rgb(var(--color-surface-container-lowest) / <alpha-value>)",
        "secondary-fixed-dim": "#cdc6b8",
        "on-tertiary-container": "#333026",
        "surface-container": "rgb(var(--color-surface-container) / <alpha-value>)",
        "surface-variant": "rgb(var(--color-surface-variant) / <alpha-value>)",
        "on-primary-container": "#362f27",
        "on-error": "#ffffff",
        "inverse-surface": "#382f21",
        "tertiary-fixed-dim": "#ccc6b7",
        "tertiary": "#625e52",
        "on-tertiary-fixed": "#1e1c12",
        "secondary-fixed": "#eae1d3",
        "on-tertiary-fixed-variant": "#4a473b",
        "on-secondary-container": "#676257",
        "on-primary": "rgb(var(--color-on-primary) / <alpha-value>)",
        "primary-fixed-dim": "#d1c4b9",
        "secondary-container": "#e7dfd0",
        "surface-container-highest": "rgb(var(--color-surface-container-highest) / <alpha-value>)",
        "outline-variant": "rgb(var(--color-outline-variant) / <alpha-value>)",
        "on-secondary-fixed-variant": "#4b463c",
        "on-surface-variant": "rgb(var(--color-on-surface-variant) / <alpha-value>)",
        "surface-tint": "#665d54",
        "surface-container-high": "rgb(var(--color-surface-container-high) / <alpha-value>)",
        "on-surface": "rgb(var(--color-on-surface) / <alpha-value>)",
        "on-tertiary": "#ffffff",
        "on-secondary": "rgb(var(--color-on-secondary) / <alpha-value>)",
        "surface-bright": "#fff8f3",
        "tertiary-fixed": "#e9e2d2",
        "primary-fixed": "#eee0d4",
        "surface-container-low": "rgb(var(--color-surface-container-low) / <alpha-value>)",
        "inverse-primary": "#d1c4b9",
        "on-error-container": "#93000a",
        "on-secondary-fixed": "#1f1b13",
        "error-container": "#ffdad6",
        "inverse-on-surface": "#feeeda",
        "on-primary-fixed-variant": "#4e453d",
        "on-background": "rgb(var(--color-on-surface) / <alpha-value>)"
      },
      fontFamily: {
        headline: ["Newsreader", "serif"],
        body: ["Newsreader", "serif"],
        label: ["Inter", "sans-serif"]
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem"
      }
    }
  },
  plugins: []
}
