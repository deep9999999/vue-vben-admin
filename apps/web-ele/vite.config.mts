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
          '*'
        ],
        proxy: {
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            // mock代理目标地址
            
            //target: 'http://localhost:5320/api',
            // 后端代理目标地址
            //target: 'http://118.31.173.178:6001/api',
            target: 'https://d623-2409-8a4c-8015-d160-9c4a-cefe-ce40-b0d7.ngrok-free.app/api',
            ws: true,
          },
        },
      },
    },
  };
});
