<script setup lang="ts">
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { computed, h, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { useVbenModal } from '@vben/common-ui';
import { useAccessStore, useUserStore } from '@vben/stores';

import { ArrowLeft, FullScreen } from '@element-plus/icons-vue';
import {
  ElButton,
  ElCard,
  ElCol,
  ElDialog,
  ElIcon,
  ElMenu,
  ElMenuItem,
  ElMessage,
  ElMessageBox,
  ElRow,
  ElTabPane,
  ElTabs,
  ElTooltip,
} from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  addFile,
  deleteFile,
  editFile,
  fetchResources,
  getCourseDetail,
  getFileDetail,
  removeFile,
} from '#/api/core/sys';

// 预览相关状态
const previewVisible = ref(false);
const previewUrl = ref('');
const isFullscreen = ref(false);
const BackIcon = ArrowLeft;
const previewContainer = ref<HTMLElement | null>(null);

// 监听全屏变化事件
const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement;
};

onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange);
});

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
});

// 切换全屏状态
const toggleFullscreen = async () => {
  try {
    if (isFullscreen.value) {
      // 退出全屏模式
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } else {
      // 进入全屏模式
      if (previewContainer.value) {
        await previewContainer.value.requestFullscreen();
      }
    }
  } catch (error) {
    console.error('全屏切换失败:', error);
    ElMessage.error('全屏切换失败，请检查浏览器权限');
  }
};

// 关闭预览
const closePreview = async () => {
  // 如果处于全屏状态，先退出全屏
  if (document.fullscreenElement) {
    try {
      await document.exitFullscreen();
    } catch (error) {
      console.error('退出全屏失败:', error);
    }
  }

  previewVisible.value = false;
  previewUrl.value = '';
  isFullscreen.value = false;
};
const userStore = useUserStore();
// 判断是否为老师账户
const isTeacher = computed(() => {
  const roles = userStore.userInfo?.roles || [];
  return roles.includes('teacher');
});

interface UploadFileParams {
  file: File;
  onError?: (error: Error) => void;
  onProgress?: (progress: { percent: number }) => void;
  onSuccess?: (data: any, file: File) => void;
}

// 获取路由实例
const route = useRoute();

// 从 URL 获取参数
const courseId = route.query.courseId as string;

// 定义主标题和副标题
const mainTitle = ref('');
const subTitle = ref('');

// 当前激活的课程目录索引
const activeIndex: any = ref(0);
const selectCourse = (index: any) => {
  activeIndex.value = index;

  // 根据选中的课程索引获取对应的标签列表
  if (tabsList.value && tabsList.value.length > 0 && tabsList.value[index]) {
    // 获取当前选中课程的标签数据
    const currentTabs = tabsList.value[index].children || [];
    // 更新tabs数据
    tabs.value = currentTabs.map((tab: any) => ({
      name: tab.name,
      value: tab.id,
    }));
    // 重置当前激活的标签为第一个
    activeTab.value = 0;
    // 更新选中的标签值
    selectTabValue = tabs.value[0]?.value;
    // 重新加载表格数据
    gridApi.query();
  }
};
const tabsList = ref([]);
// 课程目录数据
const courseList = ref();

// 导航标签数据
const tabs: any = ref([]);

// 当前激活的标签索引
const activeTab: any = ref(0);
let selectTabValue: any = null;

