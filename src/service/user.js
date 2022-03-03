import instance from './request'
import config from './config'

export function getUserList(startNum, pageSize, orderBy) {
  return instance.post(
    config.baseUrl + '/admin/user/list',
    orderBy,
    {
      params: {
        startNum,
        pageSize,
      }
    }
  );
}

export function enableUser(userId) {
  const queryString = new URLSearchParams();
  queryString.append('userId', userId)
  return instance.post(config.baseUrl + '/admin/user/enable', queryString)
}

export function disableUser(userId) {
  const queryString = new URLSearchParams();
  queryString.append('userId', userId)
  return instance.post(config.baseUrl + '/admin/user/disable', queryString)
}

export function deleteUser(userId) {
  const queryString = new URLSearchParams();
  queryString.append('userId', userId)
  return instance.post(config.baseUrl + '/admin/user/delete', queryString)
}

export function addUser(params) {
  return instance.post(config.baseUrl + '/admin/user/add', params)
}

export function updateUser(params) {
  return instance.post(config.baseUrl + '/admin/user/update', params)
}

export function updateUserPassword(params) {
  const queryString = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    queryString.append(key, params[key])
  })
  return instance.post(config.baseUrl + '/admin/user/updateUserPassword', queryString)
}

/**
 *  * 查询账号登录信息
 * @param {*} params
 * @param {*} params.account - 用户名称
 * @param {*} params.startTime - 用户名称
 * @param {*} params.endTime - 用户名称
 * @param {*} params.pageNum - 第几页
 * @param {*} params.pageSize - 数量
 * @param {*} params.orderBy - 排序规则
 * @returns 
 */
export function getLoginInfo(params) {
  let data = {
    pageNum: 15,
    orderBy: 'login_time',
  }
  data = Object.assign(data, params)
  return instance.post(config.baseUrl + '/admin/loginInfo/listByParams', data)
}

/**
 * * 获取校验图片
 * @returns 
 */
export function getAuthCode() {
  return config.baseUrl + '/captcha'
}