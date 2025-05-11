interface CourseItem {
  id: string;
  name: string;
  secname: string;
  pid?: string;
  children?: CourseItem[];
}

export default defineEventHandler(async (event) => {
  const { id } = await readBody(event);
  
  // 验证必填字段
  if (!id) {
    setResponseStatus(event, 400);
    return useResponseError(
      'BadRequestException',
      'id is required',
    );
  }

  // 根据id查询课程，包括children字段
  const findCourseWithChildren = (id: string, list: any): CourseItem | undefined => {
    for (const course of list) {
      if (course.id === id) {
        return {
          ...course,
          children: course.children ? course.children.map(child => findCourseWithChildren(child.id, list)) : []
        };
      }
      if (course.children) {
        const found = findCourseWithChildren(id, course.children);
        if (found) return found;
      }
    }
    return undefined;
  };

  const course = findCourseWithChildren(id, CourseList);

  // 如果未找到课程，返回错误
  if (!course) {
    setResponseStatus(event, 404);
    return useResponseError(
      'NotFoundException',
      'Course not found',
    );
  }

  // 返回查询结果
  return useResponseSuccess({
    data: course
  });
});