if (tabs.value.length > 0) {
  selectTabValue = tabs.value[0].value;
}
// 选择标签的方法
const selectTab = (v: any) => {
  activeTab.value = v.index;
  selectTabValue = tabs.value[v.index].value;

  // 添加滚动逻辑
  nextTick(() => {
    // 获取当前选中的标签元素
    const activeTabElement = document.querySelector('.el-tabs__item.is-active');
    if (activeTabElement) {
      // 使用 scrollIntoView 进行平滑滚动
      activeTabElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  });

  // 使用gridApi重新加载对应标签页的数据
  gridApi.query();
};

// 定义加载状态
const loading = ref(false);

// 获取课程数据
const fetchCourseData = async () => {
  try {
    loading.value = true;
    // 调用接口获取课程详情
    const courseDetail: any = await getCourseDetail({ id: courseId });
    if (courseDetail) {
      // 更新课程标题信息
      mainTitle.value = courseDetail.name;
      subTitle.value = courseDetail.secname;
      // 更新课程列表
      if (courseDetail.children && courseDetail.children.length > 0) {
        courseList.value = courseDetail.children.map((item: any) => ({
          name: item.name,
          value: item.id,
        }));

        tabsList.value = courseDetail.children;
        selectCourse(0);
      }
    }
  } catch (error) {
    console.error('获取课程数据失败:', error);
    ElMessage.error('获取课程数据失败');
  } finally {
    loading.value = false;
  }
};

// 在组件挂载时获取数据
onMounted(() => {
  fetchCourseData();
});

const resroot = 'http://118.31.173.178:6001';
// https://ow365.cn/?i=35717&furl=http://118.31.173.178:6001/api/download/2025/05/23/1%E5%89%AF%E6%9C%AC%E6%8B%BC%E8%AF%BB%E5%90%AF%E8%92%99PPT%E7%AC%AC%E4%B8%80%E8%AF%BE(1).pptx
// 打开资源方法
const openResource = async (item: any) => {
  let url = '';
  if (item.type === 'DOC') {
    // 文档类型，打开文档预览链接
    url = `${resroot}${item.fileUrl}`;
    window.open(url, '_blank');
  } else if (item.type === 'PPT') {
    // PPT类型，打开内嵌预览
    url = `https://ow365.cn/?i=35717&n=3&furl=${resroot}${item.fileUrl}`;
    previewUrl.value = url;
    previewVisible.value = true;

    // 等待DOM更新，然后自动请求全屏
    await nextTick();

    // 等待对话框动画完成后请求全屏
    setTimeout(async () => {
      if (previewContainer.value) {
        try {
          await previewContainer.value.requestFullscreen();
        } catch (error) {
          console.error('自动全屏失败:', error);
          // 不显示错误提示，避免影响用户体验
        }
      }
    }, 300); // 延迟300ms等待对话框动画
  }
};

// 定义表格行数据类型
interface RowType {
  name: string;
  createTime: string;
  type: 'doc' | 'ppt';
}

// 修改表格配置，添加checkbox配置
const gridOptions: VxeTableGridOptions<RowType> = {
  checkboxConfig: {
    highlight: true,
    labelField: 'index',
  },
  columns: [
    { align: 'left', title: '', type: 'checkbox', width: 50 },
    { field: 'name', title: '资料', width: 200, align: 'left' },
    { field: 'type', title: '类型', width: 50, align: 'left' },
    { field: 'fileUrl', title: 'URL', width: 300, align: 'left' },
    {
      field: 'createTime',
      title: '创建时间',
    },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: '操作',
    },
  ],
  rowConfig: {
    isHover: true,
    keyField: 'name',
  },
  height: '600px',
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        if (!selectTabValue) return [];

        const resp: any = await fetchResources({
          page: page.currentPage,
          pageSize: page.pageSize,
          id: selectTabValue,
        });

        return resp;
      },
    },
  },
  toolbarConfig: {
    custom: true,
    export: true,
    refresh: true,
    resizable: true,
    zoom: true,
  },
};

// 创建表格实例
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
});

