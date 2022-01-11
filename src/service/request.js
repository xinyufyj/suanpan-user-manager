import axios from 'axios'

const instance = axios.create({
  baseURL: '/auth2/admin/'
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  if(response.data && response.data.code == '2') {
    // TODO 没有登录
    let origin = location.origin
    let pathname = location.pathname
    let arr = pathname.split('/')
    if(arr.length > 0) {
      arr[arr.length - 1] = 'login.html';
    }
    location.href = `${origin}${arr.join('/')}`
  }
  return response;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error);
});

export default instance
