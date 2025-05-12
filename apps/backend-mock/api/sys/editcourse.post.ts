interface CourseItem {
  id: string;
  name: string;
  secname?: string;
  pid?: string;
  children?: CourseItem[];
}

export default defineEventHandler(async (event) => {
  const { id, name, secname } = await readBody(event);
  
  // 验证必填字段
  if (!id || !name) {
    setResponseStatus(event, 400);
    return useResponseError(
      'BadRequestException',
      'id, name are required',
    );
  }

  // 根据id查询课程，包括children字段
  const findCourseWithChildren = (id: string, list: any): CourseItem | undefined => {
    for (const course of list) {
      if (course.id === id) {
        return course
      }
      if (course.children) {
        const found = findCourseWithChildren(id, course.children);
        if (found) return found;
      }
    }
    return undefined;
  };

  const course = findCourseWithChildren(id, CourseList);

  // 更新课程数据
  Object.assign(course, {
    name: name,
    secname: secname
  });

  console.log("updatedCourse", course);
  console.log("CourseList", CourseList);

  // 返回成功响应
  return useResponseSuccess({
    message: '更新成功',
    data: course,
  });
});
