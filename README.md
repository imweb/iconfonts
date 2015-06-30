# iconfonts
### 存储icon
icon 相关文件存储到docs中，db/index.js 会负责解析docs中的style.css，解析出其中的icon，并完成如下的工作：
+ 将style.css (关于iconfont的定义)copy到public/css/iconfont.css中
+ 将fonts中字体文件copy到pubic/css/fonts下
+ 将style.css中解析出来的icon图片存储到db中。

===
### 显示icon

```
node index.js
```
浏览器输入 localhost:4001

