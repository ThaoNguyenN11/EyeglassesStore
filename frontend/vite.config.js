import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost",
    port: 5173, // Đảm bảo cổng cố định
    hmr: {
      clientPort: 5173, // Cấu hình HMR WebSocket
    },
  },
});
