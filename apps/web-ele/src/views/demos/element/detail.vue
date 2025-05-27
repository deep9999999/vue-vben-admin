<template>
  <div >
    <Grid>
      <template #action="{ row }">
        <Button 
        type="link" 
        style="color: #1890ff; margin-right: 8px" 
        @click="onSchoolDatil(row)"
      >
        详情
      </Button>
      <Button 
          type="link" 
          style="color: #1890ff; margin-right: 8px"
          @click="handleTeacherManage(row)"
        >
          教师管理
        </Button>
        <Button 
          type="link" 
          style="color: #1890ff; margin-right: 8px" 
          @click="onAuth(row)"
        >
          课程授权
        </Button>
      </template>
      <template #state="{ row }">
        <ElTag :type="getStateType(row.state)">{{ row.state }}</ElTag>
      </template>
      <template #toolbar-actions>
          <ElButton type="primary" @click="onSchoolAdd">
            新增
          </ElButton>
          <ElButton type="danger" @click="onSchoolDel">
            删除
          </ElButton>
          <ElButton type="primary" @click="onUserAuth">
            账户启用
          </ElButton>
          <ElButton type="danger" @click="onStopUserAuth">
            账户停用
          </ElButton>
      </template>
      </Grid>
      <!-- 新增对话框 -->
      <Modal>
        <Form />
      </Modal>
      <!-- 授权对话框-->
     <authkc
          v-model:visible="dialogVisible"
          @select="handleSelect"
          :selected-keys="authlist"
        />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useTabs } from '@vben/hooks';
import { ElTabs, ElTabPane } from 'element-plus';
import type { VxeGridProps } from '#/adapter/vxe-table';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getSchoolList, addSchool, deleteSchool, querySchool, editSchool, courseAuth, getAuthList, updateOrgStatus } from '#/api/core/sys';
import { ElButton, ElMessage, ElMessageBox, ElTag } from 'element-plus';
import { useVbenModal } from '@vben/common-ui';
import { useVbenForm } from '#/adapter/form';
import areadata from './area-full.json'

import authkc from "#/components/authKc.vue"

import { useRouter } from 'vue-router';

const router = useRouter();

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

const { setTabTitle } = useTabs();


// 获取路由实例
const route = useRoute()

// 从 URL 获取参数
const id = route.query.id as string
const name = route.query.name as string

console.log('URL参数:', { id, name })

setTabTitle(`${name} - 学校管理`);


interface SchoolRowType {
  id: string; // 学校ID
  name: string; // 学校名称
  principal: string; // 校长
  address: string; // 学校地址
  phone: string; // 联系电话
  type: string; // 学校类型
  releaseDate: string; // 到期时间
  state: string; // 授权状态
  orgId: string; // 所属机构ID
}

const gridOptions: VxeGridProps<SchoolRowType> = {
  checkboxConfig: {
    highlight: true,
    labelField: 'index',
  },
  columns: [
    { align: 'left', title: '', type: 'checkbox', width: 50 },
    { field: 'id', title: '学校ID',width: 100 },
    { editRender: { name: 'input' }, field: 'name', title: '学校名称', width: 150 },
    { editRender: { name: 'input' }, field: 'address', title: '学校地址',width: 250 },
    { editRender: { name: 'input' }, field: 'principal', title: '校长' },
    { editRender: { name: 'input' }, field: 'phone', title: '联系电话' },
    { editRender: { name: 'input' }, field: 'type', title: '学校类型' },
    { field: 'state', title: '状态',width: 100, slots: { default: 'state' }, },
    // { field: 'releaseDate', formatter: 'formatDate', title: '到期时间' },
    { slots: { default: 'action' }, fixed: 'right', align:"left", title: '操作', width: 400 },
  ],
  height: '700px',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        let resp:any =  await getSchoolList({
          orgId: id,
          page: page.currentPage,
          pageSize: page.pageSize,
        });
        return resp;
      },
    },
  },
  showOverflow: true,
  toolbarConfig: {
    custom: false,
    export: false,
    refresh: true,
    resizable: true,
    zoom: true,
  },
};

const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });

