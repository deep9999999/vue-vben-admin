export interface UserInfo {
  id: number;
  password: string;
  realName: string;
  roles: string[];
  username: string;
  homePath?: string;
}

export const MOCK_USERS: UserInfo[] = [
  {
    id: 0,
    password: '123456',
    realName: 'admin',
    roles: ['super'],
    username: 'admin',
  },
  {
    id: 1,
    password: '123456',
    realName: 'teacher',
    roles: ['teacher'],
    username: 'teacher',
    homePath: '/Curriculum',
  }
];

export const MOCK_CODES = [
  // super
  {
    codes: ['AC_100100', 'AC_100110', 'AC_100120', 'AC_100010'],
    username: 'vben',
  },
  {
    // admin
    codes: ['AC_100010', 'AC_100020', 'AC_100030'],
    username: 'admin',
  },
  {
    // user
    codes: ['AC_1000001', 'AC_1000002'],
    username: 'jack',
  },
];

const dashboardMenus = [
  {
    meta: {
      order: -1,
      title: 'page.dashboard.title',
    },
    name: 'Dashboard',
    path: '/dashboard',
    redirect: '/analytics',
    children: [
      {
        name: 'Analytics',
        path: '/analytics',
        component: '/dashboard/analytics/index',
        meta: {
          affixTab: true,
          title: 'page.dashboard.analytics',
        },
      },
      {
        name: 'Workspace',
        path: '/workspace',
        component: '/dashboard/workspace/index',
        meta: {
          title: 'page.dashboard.workspace',
        },
      },
    ],
  },
];

const createDemosMenus = (role: 'admin' | 'super' | 'user') => {
  const roleWithMenus = {
    admin: {
      component: '/demos/access/admin-visible',
      meta: {
        icon: 'mdi:button-cursor',
        title: 'demos.access.adminVisible',
      },
      name: 'AccessAdminVisibleDemo',
      path: '/demos/access/admin-visible',
    },
    super: {
      component: '/demos/access/super-visible',
      meta: {
        icon: 'mdi:button-cursor',
        title: 'demos.access.superVisible',
      },
      name: 'AccessSuperVisibleDemo',
      path: '/demos/access/super-visible',
    },
    user: {
      component: '/demos/access/user-visible',
      meta: {
        icon: 'mdi:button-cursor',
        title: 'demos.access.userVisible',
      },
      name: 'AccessUserVisibleDemo',
      path: '/demos/access/user-visible',
    },
  };

  return [
    {
      meta: {
        icon: 'ic:baseline-view-in-ar',
        keepAlive: true,
        order: 1000,
        title: 'demos.title',
      },
      name: 'Demos',
      path: '/demos',
      redirect: '/demos/access',
      children: [
        {
          name: 'AccessDemos',
          path: '/demosaccess',
          meta: {
            icon: 'mdi:cloud-key-outline',
            title: 'demos.access.backendPermissions',
          },
          redirect: '/demos/access/page-control',
          children: [
            {
              name: 'AccessPageControlDemo',
              path: '/demos/access/page-control',
              component: '/demos/access/index',
              meta: {
                icon: 'mdi:page-previous-outline',
                title: 'demos.access.pageAccess',
              },
            },
            {
              name: 'AccessButtonControlDemo',
              path: '/demos/access/button-control',
              component: '/demos/access/button-control',
              meta: {
                icon: 'mdi:button-cursor',
                title: 'demos.access.buttonControl',
              },
            },
            {
              name: 'AccessMenuVisible403Demo',
              path: '/demos/access/menu-visible-403',
              component: '/demos/access/menu-visible-403',
              meta: {
                authority: ['no-body'],
                icon: 'mdi:button-cursor',
                menuVisibleWithForbidden: true,
                title: 'demos.access.menuVisible403',
              },
            },
            roleWithMenus[role],
          ],
        },
      ],
    },
  ];
};

export const MOCK_MENUS = [
  {
    menus: [...dashboardMenus, ...createDemosMenus('super')],
    username: 'vben',
  },
  {
    menus: [...dashboardMenus, ...createDemosMenus('admin')],
    username: 'admin',
  },
  {
    menus: [...dashboardMenus, ...createDemosMenus('user')],
    username: 'jack',
  },
];

