# wejuai-page-console
为聚爱管理后台页面

### 鸣谢
[lin-xin](https://github.com/lin-xin/vue-manage-system)
的框架，相关前端文档也参考该框架

但是这个是一个旧版本的，不过和新版的没区别，新版只是替换了vue和element版本

### 结构
- vue.config.js：反代服务的配置
- dist：编译后html源码以及打包为nginx的docker镜像配置文件
- build.gradle：为了使用gradle的docker插件便捷使用

### 基础命令
```shell
npm i
npm run dev
npm build
```

### gradle docker插件使用
需要先将gradle配置到环境变量
或者直接用gradle的绝对路径运行
```shell
gradle dockerBuild
gradle dockerPush
```