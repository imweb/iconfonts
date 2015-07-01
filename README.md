# iconfonts
已经部署到 iconfont.imweb.io 上面。

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
### 遗留问题
icon 的解析依赖与给定的样式和font，目前的流程是：
+ 设计给到 svg 文件，上传到 icomoon 导出合并后的字体文件和 css 文件（命名规则）
+ 将这部分文件放到 docs 目录下面，由 db/insert.js 负责解析工作
+ 将 icon 存储到 db 中。
整个流程复杂，繁琐。

### 后续计划
希望将整个流程打通，设计同学给到 svg 后（这里要制定一套 icon 的命名规则），系统可以将上面流程的后面部分全部完成。
