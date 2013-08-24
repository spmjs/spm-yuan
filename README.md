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

这样一个 Spm 源服务就启动了，地址为 http://your.ip.address:3000  可以直接访问这个 URL 来查看当前源中的所有模块

### 使用源服务

要让 Spm 使用上一步启动的源，需要对其进行设置，改变源地址

    $ spm config source:default.url http://your.ip.address:3000

### 配置源服务

可以使用 -p 参数配置端口号，默认为 3000

    $ spm yuan -p 80

如果需要后台运行源服务，可以传递 -d 参数，这需要 https://github.com/Unitech/pm2 的支持，请先安装 pm2

    $ npm install pm2 -g
    $ spm yuan -d

后台运行源服务时默认会启动 CPU 内核数个线程，也可以使用 -w 参数定制

    $ spm yuan -d -w 4

源服务默认会以 http://spmjs.org 为远程官方源，可以使用 -s 参数定制

    $ spm yuan -s http://another-spmjs.org

### 镜像同步

从 0.5 版本开始支持远程镜像同步，类似 maven

如果当前的源服务找不到用户需要安装的模块，它会先尝试从远程官方源去下载并同步，然后再交给用户

可以使用上一节的 -s 参数配置远程官方源的地址

## 说明

* 源服务使用 spm 安装缓存中的文件对外提供服务，启动前会先扫描缓存目录，并从官网下载一些相应的文件
* 如果要搭建一个官方源的镜像，你需要先通过 spm install 安装所有官方源的模块，安装路径无所谓，因为只要安装过，安装缓存里会有相应的包
* 只提供对 info/install/publish/unpublish/login 命令的支持
* publish/unpublish 等操作前需要登录，用户信息配置在 ~/.spm/yuan_account.json 文件中

## 变动历史

**2013-08-24** `0.0.5`

- 使用 express 改写
- 增加镜像同步的功能
- 去除内置的多线程支持，改为依赖外部的 pm2 模块

**2013-06-13** `0.0.2`

- 增加一个静态页面用于方便地查看所有模块

**2013-06-09** `0.0.1`

- 改名为 spm-yuan，并入 spmjs
