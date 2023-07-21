const { tailwindcssPaletteGenerator } = require("@bobthered/tailwindcss-palette-generator");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}"
  ],
  plugins: [require("flowbite/plugin")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // white: "#FFF7EB",
        wallpaper: "#DEF7F7",
        ...tailwindcssPaletteGenerator({
          colors: ["#3ACECE", "#D7AE3A", "#395B50", "#7B0828", "#81735E"],
          names: ["primary", "secondary", "info", "error", "grey"]
        })
      }
    }
  }
};
