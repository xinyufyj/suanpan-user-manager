import instance from './request'
import config from './config'

export function login(params) {
  const queryString = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    queryString.append(key, params[key])
  })
  return instance.post(config.baseUrl + '/admin/login', queryString)
}

export function logout() {
  return instance.post(config.baseUrl + '/admin/logout')
}