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
}

export default defineEventHandler(async (event) => {
  const formData = await readBody(event);
  console.log("formData", formData);
  
  // 验证必填字段
  if (!formData.name || !formData.gender || !formData.subject || !formData.phone || !formData.email || !formData.orgId) {
    setResponseStatus(event, 400);
    return useResponseError(
      'BadRequestException',
      '所有字段都是必填的',
    );
  }

  // 构造新的教师数据
  const newTeacher: TeacherItem = {
    // 生成随机id
    id: Math.floor(Math.random() * 1000000).toString(),
    name: formData.name,
    gender: formData.gender,
    subject: formData.subject,
    phone: formData.phone,
    email: formData.email,
    state: formData.state,
    schoolId: formData.schoolId || '',
    orgId: formData.orgId,
    expireDate: formData.expireDate
  };

  // 根据schoolId获取学校名称
  if (formData.schoolId) {
    const school = SchoolList.find(item => item.id === formData.schoolId);
    if (school) {
      newTeacher.schoolName = school.name;
    }
  }

  // 根据 orgId 获取机构名称
  if (formData.orgId) {
    const org = OrgList.find(item => item.id === formData.orgId);
    if (org) {
      newTeacher.orgName = org.name;
    }
  }


  console.log("newTeacher", newTeacher);

  // 添加到教师列表中
  TeacherList.push(newTeacher);

  // 返回成功响应
  return useResponseSuccess({
    message: '添加成功',
    data: newTeacher
  });
});
