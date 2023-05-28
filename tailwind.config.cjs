/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
	safelist: ["bg-red-500", "bg-green-500"],
	theme: {
		extend: {},
	},
	plugins: [require("daisyui")],
};
