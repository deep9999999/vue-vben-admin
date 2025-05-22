<template>
  <Page auto-content-height>
    <div class="course-container">
      <el-loading v-model:full-screen="loading" />
      <!-- 左侧课程目录 -->
      <el-card class="course-sidebar" shadow="hover">
        <template #header>
          <div class="flex flex-col">
            <span class="text-base font-bold">{{ mainTitle }}</span>
            <span class="text-sm text-gray-500 mt-2">{{ subTitle }}</span>
          </div>
        </template>
        <el-menu
          :default-active="String(activeIndex)"
          class="course-menu"
        >
          <el-menu-item 
            v-for="(item, index) in courseList" 
            :key="index"
            :index="String(index)"
            @click="selectCourse(index)"
          >
            <template #title>
              <span class="text-blue-500 mr-2">{{ String(index + 1).padStart(2, '0') }}</span>
              <span>{{ item.name }}</span>
            </template>
          </el-menu-item>
        </el-menu>
      </el-card>

    <!-- 右侧内容区域 -->
    <div class="course-content">
      <el-card class="h-full">
        <el-tabs v-model="activeTab" class="course-tabs" @tab-click="selectTab">
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
                @click="openResource(row)"
              >
                {{ row.type === 'DOC' ? '备课' : '上课' }}
              </el-button>
              <el-button 
                type="primary" 
                size="small"
                @click="onKcDatil(row)"
              >
                详情
              </el-button>
            </template>
            <template #toolbar-actions>
            <ElButton type="primary" @click="onAdd" >
              新增
            </ElButton>
            <ElButton type="danger" class="mt-1" @click="onDel">
              删除
            </ElButton>
            </template>
        </Grid>
        <!-- 新增对话框 -->
        <Modal>
          <Form />
        </Modal>
       
      </el-card>
    </div>
    </div>
  </Page>
</template>

<script setup lang="ts">
import { ElButton, ElMessage, ElMessageBox, ElCard, ElMenu, ElMenuItem, ElTabs, ElTabPane, valueEquals } from 'element-plus';
import { ref, onMounted, computed, h } from 'vue'
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { fetchResources, getCourseDetail, addFile, editFile, getFileDetail, deleteFile, removeFile } from '#/api/core/sys';
import { useRoute } from 'vue-router'
import { useVbenForm } from '#/adapter/form';
import { useVbenModal } from '@vben/common-ui';
import { requestClient } from '#/api/request';
import { useAccessStore } from '@vben/stores';





interface UploadFileParams {
  file: File;
  onError?: (error: Error) => void;
  onProgress?: (progress: { percent: number }) => void;
  onSuccess?: (data: any, file: File) => void;
}

// 获取路由实例
const route = useRoute()

// 从 URL 获取参数
const courseId = route.query.courseId as string

// 定义主标题和副标题
const mainTitle = ref('')
const subTitle = ref('')

// 当前激活的课程目录索引
const activeIndex:any = ref(0)
const selectCourse = (index:any) => {
  activeIndex.value = index

  // 根据选中的课程索引获取对应的标签列表
  if (tabsList.value && tabsList.value[index]) {
    // 获取当前选中课程的标签数据
    const currentTabs = tabsList.value[index].children || []
    // 更新tabs数据
    tabs.value = currentTabs.map((tab: any) => ({
      name: tab.name,
      value: tab.id
    }))
    // 重置当前激活的标签为第一个
    activeTab.value = 0
    // 更新选中的标签值
    selectTabValue = tabs.value[0]?.value
    // 重新加载表格数据
    gridApi.query()
  }
}
const tabsList = ref()
// 课程目录数据
const courseList = ref()

 // 导航标签数据
const tabs:any = ref([])

// 当前激活的标签索引
const activeTab:any = ref(0)
let selectTabValue:any = null

if (tabs.value.length > 0) {
  selectTabValue = tabs.value[0].value;
}
// 选择标签的方法
const selectTab = (v: any) => {
  activeTab.value = v.index
  selectTabValue = tabs.value[v.index].value
  // 使用gridApi重新加载对应标签页的数据
  // 设置数据并保持表格状态
  gridApi.query();
}

// 定义加载状态
const loading = ref(false)

// 获取课程数据
const fetchCourseData = async () => {
  try {
    loading.value = true
    // 调用接口获取课程详情
    const courseDetail:any = await getCourseDetail({id:courseId})
    if (courseDetail) {
      // 更新课程标题信息
      mainTitle.value = courseDetail.name
      subTitle.value = courseDetail.secname
      // 更新课程列表
      if (courseDetail.children && courseDetail.children.length > 0) {
        courseList.value = courseDetail.children.map((item: any) => ({
          name: item.name,
          value: item.id
        }))

        tabsList.value = courseDetail.children
        selectCourse(0);
      }
    }
  } catch (error) {
    console.error('获取课程数据失败:', error)
    ElMessage.error('获取课程数据失败')
  } finally {
    loading.value = false
  }
}

// 在组件挂载时获取数据
onMounted(() => {
  fetchCourseData()
})

