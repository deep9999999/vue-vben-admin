export default defineEventHandler(async (event) => {
  const { childId, page, pageSize } = await readBody(event);
  console.log(childId, page, pageSize)
  // 验证必填参数
  if (childId == null || page == null || pageSize == null) {
    setResponseStatus(event, 400);
    return useResponseError(
      'BadRequestException',
      'childId, page and pageSize are required',
    );
  }

  let _childId = childId.toString();
  let resources = CourseResourceList;

  // 获取资源列表数据
  if (_childId != '') {
    resources = CourseResourceList.filter(item => {
      // 检查数据项的地区是否包含所有选择的地区层级
      return item.id  == _childId;
    });
  }
  // 计算分页
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const records = resources.slice(start, end);

  // 返回分页结果
  return useResponseSuccess({
    items: records,
    total: resources.length
  });
});
