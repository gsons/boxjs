## 🚀 BOXJS脚本集合

> 筋斗云自动签到领取流量脚本&中国联通自动登录流量查询监控
<table>
    <tr align="center">
        <th>脚本</th>
        <th>功能</th>
        <th>支持情况</th>
    </tr>
    <tr align="center">
        <td>中国联通</td>
        <td>自动登录/流量监控与查询</td>
        <td>✔</td>
    </tr>
    <tr align="center">
        <td>筋斗云</td>
        <td>定时签到/信息查询</td>
        <td>✔</td>
    </tr>
</table>

### 安装
```
npm i 
```
### 配置
> 在webpack.config.js 配置你的线上地址(online)与本地IP地址(local)
```c
{
    baseurl: {
        online:'https://raw.githubusercontent.com/gsons/boxjs/main/dist',//线上地址
        local:'http://192.168.101.149:8080'//本地地址
    }
}
````
### 开发阶段

1. 监听文件并编译
```js
npm run watch 
```

2. 启动静态文件服务器

```js
npm run serve 
```

### 上线打包
```js
npm run build 
```
> 打包dist到服务器，建议打包至github作为线上环境
### 配置软件运行

> 将gsonhub.sgmodule的url地址添加到“小火箭”模块,在“BOXJS”订阅box.json的url地址

### API接口
> API接口可用于手机本地接口服务，例如作为scriptable的接口

1. [查询中国联通流量](http://10010.json)

    [http://10010.json](http://10010.json)

2. [中国联通运行日志](http://10010.log)

    [http://10010.log](http://10010.log)

3. [查询筋斗云信息](http://somersaultcloud.json)

    [http://somersaultcloud.json](http://somersaultcloud.json)

4. [筋斗云运行日志](http://somersaultcloud.log)

    [http://somersaultcloud.log](http://somersaultcloud.log)

## 运行截图[]
![image](https://gsons.github.io/demo/notice.jpg)

![image](https://gsons.github.io/demo/scriptable.jpg)      