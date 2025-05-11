interface CourseItem {
  id: string;
  name: string;
  secname: string;
  state: string;
  releaseDate: string;
}

export default defineEventHandler(async (event) => {
  const { page, pageSize } = await readBody(event);
  
  // 验证必填参数
  if (!page || !pageSize) {
    setResponseStatus(event, 400);
    return useResponseError(
      'BadRequestException',
      'page and pageSize are required',
    );
  }

  // 获取课程列表数据
  let courseList = [...CourseList];

  // 将数据倒序排列
  courseList = courseList.reverse();

  // 计算分页
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const records = courseList.slice(start, end);

  // 返回分页结果
  return useResponseSuccess({
    items: records,
    total: courseList.length
  });
});