export const MOCK_MENU_LIST = [
  {
    id: 1,
    name: 'Workspace',
    status: 1,
    type: 'menu',
    icon: 'mdi:dashboard',
    path: '/workspace',
    component: '/dashboard/workspace/index',
    meta: {
      icon: 'carbon:workspace',
      title: 'page.dashboard.workspace',
      affixTab: true,
      order: 0,
    },
  },
  {
    id: 2,
    meta: {
      icon: 'carbon:settings',
      order: 9997,
      title: 'system.title',
      badge: 'new',
      badgeType: 'normal',
      badgeVariants: 'primary',
    },
    status: 1,
    type: 'catalog',
    name: 'System',
    path: '/system',
    children: [
      {
        id: 201,
        pid: 2,
        path: '/system/menu',
        name: 'SystemMenu',
        authCode: 'System:Menu:List',
        status: 1,
        type: 'menu',
        meta: {
          icon: 'carbon:menu',
          title: 'system.menu.title',
        },
        component: '/system/menu/list',
        children: [
          {
            id: 20_101,
            pid: 201,
            name: 'SystemMenuCreate',
            status: 1,
            type: 'button',
            authCode: 'System:Menu:Create',
            meta: { title: 'common.create' },
          },
          {
            id: 20_102,
            pid: 201,
            name: 'SystemMenuEdit',
            status: 1,
            type: 'button',
            authCode: 'System:Menu:Edit',
            meta: { title: 'common.edit' },
          },
          {
            id: 20_103,
            pid: 201,
            name: 'SystemMenuDelete',
            status: 1,
            type: 'button',
            authCode: 'System:Menu:Delete',
            meta: { title: 'common.delete' },
          },
        ],
      },
      {
        id: 202,
        pid: 2,
        path: '/system/dept',
        name: 'SystemDept',
        status: 1,
        type: 'menu',
        authCode: 'System:Dept:List',
        meta: {
          icon: 'carbon:container-services',
          title: 'system.dept.title',
        },
        component: '/system/dept/list',
        children: [
          {
            id: 20_401,
            pid: 201,
            name: 'SystemDeptCreate',
            status: 1,
            type: 'button',
            authCode: 'System:Dept:Create',
            meta: { title: 'common.create' },
          },
          {
            id: 20_402,
            pid: 201,
            name: 'SystemDeptEdit',
            status: 1,
            type: 'button',
            authCode: 'System:Dept:Edit',
            meta: { title: 'common.edit' },
          },
          {
            id: 20_403,
            pid: 201,
            name: 'SystemDeptDelete',
            status: 1,
            type: 'button',
            authCode: 'System:Dept:Delete',
            meta: { title: 'common.delete' },
          },
        ],
      },
    ],
  },
  {
    id: 9,
    meta: {
      badgeType: 'dot',
      order: 9998,
      title: 'demos.vben.title',
      icon: 'carbon:data-center',
    },
    name: 'Project',
    path: '/vben-admin',
    type: 'catalog',
    status: 1,
    children: [
      {
        id: 901,
        pid: 9,
        name: 'VbenDocument',
        path: '/vben-admin/document',
        component: 'IFrameView',
        type: 'embedded',
        status: 1,
        meta: {
          icon: 'carbon:book',
          iframeSrc: 'https://doc.vben.pro',
          title: 'demos.vben.document',
        },
      },
      {
        id: 902,
        pid: 9,
        name: 'VbenGithub',
        path: '/vben-admin/github',
        component: 'IFrameView',
        type: 'link',
        status: 1,
        meta: {
          icon: 'carbon:logo-github',
          link: 'https://github.com/vbenjs/vue-vben-admin',
          title: 'Github',
        },
      },
      {
        id: 903,
        pid: 9,
        name: 'VbenAntdv',
        path: '/vben-admin/antdv',
        component: 'IFrameView',
        type: 'link',
        status: 0,
        meta: {
          icon: 'carbon:hexagon-vertical-solid',
          badgeType: 'dot',
          link: 'https://ant.vben.pro',
          title: 'demos.vben.antdv',
        },
      },
    ],
  },
  {
    id: 10,
    component: '_core/about/index',
    type: 'menu',
    status: 1,
    meta: {
      icon: 'lucide:copyright',
      order: 9999,
      title: 'demos.vben.about',
    },
    name: 'About',
    path: '/about',
  },
];

export function getMenuIds(menus: any[]) {
  const ids: number[] = [];
  menus.forEach((item) => {
    ids.push(item.id);
    if (item.children && item.children.length > 0) {
      ids.push(...getMenuIds(item.children));
    }
  });
  return ids;
}

