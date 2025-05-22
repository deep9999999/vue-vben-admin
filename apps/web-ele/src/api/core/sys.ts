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
  return requestClient.post<sysApi.OrgListResult[]>('/org/orglist', data);
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
return requestClient.post<void>('/org/add', data);
}

/**
 * 删除 机构列表项目
 */
export async function deleteOrg(id: string[]) {
  return requestClient.post<void>('/org/delete', { id });
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
  return requestClient.post<void>('/org/editOrg', data);
}

/**
 * 查询 机构列表项目
 */
export async function queryOrg(data: {
  id: string
}) {
  return requestClient.post<sysApi.OrgListResult[]>('/org/orgDetail', data);
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
  orgId: string;
  page: number;
  pageSize: number;
}) {
  return requestClient.post<sysApi.SchoolListResult[]>('org/schoollist', data);
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
  area: string;
}) {
  return requestClient.post<void>('/org/addSchool', data);
}

/**
 * 删除 机构下的学校
 */
export async function deleteSchool(id: string[]) {
  return requestClient.post<void>('/org/deleteSchool', { id });
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
  area: string; // 所属区域
  foundDate: string; // 成立日期
}) {
  return requestClient.post<void>('/org/updateSchool', data);
}

/**
 * 查询学校信息
 */
export async function querySchool(data: {
  id: string;
}) {
  return requestClient.post<sysApi.SchoolListResult[]>('/org/schoolDetail', data);
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
    state: string; // 授权状态
    schoolId?: string; // 所属学校ID
    orgId: string; // 所属机构ID
    expireDate: string; // 到期时间
    password: string; // 密码
  }
}

/**
 * 获取学校下的教师列表
 */
export async function getTeacherList(data: {
  orgId: string;
  schoolId?: string;
  page: number;
  pageSize: number;
}) {
  return requestClient.post<sysApi.TeacherListResult[]>('/org/teacherlist', data);
}

/**
 * 新增教师
 */
export async function addTeacher(data: {
  orgId: string;
  schoolId?: string;
  name: string;
  gender: string;
  subject: string;
  phone: string;
  email: string;
  expireDate: string;
  password: string;
}) {
  return requestClient.post<void>('/org/addTeacher', data);
}

/**
 * 删除教师
 */
export async function deleteTeacher(id: string[]) {
  return requestClient.post<void>('/org/deleteTeacher', { id });
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
  password: string;
}) {
  return requestClient.post<void>('/org/updateTeacher', data);
}

/**
 * 查询教师信息
 */
export async function queryTeacher(data: {
  id: string;
}) {
  return requestClient.post<sysApi.TeacherListResult[]>('/org/teacherDetail', data);
}


export namespace sysApi {
  // 课程列表项目信息
  export interface CourseListResult {
    id: string; // 课程ID
    name: string; // 机构名称
    secname: string; // 联系方式
    state: string; // 课程状态
    releaseDate: string; // 到期时间
  }
}

/**
 * 获取课程列表
 */
export async function getCourseList(data: {
  page: number;
  pageSize: number;
  formValues: any;
}) {
  return requestClient.post<sysApi.CourseListResult[]>('/classes/getMenuList', data);
}

/**
 * 新增课程节点
 */
export async function addCourse(data: {
  name: string;
  secname: string;
  pid?: string;
}) {
  return requestClient.post<void>('/classes/addClasses', data);
}

/**
 * 删除课程节点
 */
export async function deleteCourse(id: string[], ischild: boolean = false) {
  return requestClient.post<void>('/classes/delClasses', { id, ischild });
}

/**
 * 编辑课程节点信息
 */
export async function editCourse(data: {
  id: string;
  name: string;
  secname: string;
}) {
  return requestClient.post<void>('/classes/editClasses', data);
}

/**
 * 查询课程节点信息
 */
export async function queryCourse(data: {
  id: string;
}) {
  return requestClient.post<sysApi.CourseListResult[]>('/classes/classesInfo', data);
}

/**
 * 查询单个课程详情
 */
export async function getCourseDetail(data: {
  id: string;  // 课程ID
}) {
  return requestClient.post<sysApi.CourseListResult>('/classes/getChildClasses', data);
}


export namespace sysApi {
  // 课程列表项目信息
  export interface FileDetailResult {
    id: string; // 课程ID
    name: string; // 机构名称
    type: string; // 文件类型
    state: string; // 课程状态
    releaseDate: string; // 到期时间
  }
}

/**
 * 查询当前课程资料
 */
export async function fetchResources(data: {
  id: string;  // 课程ID
  page: number;
  pageSize: number
}) {
  return requestClient.post<sysApi.FileDetailResult>('/classesSrc/fileList', data);
}

/**
 * 新增课程资料
 */
export async function addFile(data: {
  classId: string; // 课程ID
  name: string; // 资料名称
  type: string; // 文件类型
  fileUrl: string; // 文件对象
}) {
  return requestClient.post<void>('/classesSrc/addFile', data);
}


/**
 * 修改课程资料
 */
export async function editFile(data: {
  id: string; // 资料ID
  name: string; // 资料名称
  type: string; // 文件类型
  fileUrl: string; // 文件对象
}) {
  return requestClient.post<void>('/classesSrc/editFile', data);
}

/**
 * 获取资料详情
 */
export async function getFileDetail(data: {
  id: string; // 资料ID
}) {
  return requestClient.post<sysApi.FileDetailResult>('/classesSrc/fileDetail', data);
}

/**
 * 删除课程资料
 */
export async function deleteFile(id: string[]) {
  return requestClient.post<void>('/classesSrc/delFile', { id });
}

/**
 * 根据url删除附件
 */
export async function removeFile(data: {
  id: string; // 资料ID
}) {
  return requestClient.post<void>('/file/remove', data);
}


/**
 * 课程授权
 * 
 * {
  "authObjType": "",
  "courseList": [
    {
      "courseId": 0,
      "releaseDate": "",
      "type": 0
    }
  ],
  "id": 0
}
 */
export async function courseAuth(data: any) {
  return requestClient.post<void>('/courseAuth/auth', data);
}

/**
 * 获取已有权限列表
 */
export async function getAuthList(data: any) {
  return requestClient.post<void>('/courseAuth/authList', data);
}




