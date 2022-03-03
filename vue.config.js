
module.exports = {
  publicPath: './auth2/',
  pages: {
    index: {
      // page 的入口
      entry: 'src/main.js',
      // 模板来源
      template: 'public/index.html',
      // 在 dist/index.html 的输出
      filename: 'index.html'
    },
    login: {
      entry: 'src/loginMain.js',
      template: 'public/login.html',
      filename: 'login.html'
    },
  },
}