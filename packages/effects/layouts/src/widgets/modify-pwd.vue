<script setup lang="ts">
import type { Recordable } from '@vben/types';
import { computed, reactive } from 'vue';
import { $t } from '@vben/locales';
import { useVbenForm, z } from '@vben-core/form-ui';
import { useVbenModal } from '@vben-core/popup-ui';
import { VbenAvatar, VbenButton } from '@vben-core/shadcn-ui';

import {

  ElMessage,
  
} from 'element-plus';


interface Props {
  avatar?: string;
  text?: string;
}

defineOptions({
  name: 'ModifyPwd',
});

withDefaults(defineProps<Props>(), {
  avatar: '',
  text: '',
});

const emit = defineEmits<{
  submit: [Recordable<any>];
  cancel: [];
}>();

const [Form, { resetForm, validate, getValues }] = useVbenForm(
  reactive({
    commonConfig: {
      hideLabel: true,
      hideRequiredMark: true,
    },
    schema: computed(() => [
      {
        component: 'VbenInputPassword' as const,
        componentProps: {
          placeholder: "旧密码"
        },
        fieldName: 'oldPassword',
        formFieldProps: { validateOnBlur: false },
        rules: z.string().min(1, { message: "密码最小6位" }),
      },
      {
        component: 'VbenInputPassword' as const,
        componentProps: {
          placeholder: "新密码",
        },
        fieldName: 'newPassword',
        label: "新密码",
        formFieldProps: { validateOnBlur: false },
        rules: z.string().min(6, { message: "密码最小6位" }),
      },
      {
        component: 'VbenInputPassword' as const,
        componentProps: {
          placeholder: "确认密码",
        },
        fieldName: 'confirmPassword',
        formFieldProps: { validateOnBlur: false },
        label: "确认密码",
        rules: z.string().min(6, { message: "密码最小6位" }),
      },
    ]),
    showDefaultActions: false,
  }),
);

const [Modal, formApi] = useVbenModal({
  onConfirm() {
    handleSubmit();
  },
  onCancel() {
    emit('cancel');
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      resetForm();
    }
  },
});

async function handleSubmit() {
  const { valid } = await validate();
  const values = await getValues();
  if (valid) {
    if (values.newPassword !== values.confirmPassword) {
      ElMessage.error('两次输入的密码不一致');
      return;
    }
    emit('submit', {
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
      confirmPassword: values.confirmPassword,
    });
  }
}
</script>

<template>
  <Modal
    :footer="false"
    :fullscreen-button="false"
    :title="$t('ui.widgets.modifyPassword.title')"
  >
    <div
      class="mb-10 flex w-full flex-col items-center px-10"
      @keydown.enter.prevent="handleSubmit"
    >
      <div class="w-full">
        <div class="ml-2 flex w-full flex-col items-center">
          <VbenAvatar
            :src="avatar"
            class="size-20"
            dot-class="bottom-0 right-1 border-2 size-4 bg-green-500"
          />
          <div class="text-foreground my-6 flex items-center font-medium">
            {{ text }}
          </div>
        </div>
        <Form />
        <div class="mt-6 flex justify-end space-x-4">
          <VbenButton @click="formApi.close()">
            {{ $t('common.cancel') }}
          </VbenButton>
          <VbenButton type="primary" @click="handleSubmit">
            {{ $t('common.confirm') }}
          </VbenButton>
        </div>
      </div>
    </div>
  </Modal>
</template>
