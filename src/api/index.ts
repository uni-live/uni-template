import { http } from '@app/shared';

enum API {
  DEMO = '/m2/3578190-0-default/124224247',
}

/**
 * @description 测试http组件是否可用
 */
export function getDemoList() {
  return http.get({
    url: API.DEMO,
  });
}
