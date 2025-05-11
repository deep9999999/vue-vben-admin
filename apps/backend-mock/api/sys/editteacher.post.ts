interface TeacherItem {
  id: string;
  name: string;
  gender: string;
  subject: string;
  phone: string;
  email: string;
  state: string;
  schoolId: string;
  orgId: string;
  schoolName?: string;
  orgName?: string;
  expireDate: string;
  password: string;
}

export default defineEventHandler(async (event) => {
  const formData = await readBody(event);
  console.log("formData", formData);
  
  // 验证必填字段
  if (!formData.id || !formData.name || !formData.gender || !formData.subject || !formData.phone || !formData.email) {
    setResponseStatus(event, 400);
    return useResponseError(
      'BadRequestException',
      '所有字段都是必填的',
    );
  }

  // 查找要编辑的教师
  const teacherIndex = TeacherList.findIndex((teacher) => teacher.id === formData.id);
  if (teacherIndex === -1) {
    setResponseStatus(event, 404);
    return useResponseError(
      'NotFoundException',
      '未找到要编辑的教师',
    );
  }

  // 更新教师数据
  Object.assign(TeacherList[teacherIndex], {
    id: formData.id,
    name: formData.name,
    gender: formData.gender,
    subject: formData.subject,
    phone: formData.phone,
    email: formData.email,
    state: formData.state,
    schoolId: formData.schoolId || TeacherList[teacherIndex].schoolId,
    orgId: formData.orgId || TeacherList[teacherIndex].orgId,
    expireDate: formData.expireDate || TeacherList[teacherIndex].expireDate,
    password: formData.password || TeacherList[teacherIndex].password
  });

  // 更新学校名称和机构名称
  if (formData.schoolId) {
    const school = SchoolList.find(item => item.id === formData.schoolId);
    if (school) {
      TeacherList[teacherIndex].schoolName = school.name;
    }
  }

  if (formData.orgId) {
    const org = OrgList.find(item => item.id === formData.orgId);
    if (org) {
      TeacherList[teacherIndex].orgName = org.name;
    }
  }

  console.log("updatedTeacher", TeacherList[teacherIndex]);

  // 返回成功响应
  return useResponseSuccess({
    message: '更新成功',
    data: TeacherList[teacherIndex]
  });
});
