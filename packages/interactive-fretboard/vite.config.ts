/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { fileURLToPath } from "node:url";
import path from "path";

const dirname =
	typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": resolve(dirname, "./src"),
		},
	},
	build: {
		lib: {
			entry: resolve(dirname, "src/index.ts"),
			name: "InteractiveFretboard",
			fileName: (format) => `index.${format === "es" ? "es.js" : "js"}`,
			formats: ["es", "cjs"],
		},
		rollupOptions: {
			external: ["react", "react-dom", "react/jsx-runtime", "achorde-musical-domain"],
			output: {
				globals: {
					react: "React",
					"react-dom": "ReactDOM",
					"react/jsx-runtime": "jsxRuntime",
					"achorde-musical-domain": "AchordeMusicalDomain",
				},
			},
		},
		emptyOutDir: true,
	},
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: ["./vitest.setup.ts"],
		include: ["src/**/*.{test,spec}.{ts,tsx}"],
		exclude: ["src/stories/**/*"],
	},
});
