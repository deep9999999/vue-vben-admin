import { requestClient } from '#/api/request';

export namespace sysApi {
  
  // 机构列表项目信息
  export interface OrgListResult {
    id: string; // 机构ID
    name: string, // 机构名称
    contact: string, // 联系人
    school: string, // 学校名称
    area: string, // 所在区域
    state: string // 状态
    releaseDate: string, // 发布日期
    
  }
}

/**
 * 获取 机构列表
 */
export async function getOrgList(data:{
  page: number;
  pageSize: number;
  formValues: any;
}) {
  return requestClient.post<sysApi.OrgListResult[]>('/sys/orglist', data);
}

/**
 * 新增 机构列表项目
 */
export async function addOrg(data: {
  name: string,
  contact: string,
  school: string,
  area: string,
  state: string
  releaseDate: string,
}) {
return requestClient.post<void>('/sys/addorglist', data);
}

/**
 * 删除 机构列表项目
 */
export async function deleteOrg(id: string[]) {
  return requestClient.post<void>('/sys/removeorglist', { id });
}

/**
 * 编辑 机构列表项目
 */
export async function editOrg(data: {
    id: string,
    name: string,
    contact: string,
    school: string,
    area: string,
    state: string
    releaseDate: string,
}) {
  return requestClient.post<void>('/sys/editorglist', data);
}

/**
 * 查询 机构列表项目
 */
export async function queryOrg(data: {
  id: string
}) {
  return requestClient.post<sysApi.OrgListResult[]>('/sys/queryorgitem', data);
}


export namespace sysApi {
  // 学校列表项目信息
  export interface SchoolListResult {
    id: string; // 学校ID
    name: string; // 学校名称
    principal: string; // 校长
    address: string; // 学校地址
    phone: string; // 联系电话
    type: string; // 学校类型
    foundDate: string; // 成立日期
    orgId: string; // 所属机构ID
  }
}

/**
 * 获取 机构下的学校列表
 */
export async function getSchoolList(data: {
  orgid: string;
  page: number;
  pageSize: number;
}) {
  return requestClient.post<sysApi.SchoolListResult[]>('/sys/schoollist', data);
}

/**
 * 新增 机构下的学校
 */
export async function addSchool(data: {
  name: string;
  principal: string;
  address: string;
  phone: string;
  type: string;
  foundDate: string;
  orgId: string;
}) {
  return requestClient.post<void>('/sys/addschool', data);
}

/**
 * 删除 机构下的学校
 */
export async function deleteSchool(id: string) {
  return requestClient.post<void>('/sys/removeschool', { id });
}

/**
 * 编辑 机构下的学校信息
 */
export async function editSchool(data: {
  orgId: string; // 所属机构ID
  id: string; // 学校ID
  name: string; // 学校名称
  principal: string; // 校长姓名
  address: string; // 学校地址
  phone: string; // 联系电话
  type: string; // 学校类型
  foundDate: string; // 成立日期
}) {
  return requestClient.post<void>('/sys/editschool', data);
}

/**
 * 查询学校信息
 */
export async function querySchool(data: {
  id: string;
}) {
  return requestClient.post<sysApi.SchoolListResult[]>('/sys/queryschool', data);
}



export namespace sysApi {
  // 教师列表项目信息
  export interface TeacherListResult {
    id: string; // 教师ID
    name: string; // 教师姓名
    gender: string; // 性别
    subject: string; // 任教科目
    phone: string; // 联系电话
    email: string; // 电子邮箱
    entryDate: string; // 入职日期
    schoolId?: string; // 所属学校ID
    expireDate: string; // 到期时间
  }
}

/**
 * 获取学校下的教师列表
 */
export async function getTeacherList(data: {
  schoolId: string;
  page: number;
  pageSize: number;
}) {
  return requestClient.post<sysApi.TeacherListResult[]>('/sys/teacherlist', data);
}

/**
 * 新增教师
 */
export async function addTeacher(data: {
  name: string;
  gender: string;
  subject: string;
  phone: string;
  email: string;
  entryDate: string;
  schoolId: string;
}) {
  return requestClient.post<void>('/sys/addteacher', data);
}

/**
 * 删除教师
 */
export async function deleteTeacher(id: string) {
  return requestClient.post<void>('/sys/removeteacher', { id });
}

/**
 * 编辑教师信息
 */
export async function editTeacher(data: {
  id: string;
  name: string;
  gender: string;
  subject: string;
  phone: string;
  email: string;
  entryDate: string;
  schoolId: string;
}) {
  return requestClient.post<void>('/sys/editteacher', data);
}

/**
 * 查询教师信息
 */
export async function queryTeacher(data: {
  id: string;
}) {
  return requestClient.post<sysApi.TeacherListResult[]>('/sys/queryteacher', data);
}


