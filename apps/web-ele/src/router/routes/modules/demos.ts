import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1000,
      title: "机构管理",
      authority: ['super']
    },
    name: 'Organization',
    path: '/Organization',
    component: () => import('#/views/demos/element/index.vue'),
  },
  {
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1000,
      title: "课程管理",
      authority: ['super', "teacher"]
    },
    name: 'Curriculum',
    path: '/Curriculum',
    component: () => import('#/views/demos/element/index.vue'),
  },
];

export default routes;
