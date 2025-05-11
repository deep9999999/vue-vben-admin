interface SchoolItem {
  id: string;
  name: string;
  principal: string;
  area: string;
  address?: string;
  phone: string;
  type: string;
  releaseDate: string;
  state: string;
  orgId: string;
}

export default defineEventHandler(async (event) => {
  const formData = await readBody(event);
  console.log("formData", formData);
  
  // 验证必填字段
  if (!formData.id || !formData.name || !formData.principal || !formData.phone || !formData.type) {
    setResponseStatus(event, 400);
    return useResponseError(
      'BadRequestException',
      '所有字段都是必填的',
    );
  }

  // 查找要编辑的学校
  const schoolIndex = SchoolList.findIndex((school) => school.id === formData.id);
  if (schoolIndex === -1) {
    setResponseStatus(event, 404);
    return useResponseError(
      'NotFoundException',
      '未找到要编辑的学校',
    );
  }

  // 更新学校数据
  Object.assign(SchoolList[schoolIndex], {
    id: formData.id,
    name: formData.name,
    principal: formData.principal,
    area: Array.isArray(formData.area) ? formData.area.join(',') : formData.area,
    address: formData.address,
    phone: formData.phone,
    type: formData.type,
    state: formData.state,
    releaseDate: formData.releaseDate || SchoolList[schoolIndex].releaseDate,
    orgId: formData.orgId || SchoolList[schoolIndex].orgId
  });

  console.log("updatedSchool", SchoolList[schoolIndex]);

  // 返回成功响应
  return useResponseSuccess({
    message: '更新成功',
    data: SchoolList[schoolIndex]
  });
});