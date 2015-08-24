# iconfonts
已经部署到 [http://iconfont.imweb.io](http://iconfont.imweb.io) 上面。

===
### 存储icon
icon 相关文件存储到docs中，db/insert.js 会负责解析docs中的style.css，解析出其中的icon，并完成如下的工作：
+ 将style.css (关于iconfont的定义)copy到public/css/iconfont.css中
+ 将fonts中字体文件copy到pubic/css/fonts下
+ 将style.css中解析出来的icon图片存储到db中。

===
### 显示icon

```
node index.js
```
浏览器输入

```
localhost:4001
```

===
### 下载 icon 对应的字体
+ 在首页勾选需要的 icon
+ 点击导航上的下载
+ 下载的文件中包含了字体问题，同时对`ttf字体做了base64引入`（针对移动端）

### 上传 SVG
点击导航上的上传，将 SVG 拖拽到框内，系统会插入新的 SVG icon，同时生成字体文件，首页可以看到最新的 icon，这里平台和移动端的图标是以 SVG 名字来的，以mMhH-开发的，默认时移动端的 icon。

### 后续计划
希望将整个流程打通，设计同学给到 svg 后（这里要制定一套 icon 的命名规则），系统可以将上面流程的后面部分全部完成。


### 更新
##### 0701
已经将 svg 到iconfont整个流程打通，现在从 svg 目录中读取 svg， 生成对应的 iconfont，并加数据存储到本地数据库，然后到显示。

##### 0702
用户可以选择少数几个图标，然后定制自己的 font 字体（这样文件会小很多），暂时还没有复杂处理，不太稳定

##### 0707
+ 下载这里有坑，打包zip的插件没有提供回调机制，（fsstream的几个事件试过了，无效），所以不知道什么时候下载打包好的zip包，这里暂时用setTimeout hack了一下
+ 对于 ttf 文件 base64 内嵌到 css 中的需求，font-carrier 生成字体文件时，异步但是没有提供回调，已经向作者 pull request了，暂时把这里生成字体文件的操作改成同步。
+ 上传，目前支持单个 svg 上传到 iconfont 平台。

##### 0709
+ font-carrier 的问题已经fix（本身有些坑），已经支持到内嵌字体文件（ttf文件）的base64

##### 0810
+ 支持图标搜索
+ 存储切换到 mongodb
+ 错误日志

### 后续规划
+ 生成 SCSS 文件    `done`
+ 除了类名外，生成 %类名，两个文件分开  `done`
+ 命名 i-svg文件名  `done`
+ 命令规范层级问题
+ svg 命名中划线，最好不要用数字、驼峰
+ svg 规范 rogerjs
+ 移动端字体名字mfont，PC上webfont
+ 导出 png 图片 32*32
+ icon 更新
+ svg 上传到平台（目录已支持文件，需要扩充多文件支持） `done`
+ 使用命令同步 iconfont 平台的 svg 到本地项目目录
+ 构建分析 vm、tpl、html中挂在的 iconfont 类名
+ 根据类名找到对应的 svg 文件，生成字体文件
+ 引入相应的 css


### 0812 规划
+ 支持后续扩容，底层存储切换到 mongodb
+ 移动端（fis）和 pc 端构建（grunt）
+ 支持带标签搜索
+ 账号体系和icon关联
+ icon 标签编辑
+ icon 按项目分类
+ 布内网源
+ 内外网同步
+ 构建先假设 svg 都在本地

### 0824
+ 脚本手动处理SVG同步，暂时没有处理开发网问题
