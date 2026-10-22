import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, // Listens on all local IPs
    strictPort: true, // Forces Vite to fail if port 3000 is occupied rather than switching ports
    hmr: {
      protocol: "ws",
      host: "localhost",
      port: 3000,
    },
  },
  optimizeDeps: {
    include: ["jspdf", "jspdf-autotable"],
  },
});
