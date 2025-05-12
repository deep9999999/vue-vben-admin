interface CourseItem {
  id: string;
  name: string;
  secname: string;
}

export default defineEventHandler(async (event) => {
  const { page, pageSize, formValues } = await readBody(event);
  
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

  // 根据 formValues 过滤数据
  if (formValues) {
    if (formValues.name) {
      courseList = courseList.filter(item => 
        item.name.toLowerCase().includes(formValues.name.toLowerCase())
      );
    }
    if (formValues.secname) {
      courseList = courseList.filter(item => 
        item.secname.toLowerCase().includes(formValues.secname.toLowerCase())
      );
    }
  }

  

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
