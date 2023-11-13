import type { HttpRequestAbstract, HttpRequestConfig, HttpResponse, HttpError } from 'luch-request';
import Request from 'luch-request';
import { defaultInterceptor } from './transform';
import { context } from './register';
import {
  IRequestInterceptorTuple,
  IResponseInterceptorTuple,
  RequestConfig,
  Result,
} from './types';

export class VLuch {
  private luchInstance: HttpRequestAbstract;
  private readonly options: RequestConfig;

  constructor(options: RequestConfig) {
    this.options = options;
    this.luchInstance = new Request(options);

    this.setupInterceptors();
  }

  setupInterceptors() {
    const { requestInterceptors, responseInterceptors } = defaultInterceptor(this.options, this);

    this.getRequestInstance(requestInterceptors, responseInterceptors);

    this.getRequestInstance(context.requestInterceptors || [], context.responseInterceptors || []);
  }

  getRequestInstance(
    requestInterceptors: IRequestInterceptorTuple[],
    responseInterceptors: IResponseInterceptorTuple[],
  ) {
    const requestInterceptorsToEject = requestInterceptors?.map((interceptor) => {
      if (interceptor instanceof Array) {
        return this.luchInstance.interceptors.request.use(interceptor[0], interceptor[1] as any);
      } else {
        return this.luchInstance.interceptors.request.use(interceptor as any);
      }
    });

    const responseInterceptorsToEject = responseInterceptors?.map((interceptor) => {
      if (interceptor instanceof Array) {
        return this.luchInstance.interceptors.response.use(interceptor[0], interceptor[1] as any);
      } else {
        return this.luchInstance.interceptors.response.use(interceptor);
      }
    });

    return {
      requestInterceptorsToEject,
      responseInterceptorsToEject,
    };
  }

  private createLuch(config: HttpRequestConfig): void {
    this.luchInstance = new Request(config);
  }

  getAxios(): HttpRequestAbstract {
    return this.luchInstance;
  }

  configAxios(config: HttpRequestConfig) {
    if (!this.luchInstance) {
      return;
    }
    this.createLuch(config);
  }

  setHeader(headers: any): void {
    if (!this.luchInstance) {
      return;
    }
    Object.assign(this.luchInstance.config.header || {}, headers);
  }

  get<T = any>(config: RequestConfig): Promise<T> {
    return this.request({ ...config, method: 'GET' });
  }

  post<T = any>(config: RequestConfig): Promise<T> {
    return this.request({ ...config, method: 'POST' });
  }

  put<T = any>(config: RequestConfig): Promise<T> {
    return this.request({ ...config, method: 'PUT' });
  }

  delete<T = any>(config: RequestConfig): Promise<T> {
    return this.request({ ...config, method: 'DELETE' });
  }

  request<T = any>(config: RequestConfig): Promise<T> {
    const opt: RequestConfig = Object.assign({}, this.options, config);

    const { requestInterceptorsToEject, responseInterceptorsToEject } = this.getRequestInstance(
      config?.requestInterceptors ?? [],
      config?.responseInterceptors ?? [],
    );

    return new Promise((resolve, reject) => {
      this.luchInstance
        .request<any, HttpResponse<Result>>(config)
        .then((res: HttpResponse<Result>) => {
          requestInterceptorsToEject?.forEach((_, index) => {
            this.luchInstance.interceptors.request.eject(index);
          });
          responseInterceptorsToEject?.forEach((_, index) => {
            this.luchInstance.interceptors.response.eject(index);
          });
          resolve(res as unknown as Promise<T>);
        })
        .catch((e: HttpError) => {
          requestInterceptorsToEject?.forEach((_, index) => {
            this.luchInstance.interceptors.request.eject(index);
          });
          responseInterceptorsToEject?.forEach((_, index) => {
            this.luchInstance.interceptors.response.eject(index);
          });

          const handler = config?.onError ?? context.onError;

          if (handler) handler(e, opt);

          reject(e);
        });
    });
  }
}
