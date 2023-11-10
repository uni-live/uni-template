// @ts-nocheck
import type { PluginOption } from 'vite';
import { configMockPlugin } from './mock';
import uni from '@dcloudio/vite-plugin-uni';

interface Options {
  isBuild: boolean;
  enableMock?: boolean;
}

async function createPlugins({ isBuild, enableMock }: Options) {
  const vitePlugins: (PluginOption | PluginOption[])[] = [];

  vitePlugins.push(uni());

  // vite-plugin-mock
  vitePlugins.push(configMockPlugin({ enable: !!enableMock, isBuild }));

  return vitePlugins;
}

export { createPlugins };
