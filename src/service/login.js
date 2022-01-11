import instance from './request'

export function login(params) {
  const queryString = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    queryString.append(key, params[key])
  })
  return instance.post('/login', queryString)
}

export function logout() {
  return instance.post('/logout')
}