import { http } from '@app/shared';

enum API {
  DEMO = '/demo',
}

/**
 * @description 测试http组件是否可用
 */
export function getDemoList() {
  return http.get({
    url: API.DEMO,
    params: {
      id: 'demo',
    },
  });
}
