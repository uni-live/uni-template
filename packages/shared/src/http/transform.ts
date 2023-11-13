import type { HttpData, HttpResponse, HttpError } from 'luch-request';
import type { IRequestInterceptorTuple, IResponseInterceptorTuple, RequestConfig } from './types';
import lodash from 'lodash-es';
import { appendUrlParams, formatRequestDate, joinTimestamp } from './helper';
import { RequestEnum } from './enum';
import { VLuch } from './luch';
import { LuchRetry } from './luchRetry';

// 设置默认拦截器
export function defaultInterceptor(opts: RequestConfig, luchInstance: VLuch) {
  const requestInterceptors: IRequestInterceptorTuple[] = [
    [
      // 处理请求前的数据
      (config: RequestConfig) => {
        const { baseURL } = config;
        const {
          joinPrefix,
          joinParamsToUrl,
          formatDate,
          joinTime = true,
          urlPrefix,
        } = config.custom as any;
        if (joinPrefix) {
          config.url = `${urlPrefix}${config.url}`;
        }

        if (baseURL && lodash.isString(baseURL)) {
          config.url = `${baseURL}${config.url}`;
        }

        const params = config.params || {};
        const data = config.data || false;

        formatDate && data && !lodash.isString(data) && formatRequestDate(data);
        if (config.method?.toUpperCase() === RequestEnum.GET) {
          if (!lodash.isString(params)) {
            // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
            config.params = Object.assign(params || {}, joinTimestamp(joinTime, false));
          } else {
            // 兼容restful风格
            config.url = config.url + params + `${joinTimestamp(joinTime, true)}`;
            config.params = undefined;
          }
        } else {
          if (!lodash.isString(params)) {
            formatDate && formatRequestDate(params);
            if (Reflect.has(config, 'data') && config.data && Object.keys(config.data).length > 0) {
              config.data = data as HttpData;
              config.params = params;
            } else if (Reflect.has(config, 'data') && config.data && config.data instanceof Blob) {
              config.data = data as HttpData;
              config.params = params;
            } else {
              // 非GET请求如果没有提供data，则将params视为data
              config.data = params;
              config.params = undefined;
            }
            if (joinParamsToUrl) {
              config.url = appendUrlParams(
                config.url as string,
                Object.assign({}, config.params, config.data),
              );
            }
          } else {
            // 兼容restful风格
            config.url = config.url + params;
            config.params = undefined;
          }
        }

        return config;
      },
    ],
  ];

  const responseInterceptors: IResponseInterceptorTuple[] = [
    [
      (response: HttpResponse) => {
        const { custom } = response.config;

        if (custom?.isReturnNativeResponse) {
          return response;
        }

        if (!custom?.isTransformResponse) {
          return response.data;
        }

        const { data } = response;

        const codeField = custom.resultField?.code as string;
        const dataField = custom.resultField?.data as any;

        const hasSuccess =
          data &&
          Reflect.has(data, codeField) &&
          Reflect.get(data, codeField) === custom.successCode;

        if (hasSuccess) {
          return Reflect.get(data, dataField);
        }

        throw response;
      },
      (error: HttpError) => {
        const config = error.config;

        // 添加自动重试机制 保险起见 只针对GET请求
        const retryRequest = new LuchRetry();
        const { isOpenRetry } = config.custom?.retryRequest;

        config.method?.toUpperCase() === RequestEnum.GET &&
          isOpenRetry &&
          retryRequest.retry(luchInstance, error);
        return Promise.reject(error);
      },
    ],
  ];

  return {
    requestInterceptors,
    responseInterceptors,
  };
}
