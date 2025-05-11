<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import { Page } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getCourseList } from '#/api/core/sys';
import { ElButton, ElMessage, ElMessageBox, ElTag } from 'element-plus';
import { useVbenModal } from '@vben/common-ui';
import { useVbenForm } from '#/adapter/form';
import { useRouter } from 'vue-router';
const router = useRouter();


const getStateType = (state: string) => {
  switch (state) {
    case '正常授权':
      return 'success'
    case '授权到期':
      return 'danger' // 黄色
    case '停止授权':
      return 'info' // 红色
    default:
      return 'primary' // 灰色
  }
}

interface RowType {
  // 课程Id
  id: string;
  // 机构名称
  name: string;
  // 联系方式
  secname: string;
  // 课程状态
  state: string;
  // 到期时间
  releaseDate: string;
}

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  fieldMappingTime: [['date', ['start', 'end']]],
  schema: [
    {
      component: 'Input',
      defaultValue: '',
      fieldName: 'name',
      label: '课程名',
    },
    {
      component: 'Input',
      defaultValue: '',
      fieldName: 'secname',
      label: '课程章节',
    }
  ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: true,
  // 是否在字段值改变时提交表单
  submitOnChange: false,
  // 按下回车时是否提交表单
  submitOnEnter: false,
};

const gridOptions: VxeTableGridOptions<RowType> = {
  checkboxConfig: {
    highlight: true,
    labelField: 'index',
  },
  //data: [],
  columns: [
    { align: 'left', title: '', type: 'checkbox', width: 50 },
    { field: 'id', title: '序号', width: 200 },
    { field: 'name', align: 'left', title: '课程名', width: 400,  treeNode: true },
    { field: 'secname', align: 'left', title: '课程章节', width: 300 },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: '操作',
    },
  ],
  rowConfig: {
    isHover: true,
    keyField: 'id',
  },

  exportConfig: {},
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        ElMessage.success(`Query params: ${JSON.stringify(formValues)}`);
        let resp:any =  await getCourseList({
          page: page.currentPage,
          pageSize: page.pageSize,
          formValues
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
    search: true,
    zoom: true,
  },
  treeConfig: {
      parentField: 'pid',
      rowField: 'id',
      transform: false,
  }
};

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

</script>


<template>
  <Page auto-content-height>
    <Grid table-title="课程列表" table-title-help="显示所有的课程信息，用户可以通过上面的过滤条过滤数据，能够多选操作。">
      <template #action="{ row }">
        <Button 
          type="link" 
          style="color: #1890ff; margin-right: 8px" 
        >
          编辑
        </Button>
        <Button 
          type="link" 
          style="color: #1890ff; margin-right: 8px" 
        >
          新增下级
        </Button>
      </template>
      <template #toolbar-actions>
        <ElButton type="primary">
          新增
        </ElButton>
        <ElButton type="danger" class="mt-1">
          删除
        </ElButton>
        <ElButton type="danger" class="mt-1">
          授权
        </ElButton>
      </template>
    </Grid>
    
  </Page>
</template>