// mock 机构列表
// 生成100条教育机构数据
export const OrgList = Array.from({ length: 100 }, (_, index) => {
  const states = ['正常授权', '授权到期', '停止授权'];
  const areas = [
    '北京省,北京市,海淀区', '上海省,上海市,浦东新区', '广东省,广州市,天河区', '广东省,深圳市,南山区',
    '四川省,成都市,武侯区', '浙江省,杭州市,西湖区', '江苏省,南京市,玄武区', '湖北省,武汉市,江汉区',
    '陕西省,西安市,雁塔区', '重庆省,重庆市,渝中区', '江苏省,苏州市,姑苏区', '山东省,青岛市,市南区',
    '天津省,天津市,和平区', '湖南省,长沙市,岳麓区', '江西省,南昌市,东湖区'
  ];
  const prefixes = ['未来', '智慧', '育才', '重点', '示范', '附属', '寄宿', '民办', '国际', '创新'];
  
  // 生成手机号
  const phone = `13${String(Math.floor(Math.random() * 10000000000)).padStart(9, '0')}`;
  
  // 生成日期 (2024年内随机日期)
  const date = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
  const releaseDate = date.toISOString().split('T')[0];

  return {
    id: String(index + 1),
    name: `${prefixes[Math.floor(Math.random() * prefixes.length)]}教育${index + 1}号`,
    contact: phone,
    school: `${Math.floor(Math.random() * 20) + 1}号中学`,
    area: areas[Math.floor(Math.random() * areas.length)],
    state: states[Math.floor(Math.random() * states.length)],
    releaseDate: releaseDate,
  };
});


interface SchoolItem {
  id: string;
  name: string;
  principal: string;
  address?: string;
  area: string;
  phone: string;
  type: string;
  releaseDate: string;
  state: string;
  orgId: string;
}

export const SchoolList: SchoolItem[] = [
  {
    id: '1',
    name: '武汉第一中学',
    principal: '张大明',
    address: '人和街道幸福路123号',
    area: '湖北省,武汉市,洪山区',
    phone: '027-12345678',
    type: '公立学校',
    releaseDate: '2000-09-01',
    orgId: '100',
    state: '正常授权'
  },
  {
    id: '2',
    name: '武汉育才中学',
    principal: '李文华',
    address: '五里店大道456号',
    area: '湖北省,武汉市,洪山区',
    phone: '027-87654321',
    type: '公立学校',
    releaseDate: '1995-09-01',
    orgId: '100',
    state: '授权到期'
  },
  {
    id: '3',
    name: '武汉八中',
    principal: '王建国',
    address: '民族路789号',
    area: '湖北省,武汉市,洪山区',
    phone: '027-65432198',
    type: '公立学校',
    releaseDate: '1998-09-01',
    orgId: '100',
    state: '正常授权'
  },
  {
    id: '4',
    name: '华师一附中',
    principal: '赵明',
    address: '学府大道234号',
    area: '湖北省,武汉市,洪山区',
    phone: '027-56789012',
    type: '公立学校',
    releaseDate: '1997-09-01',
    orgId: '100',
    state: '停止授权'
  },
  {
    id: '5',
    name: '武汉实验中学',
    principal: '陈光',
    address: '龙兴街道567号',
    area: '湖北省,武汉市,洪山区',
    phone: '027-34567890',
    type: '公立学校',
    releaseDate: '1996-09-01',
    orgId: '100',
    state: '正常授权'
  },
  {
    id: '6',
    name: '树人学校',
    principal: '周华',
    address: '科园四路890号',
    area: '湖北省,武汉市,洪山区',
    phone: '027-23456789',
    type: '私立学校',
    releaseDate: '2010-09-01',
    orgId: '100',
    state: '授权到期'
  },
  {
    id: '7',
    name: '行知学校',
    principal: '吴军',
    address: '大学城中路123号',
    area: '湖北省,武汉市,洪山区',
    phone: '027-45678901',
    type: '私立学校',
    releaseDate: '2012-09-01',
    orgId: '100',
    state: '正常授权'
  },
  {
    id: '8',
    name: '光谷中学',
    principal: '刘强',
    address: '金开大道456号',
    area: '湖北省,武汉市,洪山区',
    phone: '027-89012345',
    type: '公立学校',
    releaseDate: '2015-09-01',
    orgId: '100',
    state: '停止授权'
  },
  {
    id: '9',
    name: '江南实验学校',
    principal: '张文',
    address: '江南大道789号',
    area: '湖北省,武汉市,洪山区',
    phone: '027-90123456',
    type: '公立学校',
    releaseDate: '2008-09-01',
    orgId: '100',
    state: '正常授权'
  },
  {
    id: '10',
    name: '融创学校',
    principal: '李明',
    address: '创新路101号',
    area: '湖北省,武汉市,洪山区',
    phone: '027-78901234',
    type: '私立学校',
    releaseDate: '2018-09-01',
    orgId: '100',
    state: '授权到期'
  }
];

