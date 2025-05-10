import { forbiddenResponse } from '~/utils/response';

//{"Name":"1","tel":"2","school":"3","arearange":["重庆市","重庆城区","潼南区"]}

export default defineEventHandler(async (event) => {
  const { page, pageSize, formValues } = await readBody(event);
  if (!page || !pageSize) {
    setResponseStatus(event, 400);
    return useResponseError(
      'BadRequestException',
      'page and pageSize are required',
    );
  }

  let filteredList = [...OrgList];

  if (formValues) {
    // 根据表单值过滤数据
    if (formValues.Name != '') {
      filteredList = filteredList.filter(item => {
          return item.name.toLowerCase().includes(formValues.Name.toLowerCase())
        }
      );
    }
    
    if (formValues.tel != '') {
      filteredList = filteredList.filter(item => 
        item.contact.includes(formValues.tel)
      );
    }

    if (formValues.school != '') {
      filteredList = filteredList.filter(item => {
        return item.school.toLowerCase().includes(formValues.school.toLowerCase())
      });
    }

    // 如果存在地区范围,去掉逗号分隔符
    if (formValues.area != '') {
      // 将字符串转换为数组并连接成字符串
      formValues.area = formValues.area.join(',');
    }

    console.log(formValues.area);

    if (formValues.area != '') {
      filteredList = filteredList.filter(item => {
        // 检查数据项的地区是否包含所有选择的地区层级
        return item.area.toLowerCase().includes(formValues.area.toLowerCase())
      });
    }
  }

  let _OrgList = filteredList;

  // 将数据倒序排列
  _OrgList = _OrgList.reverse();

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const records = _OrgList.slice(start, end);

  // 返回分页结果
  return useResponseSuccess({
    items: records,
    total: _OrgList.length
  });
});
