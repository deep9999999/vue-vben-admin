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
                {{ row.type === 'doc' ? '查看' : '上课' }}
              </el-button>
            </template>
            <template #toolbar-actions>
            <ElButton type="primary" >
              新增
            </ElButton>
            <ElButton type="danger" class="mt-1" >
              删除
            </ElButton>
            </template>
          </Grid>
      </el-card>
    </div>
    </div>
  </Page>
</template>

<script setup lang="ts">
import { ElButton, ElMessage, ElMessageBox, ElCard, ElMenu, ElMenuItem, ElTabs, ElTabPane } from 'element-plus';
import { ref, onMounted, computed } from 'vue'
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { fetchResources } from '#/api/core/sys';

// 定义主标题和副标题
const mainTitle = ref('一秋看图写话')
const subTitle = ref('一年级秋季')

// 当前激活的课程目录索引
const activeIndex:any = ref(0)
const selectCourse = (index:any) => {
  activeIndex.value = index
}

// 课程目录数据
const courseList = ref([
  { name: '《认识新朋友》' },
  { name: '《我的小伙伴》' },
  { name: '《猪猪他是谁》' },
  { name: '《悠悠做老七》' },
  { name: '《我的房间》' },
  { name: '《周末大扫除》' },
  { name: '《快乐的周末》' },
  { name: '《天气变变变》' },
  { name: '《快乐户外行》' },
  { name: '《手高的傅品》' }
])

 // 导航标签数据
 const tabs:any = ref([
  { name: '课前备课', value:20101},
  { name: '跟课讲作', value:20102 },
  { name: '课后家校联', value:20103 },
  { name: '课程作业', value:20104 },
  { name: '打卡练习', value:20105 },
  { name: '范文范例', value:20106 }
])

// 当前激活的标签索引
const activeTab:any = ref(0)
let selectTabValue:any = tabs.value[0].value;
// 选择标签的方法
const selectTab = (v: any) => {
  activeTab.value = v.index
  selectTabValue = tabs.value[v.index].value
  // 使用gridApi重新加载对应标签页的数据
  // 设置数据并保持表格状态
  gridApi.query();
}

// 每个标签页的内容
const tabContents:any = ref({
  0: [
    { name: '01课课', createTime: '2025-02-16 21:51', type: 'doc' },
    { name: '一秋预课', createTime: '2025-01-21 17:38', type: 'ppt' },
    { name: '一年级秋季课程反馈-教案合集', createTime: '2025-01-21 17:38', type: 'doc' },
    { name: '一年级练习册答案', createTime: '2025-01-21 17:29', type: 'doc' }
  ],
  1: [
    { name: '跟课讲作指导1', createTime: '2025-02-16 21:51', type: 'doc' },
    { name: '跟课讲作指导2', createTime: '2025-01-21 17:38', type: 'ppt' },
  ],
  2: [
    { name: '家校联系记录1', createTime: '2025-02-16 21:51', type: 'doc' },
    { name: '家校联系记录2', createTime: '2025-01-21 17:38', type: 'doc' },
  ],
  3: [
    { name: '课程作业1', createTime: '2025-02-16 21:51', type: 'doc' },
    { name: '课程作业2', createTime: '2025-01-21 17:38', type: 'ppt' },
  ],
  4: [
    { name: '打卡练习1', createTime: '2025-02-16 21:51', type: 'doc' },
    { name: '打卡练习2', createTime: '2025-01-21 17:38', type: 'doc' },
  ],
  5: [
    { name: '范文示例1', createTime: '2025-02-16 21:51', type: 'ppt' },
    { name: '范文示例2', createTime: '2025-01-21 17:38', type: 'doc' },
  ]
})

// 定义加载状态
const loading = ref(false)

// 获取课程数据
const fetchCourseData = async () => {
  try {
    loading.value = true
    // 获取主标题和副标题
    const titleResponse = await fetch('/api/course/title')
    const titleData = await titleResponse.json()
    mainTitle.value = titleData.mainTitle
    subTitle.value = titleData.subTitle

    // 获取课程列表
    const courseResponse = await fetch('/api/course/list')
    const courseData = await courseResponse.json()
    courseList.value = courseData.list

    // 获取标签页内容
    const tabResponse = await fetch('/api/course/tab-contents')
    const tabData = await tabResponse.json()
    tabContents.value = tabData.contents
  } catch (error) {
    console.error('获取课程数据失败:', error)
    ElMessage.error('获取课程数据失败')
  } finally {
    loading.value = false
  }
}

// 在组件挂载时获取数据
onMounted(() => {
  //fetchCourseData()
})

// 打开资源方法
const openResource = (item:any) => {
let url = ''
if (item.type === 'doc') {
  // 文档类型，打开文档预览链接
  url = `https://ow365.cn/?i=35593&furl=http://118.31.173.178:8081/${encodeURIComponent(item.name)}.docx`
} else if (item.type === 'ppt') {
  // PPT类型，打开PPT预览链接
  url = `https://ow365.cn/?i=35593&furl=http://118.31.173.178:8081/${encodeURIComponent(item.name)}.pptx`
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
    { field: 'name', title: '资料', width: 1000, align: 'left', },
    { 
      field: 'createTime',
      title: '创建时间',
      align: 'left',
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
        let resp:any =  await fetchResources({
          page: page.currentPage,
          pageSize: page.pageSize,
          id: activeIndex.value,
          childId: selectTabValue
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

// 添加新增方法
const onAdd = async () => {
  // 这里可以打开新增表单对话框
  ElMessage.info('新增功能待实现');
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
      // await deleteResources(rows.map(row => row.id));
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