const onSchoolAdd = () => {
  openFormModal();
}
const onSchoolDel = () => {
  const rows = gridApi.grid.getCheckboxRecords();
  if (rows.length === 0) {
    ElMessage.warning('请选择要删除的学校');
    return;
  }
  ElMessageBox.confirm(`确定要删除选中的 ${rows.length} 个学校吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      // 调用删除接口
      await deleteSchool(rows.map(row => row.id));
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

const onUserAuth = async (row:any) => {
  // 处理选中数据
  const rows = gridApi.grid.getCheckboxRecords();
  if (rows.length === 0) {
    ElMessage.warning('请选择要启用的机构');
    return;
  }

  ElMessageBox.confirm(`确定要启用选中的 ${rows.length} 个学校吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      // 调用启用接口
      await updateOrgStatus({
        ids: rows.map(row => row.id),
        state: '正常授权',
        type: "学校"
      });
      ElMessage.success('启用成功');
      // 刷新表格数据
      gridApi.reload();
    } catch (error) {
      ElMessage.error('启用失败');
    }
  }).catch(() => {
    ElMessage.info('已取消启用');
  });
}

const onStopUserAuth = async (row:any) => {
  // 处理选中数据
  const rows = gridApi.grid.getCheckboxRecords();
  if (rows.length === 0) {
    ElMessage.warning('请选择要停用的学校');
    return;
  }

  ElMessageBox.confirm(`确定要停用选中的 ${rows.length} 个学校吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      // 调用停用接口
      await updateOrgStatus({
        ids: rows.map(row => row.id),
        state: '停止授权',
        type: "学校"
      });
      ElMessage.success('停用成功');
      // 刷新表格数据
      gridApi.reload();
    } catch (error) {
      ElMessage.error('停用失败');
    }
  }).catch(() => {
    ElMessage.info('已取消停用');
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

// 编辑对话框
const [Form, formApi] = useVbenForm({
  handleSubmit: onSubmit,
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'name',
      label: '学校名称',
      rules: 'required',
    },
    {
      component: 'Input', 
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'principal',
      label: '校长',
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
      label: '',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'phone',
      label: '联系电话',
      rules: 'required',
    },
    {
      component: 'Select',
      componentProps: {
        placeholder: '请输入',
        options: [
          { label: '公立', value: '公立' },
          { label: '私立', value: '私立' }
        ]
      },
      fieldName: 'type',
      label: '学校类型',
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
  title: '学校信息',
});

async function onSubmit(values: Record<string, any>) {
  ElMessage.success('正在提交中...');
  modalApi.lock();
  try {
      const formvalues:any = await formApi.getValues<Record<string, any>>();
      const { values } = modalApi.getData<Record<string, any>>();
      if (formvalues) {
        if (values && values.id != null) {
          await editSchool({
            id:values.id,
            ...formvalues
          })
        }
        else {
          await addSchool({
          orgId: id,
          ...formvalues
          })
        }
      }
    //setTimeout(() => {
      modalApi.close();
      gridApi.reload();
      ElMessage.success(`提交成功`);
    //}, 1000);
  }catch (error) {
    ElMessage.error('提交失败');
    modalApi.unlock();
  }
}

const onSchoolDatil = async (row : any) => {
  let rowdata:any = await querySchool({id:row.id});
    // 克隆数据以避免直接修改原始数据
    const clonedData = JSON.parse(JSON.stringify(rowdata.data));

    clonedData.area = clonedData.area;
    
    modalApi.setData({
      // 表单值
      values: clonedData,
      id: row.id,
    })
    
    modalApi.setState({
        title:'学校详情'
      }
    );

    modalApi.open();
};

const handleTeacherManage = (row :any ) => {
  router.push({
    path: '/Organization/teachermgr',
    query: {
      id: id,
      sid: row.id,
      name: `${name} | ${row.name}`
    }
  });
}

function openFormModal() {
    modalApi.open();
    // 清空表单数据
    formApi.resetForm();
    modalApi.setData({
      orgId: id
    })
    modalApi.setState({
      title: '新增学校信息'
    });
}



// 授权
const dialogVisible = ref(false);
let currow:any = null;
const handleSelect = async (data : any) => {
  console.log('当前授权的课程', data)
  // 处理选中数据
  let auth = await courseAuth({
    authObjType:"学校",
    courseList: data.map((item:any) => ({
      courseId: item,
      releaseDate: '',
      type: 1
    })),
    id: currow.id
  });

  ElMessage.success(`授权成功`);
};

let authlist:any = ref([]);
const onAuth = async (row:any) => {
  currow = row
  let authData = await getAuthList({
    authObjType:"学校",
    id: currow.id
  })
  authlist.value = authData;
  dialogVisible.value = true;
}

</script>

<style scoped>
.demo-tabs {
  margin: 30px;
}
</style>
