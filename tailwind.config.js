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
        "primary": "#665d54",
        "secondary": "#635e53",
        "outline": "#7d766d",
        "on-primary-fixed": "#211a13",
        "tertiary-container": "#9d988a",
        "primary-container": "#a1968c",
        "surface": "#fff8f3",
        "background": "#fff8f3",
        "surface-dim": "#e7d8c4",
        "surface-container-lowest": "#ffffff",
        "secondary-fixed-dim": "#cdc6b8",
        "on-tertiary-container": "#333026",
        "surface-container": "#fbecd7",
        "surface-variant": "#f0e0cc",
        "on-primary-container": "#362f27",
        "on-error": "#ffffff",
        "inverse-surface": "#382f21",
        "tertiary-fixed-dim": "#ccc6b7",
        "tertiary": "#625e52",
        "on-tertiary-fixed": "#1e1c12",
        "secondary-fixed": "#eae1d3",
        "on-tertiary-fixed-variant": "#4a473b",
        "on-secondary-container": "#676257",
        "on-primary": "#ffffff",
        "primary-fixed-dim": "#d1c4b9",
        "secondary-container": "#e7dfd0",
        "surface-container-highest": "#f0e0cc",
        "outline-variant": "#cec5ba",
        "on-secondary-fixed-variant": "#4b463c",
        "on-surface-variant": "#4c463e",
        "surface-tint": "#665d54",
        "surface-container-high": "#f6e6d2",
        "on-surface": "#221a0e",
        "on-tertiary": "#ffffff",
        "on-secondary": "#ffffff",
        "surface-bright": "#fff8f3",
        "tertiary-fixed": "#e9e2d2",
        "primary-fixed": "#eee0d4",
        "surface-container-low": "#fff2e1",
        "inverse-primary": "#d1c4b9",
        "on-error-container": "#93000a",
        "on-secondary-fixed": "#1f1b13",
        "error-container": "#ffdad6",
        "inverse-on-surface": "#feeeda",
        "on-primary-fixed-variant": "#4e453d",
        "on-background": "#221a0e"
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
