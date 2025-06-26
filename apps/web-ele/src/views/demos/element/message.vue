<script lang="ts" setup>
import { ref, nextTick } from 'vue';
import { Page } from '@vben/common-ui';
import { ElInput, ElButton, } from 'element-plus';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import {
 getMessageList
} from '#/api/core/sys';

// 消息列表数据
interface MessageItem {
  id: number;
  title: string;
  content: string;
  createTime: string;
}

const messageList = ref<MessageItem[]>([]);
const title = ref('');
const content = ref('');

// 添加消息
const addMessage = () => {
  if (!title.value || !content.value) {
    return;
  }
  
  const newMessage: MessageItem = {
    id: Date.now(),
    title: title.value,
    content: content.value,
    createTime: new Date().toLocaleString()
  };
  
  nextTick(() => {
    messageList.value.push(newMessage);
    console.log('消息列表:', messageList.value); // 添加这行
  });
  gridApi.refreshData(); // 添加这行，假设 gridApi 有 refreshData 方法
  
  // 清空输入
  title.value = '';
  content.value = '';
};

// 表格配置
const gridOptions: VxeTableGridOptions<MessageItem> = {
  columns: [
    { field: 'id', title: 'ID', width: 80 },
    { field: 'title', title: '标题', width: 200 },
    { field: 'content', title: '内容' },
    { field: 'createTime', title: '创建时间', width: 180 },
  ],
  height: '700px',
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        const resp: any = await getMessageList({
          page: page.currentPage,
          pageSize: page.pageSize,
        });
        return resp;
      },
    },
  },
  toolbarConfig: {
    custom: false,
    export: false,
    refresh: true,
    resizable: true,
    zoom: true,
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
});
</script>

<template>
  <Page>
    <div class="message-container">
      <!-- 左侧编辑区域 -->
      <div class="edit-area">
        <div class="input-group">
          <h3>标题</h3>
          <ElInput v-model="title" placeholder="请输入标题" />
        </div>
        <div class="input-group">
          <h3>内容</h3>
          <div class="editor-container">
            <ElInput
              v-model="content"
              type="textarea"
              :rows="10"
              placeholder="请输入内容"
            />
          </div>
        </div>
        <ElButton type="primary" @click="addMessage">添加消息</ElButton>
      </div>
      
      <!-- 右侧消息列表 -->
      <div class="message-list">
        <h2 style="margin-bottom: 10px;">消息列表</h2>
        <Grid :data="messageList" />
      </div>
    </div>
  </Page>
</template>

<style scoped>
.message-container {
  display: flex;
  gap: 20px;
  height: 100%;
  padding: 20px;
}

.edit-area {
  flex: 0.4;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.editor-container {
  flex: 1;
}

.message-list {
  flex: 0.6;
  border-left: 1px solid #eee;
  padding-left: 20px;
}
</style>
