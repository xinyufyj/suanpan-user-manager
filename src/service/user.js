import instance from './request'

export function getUserList(startNum, pageSize, orderBy) {
  return instance.post(
    '/user/list',
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
  return instance.post('/user/enable', queryString)
}

export function disableUser(userId) {
  const queryString = new URLSearchParams();
  queryString.append('userId', userId)
  return instance.post('/user/disable', queryString)
}

export function deleteUser(userId) {
  const queryString = new URLSearchParams();
  queryString.append('userId', userId)
  return instance.post('/user/delete', queryString)
}

export function addUser(params) {
  return instance.post('/user/add', params)
}

export function updateUser(params) {
  return instance.post('/user/update', params)
}

export function updateUserPassword(params) {
  const queryString = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    queryString.append(key, params[key])
  })
  return instance.post('/user/updateUserPassword', queryString)
}

// * 查询账号登录信息
/**
 * 
 * @param {*} params
 * @param {*} params.account - 用户名称
 * @param {*} params.pageNum - 每页数量
 * @param {*} params.pageSize - 第几页
 * @param {*} params.orderBy - 排序规则
 * @returns 
 */
export function getLoginInfo(params){
  let data = {
    pageNum:15,
    orderBy:'login_time',
  }
  data = Object.assign(data,params)
  return instance.post('/loginInfo/listByParams',data)
}