import { register } from '@app/shared';
import { setupError } from './error';
import { getAppEnvConfig } from '@/utils';

/**
 * @description 初始化http
 * @param
 */
export function setupHttp() {
  const { VITE_GLOB_API_URL_PREFIX, VITE_GLOB_API_URL } = getAppEnvConfig();

  register({
<<<<<<< HEAD
    baseURL: VITE_GLOB_API_URL,
    custom: {
      urlPrefix: VITE_GLOB_API_URL_PREFIX,
    },
    requestInterceptors: [
      (config) => {
        config.header!.Authorization = '';

        return config;
      },
    ],
=======
>>>>>>> 5689112a50da1de13542c37e7f0618cddb64620d
    onError: setupError,
  });
}
