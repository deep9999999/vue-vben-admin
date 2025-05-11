interface SchoolItem {
  id: string;
  name: string;
  principal: string;
  address: string;
  phone: string;
  type: string;
  releaseDate: string;
  state: string;
  orgId: string;
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

  // 在学校列表中查找对应id的学校
  const school = SchoolList.find((item) => item.id === id);

  // 如果没有找到对应的学校，返回错误
  if (!school) {
    setResponseStatus(event, 404);
    return useResponseError(
      'NotFoundException',
      '未找到对应的学校信息',
    );
  }

  // 返回成功响应
  return useResponseSuccess({
    message: '查询成功',
    data: school
  });
});
