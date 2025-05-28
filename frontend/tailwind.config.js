/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        bounce1: {
          "0%, 80%, 100%": { transform: "translateY(0)" },
          "40%": { transform: "translateY(-10px)" },
        },
        bounce2: {
          "0%, 80%, 100%": { transform: "translateY(0)" },
          "40%": { transform: "translateY(-10px)" },
        },
        bounce3: {
          "0%, 80%, 100%": { transform: "translateY(0)" },
          "40%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        bounce1: "bounce1 1.4s infinite",
        bounce2: "bounce2 1.4s infinite 0.2s",
        bounce3: "bounce3 1.4s infinite 0.4s",
      },
    },
  },
  plugins: [],
};
