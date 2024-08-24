/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {},
    screens: {
      /* ----- min-w = min-width breakpoint ----- */
      "2xl": { max: "1535px" },
      xl: { max: "1279px" },
      lg: { max: "1023px" },
      md: { max: "834px" },
      sm: { max: "640px" },
      "x-sm": { max: "375px" },
      "xx-sm": { max: "280px" },
      "min-w-md": "835px",
    },
  },
  plugins: [],
};
