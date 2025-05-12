interface CourseItem {
  id: string;
  name: string;
  secname: string
}

export default defineEventHandler(async (event) => {
  const { name, secname, pid} = await readBody(event);
  
  // 验证必填字段
  if (!name) {
    setResponseStatus(event, 400);
    return useResponseError(
      'BadRequestException',
      'name, secname, state, releaseDate are required',
    );
  }

  const findCourseWithChildren = (id: string, list: any): CourseItem | undefined => {
    for (const course of list) {
      if (course.id === id) {
        return course;
      }
      if (course.children) {
        const found = findCourseWithChildren(id, course.children);
        if (found) return found;
      }
    }
    return undefined;
  };

  let course;
  if (pid) {
    course = findCourseWithChildren(pid, CourseList);
  }

  // 生成唯一ID
  const id = Date.now().toString().slice(-5);

  // 创建新的课程项
  const newCourse: CourseItem = {
    id,
    name,
    secname
  };

  if (course) {
    course.children = course.children || [];
    course.children.push(newCourse);
  } else {
    CourseList.push(newCourse);
  }

  // 返回成功响应
  return useResponseSuccess({
    message: '添加成功',
    data: newCourse
  });
});
