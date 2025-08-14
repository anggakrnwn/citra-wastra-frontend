/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        display: ["3.75rem", { lineHeight: "1.1" }], // 60px
        h1: ["3rem", { lineHeight: "1.2" }], // 48px
        h2: ["2.25rem", { lineHeight: "1.3" }], // 36px
        h3: ["1.875rem", { lineHeight: "1.3" }], // 30px
        subheading: ["1.25rem", { lineHeight: "1.4" }], // 20px
        "body-lg": ["1.125rem", { lineHeight: "1.6" }], // 18px
        body: ["1rem", { lineHeight: "1.6" }], // 16px
        small: ["0.875rem", { lineHeight: "1.4" }], // 14px
      },
    },
  },
  plugins: [],
};
