import { register } from '@app/shared';
import { setupError } from './error';

/**
 * @description 初始化http
 * @param
 */
export function setupHttp() {
  register({
    custom: {
      // urlPrefix: 'api',
    },
    onError: setupError,
  });
}
