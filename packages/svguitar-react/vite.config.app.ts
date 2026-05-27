import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

// App dev/build configuration (demo UI — not the npm library bundle)
export default defineConfig({
	plugins: [tailwindcss(), react()],
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		},
	},
	server: {
		host: "127.0.0.1",
		port: 5284,
		strictPort: true,
	},
	preview: {
		host: "127.0.0.1",
		port: 4284,
		strictPort: true,
	},
	build: {
		outDir: "dist-app",
		rollupOptions: {
			input: {
				main: resolve(__dirname, "index.html"),
			},
		},
	},
	base: "/",
});
