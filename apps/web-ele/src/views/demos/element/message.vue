<script lang="ts" setup>
import { ref, nextTick, shallowRef,onBeforeUnmount } from 'vue';
import { Page } from '@vben/common-ui';
import { ElInput, ElButton, } from 'element-plus';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import {
 getMessageList,
 sendMessage,
 readMessage,
 hasUnreadMessage,
 getMsgList
} from '#/api/core/sys';
import '@wangeditor/editor/dist/css/style.css';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';

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

// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef();

// 内容 HTML
const valueHtml = ref('');

// 添加消息
const addMessage = async () => {
  if (!title.value || !content.value) {
    return;
  }
  
  await sendMessage({
    title: title.value,
    content: content.value,
    type: 2
  })

  gridApi.reload();
  
  // 清空输入
  title.value = '';
  content.value = '';
  valueHtml.value = '';
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
        const resp: any = await getMsgList({
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


// 组件销毁时，也及时销毁编辑器，重要！
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;

  editor.destroy();
});

// 编辑器回调函数
const handleCreated = (editor:any) => {
  console.log('created', editor);
  editorRef.value = editor; // 记录 editor 实例，重要！
};
const handleChange = (editor:any) => {
  console.log('change:', editor.getHtml());
  content.value = editor.getHtml()
};
const handleDestroyed = (editor:any) => {
  console.log('destroyed', editor);
};
const handleFocus = (editor:any) => {
  console.log('focus', editor);
};
const handleBlur = (editor:any) => {
  console.log('blur', editor);
};

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
            <div style="border: 1px solid #ccc; margin-top: 10px">
              <Toolbar
                :editor="editorRef"
                :defaultConfig="toolbarConfig"
                :mode="mode"
                style="border-bottom: 1px solid #ccc"
              />
              <Editor
                :defaultConfig="editorConfig"
                :mode="mode"
                v-model="valueHtml"
                style="height: 400px; overflow-y: hidden"
                @onCreated="handleCreated"
                @onChange="handleChange"
                @onDestroyed="handleDestroyed"
                @onFocus="handleFocus"
                @onBlur="handleBlur"
                @customAlert="customAlert"
                @customPaste="customPaste"
              />
          </div>
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
