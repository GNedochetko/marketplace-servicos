import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      includeAssets: ["icon.svg"],
      manifest: {
        name: "ConectaLocal",
        short_name: "ConectaLocal",
        description: "Encontre e contrate serviços locais.",
        theme_color: "#176b50",
        background_color: "#fbfcfa",
        display: "standalone",
        start_url: "/",
        lang: "pt-BR",
        icons: [
          { src: "/icon-1024.png", sizes: "1254x1254", type: "image/png", purpose: "any maskable" },
          { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
        ],
      },
      workbox: {
        navigateFallback: "index.html",
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: "CacheFirst",
            options: { cacheName: "google-fonts", expiration: { maxEntries: 10, maxAgeSeconds: 31536000 } },
          },
        ],
      },
    }),
  ],
  server: {
    host: "0.0.0.0",
    port: 8080,
  },
});
