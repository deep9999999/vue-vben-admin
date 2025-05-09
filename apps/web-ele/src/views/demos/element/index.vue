<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { Page } from '@vben/common-ui';

import dayjs from 'dayjs';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

//import { getExampleTableApi } from '#/api';
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
  data: [
    {
      id: '1',
      name: '第一教育机构',
      contact: '13800138000',
      school: '第一中学',
      area: '北京市海淀区',
      state: '正常',
      releaseDate: '2024-12-31',
    },
    {
      id: '2',
      name: '未来教育',
      contact: '13900139000',
      school: '第二中学',
      area: '上海市浦东新区',
      state: '正常',
      releaseDate: '2024-11-30',
    },
    {
      id: '3',
      name: '智慧教育',
      contact: '13700137000',
      school: '实验中学',
      area: '广州市天河区',
      state: '即将到期',
      releaseDate: '2024-10-31',
    },
    {
      id: '4',
      name: '育才教育',
      contact: '13600136000',
      school: '育才中学',
      area: '深圳市南山区',
      state: '正常',
      releaseDate: '2024-09-30',
    },
    {
      id: '5',
      name: '重点教育',
      contact: '13500135000',
      school: '重点中学',
      area: '成都市武侯区',
      state: '已到期',
      releaseDate: '2024-08-31',
    },
    {
      id: '6',
      name: '示范教育',
      contact: '13400134000',
      school: '示范中学',
      area: '杭州市西湖区',
      state: '正常',
      releaseDate: '2024-07-31',
    },
    {
      id: '7',
      name: '附属教育',
      contact: '13300133000',
      school: '附属中学',
      area: '南京市玄武区',
      state: '正常',
      releaseDate: '2024-06-30',
    },
    {
      id: '8',
      name: '寄宿教育',
      contact: '13200132000',
      school: '寄宿中学',
      area: '武汉市江汉区',
      state: '即将到期',
      releaseDate: '2024-05-31',
    },
    {
      id: '9',
      name: '民办教育',
      contact: '13100131000',
      school: '民办中学',
      area: '西安市雁塔区',
      state: '正常',
      releaseDate: '2024-04-30',
    },
    {
      id: '10',
      name: '国际教育',
      contact: '13000130000',
      school: '国际学校',
      area: '重庆市渝中区',
      state: '已到期',
      releaseDate: '2024-03-31',
    }
  ],
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
  // proxyConfig: {
  //   ajax: {
  //     query: async ({ page }, formValues) => {
  //       //message.success(`Query params: ${JSON.stringify(formValues)}`);
  //       // return await getExampleTableApi({
  //       //   page: page.currentPage,
  //       //   pageSize: page.pageSize,
  //       //   ...formValues,
  //       // });
  //       return []
  //     },
  //   },
  // },
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
