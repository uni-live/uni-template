import type { HttpData } from 'luch-request';
import type { IRequestInterceptorTuple, IResponseInterceptorTuple, RequestConfig } from './types';
import lodash from 'lodash-es';
import { appendUrlParams, formatRequestDate, joinTimestamp } from './helper';
import { RequestEnum } from './enum';
import { ErrorThrow } from './ErrorThrow';
import { context } from './register';
import { VLuch } from './luch';

// 设置默认拦截器
export function defaultInterceptor(opts: RequestConfig, luchInstance: VLuch) {
  const requestInterceptors: IRequestInterceptorTuple[] = [
    [
      // 处理请求前的数据
      (config: RequestConfig) => {
        const {
          baseURL,
          joinPrefix,
          joinParamsToUrl,
          formatDate,
          joinTime = true,
          urlPrefix,
        } = config;
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
      (response: any) => {
        if (response.config?.isReturnNativeResponse) {
          return response;
        }

        if (!response.config?.isTransformResponse) {
          return response.data;
        }

        const { data } = response;

        const codeField = context.resultField?.code as string;
        const dataField = context.resultField?.data as any;
        const successCode = context.successCode as string | number;

        const hasSuccess =
          data && Reflect.has(data, codeField) && Reflect.get(data, codeField) === successCode;

        if (hasSuccess) {
          return Reflect.get(data, dataField);
        }
        if (data) {
          return data;
        }

        if (response.status === 200) {
          return data;
        }

        throw new ErrorThrow({
          name: 'BizError',
          code: response.status,
          message: 'CODE ERROR',
          result: data,
          info: response,
          type: 'LINK_OK_CODE_ERROR',
        });
      },
      (error: Error) => {
        return Promise.reject(`失败了${error.message}`);
      },
    ],
  ];

  return {
    requestInterceptors,
    responseInterceptors,
  };
}
