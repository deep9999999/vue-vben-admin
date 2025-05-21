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
        name: 'Organization_Index',
        path: '',
        component: () => import('#/views/demos/element/index.vue'),
        meta: {
          // hideInMenu: true,
          title: "机构管理",
          keepAlive: true,
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
          keepAlive: true,
          title: "学校管理",
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
          keepAlive: true,
          title: "教师管理",
        },
      },
    ],
  },
  {
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1001,
      title: "课程管理",
      authority: ['super', "teacher"],
      hideChildrenInMenu: true
    },
    name: 'Curriculum',
    path: '/Curriculum',
    children: [
      {
        name: 'Curriculum_Index',
        path: '',
        component: () => import('#/views/demos/element/kc.vue'),
        meta: {
          // hideInMenu: true,
          title: "课程管理",
          keepAlive: true,
        },
      },
      {
        name: 'Information',
        path: 'information',
        component: () => import('#/views/demos/element/information.vue'),
        meta: {
          // hideInMenu: true,
          keepAlive: true,
          title: "资料管理",
        },
      },
    ]
  },
];

export default routes;
