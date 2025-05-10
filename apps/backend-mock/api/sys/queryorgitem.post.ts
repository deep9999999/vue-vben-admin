interface OrgItem {
  id: string;
  name: string;
  contact: string;
  school: string;
  area: string;
  state: string;
  releaseDate: string;
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

  // 在组织列表中查找对应id的机构
  const org = OrgList.find((item) => item.id === id);

  // 如果没有找到对应的机构，返回错误
  if (!org) {
    setResponseStatus(event, 404);
    return useResponseError(
      'NotFoundException',
      '未找到对应的机构信息',
    );
  }

  // 返回成功响应
  return useResponseSuccess({
    message: '查询成功',
    data: org
  });
});
