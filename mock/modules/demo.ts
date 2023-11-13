import { MockMethod } from 'vite-plugin-mock';
import { resultPageSuccess, resultSuccess } from '../_util';

const getDemo = () => {
  return {
    id: '@guid',
    avatar: 'http://vjs.zencdn.net/v/oceans.png',
    title: '@title()',
    size: '@integer(1000, 2000)',
    duration: '@integer(100, 1000)',
    create_time: '@date("yyyy-MM-dd")',
    cover: 'http://vjs.zencdn.net/v/oceans.png',
  };
};

const getDemoList = () => {
  const arr: any[] = [];

  for (let index = 0; index < 100; index++) {
    arr.push(getDemo());
  }

  return arr;
};

export default [
  {
    url: '/api/list',
    timeout: 1000,
    statusCode: 200,
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 20 } = query;
      const videos = getDemoList();

      return resultPageSuccess(page, pageSize, videos);
    },
  },
  {
    url: '/api/demo',
    timeout: 1000,
    statusCode: 200,
    method: 'delete',
    response: ({ body }) => {
      return resultSuccess(body);
    },
  },
  {
    url: '/api/demo',
    timeout: 1000,
    statusCode: 200,
    method: 'get',
    response: () => {
      return resultSuccess(getDemo());
    },
  },
] as MockMethod[];
