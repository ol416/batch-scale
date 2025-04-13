# Photoshop 批量缩放插件

这款适用于 Adobe Photoshop 的 UXP 插件允许批量缩放多个图层，同时保持它们的位置不变。对于需要一致缩放多个图层的设计师来说，它特别有用。

## 功能
- 同时缩放多个选定的图层
- 在缩放过程中保持图层位置
- 简单的基于百分比的缩放输入
- 保持图层关系和构图

## 安装

### 温馨提示:在使用PS Beta 版插件前,请先确认已经安装了 Creative Cloud(点击这里下载) ,并且登录了 Adobe 账号。

如未安装Adobe Creative Cloud,安装测试版插件时,将会出现下图:

如果 PS 版本低于 2021,将会出现下图:

## 安装插件

如果你已经安装并登录了 Creative Cloud,并且 PS 版本是2021及其以上。下载好摹客插件后,双击文件打开:

双击后会自动打开 Creative Cloud,点击“本地安装”:

出现下图状态,代表安装成功:

接着打开 2021 或以上版本的 PS ,“增效工具” - “上传设计”,即可开始使用 PS Beta 版插件。

## 更新Creative Cloud后无法打开增效工具

方法一:

1. 请使用国外Adobe账号或谷歌邮箱进行登录,登录后双击插件进行安装。

方法二:

Mac 电脑

1. Mac电脑打开终端。(快捷键 command + 空格,搜索终端,并点击回车。)

2. 在终端中粘贴以下代码:

"/Library/Application Support/Adobe/Adobe Desktop Common/RemoteComponents/UPI/UnifiedPluginInstallerAgent/UnifiedPluginInstallerAgent.app/Contents/MacOS/UnifiedPluginInstallerAgent" --install

(注意:install 后面有一个空格)

3. 将下载好的Beta版插件拖入终端,并点击回车。

4. 安装成功后,重启PS即可,在顶部“增效工具” - “上传设计”,即可开始使用 PS Beta 版插件。

Windows 电脑

1. 在搜索栏搜索"终端" ,并点击 Windows PowerShell

2. 粘贴以下代码,并按回车:

cd "C:\Program Files\Common Files\Adobe\Adobe Desktop Common\RemoteComponents\UPI\UnifiedPluginInstallerAgent"

3. 再粘贴以下代码

.\UnifiedPluginInstallerAgent.exe /install

(注意:install 后面有一个空格)

4. 将要安装的插件拖入到终端并回车。

5. 安装成功后,重启PS即可,在顶部“增效工具” - “上传设计”,即可开始使用 PS Beta 版插件。

方法三:

Mac M1电脑可以进行以下设置即可使用正式版插件。

1. 右键“PS应用程序-显示简介”,勾选“使用Rosetta打开”,若无此选项,可安装最新版PS软件;

2. 勾选后,下载正式版PS插件;

3. 安装后,请重启PS软件,在顶部“窗口-扩展”内唤起正式版插件。

## 用法
1. 在 Photoshop 中打开您的文档
2. 选择要缩放的多个图层
3. 运行批量缩放插件
4. 输入所需的缩放百分比（例如，50 表示 50%）
5. 单击“缩放”以应用变换

## 开发设置
要修改或扩展此插件：

1. 安装依赖项：
   `npm install`

2. 启动开发服务器：
   `npm run watch`

3. 当您更改源文件时，插件将自动重新加载。

## 项目结构
- `index.js` - 主要插件逻辑
- `index.html` - 插件 UI
- `style.css` - 插件样式
- `manifest.json` - 插件配置
- `batch_scale_PS.ccx` - Photoshop CCX 插件文件
- `icons/` - 适用于不同主题和分辨率的插件图标

## 许可证
MIT - 有关详细信息，请参见 LICENSE 文件
