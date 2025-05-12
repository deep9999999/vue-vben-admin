<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import { Page } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getCourseList, deleteCourse, addCourse, queryCourse, editCourse } from '#/api/core/sys';
import { ElButton, ElMessage, ElMessageBox } from 'element-plus';
import { useVbenModal } from '@vben/common-ui';
import { useVbenForm } from '#/adapter/form';
import { useRouter } from 'vue-router';
const router = useRouter();


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


const onDel = async () => {
  const rows = gridApi.grid.getCheckboxRecords();
  if (rows.length === 0) {
    ElMessage.warning('请选择要删除的课程');
    return;
  }
  ElMessageBox.confirm(`确定要删除选中的 ${rows.length} 个课程吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      // 调用删除接口
      await deleteCourse(rows.map(row => row.id));
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

const onAdd = () => {
  openFormModal();
}

const onDatil = async (row:any) => {
  let rowdata:any = await queryCourse({id:row.id});
    // 克隆数据以避免直接修改原始数据
    const clonedData = JSON.parse(JSON.stringify(rowdata.data));

    modalApi.setData({
      // 表单值
      values: clonedData,
      id: row.id,
    })
    
    modalApi.setState({
        title:'课程详情'
      }
    );

    modalApi.open();
}

const onddLevel = async (row:any) => {
  
  formApi.resetForm();
  modalApi.sharedData.payload = row;
    
  modalApi.setState({
      title:'新增下级-课程编辑'
    }
  );

  modalApi.open();
}

function openFormModal() {
    modalApi.open();
    // 清空表单数据
    formApi.resetForm();
    modalApi.setData({
    })
    modalApi.setState({
      title: '新增课程'
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
      label: '课程名称',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'secname',
      label: '课程章节'
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
  title: '新增课程',
});

async function onSubmit(values: Record<string, any>) {
  ElMessage.success('正在提交中...');
  modalApi.lock();
  try {
      const formvalues:any = await formApi.getValues<Record<string, any>>();
      const { values } = modalApi.getData<Record<string, any>>();
      if (formvalues) {
        if (values && values.id != null) {
          await editCourse({
            id:values.id,
            ...formvalues
          })
          // 更新表格数据
          const updatedRow = gridApi.grid.getRowById(values.id);
          if (updatedRow) {
            Object.assign(updatedRow, formvalues);
            gridApi.grid.updateData();
          }
        }
        else if (modalApi.sharedData.payload.id) {
          // 保存当前展开的节点
          const expandedKeys = gridApi.grid.getTreeExpandRecords().map(row => row.id);

          // 新增下级节点
          await addCourse({
            ...formvalues,
            pid: modalApi.sharedData.payload.id
          });

          // 重新加载数据
          await gridApi.query();

          // 恢复展开状态
          expandedKeys.forEach(key => {
            const row = gridApi.grid.getRowById(key);
            if (row) gridApi.grid.setTreeExpand(row, true);
          });
        }
        else {
          await addCourse(formvalues)
          gridApi.query()
        }
      }
    //setTimeout(() => {
      modalApi.close();
      
      ElMessage.success(`提交成功：${JSON.stringify(values)}`);
    //}, 1000);
  }catch (error) {
    ElMessage.error('提交失败');
    modalApi.unlock();
  }
  
}
</script>


<template>
  <Page auto-content-height>
    <Grid table-title="课程列表" table-title-help="显示所有的课程信息，用户可以通过上面的过滤条过滤数据，能够多选操作。">
      <template #action="{ row }">
        <Button 
          type="link" 
          style="color: #1890ff; margin-right: 8px"
           @click="onDatil(row)"
        >
          编辑
        </Button>
        <Button 
          type="link" 
          style="color: #1890ff; margin-right: 8px" 
          @click="onddLevel(row)"
        >
          新增下级
        </Button>
      </template>
      <template #toolbar-actions>
        <ElButton type="primary" @click="onAdd">
          新增
        </ElButton>
        <ElButton type="danger" class="mt-1" @click="onDel">
          删除
        </ElButton>
        <ElButton type="danger" class="mt-1">
          授权
        </ElButton>
      </template>
    </Grid>
    <!-- 新增对话框 -->
    <Modal>
      <Form />
    </Modal>
  </Page>
</template>
