import { forbiddenResponse } from '~/utils/response';

export default defineEventHandler(async (event) => {
  const { page, pageSize } = await readBody(event);
  if (!page || !pageSize) {
    setResponseStatus(event, 400);
    return useResponseError(
      'BadRequestException',
      'page and pageSize are required',
    );
  }

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const records = OrgList.slice(start, end);

  // 返回分页结果
  return useResponseSuccess({
    items: records,
    total: OrgList.length
  });
});
