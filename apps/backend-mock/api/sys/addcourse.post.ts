interface CourseItem {
  id: string;
  name: string;
  secname: string
}

export default defineEventHandler(async (event) => {
  const { name, secname} = await readBody(event);
  
  // 验证必填字段
  if (!name || !secname) {
    setResponseStatus(event, 400);
    return useResponseError(
      'BadRequestException',
      'name, secname, state, releaseDate are required',
    );
  }

  // 生成唯一ID
  const id = Date.now().toString().substring(0, 5);

  // 创建新的课程项
  const newCourse: CourseItem = {
    id,
    name,
    secname
  };

  // 添加到课程列表
  CourseList.push(newCourse);

  // 返回成功响应
  return useResponseSuccess({
    message: '添加成功',
    data: newCourse
  });
});
