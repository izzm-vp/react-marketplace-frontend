import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  esbuild: {
    loader: "jsx", // Simplified loader configuration
    include: [
      "src/**/*.jsx",
      "src/**/*.js",
      "node_modules/**/*.js"
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx", // Alternative format if needed
      },
    },
  },
});