
## Project setup

## nodejs 版本要求
- nodejs 版本统一要求 10.0 以上,建议用 10.16.3 LTS 版本

### 安装对应的全局依赖包
```
npm install -g conventional-changelog-cli commitizen

```

### git 用法

**用 git cz 代替 git commit**

*git cz 用法*

* feat 新功能
* fix Bug修复
* docs 文档更新
* style 代码的格式，标点符号的更新
* refactor 代码重构
* perf 性能优化
* test 测试更新
* build 构建系统或者包依赖更新
* ci CI配置，脚本文件等更新
* chore 非src或者测试文件的更新
* revert commit回退

### 如何启动项目
- 使用npm install 安装依赖文件或者cnpm i
- 配制好 host 为 janus.com
- npm start 即可运行项目
- npm run serve
- npm run lint 做代码检测
