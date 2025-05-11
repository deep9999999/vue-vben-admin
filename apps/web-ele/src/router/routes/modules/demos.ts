import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ic:round-menu',
      keepAlive: true,
      order: 1000,
      title: "机构管理",
      authority: ['super'],
      hideChildrenInMenu: true
    },
    name: 'Organization',
    path: '/Organization',
    children: [
      {
        name: 'Index',
        path: '',
        component: () => import('#/views/demos/element/index.vue'),
        meta: {
          // hideInMenu: true,
          title: "机构管理",
        },
      },
      {
        name: 'Detial',
        path: 'detail',
        component: () =>
          import(
            '#/views/demos/element/detail.vue'
          ),
        meta: {
          // hideInMenu: true,
          title: "机构详情",
        },
      },
      {
        name: 'Teacher',
        path: 'teachermgr',
        component: () =>
          import(
            '#/views/demos/element/teacherMgr.vue'
          ),
        meta: {
          // hideInMenu: true,
          title: "学校管理",
        },
      },
    ],
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
    component: () => import('#/views/demos/element/kc.vue'),
  },
];

export default routes;
