import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	server: {
		host: "127.0.0.1",
		port: 5283,
		strictPort: true,
	},
	build: {
		copyPublicDir: false,
		lib: {
			entry: {
				index: "src/index.ts",
				react: "src/react.ts",
			},
			formats: ["es"],
			fileName: (_format, entryName) => `${entryName}.js`,
		},
		rollupOptions: {
			external: ["react", "react-dom", "react/jsx-runtime"],
		},
	},
});