//  编辑对话框
const [Form, formApi] = useVbenForm({
  handleSubmit: onSubmit,
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'name',
      label: '资料名称',
      rules: 'required',
    },
    {
      component: 'Select',
      componentProps: {
        placeholder: '请输入',
        options: [
          { label: 'PPT', value: 'PPT' },
          { label: 'DOC', value: 'DOC' },
          { label: 'AUDIO', value: 'AUDIO' },
          { label: 'VIDEO', value: 'VIDEO' },
        ],
      },
      fieldName: 'type',
      label: '文件类型',
      rules: 'required',
    },
    // {
    //   component: 'RadioGroup',
    //   componentProps: {
    //     options: [
    //       {
    //         label: '查看',
    //         value: '查看',
    //       },
    //       {
    //         label: '下载',
    //         value: '下载',
    //       }
    //     ],
    //   },
    //   rules: 'required',
    //   defaultValue: '正常授权',
    //   fieldName: 'state',
    //   label: '授权状态',
    // },
    {
      component: 'Upload',
      componentProps: {
        headers: {
          Authorization: `Bearer ${useAccessStore().accessToken}`,
        },
        accept: '.pptx,.ppt,.doc,.docx,.mp3,.mp4',
        action: '/api/file/upload',
        limit: 1,
        multiple: false,
        // 上传列表的内建样式，支持四种基本样式 text, picture, picture-card 和 picture-circle
        listType: 'text',
        name: 'file',
        'on-remove': async (uploadFile: any, uploadFiles: any) => {
          await removeFile({ id: uploadFile.id });
          gridApi.query();
        },
      },
      fieldName: 'files',
      label: '文件',
      renderComponentContent: () => {
        return {
          default: () =>
            h('span', { style: { fontSize: '14px' } }, '点击上传资料'),
        };
      },
      rules: 'required',
    },
  ],
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  fullscreenButton: false,
  onCancel() {
    modalApi.close();
  },
  onConfirm: async () => {
    await formApi.validateAndSubmitForm();
    // modalApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const { values } = modalApi.getData<Record<string, any>>();
      if (values) {
        formApi.setValues(values);
      }
    }
  },
  title: '资料信息',
});

async function onSubmit(values: Record<string, any>) {
  ElMessage.success('正在提交中...');
  modalApi.lock();
  try {
    const formvalues: any = await formApi.getValues<Record<string, any>>();
    const { values } = modalApi.getData<Record<string, any>>();
    if (formvalues) {
      await (values && values.id != null
        ? editFile({
            id: values.id,
            name: formvalues.name,
            type: formvalues.type,
            fileUrl: formvalues.files[0].response.data.url,
          })
        : addFile({
            classId: selectTabValue,
            fileUrl: formvalues.files[0].response.data.url,
            name: formvalues.name,
            type: formvalues.type,
          }));
    }
    // setTimeout(() => {
    modalApi.close();
    gridApi.reload();
    ElMessage.success(`提交成功：${JSON.stringify(formvalues)}`);
    // }, 1000);
  } catch {
    ElMessage.error('提交失败');
    modalApi.unlock();
  }
}

const onKcDatil = async (row: any) => {
  const rowdata: any = await getFileDetail({ id: row.id });
  // 克隆数据以避免直接修改原始数据
  const clonedData = JSON.parse(JSON.stringify(rowdata));

  if (clonedData.fileUrl && clonedData.fileUrl.length > 0) {
    clonedData.files = [
      {
        name: clonedData.fileUrl,
        url: clonedData.fileUrl,
        id: clonedData.id,
        response: {
          data: {
            url: clonedData.fileUrl,
          },
        },
      },
    ];
  }

  modalApi.setData({
    // 表单值
    values: clonedData,
    id: row.id,
  });

  modalApi.setState({
    title: '资料详情',
  });

  modalApi.open();
};

// 添加新增方法
const onAdd = async () => {
  modalApi.open();
  // 清空表单数据
  formApi.resetForm();
  modalApi.setData({
    courseId: selectTabValue,
  });
  modalApi.setState({
    title: '新增资料',
  });
};

