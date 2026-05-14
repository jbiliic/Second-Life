import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, "../../", "VITE_");

  return {
    plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
    define: {
      "process.env.VITE_SERVER_URL": JSON.stringify(env.VITE_SERVER_URL),
    },
    server: {
      proxy: {
        "/api": {
          target: env.VITE_SERVER_URL || "http://localhost:3000",
          changeOrigin: true,
        },
      },
    },
    resolve: {
      alias: [
        {
          find: /^src\/(.*)/,
          replacement: path.resolve(__dirname, "./src/$1"),
        },
        {
          find: /^@\/(.*)/,
          replacement: path.resolve(__dirname, "./src/$1"),
        },
      ],
    },
  };
});
