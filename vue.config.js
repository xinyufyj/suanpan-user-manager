const { options } = require("less")

module.exports = {
  publicPath: './',
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
  chainWebpack: config => {
    config
      .module
      .rule("images")
      .test(/\.(jpg|png|gif)$/)
      .use("url-loader")
      .loader("url-loader")
      .tap(options => {
        options.fallback.options.name = 'image/[name].[hash:8].[ext]'
        return options;
    });
  },
}