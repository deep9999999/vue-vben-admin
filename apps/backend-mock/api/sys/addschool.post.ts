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
  if (!formData.name || !formData.principal || !formData.phone || !formData.type) {
    setResponseStatus(event, 400);
    return useResponseError(
      'BadRequestException',
      '所有字段都是必填的',
    );
  }

  // 构造新的学校数据
  const newSchool: SchoolItem = {
    // 生成随机id
    id: Math.floor(Math.random() * 1000000).toString(),
    name: formData.name,
    principal: formData.principal,
    area: Array.isArray(formData.area) ? formData.area.join(',') : formData.area,
    address: formData.address,
    phone: formData.phone,
    type: formData.type,
    state: formData.state,
    releaseDate: formData.releaseDate || new Date().toISOString().split('T')[0],
    orgId: formData.orgId
  };

  console.log("newSchool", newSchool);

  // 添加到学校列表中
  SchoolList.push(newSchool);

  // 返回成功响应
  return useResponseSuccess({
    message: '添加成功',
    data: newSchool
  });
});
