import { reactRouter } from "@react-router/dev/vite";
// ↓ add this
import netlifyPlugin from "@netlify/vite-plugin-react-router";

export default {
  plugins: [
    reactRouter(),
    netlifyPlugin() // ← add this
  ]
};
