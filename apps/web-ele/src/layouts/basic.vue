<script lang="ts" setup>
import type { NotificationItem } from '@vben/layouts';

import { computed, ref, watch, onMounted } from 'vue';

import { AuthenticationLoginExpiredModal } from '@vben/common-ui';
import { VBEN_DOC_URL, VBEN_GITHUB_URL } from '@vben/constants';
import { useWatermark } from '@vben/hooks';
import { BookOpenText, CircleHelp, MdiGithub } from '@vben/icons';
import {
  BasicLayout,
  LockScreen,
  Notification,
  UserDropdown,
  ModifyPwd
} from '@vben/layouts';
import { preferences } from '@vben/preferences';
import { useAccessStore, useUserStore } from '@vben/stores';
import { openWindow } from '@vben/utils';

import { $t } from '#/locales';
import { useAuthStore } from '#/store';
import LoginForm from '#/views/_core/authentication/login.vue';
import { useVbenModal } from '@vben/common-ui';

import {
 getMessageList,
 hasUnreadMessage
} from '#/api/core/sys';

import {
  updatePassword
} from '#/api/core/sys';



const [LockModal, lockModalApi] = useVbenModal({
  connectedComponent: ModifyPwd,
});

const notifications = ref<NotificationItem[]>([
  // {
  //   avatar: 'https://avatar.vercel.sh/vercel.svg?text=VB',
  //   date: '3小时前',
  //   isRead: true,
  //   message: '描述信息描述信息描述信息',
  //   title: '收到了 14 份新周报',
  // },
  // {
  //   avatar: 'https://avatar.vercel.sh/1',
  //   date: '刚刚',
  //   isRead: false,
  //   message: '描述信息描述信息描述信息',
  //   title: '朱偏右 回复了你',
  // },
  // {
  //   avatar: 'https://avatar.vercel.sh/1',
  //   date: '2024-01-01',
  //   isRead: false,
  //   message: '描述信息描述信息描述信息',
  //   title: '曲丽丽 评论了你',
  // },
  // {
  //   avatar: 'https://avatar.vercel.sh/satori',
  //   date: '1天前',
  //   isRead: false,
  //   message: '描述信息描述信息描述信息',
  //   title: '代办提醒',
  // },
]);



const userStore = useUserStore();
const authStore = useAuthStore();
const accessStore = useAccessStore();
const { destroyWatermark, updateWatermark } = useWatermark();
const showDot = computed(() =>
  notifications.value.some((item) => !item.isRead),
);

const page = {
  currentPage:1,
  pageSize: 20
}
onMounted(async ()=>{
  // const resp: any = await getMessageList({
  //         page: page.currentPage,
  //         pageSize: page.pageSize,
  //       });
  //       return resp;

 
})

const handleSubmitModifyPwd = async (data: any) => {
  lockModalApi.close();
  console.log("修改密码", data)

  await updatePassword(data);
  await handleLogout();
};

const menus = computed(() => {
  const roles = userStore.userInfo?.roles || [];
  if (roles.includes('teacher')) {
    return [];
  }

  return [
    {
      handler: () => {
        lockModalApi.open();
      },
      icon: BookOpenText,
      text: "修改密码",
    },
  ]
});

const avatar = computed(() => {
  return userStore.userInfo?.avatar ?? preferences.app.defaultAvatar;
});

async function handleLogout() {
  await authStore.logout(false);
}

function handleNoticeClear() {
  notifications.value = [];
}

function handleMakeAll() {
  notifications.value.forEach((item) => (item.isRead = true));
}
watch(
  () => preferences.app.watermark,
  async (enable) => {
    if (enable) {
      await updateWatermark({
        content: `${userStore.userInfo?.username} - ${userStore.userInfo?.realName}`,
      });
    } else {
      destroyWatermark();
    }
  },
  {
    immediate: true,
  },
);
</script>

<template>

  <LockModal
  :avatar
    @submit="handleSubmitModifyPwd"
  />

  <BasicLayout @clear-preferences-and-logout="handleLogout">
    
    <template #user-dropdown>
      <UserDropdown
        :avatar
        :menus
        :text="userStore.userInfo?.realName"
        :description="userStore.userInfo?.username"
        tag-text=""
        @logout="handleLogout"
      />
    </template>
    <template #notification>

      
      <ModifyPwd />
      <Notification
        :dot="showDot"
        :notifications="notifications"
        @clear="handleNoticeClear"
        @make-all="handleMakeAll"
      />
    </template>
    <template #extra>
      <AuthenticationLoginExpiredModal
        v-model:open="accessStore.loginExpired"
        :avatar
      >
        <LoginForm />
      </AuthenticationLoginExpiredModal>
    </template>
    <template #lock-screen>
      <LockScreen :avatar @to-login="handleLogout" />
    </template>
  </BasicLayout>
</template>
