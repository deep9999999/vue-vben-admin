<script lang="ts" setup>
import { ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { useVbenModal } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import { getCourseList } from '#/api/core/sys';
import type { VbenFormProps } from '#/adapter/form';

// 定义 props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  selectedKeys: {
    type: Array,
    default: () => []
  }
});

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

// 用于存储展开状态的响应式变量
const expandedKeys = ref<string[]>([]);

const deletedKeys:any = ref<string[]>([]);

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
    showHeader: false,
  },
  //data: [],
  columns: [
    { align: 'left', title: '', type: 'checkbox', width: 50 },
    { field: 'id', title: '序号', width: 200 },
    { field: 'name', align: 'left', title: '课程名', width: 400,  treeNode: true },
    { field: 'secname', align: 'left', title: '课程章节', width: 300 },
    
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
        
        // ElMessage.success(`Query params: ${JSON.stringify(formValues)}`);
        let resp:any = await getCourseList({
          page: page.currentPage,
          pageSize: page.pageSize,
          formValues
        });

        // 在数据加载完成后恢复展开状态
        setTimeout(() => {
          
          expandedKeys.value.forEach(key => {
            const row = gridApi.grid.getRowById(key);
            if (row) {
              gridApi.grid.setTreeExpand(row, true);
            }
          });

          // 恢复选中状态
          deletedKeys.value.forEach((key:any) => {
            const row = gridApi.grid.getRowById(key);
            if (row) {
              gridApi.grid.setCheckboxRow(row, true);
            }
          });


        }, 0);

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


// 监听展开状态变化
const handleTreeExpand = (params: any) => {
  console.log('展开状态变化:', params.expanded);
  const { row } = params;
  
  if (params.expanded) {
    // 添加到展开状态列表
    if (!expandedKeys.value.includes(row.id)) {
      expandedKeys.value.push(row.id);
      console.log('展开节点列表：', expandedKeys.value);
    }
  } else {
    // 从展开状态列表中移除
    const index = expandedKeys.value.indexOf(row.id);
    if (index > -1) {
      expandedKeys.value.splice(index, 1);
      console.log('收起后节点列表：', expandedKeys.value);
    }
  }
};


const saveSelection = (row:any, checked:any) => {
  if (checked) {
      // 如果是选中,将id添加到deletedKeys
      if (!deletedKeys.value.includes(row.id)) {
        deletedKeys.value.push(row.id);
      }
  } else {
    // 如果是取消选中,从deletedKeys中移除
    const index = deletedKeys.value.indexOf(row.id);
    if (index > -1) {
      deletedKeys.value.splice(index, 1);
    }
  }

  if (row.children.length > 0) {
    row.children.forEach((child: any) => {
      saveSelection(child, checked);
    });
  }
}

const gridEvents = {
  // 展开/收起事件
  toggleTreeExpand: handleTreeExpand,
  // 复选框勾选事件处理
  checkboxChange: ({ records, row, checked } : any) => {
    saveSelection(row, checked);
    console.log('选中节点列表：', deletedKeys.value);
  },

  // 全选事件处理
  // checkboxAll: ({ records, checked }: any) => {
  //   console.log('全选状态:', checked);
  //   console.log('所有选中记录:', records);

  //   if (checked) {
  //     // 全选时,将所有记录的id添加到deletedKeys
  //     records.forEach((record: any) => {
  //       if (!deletedKeys.value.includes(record.id)) {
  //         deletedKeys.value.push(record.id);
  //       }
  //     });
  //   } else {
  //     records.forEach((record: any) => {
  //       const index = deletedKeys.value.indexOf(record.id);
  //       if (index > -1) {
  //         deletedKeys.value.splice(index, 1);
  //       }
  //     });
  //   }
  //   console.log('删除列表:', deletedKeys.value);
  // },
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
  gridEvents
});

// 创建对话框实例
const [Modal, modalApi] = useVbenModal({
  class: 'w-[60%] h-full',
  onCancel() {
    handleAfterClose();
  },
  onClosed() {
    handleAfterClose();
  },
  onConfirm() {
    emit('select',deletedKeys.value);
    handleAfterClose();
    return true;
  },
});

// 监听外部visible变化
watch(() => props.visible, (newVal) => {
  if (newVal) {
    modalApi.open();
  } else {
    modalApi.close();
  }
}, {
  immediate: true
});

// 监听外部selectedKeys变化
watch(() => props.selectedKeys, (newVal) => {
  deletedKeys.value = [...newVal];
}, {
  immediate: true
});

// 对外暴露事件
const emit = defineEmits(['select', 'update:visible']);

// 关闭弹窗时触发更新
const handleClose = () => {
  emit('update:visible', false);
};

// 重置选择状态
const resetSelection = () => {
};

// 监听弹窗关闭
const handleAfterClose = () => {
  handleClose();
  resetSelection();
};
</script>

<template>
  <Modal title="课程授权">
    <Grid ref="grid" class="flex-1" />
  </Modal>
</template>