let resroot = "http://118.31.173.178:6001"
// https://ow365.cn/?i=35717&furl=http://118.31.173.178:6001/api/download/2025/05/23/1%E5%89%AF%E6%9C%AC%E6%8B%BC%E8%AF%BB%E5%90%AF%E8%92%99PPT%E7%AC%AC%E4%B8%80%E8%AF%BE(1).pptx
// 打开资源方法
const openResource = (item:any) => {
let url = ''
if (item.type === 'DOC') {
  // 文档类型，打开文档预览链接
  url = `${resroot}${item.fileUrl}`
} else if (item.type === 'PPT') {
  // PPT类型，打开PPT预览链接
  url = `https://ow365.cn/?i=35717&furl=${resroot}${item.fileUrl}`
}

if (url) {
  window.open(url, '_blank')
}
}

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
    { field: 'name', title: '资料', width: 200, align: 'left', },
    { field: 'type', title: '类型', width: 50, align: 'left', },
    { field: 'fileUrl', title: 'URL', width: 300, align: 'left', },
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

        let resp:any =  await fetchResources({
          page: page.currentPage,
          pageSize: page.pageSize,
          id: selectTabValue
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
  gridOptions
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
          { label: 'VIDEO', value: 'VIDEO' }
        ]
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
          Authorization: "Bearer " + useAccessStore().accessToken,
        },
        accept: '.pptx,.ppt,.doc,.docx,.mp3,.mp4',
        action: "/api/file/upload",
        limit: 1,
        multiple: false,
        // 上传列表的内建样式，支持四种基本样式 text, picture, picture-card 和 picture-circle
        listType: 'text',
        name: "file",
        "on-remove": async (uploadFile: any, uploadFiles: any) => {
          await removeFile({id:uploadFile.id});
          gridApi.query();
        }
      },
      fieldName: 'files',
      label: "文件",
      renderComponentContent: () => {
        return {
          default: () => h('span', { style: { fontSize: '14px' } }, '点击上传资料'),
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
      const formvalues:any = await formApi.getValues<Record<string, any>>();
      const { values } = modalApi.getData<Record<string, any>>();
      if (formvalues) {
        if (values && values.id != null) {
          await editFile({
            id:values.id,
            ...formvalues
          })
        }
        else {
          await addFile({
          classId: selectTabValue,
          "fileUrl": formvalues.files[0].response.data.url,
          "name": formvalues.name,
          "type": formvalues.type
          })
        }
      }
    //setTimeout(() => {
      modalApi.close();
      gridApi.reload();
      ElMessage.success(`提交成功：${JSON.stringify(formvalues)}`);
    //}, 1000);
  }catch (error) {
    ElMessage.error('提交失败');
    modalApi.unlock();
  }
}

const onKcDatil = async (row : any) => {
  let rowdata:any = await getFileDetail({id:row.id});
    // 克隆数据以避免直接修改原始数据
    const clonedData = JSON.parse(JSON.stringify(rowdata));
    
    if (clonedData.fileUrl && clonedData.fileUrl.length > 0) {
      clonedData.files = [{
        name: clonedData.fileUrl,
        url: clonedData.fileUrl,
        id: clonedData.id,
        response: {
          data: {
            url: clonedData.fileUrl,
          }
        }
      }];  
    }
    

    modalApi.setData({
      // 表单值
      values: clonedData,
      id: row.id,
    })
    
    modalApi.setState({
        title:'资料详情'
      }
    );

    modalApi.open();
};

// 添加新增方法
const onAdd = async () => {
  modalApi.open();
    // 清空表单数据
    formApi.resetForm();
    modalApi.setData({
      courseId: selectTabValue
    })
    modalApi.setState({
      title: '新增资料'
    });
}

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
  }).then(async () => {
    try {
      // TODO: 调用删除接口
      await deleteFile(rows.map(row => row.id));
      ElMessage.success('删除成功');
      // 刷新表格数据
      gridApi.reload();
    } catch (error) {
      ElMessage.error('删除失败');
    }
  }).catch(() => {
    ElMessage.info('已取消删除');
  });
}
</script>

<style scoped lang="scss">
.course-container {
  display: flex;
  height: 100vh;
}

.course-sidebar {
  width: 240px;
  min-width: 240px; /* 添加最小宽度 */
  max-width: 240px; /* 添加最大宽度 */
  margin: 20px;
  flex-shrink: 0;  /* 防止侧边栏被压缩 */
  
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
      background-color: var(--el-menu-hover-bg-color);
      color: var(--el-menu-hover-text-color);
    }
    
    &.is-active {
      background-color: var(--el-color-primary-light-9);
      color: var(--el-color-primary);
      border-right: 2px solid var(--el-color-primary);
      font-weight: bold;
      
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
  font-size: 14px;
  color: #666;
  margin-top: 20px;
}

.course-list {
  margin-top: 20px;
}

.course-item {
  padding: 12px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.course-item:hover {
  background: #022740;
}

.course-item.active {
  background: #e6f4ff;
  color: #1890ff;
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
        background-color: var(--el-fill-color-light);
        font-weight: 600;
      }
    }
  }
}

.nav-tabs {
  display: flex;
  border-radius: 4px;
  margin-bottom: 20px;
}

.tab-item {
  padding: 12px 24px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s;
  border-bottom: 2px solid transparent;
}

.tab-item.active {
  color: #1890ff;
  font-weight: 500;
  border-bottom: 2px solid #1890ff;
}

.tab-item:hover {
  color: #40a9ff;
}

.course-table {
  border-radius: 4px;
  padding: 20px;
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
  text-align: right;
  color: #666;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  gap: 10px;
}

.page-num {
  padding: 4px 12px;
  cursor: pointer;
}

.page-num.active {
  background: #1890ff;
  color: white;
  border-radius: 2px;
}

.prev, .next {
  cursor: pointer;
  color: #666;
}

.page-info {
  margin-left: 10px;
  color: #666;
}
</style>

