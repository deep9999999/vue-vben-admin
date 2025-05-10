<template>
  <div class="hello-world">
    <el-tabs
    v-model="activeName"
    type="card"
    class="demo-tabs"
    @tab-click="handleClick"
  >
    <el-tab-pane label="学校管理" name="first">
      <Grid>
      <template #action="{ row }">
      </template>
    </Grid>
    </el-tab-pane>
    <el-tab-pane label="教师管理" name="second">教师管理</el-tab-pane>
  </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useTabs } from '@vben/hooks';
import { ElTabs, ElTabPane } from 'element-plus';
import type { VxeGridProps } from '#/adapter/vxe-table';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getSchoolList } from '#/api/core/sys';

const { setTabTitle } = useTabs();


// 获取路由实例
const route = useRoute()

// 从 URL 获取参数
const id = route.query.id as string
const name = route.query.name as string

console.log('URL参数:', { id, name })

setTabTitle(`${name} - 机构`);


import type { TabsPaneContext } from 'element-plus'

const activeName = ref('first')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}


// 学校管理
interface SchoolRowType {
  id: string; // 学校ID
  name: string; // 学校名称
  principal: string; // 校长
  address: string; // 学校地址
  phone: string; // 联系电话
  type: string; // 学校类型
  foundDate: string; // 成立日期
  orgId: string; // 所属机构ID
}

const gridOptions: VxeGridProps<SchoolRowType> = {
  columns: [
    { field: 'id', title: '学校ID' },
    { editRender: { name: 'input' }, field: 'name', title: '学校名称' },
    { editRender: { name: 'input' }, field: 'principal', title: '校长' },
    { editRender: { name: 'input' }, field: 'address', title: '学校地址' },
    { editRender: { name: 'input' }, field: 'phone', title: '联系电话' },
    { editRender: { name: 'input' }, field: 'type', title: '学校类型' },
    { field: 'foundDate', formatter: 'formatDateTime', title: '成立日期' },
    { field: 'orgId', title: '所属机构ID' },
    { slots: { default: 'action' }, title: '操作', width: 160 },
  ],
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        let resp:any =  await getSchoolList({
          orgid: id,
          page: page.currentPage,
          pageSize: page.pageSize,
        });
        return resp;
      },
    },
  },
  showOverflow: true,
};

const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });
</script>

<style scoped>
.hello-world {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.demo-tabs {
  height: 100vh;
  width: 100%;
  padding: 20px;
}
h1 {
  font-size: 2rem;
  color: #409EFF;
}
</style>
