import { defineConfig } from '@vben/vite-config';

import ElementPlus from 'unplugin-element-plus/vite';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      plugins: [
        ElementPlus({
          format: 'esm',
        }),
      ],
      server: {
        allowedHosts: [
          'b461-59-174-127-81.ngrok-free.app',
          'localhost',
          '127.0.0.1'
        ],
        proxy: {
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            // mock代理目标地址
            target: 'http://localhost:5320/api',
            // 后端代理目标地址
            //target: 'https://daf4-35-240-132-46.ngrok-free.app/api',
            ws: true,
          },
        },
      },
    },
  };
});
