import { resolve } from 'path';
import { defineConfig, loadEnv, mergeConfig, type UserConfig } from 'vite';
import { createPlugins } from '../plugins';
import { commonConfig } from './common';

interface DefineOptions {
  overrides?: UserConfig;
  options?: {};
}

export function defineApplicationConfig(defineOptions: DefineOptions = {}) {
  const { overrides = {} } = defineOptions;

  return defineConfig(async ({ command, mode }) => {
    const root = process.cwd();
    const isBuild = command === 'build';
    const env = loadEnv(mode, root);

    const plugins = await createPlugins({
      isBuild,
    });

    const pathResolve = (pathname: string) => resolve(root, '.', pathname);
    const applicationConfig: UserConfig = {
      // css: {
      //   preprocessorOptions: {
      //     scss: {
      //       additionalData: `@use '@app/design/shared' as *;`,
      //     },
      //   },
      // },
      resolve: {
        alias: [
          {
            find: /@\//,
            replacement: pathResolve('src') + '/',
          },
        ],
      },
      plugins: [...plugins],
    };

    const mergedConfig = mergeConfig(commonConfig, applicationConfig);

    return mergeConfig(mergedConfig, overrides);
  });
}
