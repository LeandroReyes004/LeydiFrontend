import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "on-secondary-fixed-variant": "#5e4200",
        "on-background": "#e5e1e6",
        "on-primary-container": "#5b0011",
        "inverse-on-surface": "#303033",
        "tertiary-fixed": "#84f7d8",
        "on-error-container": "#ffdad6",
        "secondary-container": "#feb700",
        "inverse-surface": "#e5e1e6",
        "outline": "#ad8887",
        "on-secondary-fixed": "#271900",
        "surface": "#131316",
        "surface-container-highest": "#353438",
        "primary-fixed": "#ffdad9",
        "outline-variant": "#5d3f3f",
        "surface-bright": "#39393c",
        "on-tertiary": "#00382d",
        "secondary": "#ffdb9d",
        "error-container": "#93000a",
        "error": "#ffb4ab",
        "primary-container": "#ff5261",
        "on-primary": "#680015",
        "tertiary-container": "#20a388",
        "on-error": "#690005",
        "on-surface-variant": "#e6bcbc",
        "primary": "#ffb3b3",
        "surface-tint": "#ffb3b3",
        "surface-container-lowest": "#0e0e11",
        "surface-container": "#1f1f22",
        "on-tertiary-fixed-variant": "#005142",
        "surface-dim": "#131316",
        "background": "#131316",
        "secondary-fixed": "#ffdea8",
        "secondary-fixed-dim": "#ffba20",
        "inverse-primary": "#bf002f",
        "tertiary": "#66dabd",
        "surface-container-high": "#2a2a2d",
        "surface-variant": "#353438",
        "on-secondary-container": "#6b4b00",
        "tertiary-fixed-dim": "#66dabd",
        "on-tertiary-fixed": "#002019",
        "on-primary-fixed-variant": "#920022",
        "primary-fixed-dim": "#ffb3b3",
        "on-surface": "#e5e1e6",
        "surface-container-low": "#1b1b1e",
        "on-primary-fixed": "#400009",
        "on-secondary": "#412d00",
        "on-tertiary-container": "#003026"
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem"
      },
      spacing: {
        "rail-width-expanded": "16rem",
        "gutter-tablet": "1.5rem",
        "space-xl": "2rem",
        "gutter-desktop": "2.5rem",
        "space-lg": "1.5rem",
        "space-sm": "0.75rem",
        "rail-width-collapsed": "4.5rem",
        "space-xs": "0.5rem",
        "gutter-mobile": "1rem",
        "space-md": "1rem",
        "space-2xl": "3rem",
        "space-xxs": "0.25rem",
        "space-3xl": "4rem"
      },
      fontFamily: {
        "title-sm": ["var(--font-hanken)"],
        "display-hero-mobile": ["var(--font-chivo)"],
        "headline-md": ["var(--font-chivo)"],
        "label-badge": ["var(--font-hanken)"],
        "label-md": ["var(--font-hanken)"],
        "body-lg": ["var(--font-hanken)"],
        "headline-xl": ["var(--font-chivo)"],
        "headline-lg": ["var(--font-chivo)"],
        "body-md": ["var(--font-hanken)"],
        "display-hero": ["var(--font-chivo)"]
      },
      fontSize: {
        "title-sm": ["16px", { lineHeight: "24px", letterSpacing: "0em", fontWeight: "600" }],
        "display-hero-mobile": ["36px", { lineHeight: "42px", letterSpacing: "-0.02em", fontWeight: "900" }],
        "headline-md": ["20px", { lineHeight: "28px", letterSpacing: "-0.01em", fontWeight: "700" }],
        "label-badge": ["11px", { lineHeight: "14px", letterSpacing: "0.08em", fontWeight: "800" }],
        "label-md": ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "700" }],
        "body-lg": ["16px", { lineHeight: "26px", letterSpacing: "0em", fontWeight: "400" }],
        "headline-xl": ["32px", { lineHeight: "40px", letterSpacing: "-0.02em", fontWeight: "800" }],
        "headline-lg": ["24px", { lineHeight: "32px", letterSpacing: "-0.015em", fontWeight: "700" }],
        "body-md": ["14px", { lineHeight: "22px", letterSpacing: "0.01em", fontWeight: "400" }],
        "display-hero": ["56px", { lineHeight: "64px", letterSpacing: "-0.03em", fontWeight: "900" }]
      }
    }
  }
};

export default config;
