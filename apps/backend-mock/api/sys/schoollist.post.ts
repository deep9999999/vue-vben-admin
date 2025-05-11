interface SchoolItem {
  id: string;
  name: string;
  principal: string;
  address: string;
  phone: string;
  type: string;
  releaseDate: string;
  orgId: string;
}

export default defineEventHandler(async (event) => {
  const { orgid, page, pageSize } = await readBody(event);
  
  // 验证必填参数
  if (!orgid || !page || !pageSize) {
    setResponseStatus(event, 400);
    return useResponseError(
      'BadRequestException',
      'orgid, page and pageSize are required',
    );
  }

  // 根据机构ID筛选学校列表
  let filteredList = [...SchoolList].filter(school => school.orgId === orgid);

  // 将数据倒序排列，保持与机构列表一致的排序方式
  filteredList = filteredList.reverse();

  // 计算分页
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const records = filteredList.slice(start, end);

  // 为每条记录添加state字段并与address连接
  const recordsWithState = records.map(record => ({
    ...record,
    address: `${record.area || ''} ${record.address}`
  }));

  // 返回分页结果
  return useResponseSuccess({
    items: recordsWithState,
    total: filteredList.length
  });
});
