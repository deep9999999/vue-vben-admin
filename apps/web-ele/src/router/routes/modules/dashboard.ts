import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:layout-dashboard',
      order: -1,
      title: $t('page.dashboard.title'),
      authority: ['super']
    },
    name: 'Dashboard',
    path: '/dashboard',
    children: [
      {
        name: 'Analytics',
        path: '/analytics',
        component: () => import('#/views/dashboard/analytics/index.vue'),
        meta: {
          affixTab: true,
          icon: 'lucide:area-chart',
          title: "运营分析",
          authority: ['super']
        },
      },
      // {
      //   name: 'Workspace',
      //   path: '/workspace',
      //   component: () => import('#/views/dashboard/workspace/index.vue'),
      //   meta: {
      //     icon: 'carbon:workspace',
      //     title: $t('page.dashboard.workspace'),
      //   },
      // },
    ],
  },
];

export default routes;
