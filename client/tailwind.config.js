/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from "tailwindcss-animate";
import scrollbarHide from "tailwind-scrollbar-hide";

const config = {
	darkMode: "class",
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	plugins: [scrollbarHide, tailwindcssAnimate],
};

export default config;
