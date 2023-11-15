import type { HttpCustom, HttpError, HttpRequestConfig, HttpResponse } from 'luch-request';

export type Recordable<T> = Record<string, T>;

export type IHttpContext = RequestConfig;

export interface Result<T = any> {
  code: number;
  type: 'success' | 'error' | 'warning';
  message: string;
  result: T;
}

// multipart/form-data: upload file
export interface UploadFileParams {
  // Other parameters
  data?: Recordable<any>;
  // File parameter interface field name
  name?: string;
  // file name
  file: File | Blob;
  // file name
  filename?: string;
  [key: string]: any;
}

type IRequestInterceptorAxios = (config: RequestConfig) => RequestConfig;
type IRequestInterceptor = IRequestInterceptorAxios;
type IErrorInterceptor = (error: HttpError) => Promise<HttpError>;
type IResponseInterceptor = <T = any>(response: HttpResponse<T>) => HttpResponse<T>;
export type IRequestInterceptorTuple =
  | [IRequestInterceptor, IErrorInterceptor]
  | [IRequestInterceptor]
  | IRequestInterceptor;
export type IResponseInterceptorTuple =
  | [IResponseInterceptor, IErrorInterceptor]
  | [IResponseInterceptor]
  | IResponseInterceptor;

type RequestError = HttpError | Error;

interface IErrorHandler {
  (error: RequestError, opts: RequestConfig): void;
}

export interface IResultField {
  code: string;
  message: string;
  data: string;
}

export interface RequestConfig extends HttpRequestConfig {
  custom?: CustomHandler;
  onError?: IErrorHandler;
  requestInterceptors?: IRequestInterceptorTuple[];
  responseInterceptors?: IResponseInterceptorTuple[];
}

export interface CustomHandler extends HttpCustom {
  resultField?: IResultField;
  successCode?: number | string;
  // Splicing request parameters to url
  joinParamsToUrl?: boolean;
  // Format request parameter time
  formatDate?: boolean;
  // Whether to process the request result
  isTransformResponse?: boolean;
  // Whether to return native response headers
  // For example: use this attribute when you need to get the response headers
  isReturnNativeResponse?: boolean;
  // Whether to join url
  joinPrefix?: boolean;

  // 请求拼接路径
  urlPrefix?: string;
  // Whether to add a timestamp
  joinTime?: boolean;
}
