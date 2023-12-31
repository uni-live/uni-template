import { VLuch } from './luch';
import { ContentTypeEnum } from './enum';
import type { IHttpContext } from './types';
import { merge } from 'lodash-es';

export let context: IHttpContext = {
  // 响应的过期时间
  timeout: 10 * 1000,
  // 基础接口地址
  header: { 'Content-Type': ContentTypeEnum.JSON },
  custom: {
    // 自定义后端返回的字段
    resultField: {
      code: 'code',
      message: 'message',
      data: 'data',
    },
    // 后端返回数据格式，请求成功的依据
    successCode: 0,
    // 默认将prefix 添加到url
    joinPrefix: true,
    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    isReturnNativeResponse: false,
    // 需要对返回数据进行处理
    isTransformResponse: true,
    // post请求的时候添加参数到url
    joinParamsToUrl: false,
    // 格式化提交参数时间
    formatDate: true,
    // 接口地址
    baseURL: '',
    // 接口拼接地址
    urlPrefix: '',
    //  是否加入时间戳
    joinTime: true,
    // 重连
    retryRequest: {
      isOpenRetry: false,
      count: 5,
      waitTime: 100,
    },
  },
};

export let http: VLuch;

export async function register(opts?: IHttpContext) {
  context = merge(context, opts);

  http = new VLuch(context);

  return http;
}
