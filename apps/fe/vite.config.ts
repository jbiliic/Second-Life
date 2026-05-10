import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, "../../", "");

    return {
        plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
        define: {
            "process.env": env,
        },
        server: {
            proxy: {
                "/api": {
                    target: env.VITE_API_URL,
                    changeOrigin: true,
                },
            },
        },
        resolve: {
            alias: {
                components: path.resolve(__dirname, "./src/components"),
                assets: path.resolve(__dirname, "./src/assets"),
            },
        },
    };
});
