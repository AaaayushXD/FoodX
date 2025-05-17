import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { visualizer } from "rollup-plugin-visualizer";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true }),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico"],
      manifest: {
        name: " ",
        short_name: " ",
        description: "Digitalize your canteen and cafeteria with Foodx.",
        display: "standalone",
        start_url: "/",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-maskable-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/pwa-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      // workbox: {
      //   globPatterns: ["*/**/*.{css,html,js,png,svg,jpg}"],
      //   globDirectory: "./dist",
      //   cacheId: "foodXCache",
      //   runtimeCaching: [
      //     {
      //       urlPattern: ({ url }) =>
      //         url.pathname.startsWith("https://foodx-xnga.onrender.com/"),
      //       handler: "CacheFirst" as const,
      //       options: {
      //         cacheName: "api-cache",
      //         cacheableResponse: {
      //           statuses: [0, 200],
      //         },
      //       },
      //     },
      //   ],
      // },
    }),
  ],

  base: "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
  },
  server: {
    allowedHosts: true,
    host: "0.0.0.0",
  },
  preview: {
    allowedHosts: true,
  },
});
