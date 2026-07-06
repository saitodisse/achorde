import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    copyPublicDir: false,
    lib: {
      entry: {
        index: "src/index.ts",
        react: "src/react.ts",
      },
      formats: ["es"],
      fileName: (_format, entryName) => `${entryName}.js`,
      cssFileName: "style",
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "@achorde/tab-renderer",
        "@achorde/tab-renderer/react",
        "@monaco-editor/react",
        "monaco-editor",
      ],
    },
  },
});
