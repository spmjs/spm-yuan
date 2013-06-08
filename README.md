# spm-tiny-yuan

> 一个简易的 Spm 源服务，以 Spm 插件的形式提供

-----

## 使用方式

安装好 Spm 后再安装此插件

    $ npm install spm -g
    $ npm install spm-tiny-yuan -g

然后可以在任意目录下，运行命令启动源服务

    $ spm tiny-yuan

这样一个 Spm 源服务就启动了，地址为 http://your.ip.address:3000

支持参数配置端口号和启动的线程数（默认为 3000 和 CPU 内核数）

    $spm tiny-yuan -p 80 -w 4

要让 Spm 使用这个源需要修改 ~/.spm/spmrc 文件，增加以下配置

    [source:default]
    url = http://your.ip.address:3000

## 说明

* 源服务使用 spm 安装缓存中的文件对外提供服务，启动前会先扫描缓存目录，并从官网下载一些相应的文件
* 如果要做一个官方源的镜像，你需要先通过 spm install 安装所有官方源的模块，安装到哪里不重要，因为只要安装过，spm 缓存里面有会有相应的包
* 只提供对 info/install/publish/unpublish/login 命令的支持
* publish 等操作前需要登录，用户信息配置在 ~/.spm/yuan_account.json 文件中（WIN7 就是 C:\Users\YOUR_NAME\.spm\yuan_account.json）