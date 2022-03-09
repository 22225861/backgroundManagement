import request from '@/utils/request'

/**
 * 获取角色列表
 * @param params
 * @returns {*}
 */
export function getRoleList(params) {
  return request({
    url: '/sys/role',
    params
  })
}

/**
 *获取企业信息
 */
export function getCompanyInfo(companyId) {
  return request({
    url: `/company/${companyId}`
  })
}

/**
 * 删除角色
 * @param id
 * @returns {*}
 */
export function deleteRole(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}

/**
 * 读取角色详情
 * @param id
 * @returns {*}
 */
export function getRoleDetail(id) {
  return request({
    url: `/sys/role/${id}`
  })
}

/**
 * 修改角色
 * @param data
 * @returns {*}
 */
export function updateRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * 新增角色
 * @param data
 * @returns {*}
 */
export function addRole(data) {
  return request({
    url: `sys/role`,
    method: 'post',
    data
  })
}
