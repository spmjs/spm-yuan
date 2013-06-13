# spm-yuan

> 一个简易的 Spm 源服务，以 Spm 插件的形式提供

-----

## 使用

### 安装

请先安装 spm

    $ npm install spm -g
    $ npm install spm-yuan -g

### 启动源服务

在任意目录下，运行以下命令

    $ spm yuan

这样一个 Spm 源服务就启动了，地址为 http://your.ip.address:3000，可以直接访问这个 URL 来查看当前源中的所有模块

支持参数配置端口号和启动的线程数（默认为 3000 和 CPU 内核数）

    $spm yuan -p 80 -w 4

### 使用源服务

要让 Spm 使用上一步启动的源，需要修改 ~/.spm/spmrc （没有请创建），增加或修改以下配置

    [source:default]
    url = http://your.ip.address:3000

## 说明

* 源服务使用 spm 安装缓存中的文件对外提供服务，启动前会先扫描缓存目录，并从官网下载一些相应的文件
* 如果要搭建一个官方源的镜像，你需要先通过 spm install 安装所有官方源的模块，安装路径无所谓，因为只要安装过，安装缓存里会有相应的包
* 只提供对 info/install/publish/unpublish/login 命令的支持
* publish/unpublish 等操作前需要登录，用户信息配置在 ~/.spm/yuan_account.json 文件中

## 变动历史

**2013-06-13** `0.0.2`

- 增加一个静态页面用于方便地查看所有模块

**2013-06-09** `0.0.1`

- 改名为 spm-yuan，并入 spmjs
