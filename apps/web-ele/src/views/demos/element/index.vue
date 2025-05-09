<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import { Page } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getOrgList } from '#/api/core/sys';
import areadata from './area-full.json'

interface RowType {
  id: string;
  name: string;
  contact: string;
  school: string;
  area: string;
  state: string;
  releaseDate: string;
}

// 将地区数据转换为级联选择器需要的格式
const convertAreaDataToOptions = (areaData: any[]): any[] => {
  // 转换函数
  const convert = (items: any[]) => {
    return items.map((item) => {
      const result: any = {
        value: item.adcode,
        label: item.name,
      };

      if (item.districts && item.districts.length) {
        result.children = convert(item.districts);
      }

      return result;
    });
  };

  return convert(areaData);
};

// 转换后的地区数据
const areaOptions = convertAreaDataToOptions(areadata);

const options = areaOptions;

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  fieldMappingTime: [['date', ['start', 'end']]],
  schema: [
    {
      component: 'Input',
      defaultValue: '',
      fieldName: 'Name',
      label: '机构名称',
    },
    {
      component: 'Input',
      fieldName: 'tel',
      defaultValue: '',
      label: '联系电话',
    },
    {
      component: 'Input',
      fieldName: 'school',
      defaultValue: '',
      label: '学校',
    },
    // {
    //   component: 'Select',
    //   componentProps: {
    //     allowClear: true,
    //     options: [
    //       {
    //         label: 'Color1',
    //         value: '1',
    //       },
    //       {
    //         label: 'Color2',
    //         value: '2',
    //       },
    //     ],
    //     placeholder: '请选择',
    //   },
    //   fieldName: 'color',
    //   label: 'Color',
    // },
    // {
    //   component: 'DatePicker',
    //   defaultValue: [dayjs().subtract(7, 'days'), dayjs()],
    //   fieldName: 'date',
    //   label: 'Date',
    // },
    {
      component: 'Cascader',
      componentProps: {
        options: options,
      },
      defaultValue: [],
      fieldName: 'arearange',
      label: '区域',
    },
  ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: true,
  // 是否在字段值改变时提交表单
  submitOnChange: true,
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
    { title: '序号', type: 'seq', width: 50 },
    { field: 'name', align: 'left', title: '机构名称', width: 120 },
    { field: 'contact', title: '联系信息', width: 140 },
    { field: 'school', title: '对应学校',width: 200 },
    { field: 'area', title: '所在地区',width: 200  },
    { field: 'state', title: '状态',width: 100 },
    { field: 'releaseDate', formatter: 'formatDate', title: '到期时间',width: 150 },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: '操作',
    },
  ],
  rowConfig: {
    isHover: true,
  },

  exportConfig: {},
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        //ElMessage.success(`Query params: ${JSON.stringify(formValues)}`);
        let resp:any =  await getOrgList({
          page: page.currentPage,
          pageSize: page.pageSize,
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
};

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

gridApi.setGridOptions({
  border: true,
  stripe: true
});
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #action>
        <Button type="link" style="color: #1890ff; margin-right: 8px">编辑</Button>
        <Button type="link" style="color: #1890ff; margin-right: 8px">学校管理</Button>
        <Button type="link" style="color: #1890ff">老师管理</Button>
      </template>
    </Grid>
  </Page>
</template>
