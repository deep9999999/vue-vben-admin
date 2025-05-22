<script lang="ts" setup>
import { ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { useVbenModal } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import { getOrgList, getSchoolList, getTeacherList } from '#/api/core/sys';


interface RowType {
  // 机构ID
  id: string;
  // 机构名称
  name: string;
}

// 定义 props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

const selectedOrg = ref('');
const selectedSchool = ref('');
const selectedTeacher = ref('');

// 机构表格配置
const orgGridOptions: VxeTableGridOptions<RowType> = {
  columns: [
    { field: 'id', title: '机构ID', width: 100 },
    { field: 'name', title: '机构名称', width: 200 },
  ],
  // data: [
  //   { id: '1', name: '机构1' },
  //   { id: '2', name: '机构2' },
  // ],
  height: 'auto',
  rowConfig: {
    keyField: 'id',
    isHover: true,
    isCurrent: true,  // 开启当前行
  },
  highlightCurrentRow: true, // 高亮当前行
  pagerConfig: {
    enabled: true,
  },
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        // ElMessage.success(`Query params: ${JSON.stringify(formValues)}`);
        let resp:any =  await getOrgList({
          page: page.currentPage,
          pageSize: page.pageSize,
          formValues
        });

        return resp;
      },
    },
  },
};

// 学校表格配置
const schoolGridOptions: VxeTableGridOptions<RowType> = {
  columns: [
    { field: 'id', title: '学校ID', width: 100 },
    { field: 'name', title: '学校名称', width: 200 },
  ],
  data: [],
  height: 'auto',
  rowConfig: {
    keyField: 'id',
    isHover: true,
    isCurrent: true,  // 开启当前行
  },
  highlightCurrentRow: true, // 高亮当前行
  pagerConfig: {
    enabled: false,
  },
  proxyConfig: {
    autoLoad: false,
    ajax: {
      query: async ({ page }) => {
        let resp:any =  await getSchoolList({
          orgId: selectedOrg.value,
          page: page.currentPage,
          pageSize: page.pageSize,
        });
        return resp;
      },
    },
  },
};

// 教师表格配置
const teacherGridOptions: VxeTableGridOptions<RowType> = {
  columns: [
    { field: 'id', title: '教师ID', width: 100 },
    { field: 'name', title: '教师名称', width: 200 },
  ],
  data: [],
  height: 'auto',
  rowConfig: {
    keyField: 'id',
    isHover: true,
    isCurrent: true,  // 开启当前行
  },
  highlightCurrentRow: true, // 高亮当前行
  pagerConfig: {
    enabled: false,
  },
  proxyConfig: {
    autoLoad: false,
    ajax: {
      query: async ({ page }) => {
        let resp:any =  await getTeacherList({
          orgId: selectedOrg.value,
          schoolId: selectedSchool.value,
          page: page.currentPage,
          pageSize: page.pageSize,
        });
        return resp;
      },
    },
  },
};

let eventParams: any = {};

// 创建表格实例
const handleOrgSelect = async ({ row } : any ) => {
  selectedOrg.value = row.id;

  selectedSchool.value = '';
  selectedTeacher.value = '';

  // 清除其他表格的选中状态
  schoolGridApi.grid.setCurrentRow(null);
  teacherGridApi.grid.setCurrentRow(null);
  
  eventParams = {
    type: 'org',
    orgId: row.id,
    orgName: row.name
  };

  schoolGridApi.query()
  teacherGridApi.query()
};

const handleSchoolSelect = async ({ row } : any) => {
  selectedSchool.value = row.id;
  
  selectedTeacher.value = '';

  orgGridApi.grid.setCurrentRow(null);
  teacherGridApi.grid.setCurrentRow(null);
  
  eventParams = {
    type: 'school',
    schoolId: row.id,
    schoolName: row.name
  };

  teacherGridApi.query();
};

const handleTeacherSelect = ({ row } : any) => {
  selectedTeacher.value = row.id;

  // 清除其他表格的选中状态
  orgGridApi.grid.setCurrentRow(null);
  schoolGridApi.grid.setCurrentRow(null);
  
  eventParams = {
    type: 'teacher',
    teacherId: row.id,
    teacherName: row.name
  };
};



const [OrgGrid, orgGridApi] = useVbenVxeGrid({ 
  gridEvents: {
    // 监听行点击事件
    cellClick:  handleOrgSelect
  },
  gridOptions: orgGridOptions,
});
const [SchoolGrid, schoolGridApi] = useVbenVxeGrid({ 
  gridEvents: {
    // 监听行点击事件
    cellClick:  handleSchoolSelect
  },
  gridOptions: schoolGridOptions 
});
const [TeacherGrid, teacherGridApi] = useVbenVxeGrid({ 
  gridEvents: {
    // 监听行点击事件
    cellClick:  handleTeacherSelect
  },
  gridOptions: teacherGridOptions 
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
    if (!selectedTeacher.value && !selectedSchool.value && !selectedOrg.value) {
      ElMessage.warning('请至少选择一项');
      return false;
    }

    emit('select',eventParams);
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

// 对外暴露事件
const emit = defineEmits(['select', 'update:visible']);

// 关闭弹窗时触发更新
const handleClose = () => {
  emit('update:visible', false);
};

// 重置选择状态
const resetSelection = () => {
  selectedOrg.value = '';
  selectedSchool.value = '';
  selectedTeacher.value = '';
  schoolGridApi.setGridOptions({ data: [] });
  teacherGridApi.setGridOptions({ data: [] });
};

// 监听弹窗关闭
const handleAfterClose = () => {
  handleClose();
  resetSelection();
};
</script>

<template>
  <Modal title="课程授权">
    <div class="flex flex-col gap-4">
      <div class="flex gap-4">
        <div class="w-1/3">
          <h3 class="text-lg font-medium mb-2">选择机构</h3>
          <OrgGrid />
        </div>
        
        <div class="w-1/3">
          <h3 class="text-lg font-medium mb-2">选择学校</h3>
          <SchoolGrid 
            @cell-click="handleSchoolSelect"
            @current-change="handleSchoolSelect"
          />
        </div>
        
        <div class="w-1/3">
          <h3 class="text-lg font-medium mb-2">选择教师</h3>
          <TeacherGrid 
            @cell-click="handleTeacherSelect"
            @current-change="handleTeacherSelect"
          />
        </div>
      </div>
    </div>
  </Modal>
</template>
