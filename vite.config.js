import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Task Manager PWA",
        short_name: "Tasks",
        description: "A task manager with offline support",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/vite.svg",
            sizes: "192x192",
            type: "image/svg+xml",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              networkTimeoutSeconds: 10,
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
  optimizeDeps: {
    exclude: ["lucide-react"], // Exclude dependencies if necessary
  },
  define: {
    global: "window", // Make sure `global` is defined to avoid issues with the global object
  },
  server: {
    proxy: {
      // Proxy the socket connections to your backend server for development
      "/socket.io": "http://localhost:3001", // Proxy requests for Socket.io to backend
    },
  },
});
