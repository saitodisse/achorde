import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		},
	},
	server: {
		host: "127.0.0.1",
		port: 6011,
		strictPort: true,
	},
	preview: {
		host: "127.0.0.1",
		port: 4311,
		strictPort: true,
	},
	build: {
		outDir: "dist-app",
		emptyOutDir: true,
		rollupOptions: {
			input: {
				main: resolve(__dirname, "index.html"),
			},
		},
	},
	base: "/",
});
