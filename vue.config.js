// 运行环境
const env = process.env.NODE_ENV;

// 项目部署的子路径，
const location = '/';

console.log(`当前环境是${env}`);

module.exports = {
  // 项目部署的子路径
  publicPath: env === 'production' ? location : '/',

  // 生产构建时禁用
  // lintOnSave: env !== 'production',

  // 是否使用包含运行时编译器的 Vue 构建版本
  // 设置为 true 后就可以在 Vue 组件中使用 template 选项，但是这会让应用额外增加 10kb 左右
  // runtimeCompiler: true,

  devServer: {
    // port: 8080,
    //host: 'janus.com',
    https: false,
    proxy: {
      '/admin': {
        target: 'http://127.0.0.1:8084',
        changeOrigin: true,
      },
    },
  },
};
