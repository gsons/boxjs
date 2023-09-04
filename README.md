# 🚀 boxjs 脚本集合

## 功能说明

> 中国联通、中国电信自动登录流量查询监控

<table>
    <tr align="center">
        <th>脚本</th>
        <th>功能</th>
        <th>支持情况</th>
    </tr>
    <tr align="center">
        <td>中国联通</td>
        <td>自动登录/流量监控与查询</td>
        <td>✔️</td>
    </tr>
    <tr align="center">
        <td>中国电信</td>
        <td>自动登录/流量监控与查询</td>
        <td>✔️</td>
    </tr>
        <tr align="center">
        <td>平安白云</td>
        <td>改有效期无需充值续期</td>
        <td>✔️</td>
    </tr>
        <tr align="center">
        <td>筋斗云机场</td>
        <td>自动加ip白名单</td>
        <td>✔️</td>
    </tr>
</table>



## 开发阶段

0. 安装依赖
```
npm i 
```

1. 监听文件并编译
```js
npm run watch 
```

2. 启动静态文件服务器

```js
npm run serve 
```

3. 更新模块

> 将模块的url地址添加到“小火箭”模块


## 上线打包

### 配置
> 在webpack.config.js 配置你的线上地址(online)
```c
    options: {
        onlineUrl: 'https://raw.githubusercontent.com/gsons/boxjs/main/dist',
    },
````

```js
npm run build 
```
> 打包dist到服务器，建议打包至github作为线上环境
### 配置软件运行

> 将模块的url地址添加到“shadowrocket/surge/loon/qx”模块,在“BOXJS”订阅box.json的url地址 https://raw.githubusercontent.com/gsons/boxjs/main/dist/boxjs.json
<table>
    <tr align="center">
        <th>脚本</th>
        <th>模块地址</th>
    </tr>
    <tr align="center">
        <td>中国联通</td>
        <td>https://raw.githubusercontent.com/gsons/boxjs/main/dist/unicom.sgmodule<td>
    </tr>
    <tr align="center">
        <td>中国电信</td>
         <td>https://raw.githubusercontent.com/gsons/boxjs/main/dist/telecom.sgmodule<td>
    </tr>
        <tr align="center">
        <td>平安白云</td>
        <td>https://raw.githubusercontent.com/gsons/boxjs/main/dist/pingan.sgmodule<td>
    </tr>
        </tr>
    <tr align="center">
        <td>筋斗云机场</td>
        <td>https://raw.githubusercontent.com/gsons/boxjs/main/dist/cloud.sgmodule<td>
    </tr>
</table>


### API接口
> API接口可用于手机本地接口服务，例如作为scriptable的接口

1. 查询中国联通流量

    [http://10010.json](http://10010.json)

2. 中国联通运行日志

    [http://10010.log](http://10010.log)

3. 平安白云运行日志

    [http://pingan.log](http://pingan.log)

4. 中国电信运行日志

   [http://10000.log](http://10000.log)

5. 查询中国电信流量

    [http://10000.json](http://10000.json)


## 运行截图

<img src='https://raw.githubusercontent.com/gsons/gsons.github.io/demo/demo/mokuai.jpg' width='350px'>

<img src='https://raw.githubusercontent.com/gsons/gsons.github.io/demo/images/QQ%E5%9B%BE%E7%89%8720221223165230.jpg' width='350px'>

<img src='https://raw.githubusercontent.com/gsons/gsons.github.io/demo/images/QQ%E5%9B%BE%E7%89%8720221223165234.jpg' width='350px'>


## 平安白云

> 请务必添加如下reject规则，阻止平安白云上报打卡开门记录
```shell
URL-REGEX,baiyunuser\/statistics\/reportOpenDoorRecord,REJECT
```

