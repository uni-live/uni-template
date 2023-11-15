import type { PluginOption } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';

interface Options {
  isBuild: boolean;
  enableMock?: boolean;
}

async function createPlugins({ isBuild }: Options) {
  const vitePlugins: (PluginOption | PluginOption[])[] = [];

  vitePlugins.push(uni());

  return vitePlugins;
}

export { createPlugins };