interface TeacherItem {
  id: string;
  name: string;
  gender: string;
  subject: string;
  phone: string;
  email: string;
  state: string;
  schoolId?: string;
  orgId: string;
  schoolName?: string;
  orgName?: string;
  expireDate: string;
  password: string;
}

export const TeacherList: TeacherItem[] = [
  {
    id: '0',
    name: '张三',
    gender: '男',
    subject: '数学',
    phone: '13800138001',
    email: 'zhangsan@school.com',
    state: '正常授权',
    orgId: '100',
    orgName: '未来教育1号',
    expireDate: '2024-12-31',
    password: '123456'
  },
  {
    id: '1',
    name: '张三',
    gender: '男',
    subject: '数学',
    phone: '13800138001',
    email: 'zhangsan@school.com',
    state: '正常授权',
    schoolId: '1',
    schoolName: '武汉第一中学',
    orgId: '100',
    orgName: '未来教育1号',
    expireDate: '2024-12-31',
    password: '123456'
  },
  {
    id: '2', 
    name: '李四',
    gender: '女',
    subject: '语文',
    phone: '13800138002',
    email: 'lisi@school.com',
    state: '正常授权',
    schoolId: '1',
    schoolName: '武汉第一中学',
    orgId: '100',
    orgName: '未来教育1号',
    expireDate: '2024-12-31',
    password: '123456'
  },
  {
    id: '3',
    name: '王五',
    gender: '男',
    subject: '英语',
    phone: '13800138003',
    email: 'wangwu@school.com',
    state: '授权到期',
    schoolId: '2',
    schoolName: '武汉育才中学',
    orgId: '100',
    orgName: '未来教育1号',
    expireDate: '2024-10-31',
    password: '123456'
  },
  {
    id: '4',
    name: '赵六',
    gender: '女',
    subject: '物理',
    phone: '13800138004',
    email: 'zhaoliu@school.com',
    state: '正常授权',
    schoolId: '2',
    schoolName: '武汉育才中学',
    orgId: '100',
    orgName: '未来教育1号',
    expireDate: '2024-12-31',
    password: '123456'
  },
  {
    id: '5',
    name: '孙七',
    gender: '男',
    subject: '化学',
    phone: '13800138005',
    email: 'sunqi@school.com',
    state: '停止授权',
    schoolId: '3',
    schoolName: '武汉八中',
    orgId: '100',
    orgName: '未来教育1号',
    expireDate: '2024-06-30',
    password: '123456'
  },
  {
    id: '6',
    name: '周八',
    gender: '女',
    subject: '生物',
    phone: '13800138006',
    email: 'zhouba@school.com',
    state: '正常授权',
    schoolId: '3',
    schoolName: '武汉八中',
    orgId: '100',
    orgName: '未来教育1号',
    expireDate: '2024-12-31',
    password: '123456'
  },
  {
    id: '7',
    name: '吴九',
    gender: '男',
    subject: '历史',
    phone: '13800138007',
    email: 'wujiu@school.com',
    state: '正常授权',
    schoolId: '4',
    schoolName: '华师一附中',
    orgId: '100',
    orgName: '未来教育1号',
    expireDate: '2024-12-31',
    password: '123456'
  },
  {
    id: '8',
    name: '郑十',
    gender: '女',
    subject: '地理',
    phone: '13800138008',
    email: 'zhengshi@school.com',
    state: '授权到期',
    schoolId: '4',
    schoolName: '华师一附中',
    orgId: '100',
    orgName: '未来教育1号',
    expireDate: '2024-09-30',
    password: '123456'
  },
  {
    id: '9',
    name: '钱十一',
    gender: '男',
    subject: '政治',
    phone: '13800138009',
    email: 'qianshiyi@school.com',
    state: '正常授权',
    schoolId: '5',
    schoolName: '武汉实验中学',
    orgId: '100',
    orgName: '未来教育1号',
    expireDate: '2024-12-31',
    password: '123456'
  },
  {
    id: '10',
    name: '孔十二',
    gender: '女',
    subject: '体育',
    phone: '13800138010',
    email: 'kongshier@school.com',
    state: '正常授权',
    schoolId: '5',
    schoolName: '武汉实验中学',
    orgId: '100',
    orgName: '未来教育1号',
    expireDate: '2024-12-31',
    password: '123456'
  }
];
