# Photoshop 批量缩放插件

这款 Adobe Photoshop 的 UXP 插件允许批量缩放多个图层，同时保持它们在原位。它特别适用于需要一致缩放的、处理多个图层的设计师。

## 功能
- 同时缩放多个选定图层
- 在缩放过程中保持图层位置
- 简单的基于百分比的缩放输入
- 保留图层关系和构图

## 安装

提醒：在使用 PS Beta 版插件之前，请确保您已安装 Creative Cloud（[点击此处下载](https://www.adobe.com/creativecloud/catalog/desktop.html)）并登录您的 Adobe 帐户。

如果未安装 Adobe Creative Cloud，安装 Beta 版插件时将出现以下图像：

[Image of error message if Creative Cloud is not installed]

如果 PS 版本低于 2021，将出现以下图像：

[Image of error message if PS version is below 2021]

### 安装插件

如果您已安装并登录 Creative Cloud，并且 PS 版本为 2021 或更高版本。下载 Mockplus 插件后，双击该文件将其打开：

双击后，Creative Cloud 将自动打开，点击“本地安装”：

[Image of Creative Cloud installer]

以下状态表示安装成功：

[Image of successful installation message]

然后打开 2021 或更高版本的 PS，“插件”-“上传设计”，您就可以开始使用 PS Beta 版插件了。

## 更新 Creative Cloud 后无法打开插件

### 方法 1：

请使用国外 Adobe 账号或 Google 邮箱账号登录，登录后双击插件进行安装。

### 方法 2：

#### Mac 电脑

1.  Mac 电脑打开终端。（快捷键 command + space，搜索终端，点击回车。）

2.  将以下代码粘贴到终端中：

    ```bash
    "/Library/Application Support/Adobe/Adobe Desktop Common/RemoteComponents/UPI/UnifiedPluginInstallerAgent/UnifiedPluginInstallerAgent.app/Contents/MacOS/UnifiedPluginInstallerAgent" --install
    ```

    （注意：install 后面有一个空格）

3.  将下载的 Beta 版本插件拖入终端，点击回车。

4.  安装成功后，重启 PS。在顶部“插件”-“上传设计”中，即可开始使用 PS Beta 版本插件。

#### Windows 电脑

1.  在搜索栏中搜索“终端”，点击 Windows PowerShell

2.  粘贴以下代码并按回车键：

    ```bash
    cd "C:\Program Files\Common Files\Adobe\Adobe Desktop Common\RemoteComponents\UPI\UnifiedPluginInstallerAgent"
    ```

3.  然后粘贴以下代码

    ```bash
    .\UnifiedPluginInstallerAgent.exe /install
    ```

    （注意：install 后面有一个空格）

4.  将要安装的插件拖到终端中，然后按 Enter 键。

5.  安装成功后，重启 PS。在顶部“插件” - “上传设计”中，即可开始使用 PS Beta 版插件。

### 方法 3：

Mac M1 电脑可以进行以下设置来使用官方版插件。

1.  右键单击“PS 应用程序 - 显示简介”，勾选“使用 Rosetta 打开”。如果没有此选项，可以安装最新版本的 PS 软件；

2.  勾选后，下载 PS 官方版插件；

3.  安装完成后，请重启 PS 软件，然后在顶部菜单栏的“窗口-扩展功能”中启用官方插件。

## 用法

1.  在 Photoshop 中打开您的文档
2.  选择您要缩放的多个图层
3.  运行 Batch Scale 插件
4.  输入所需的缩放百分比（例如，输入 50 代表 50%）
5.  点击“缩放”以应用变换

## 开发设置

要修改或扩展此插件：

安装依赖项： `npm install`

启动开发服务器： `npm run watch`

当您更改源文件时，插件将自动重新加载。

## 项目结构

- index.js - 主要插件逻辑
- index.html - 插件 UI
- style.css - 插件样式
- manifest.json - 插件配置
- batch_scale_PS.ccx - Photoshop CCX 插件文件
- icons/ - 插件图标，适用于不同主题和分辨率

## 许可证

MIT - 详情请参阅 LICENSE 文件
