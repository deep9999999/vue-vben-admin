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
  const { id } = await readBody(event);
  
  // 验证必填字段
  if (!id) {
    setResponseStatus(event, 400);
    return useResponseError(
      'BadRequestException',
      'id是必填的',
    );
  }

  // 在教师列表中查找对应id的教师
  const teacher = TeacherList.find((item) => item.id === id);

  // 如果没有找到对应的教师，返回错误
  if (!teacher) {
    setResponseStatus(event, 404);
    return useResponseError(
      'NotFoundException',
      '未找到对应的教师信息',
    );
  }

  // 返回成功响应
  return useResponseSuccess({
    message: '查询成功',
    data: teacher
  });
});
