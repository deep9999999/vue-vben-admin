import { requestClient } from '#/api/request';

export namespace sysApi {
  
  // 机构信息
  export interface OrgListResult {
    id: string;
    name: string;
    code: string;
    parentId: string;
    children?: OrgListResult[];
  }
}

/**
 * 获取机构列表
 */
export async function getOrgList(data:{
  page: number;
  pageSize: number;
}) {
  return requestClient.post<sysApi.OrgListResult[]>('/sys/orglist', data);
}
