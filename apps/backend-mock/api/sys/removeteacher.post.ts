interface TeacherItem {
  id: string;
}

export default defineEventHandler(async (event) => {
  const { id } = await readBody(event);
  console.log("ids", id);
  
  // 验证必填字段
  if (id.length === 0) {
    setResponseStatus(event, 400);
    return useResponseError(
      'BadRequestException',
      '不存在id',
    );
  }

  console.log("del id", id);
  
  // 根据id数组删除教师列表中的项目
  id.forEach((itemId: string) => {
    const index = TeacherList.findIndex((teacher) => teacher.id === itemId);
    if (index !== -1) {
      TeacherList.splice(index, 1);
    }
  });

  // 返回成功响应
  return useResponseSuccess({
    message: '删除成功'
  });
});
