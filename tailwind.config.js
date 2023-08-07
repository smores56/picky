import { tailwindcssPaletteGenerator } from "@bobthered/tailwindcss-palette-generator";
import flowbitePlugin from "flowbite/plugin";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}"
  ],
  plugins: [flowbitePlugin],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // white: "#FFFFFF",
        wallpaper: "#DEF7F7",
        accent: "#9CE7E7",
        ...tailwindcssPaletteGenerator({
          colors: ["#3ACECE", "#D7AE3A", "#395B50", "#7B0828", "#81735E"],
          names: ["primary", "secondary", "info", "error", "grey"]
        })
      }
    }
  }
};
