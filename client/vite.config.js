import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import eslint from 'vite-plugin-eslint'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    eslint(),
  ],
  resolve: {
    alias: {
      src: path.resolve(__dirname, "./src"),
      components: path.resolve(__dirname, "./src/components"),
      pages: path.resolve(__dirname, "./src/pages"),
      assets: path.resolve(__dirname, "./src/assets"),
      layouts: path.resolve(__dirname, "./src/layouts"),
      utils: path.resolve(__dirname, "./src/utils"),
      styles: path.resolve(__dirname, "./src/styles"),
      images: path.resolve(__dirname, "./src/assets/images"),
      svg: path.resolve(__dirname, "./src/assets/svg"),
      api: path.resolve(__dirname, "./src/api"),
      routes: path.resolve(__dirname, "./src/routes"),
      data: path.resolve(__dirname, "./src/data"),
      hooks: path.resolve(__dirname, "./src/utils/hooks"),
      contexts: path.resolve(__dirname, "./src/contexts"),
    },
  },
  server: {
    proxy: {
      "/users": "http://localhost:5000",
    }
  }
})
