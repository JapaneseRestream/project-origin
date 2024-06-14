import { defineConfig } from "@pandacss/dev";

export default defineConfig({
	// Whether to use css reset
	preflight: true,

	// Where to look for your css declarations
	include: ["./app/routes/**/*.{ts,tsx}", "./app/components/**/*.{ts,tsx}"],

	// Files to exclude
	exclude: [],

	// Useful for theme customization
	theme: {
		extend: {
			breakpoints: {
				xs: '520px',
				sm: '768px',
				md: '1024px',
				lg: '1280px',
				xl: '1640px',
			}
		},
	},

	// The output directory for your css system
	outdir: "styled-system",
});
