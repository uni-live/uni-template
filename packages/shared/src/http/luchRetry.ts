import type { HttpError } from 'luch-request';
import { RequestConfig } from './types';
import { VLuch } from './luch';
/**
 *  请求重试机制
 */

export class LuchRetry {
  /**
   * 重试
   */
  retry(luchInstance: VLuch, error: HttpError) {
    const config = error.config as RequestConfig;
    const { waitTime, count } = config?.retryRequest ?? {};
    config.__retryCount = config.__retryCount || 0;
    if (config.__retryCount >= count) {
      return Promise.reject(error);
    }
    config.__retryCount += 1;
    //请求返回后config的header不正确造成重试请求失败,删除返回headers采用默认headers
    delete config.headers;
    return this.delay(waitTime).then(() => luchInstance.request(config));
  }

  /**
   * 延迟
   */
  private delay(waitTime: number) {
    return new Promise((resolve) => setTimeout(resolve, waitTime));
  }
}
