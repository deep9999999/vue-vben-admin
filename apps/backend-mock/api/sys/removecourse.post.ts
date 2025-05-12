interface CourseItem {
  id: string;
}

  // 根据id查询课程，包括children字段
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

export default defineEventHandler(async (event) => {
  const { id, ischild } = await readBody(event);
  
  // 验证必填字段
  if (id.length === 0) {
    setResponseStatus(event, 400);
    return useResponseError(
      'BadRequestException',
      '不存在id',
    );
  }

  if (ischild) {
    // 如果是子节点，直接删除
    id.forEach((itemId: string) => {
      let course:any = findCourseWithChildren(itemId, CourseList);
      if (course.pid) {
        course = findCourseWithChildren(course.pid, CourseList);
        const childIndex = course.children.findIndex((child: any) => child.id === itemId);
        if (childIndex !== -1) {
          course.children.splice(childIndex, 1);
          console.log(course);
        }
      }
    });
  }
  else {
    // 根据id数组删除课程列表中的项目
    id.forEach((itemId: string) => {
      const index = CourseList.findIndex((course) => course.id === itemId);
      if (index !== -1) {
        CourseList.splice(index, 1);
      }
    });  
  }
  

  // 返回成功响应
  return useResponseSuccess({
    message: '删除成功'
  });
});
