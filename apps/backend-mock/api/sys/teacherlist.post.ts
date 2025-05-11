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
  expireDate: string;
}

export default defineEventHandler(async (event) => {
  const { orgId, schoolId, page, pageSize } = await readBody(event);
  
  // 验证必填参数
  if (!orgId || !page || !pageSize) {
    setResponseStatus(event, 400);
    return useResponseError(
      'BadRequestException',
      'orgId, page and pageSize are required',
    );
  }

  // 根据机构ID筛选教师列表
  let filteredList = [...TeacherList].filter(teacher => teacher.orgId === orgId && teacher.schoolId === schoolId);

  // 将数据倒序排列，保持与其他列表一致的排序方式
  filteredList = filteredList.reverse();

  // 计算分页
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const records = filteredList.slice(start, end);

  // 返回分页结果
  return useResponseSuccess({
    items: records,
    total: filteredList.length
  });
});
