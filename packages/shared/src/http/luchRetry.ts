import { VLuch } from './luch';
import type { HttpError } from 'luch-request';
/**
 *  请求重试机制
 */

export class LuchRetry {
  /**
   * 重试
   */
  retry(luchInstance: VLuch, error: HttpError) {
    const config = error.config;
    const { waitTime, count } = config.custom?.retryRequest ?? {};
    (config.custom as any).__retryCount = config.custom?.__retryCount || 0;
    if (config.custom?.__retryCount >= count) {
      return Promise.reject(error);
    }
    (config.custom as any).__retryCount += 1;
    //请求返回后config的header不正确造成重试请求失败,删除返回headers采用默认headers
    let url;
    if (config.custom?.urlPrefix) {
      const urls = config.url?.split('/');
      urls?.shift();

      url = `/${urls?.join('/')}`;
    }

    return this.delay(waitTime).then(() =>
      luchInstance.request({
        ...config,
        url,
      }),
    );
  }

  /**
   * 延迟
   */
  private delay(waitTime: number) {
    return new Promise((resolve) => setTimeout(resolve, waitTime));
  }
}
