import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            "@assets": path.resolve(__dirname, "./src/assets"),
            "@gui": path.resolve(__dirname, "./src/gui"),
            "@phaser": path.resolve(__dirname, "./src/phaser"),
            "@store": path.resolve(__dirname, "./src/store"),
        },
    },
    plugins: [react()],
});
