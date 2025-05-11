interface OrgItem {
  id: string;
  name: string;
  contact: string;
  school: string;
  area: string;
  state: string;
  releaseDate: string;
}

export default defineEventHandler(async (event) => {
  const formData = await readBody(event);
  console.log("formData", formData);
  
  // 验证必填字段
  if (!formData.id || !formData.name || !formData.contact || !formData.area || !formData.state) {
    setResponseStatus(event, 400);
    return useResponseError(
      'BadRequestException',
      '所有字段都是必填的',
    );
  }

  // 查找要编辑的组织
  const orgIndex = OrgList.findIndex((org) => org.id === formData.id);
  if (orgIndex === -1) {
    setResponseStatus(event, 404);
    return useResponseError(
      'NotFoundException',
      '未找到要编辑的组织',
    );
  }

  // 更新组织数据
  Object.assign(OrgList[orgIndex], {
    id: formData.id,
    name: formData.name,
    contact: formData.contact,
    area: Array.isArray(formData.area) ? formData.area.join(',') : formData.area,
    state: formData.state,
  });

  console.log("updatedOrg", OrgList[orgIndex]);

  // 返回成功响应
  return useResponseSuccess({
    message: '更新成功',
    data: OrgList[orgIndex]
  });
});