// 添加删除方法
const onDel = async () => {
  const rows = gridApi.grid.getCheckboxRecords();
  if (rows.length === 0) {
    ElMessage.warning('请选择要删除的资料');
    return;
  }

  ElMessageBox.confirm(`确定要删除选中的 ${rows.length} 个资料吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        // TODO: 调用删除接口
        await deleteFile(rows.map((row) => row.id));
        ElMessage.success('删除成功');
        // 刷新表格数据
        gridApi.reload();
      } catch {
        ElMessage.error('删除失败');
      }
    })
    .catch(() => {
      ElMessage.info('已取消删除');
    });
};
</script>

<template>
  <Page auto-content-height>
    <ElRow :gutter="5">
      <ElCol :span="4">
        <ElCard
          class="course-sidebar"
          shadow="hover"
        >
          <template #header>
            <div class="flex flex-col">
              <span class="text-base font-bold">{{ mainTitle }}</span>
              <span class="mt-2 text-sm text-gray-500">{{ subTitle }}</span>
            </div>
          </template>
          <div class="h-[600px] overflow-y-auto">
            <ElMenu
              :default-active="String(activeIndex)"
              class="course-menu"
            >
              <ElMenuItem
                v-for="(item, index) in courseList"
                :key="index"
                :index="String(index)"
                @click="selectCourse(index)"
              >
                <template #title>
                  <span class="mr-2 text-blue-500">{{
                    String(index + 1).padStart(2, '0')
                  }}</span>
                  <span>{{ item.name }}</span>
                </template>
              </ElMenuItem>
            </ElMenu>
          </div>
        </ElCard>
      </ElCol>
      <ElCol :span="20">
        <ElTabs
          v-model="activeTab"
          @tab-click="selectTab"
        >
          <ElTabPane
            v-for="(tab, index) in tabs"
            :key="index"
            :label="tab.name"
            :name="index"
          />
        </ElTabs>
        <Grid>
          <template #action="{ row }">
            <ElButton
              type="primary"
              size="small"
              :disabled="row.fileUrl == null || row.fileUrl == ''"
              @click="openResource(row)"
            >
              {{ row.type === 'DOC' ? '备课' : '上课' }}
            </ElButton>
            <ElButton
              v-if="!isTeacher"
              type="primary"
              size="small"
              @click="onKcDatil(row)"
            >
              详情
            </ElButton>
          </template>
          <template #toolbar-actions>
            <ElButton
              v-if="!isTeacher && tabs.length > 0"
              type="primary"
              @click="onAdd"
            >
              新增
            </ElButton>
            <ElButton
              v-if="!isTeacher && tabs.length > 0"
              type="danger"
              class="mt-1"
              @click="onDel"
            >
              删除
            </ElButton>
          </template>
        </Grid>
      </ElCol>
    </ElRow>

    <!-- <el-loading v-model:full-screen="loading" /> -->
    <!-- 左侧课程目录 -->

    <!-- 右侧内容区域 -->
    <!-- <Page auto-content-width class="w-[100%]">
      <el-tabs v-model="activeTab" @tab-click="selectTab">
              <el-tab-pane 
                v-for="(tab, index) in tabs" 
                :key="index"
                :label="tab.name"
                :name="index"
              />
      </el-tabs>
      <Grid>
        <template #action="{ row }">
          <el-button 
            type="primary" 
            size="small"
            :disabled="row.fileUrl == null || row.fileUrl == ''"
            @click="openResource(row)"
          >
            {{ row.type === 'DOC' ? '备课' : '上课' }}
          </el-button>
          <el-button 
            v-if="!isTeacher"
            type="primary" 
            size="small"
            @click="onKcDatil(row)"
          >
            详情
          </el-button>
        </template>
        <template #toolbar-actions>
        <ElButton v-if="!isTeacher" type="primary" @click="onAdd" >
          新增
        </ElButton>
        <ElButton v-if="!isTeacher" type="danger" class="mt-1" @click="onDel">
          删除
        </ElButton>
        </template>
      </Grid>
    </Page> -->

    <!-- 新增对话框 -->
    <Modal class="w-[50%]">
      <Form />
    </Modal>

    <!-- 全屏预览弹框 -->
    <ElDialog
      v-model="previewVisible"
      width="80%"
      :close-on-click-modal="false"
      :show-close="false"
      class="preview-dialog"
      top="0"
      append-to-body
    >
      <div
        class="preview-container"
        ref="previewContainer"
      >
        <div class="preview-toolbar">
          <ElTooltip
            :content="isFullscreen ? '退出全屏' : '全屏'"
            placement="bottom"
          >
            <ElButton
              circle
              @click="toggleFullscreen"
            >
              <ElIcon>
                <FullScreen />
              </ElIcon>
            </ElButton>
          </ElTooltip>
          <ElTooltip
            content="返回"
            placement="bottom"
          >
            <ElButton
              circle
              @click="closePreview"
            >
              <ElIcon>
                <component :is="BackIcon" />
              </ElIcon>
            </ElButton>
          </ElTooltip>
        </div>
        <iframe
          v-if="previewUrl"
          :src="previewUrl"
          class="preview-iframe"
          frameborder="0"
          allowfullscreen
        ></iframe>
      </div>
    </ElDialog>
  </Page>
</template>

<style scoped lang="scss">
.course-container {
  display: flex;
}

.course-sidebar {
  flex-shrink: 0;
  margin: 20px;

  /* 防止侧边栏被压缩 */

  :deep(.el-card__header) {
    padding: 15px;
  }

  :deep(.el-menu) {
    border-right: none;
  }

  :deep(.el-menu-item) {
    height: 45px;
    line-height: 45px;
    transition: all 0.3s ease;

    &:hover {
      color: var(--el-menu-hover-text-color);
      background-color: var(--el-menu-hover-bg-color);
    }

    &.is-active {
      font-weight: bold;
      color: var(--el-color-primary);
      background-color: var(--el-color-primary-light-9);
      border-right: 2px solid var(--el-color-primary);

      &::after {
        display: none;
      }

      .text-blue-500 {
        color: var(--el-color-primary);
      }
    }
  }
}

.course-title {
  padding: 20px;
  font-size: 16px;
  font-weight: bold;
}

.sub-title {
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}

.course-list {
  margin-top: 20px;
}

.course-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
}

.course-item:hover {
  background: #022740;
}

.course-item.active {
  color: #1890ff;
  background: #e6f4ff;
}

.course-num {
  margin-right: 10px;
  color: #1890ff;
}

.course-content {
  flex: 1;
  padding: 20px;

  :deep(.el-tabs__header) {
    margin-bottom: 16px;
  }

  :deep(.el-table) {
    --el-table-border-color: var(--el-border-color-lighter);

    .el-table__header-wrapper {
      th {
        font-weight: 600;
        background-color: var(--el-fill-color-light);
      }
    }
  }
}

.nav-tabs {
  display: flex;
  margin-bottom: 20px;
  border-radius: 4px;
}

.tab-item {
  position: relative;
  padding: 12px 24px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
}

.tab-item.active {
  font-weight: 500;
  color: #1890ff;
  border-bottom: 2px solid #1890ff;
}

.tab-item:hover {
  color: #40a9ff;
}

.course-table {
  padding: 20px;
  border-radius: 4px;
}

.table-header {
  display: flex;
  padding: 12px 20px;
  font-weight: bold;
}

.table-header span:first-child {
  flex: 1;
}

.table-header span:last-child {
  width: 200px;
  text-align: right;
}

.table-row {
  display: flex;
  padding: 12px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.resource-name {
  flex: 1;
}

.create-time {
  width: 200px;
  color: #666;
  text-align: right;
}

.pagination {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}

.page-num {
  padding: 4px 12px;
  cursor: pointer;
}

.page-num.active {
  color: white;
  background: #1890ff;
  border-radius: 2px;
}

.prev,
.next {
  color: #666;
  cursor: pointer;
}

.page-info {
  margin-left: 10px;
  color: #666;
}

.preview-dialog {
  :deep(.el-dialog__body) {
    height: 100%;
    padding: 0;
  }
}

.preview-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 80vh;

  &:fullscreen {
    width: 100vw;
    height: 100vh;
    padding: 0;
    margin: 0;
    overflow: hidden;
    background: #000;
  }
}

.preview-toolbar {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 2000;
  display: flex;
  gap: 10px;

  .el-button {
    color: white;
    background-color: rgb(0 0 0 / 50%);
    border-color: rgb(255 255 255 / 20%);

    &:hover {
      background-color: rgb(0 0 0 / 70%);
    }
  }
}

.preview-iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  min-height: 80vh;
  background: #000;
}
</style>
