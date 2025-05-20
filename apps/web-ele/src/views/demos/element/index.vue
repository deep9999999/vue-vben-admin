<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import { Page } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getOrgList, addOrg, deleteOrg, editOrg, queryOrg } from '#/api/core/sys';
import areadata from './area-full.json'
import { ElButton, ElMessage, ElMessageBox, ElTag } from 'element-plus';

import { useVbenModal } from '@vben/common-ui';
import { useVbenForm } from '#/adapter/form';
import { useRouter } from 'vue-router';

const router = useRouter();

interface RowType {
  // 机构ID
  id: string;
  // 机构名称
  name: string;
  // 联系方式
  contact: string;
  // 所属学校
  school: string;
  // 所在地区
  area: string;
  // 机构状态
  state: string;
  // 到期时间
  releaseDate: string;
}

// 将地区数据转换为级联选择器需要的格式
const convertAreaDataToOptions = (areaData: any[]): any[] => {
  // 转换函数
  const convert = (items: any[]) => {
    return items.map((item) => {
      const result: any = {
        value: item.name,
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
      fieldName: 'name',
      label: '机构名称',
    },
    {
      component: 'Input',
      fieldName: 'contact',
      defaultValue: '',
      label: '联系电话',
    },
    // {
    //   component: 'Input',
    //   fieldName: 'school',
    //   defaultValue: '',
    //   label: '学校',
    // },
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
      fieldName: 'area',
      label: '所属区域',
    },
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
    { field: 'id', title: '序号', width: 50 },
    { field: 'name', align: 'left', title: '机构名称', width: 120 },
    { field: 'contact', title: '联系信息', width: 140 },
    //{ field: 'school', title: '对应学校',width: 200 },
    { field: 'address', title: '机构地址',width: 150 },
    { field: 'state', title: '状态',width: 100, slots: { default: 'state' }, },
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
        ElMessage.success(`Query params: ${JSON.stringify(formValues)}`);
        let resp:any =  await getOrgList({
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
  
};

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

gridApi.setGridOptions({
  border: true,
  stripe: true
});

const onDel = () => {
  const rows = gridApi.grid.getCheckboxRecords();
  if (rows.length === 0) {
    ElMessage.warning('请选择要删除的机构');
    return;
  }
  ElMessageBox.confirm(`确定要删除选中的 ${rows.length} 个机构吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      // 调用删除接口
      await deleteOrg(rows.map(row => row.id));
      ElMessage.success('删除成功');
      // 刷新表格数据
      gridApi.reload();
    } catch (error) {
      ElMessage.error('删除失败');
    }
  }).catch(() => {
    ElMessage.info('已取消删除');
  });
};

const onAdd = () => {
  openFormModal();
};

const handleSchoolManage = (row : any) => {
  //ElMessage.success('学校管理');
  router.push({
    path: '/Organization/detail',
    query: {
      id: row.id,
      name: row.name
    }
  });
}

const handleTeacherManage = (row : any) => {
  // ElMessage.success('老师管理');
  router.push({
    path: '/Organization/teachermgr',
    query: {
      id: row.id,
      name: row.name
    }
  });
}

// 新增对话框
const [Form, formApi] = useVbenForm({
  handleSubmit: onSubmit,
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'name',
      label: '机构名称',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'contact',
      label: '联系信息',
      rules: 'required',
    },
    {
      component: 'Cascader',
      componentProps: {
        options: options,
      },
      defaultValue: [],
      fieldName: 'area',
      label: '所属区域',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'address', 
      label: '地址',
    },
    {
      component: 'DatePicker',
      componentProps: {
        placeholder: '请输入',
        type: 'date',
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD'
      },
      fieldName: 'releaseDate',
      label: '到期时间',
    },
    {
      component: 'RadioGroup',
      componentProps: {
        options: [
          {
            label: '正常授权',
            value: '正常授权',
          },
          {
            label: '授权到期',
            value: '授权到期',
          },
          {
            label: '停止授权',
            value: '停止授权',
          },
        ],
      },
      rules: 'required',
      defaultValue: '正常授权',
      fieldName: 'state',
      label: '授权状态',
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
  title: '新增机构信息',
});

async function onSubmit(values: Record<string, any>) {
  ElMessage.success('正在提交中...');
  modalApi.lock();
  try {
      const formvalues:any = await formApi.getValues<Record<string, any>>();
      const { values } = modalApi.getData<Record<string, any>>();
      if (formvalues) {
        if (values && values.id != null) {
          await editOrg({
            id:values.id,
            ...formvalues
          })
        }
        else {
          await addOrg(formvalues)
        }
      }
    //setTimeout(() => {
      modalApi.close();
      gridApi.reload();
      ElMessage.success(`提交成功：${JSON.stringify(values)}`);
    //}, 1000);
  }catch (error) {
    ElMessage.error('提交失败');
    modalApi.unlock();
  }
  
}

const onOrgDatil = async (row : any) => {
  // modalApi.setData({
  //     // 表单值
  //     values: { field1: 'abc', field2: '123' },
  //   })
    let rowdata:any = await queryOrg({id:row.id});
    // 克隆数据以避免直接修改原始数据
    const clonedData = JSON.parse(JSON.stringify(rowdata.data));

    clonedData.area = clonedData.area.split(',');
    
    modalApi.setData({
      // 表单值
      values: clonedData,
      id: row.id,
    })
    
    modalApi.setState({
        title:'机构详情'
      }
    );

    modalApi.open();
};

// 打开对话框
function openFormModal() {
    modalApi.open();
    // 清空表单数据
    formApi.resetForm();
    modalApi.setData({
    })
    modalApi.setState({
      title: '新增机构信息'
    });
}

// 根据授权状态返回对应的颜色
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
</script>





<template>
  <Page auto-content-height>
    <Grid table-title="机构列表" table-title-help="显示所有的机构信息，用户可以通过上面的过滤条过滤数据，能够多选。">
      <template #action="{ row }">
        <Button 
          type="link" 
          style="color: #1890ff; margin-right: 8px" 
          @click="onOrgDatil(row)"
        >
          详情
        </Button>
        <Button 
          type="link" 
          style="color: #1890ff; margin-right: 8px" 
          @click="handleSchoolManage(row)"
        >
          学校管理
        </Button>
        <Button 
          type="link" 
          style="color: #1890ff"
          @click="handleTeacherManage(row)"
        >
          教师管理
        </Button>
      </template>
      <template #state="{ row }">
        <ElTag :type="getStateType(row.state)">{{ row.state }}</ElTag>
      </template>
      <template #toolbar-actions>
        <ElButton type="primary" @click="onAdd">
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
  </Page>
</template>
