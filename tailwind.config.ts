import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        miFuente: ['Bogart', 'sans-serif'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'custom-purple': '#b093bf',
        'custom-orange': '#d57159',
        'valkyrie-purple': '#7b548b',
        'creativity-purple': '#b093bf'
      },
    },
  },
  plugins: [],
} satisfies Config;
