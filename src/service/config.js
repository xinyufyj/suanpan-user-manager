const env = location.href.indexOf('localhost') !== -1 || location.href.indexOf('127.0.0.1') !== -1 ? 'local' : 'remote'
export default {
    baseUrl: env === 'local' ? 'http://spuc.xuelangyun.com/auth2' : '/auth2'
}