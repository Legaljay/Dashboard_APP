import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@enums': path.resolve(__dirname, './src/enums'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@provider': path.resolve(__dirname, './src/provider'),
      '@redux-slice': path.resolve(__dirname, './src/redux-slice'),
      '@routes': path.resolve(__dirname, './src/Routes'),
      '@services': path.resolve(__dirname, './src/services'),
      '@store': path.resolve(__dirname, './src/store'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: process.env.VITE_API_URL,
  //       changeOrigin: true,
  //       secure: false, // Add this if dealing with HTTPS
  //       rewrite: (path) => path.replace(/^\/api/, ''),
  //       configure: (proxy) => {
  //         proxy.on('proxyReq', (proxyReq) => {
  //           proxyReq.removeHeader('origin');
  //           proxyReq.removeHeader('referer');
  //         });
  //       }
  //     }
  //   }
  // }
})
