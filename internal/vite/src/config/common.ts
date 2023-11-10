import { type UserConfig } from 'vite';

const commonConfig: UserConfig = {
  server: {
    host: true,
  },
  build: {
    sourcemap: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1500,
  },
  plugins: [],
};

export { commonConfig };
