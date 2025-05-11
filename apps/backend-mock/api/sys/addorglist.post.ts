interface OrgItem {
  id: string;
  name: string;
  contact: string;
  school: string;
  area: string;
  address: string;
  state: string;
  releaseDate: string;
}

export default defineEventHandler(async (event) => {
  const formData = await readBody(event);
  console.log("formData", formData)
  // 验证必填字段
  if (!formData.name || !formData.contact || !formData.area || !formData.state) {
    setResponseStatus(event, 400);
    return useResponseError(
      'BadRequestException',
      '所有字段都是必填的',
    );
  }

  // 构造新的组织数据
  const newOrg: OrgItem = {
    // 生成随机id
    id: Math.floor(Math.random() * 1000000).toString(),
    name: formData.name,
    contact: formData.contact,
    school: "",
    // 将地区数组连接成字符串
    area: Array.isArray(formData.area) ? formData.area.join(',') : formData.area,
    releaseDate: formData.releaseDate,
    state: formData.state,
    address: formData.address,
  };

  console.log("newOrg", newOrg)

  // 添加到组织列表中
  OrgList.push(newOrg);

  // 返回成功响应
  return useResponseSuccess({
    message: '添加成功',
    data: newOrg
  });
});
