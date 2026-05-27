import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/** SPA build for the public demo site (Vercel). */
export default defineConfig({
	plugins: [react()],
	build: {
		outDir: "dist-site",
		emptyOutDir: true,
	},
});
