<template>
  <div>
    <Grid>
      <template #action="{ row }">
        <Button 
        type="link" 
        style="color: #1890ff; margin-right: 8px" 
        @click="onTeacherDatil(row)"
      >
        详情
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
          <ElButton type="primary" @click="onTeacherAdd">
            新增
          </ElButton>
          <ElButton type="danger" class="mt-1" @click="onTeacherDel">
            删除
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
import type { VxeGridProps } from '#/adapter/vxe-table';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getTeacherList, addTeacher, deleteTeacher, queryTeacher, editTeacher, courseAuth, getAuthList } from '#/api/core/sys';
import { ElButton, ElMessage, ElMessageBox, ElTag } from 'element-plus';
import { useVbenModal } from '@vben/common-ui';
import { useVbenForm, z } from '#/adapter/form';
import { useRouter, useRoute } from 'vue-router';
import { useTabs } from '@vben/hooks';
import { ref, watch } from 'vue';
import authkc from "#/components/authKc.vue"

const { setTabTitle } = useTabs();
// 获取路由实例
const route = useRoute()
const router = useRouter();

// 从 URL 获取参数
const id = route.query.id as string
const sid = route.query.sid as string
const name = route.query.name as string

console.log('URL参数:', { id, name })

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

setTabTitle(`${name} - 教师管理`);

interface TeacherRowType {
  /** 教师ID */
  id: string;
  /** 教师姓名 */
  name: string;
  /** 性别 */
  gender: string;
  /** 任教科目 */
  subject: string;
  /** 联系电话 */
  phone: string;
  /** 电子邮箱 */
  email: string;
  /** 授权状态 */
  state: string;
  /** 学校ID（可选） */
  schoolId?: string;
  /** 学校名称（可选） */
  schoolName?: string;
  /** 组织ID */
  orgId: string;
  /** 组织名称 */
  orgName: string;
  /** 到期时间 */
  expireDate: string;
  /** 登录密码 */
  password: string;
}

const gridOptions: VxeGridProps<TeacherRowType> = {
  checkboxConfig: {
    highlight: true,
    labelField: 'index',
  },
  columns: [
    { align: 'left', title: '', type: 'checkbox', width: 50 },
    { field: 'id', title: '教师ID', width: 100 },
    { 
      field: 'name',
      title: '教师姓名', 
      width: 150,
      editRender: { name: 'input' }
    },
    { 
      field: 'gender',
      title: '性别',
      width: 80,
      editRender: { 
        name: 'select',
        options: [
          { label: '男', value: '男' },
          { label: '女', value: '女' }
        ]
      }
    },
    { 
      field: 'subject',
      title: '任教科目',
      width: 120,
      editRender: { name: 'input' }
    },
    { 
      field: 'phone',
      title: '联系电话',
      width: 120,
      editRender: { name: 'input' }
    },
    { 
      field: 'email',
      title: '电子邮箱',
      width: 180,
      editRender: { name: 'input' }
    },
    { 
      field: 'password',
      title: '密码',
      width: 180,
      editRender: { name: 'input' }
    },
    { 
      field: 'state',
      title: '授权状态',
      width: 100,
      slots: { default: 'state' }
    },
    // {
    //   field: 'schoolName',
    //   title: '所属学校',
    //   width: 150,
    //   editRender: { name: 'input' }
    // },
    // {
    //   field: 'orgName',
    //   title: '所属组织',
    //   width: 150,
    //   editRender: { name: 'input' }
    // },
    { 
      field: 'releaseDate',
      title: '到期时间',
      width: 120,
      formatter: 'formatDate'
    },
    { 
      title: '操作',
      width: 160,
      fixed: 'right',
      slots: { default: 'action' }
    }
  ],
  height: '700px',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        let resp:any =  await getTeacherList({
          orgId: id,
          schoolId: sid,
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

const onTeacherDatil = async (row : any) => {
  let rowdata:any = await queryTeacher({id:row.id});
    // 克隆数据以避免直接修改原始数据
    const clonedData = JSON.parse(JSON.stringify(rowdata.data));

    modalApi.setData({
      // 表单值
      values: clonedData,
      id: row.id,
    })
    
    modalApi.setState({
        title:'教师信息'
      }
    );

    modalApi.open();
}

const onTeacherAdd = async () => {
  openFormModal();
}

const onTeacherDel = async () => {
  const rows = gridApi.grid.getCheckboxRecords();
  if (rows.length === 0) {
    ElMessage.warning('请选择要删除的教师');
    return;
  }
  ElMessageBox.confirm(`确定要删除选中的 ${rows.length} 个教师吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      // 调用删除接口
      await deleteTeacher(rows.map(row => row.id));
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
      label: '教师姓名',
      rules: 'required',
    },
    {
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        options: [
          { label: '男', value: '男' },
          { label: '女', value: '女' }
        ]
      },
      fieldName: 'gender',
      label: '性别',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'subject',
      label: '任教科目',
      rules: 'required',
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
      component: 'Input',
      componentProps: {
        placeholder: '请输入电子邮箱',
        type: 'email'
      },
      fieldName: 'email',
      label: '电子邮箱',
      rules: z.string().email('请输入正确的邮箱').optional(),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入密码',
        type: 'password',
        showPassword: true,
        // 添加autocomplete属性避免Chrome密码自动填充警告
        autocomplete: 'new-password'
      },
      fieldName: 'password',
      label: '登录密码',
      rules: z.string().min(6, '密码长度至少6位'),
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
    {
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择到期时间',
        type: 'date',
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD'
      },
      fieldName: 'releaseDate',
      label: '到期时间'
    }
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
          await editTeacher({
            id:values.id,
            ...formvalues
          })
        }
        else {
          await addTeacher({
          orgId: id,
          schoolId: sid,
          ...formvalues
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

function openFormModal() {
    modalApi.open();
    // 清空表单数据
    formApi.resetForm();
    modalApi.setData({
      orgId: id,
      sid: sid
    })
    modalApi.setState({
      title: '新增教师信息'
    });
}

// 授权
const dialogVisible = ref(false);
let currow:any = null;
const handleSelect = async (data : any) => {
  console.log('当前授权的课程', data)
  // 处理选中数据
  let auth = await courseAuth({
    authObjType:"老师",
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
  currow = row;
  let authData = await getAuthList({
    authObjType:"老师",
    id: currow.id
  })
  authlist.value = authData;
  dialogVisible.value = true;
}
</script>

<style scoped>

</style>
