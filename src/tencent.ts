import VpnBox, { BaseErr, Err } from "./lib/VpnBox";
require('./tpl/tencent.tpl.sgmodule');
require('./tpl/tencent_link.tpl.conf');
require('./tpl/tencent.tpl.conf');

class App extends VpnBox {

    public static readonly VERSION = '1.0.2'

    public static readonly TOKEN_URL = 'http://kc.iikira.com/kingcard';

    public async doRequestAction($request: ScriptRequest): Promise<VpnResult> {
        if ($request.url.includes('tencent.log')) {
            return this.handelLogHttp();
        } else if ($request.url.includes('tencent.json')) {
            let message = '';
            try {
                const res = await this.fetchGuidTokenToConnect();
                if (res) {
                    message = '连接成功！'
                } else {
                    message = '连接失败！';
                }
            } catch (err) {
                let msg = '';
                if (err instanceof BaseErr) {
                    msg = err.message;
                }
                message = '连接失败！出现异常，' + msg;
            }
            this.log(message)
            let html = this.renderHtml(message)
            return this.httpResponseResult(html, { 'Content-Type': 'text/html;charset=utf-8' });
        }
        return false;
    }

   

    private renderHtml(htm: string) {
        const version = App.VERSION
        const html = `
        <html>
        <title>大王卡动态免流</title>
        <link rel="icon" href="https://txwk.10010.com/favicon.ico" type="image/x-icon">
        <link rel="shortcut icon" href="https://txwk.10010.com/favicon.ico" type="image/x-icon">
        <link rel="apple-touch-icon" sizes="180x180" href="https://txwk.10010.com/favicon.ico">
        <meta name=viewport content="width=device-width,user-scalable=no,initial-scale=1,minimum-scale=1,maximum-scale=1">
        <style>
            p{ padding:0px;margin: 0px;  color: #999; font-size: 15px;}
            a{ color: #999;font-size: 15px;}
        </style>
        <body style="color:rgba(131, 109, 70, 0.8);">
            <h1 align="center">腾讯大王卡动态免流</h1>
            <h2 align="center" style='margin-top:30px'>${htm}</h2>
            <div style="position: fixed;bottom:5px;right:0px; width: 220px;height:90px;">
                <p>@author gsonhub</p>
                <p>@version ${version}</p>
                <p>power by shadowrocket script</p>
                <p><a href="http://tencent.log">查看程序运行日志</a></p>
                <div>
        </body>
        </html>
        `
        return html;
    }

    public async doResponseAction($request: ScriptRequest, $response: ScriptResponse): Promise<VpnResult> {
        return false;
    }


    public async doScriptAction(): Promise<VpnResult> {
        let isConnect = true;
        if ($argument == 'network-changed') {
            this.log('network-changed:当网络改变时等待2s 保证VPN已经自动连接');
            await this.sleep(2000);
            isConnect = true;
        }
        else if ($argument == 'network-check') {
            this.log('network-check:检查网络状态');
            const status = await this.checkConnectStatus();
            if (status) {
                isConnect = false;
            }
            this.log(status ? '已连接' : '连接异常，尝试重新连接');
        }
        else if ($argument == 'network-token') {
            this.log('network-token:更新TOKEN');
            isConnect = true;
        }

        if (isConnect) {
            await this.fetchGuidTokenToConnect();
        } else {
            this.log('本次不更新token');
        }
        return {};
    }

    private async checkConnectStatus(isThrow:boolean=false): Promise<boolean> {
        let connected=false,err_msg='';
        try{
            const response = await this.get({ url: `http://www.gstatic.com/generate_204` });
            if(response.status == 204){
                connected= true;
            }else{
                err_msg=JSON.stringify(response);
            }
        }catch(err){
            err_msg=err;
        }
        if(connected){
            return true;
        }else{
            if(isThrow) throw new BaseErr('测试连接状态，连接失败，'+err_msg,Err.HTTP);
            return false;
        }
    }

    private async fetchGuidTokenToConnect(): Promise<boolean> {
        this.log('开始更新token');
        const res = await this.get({ url: App.TOKEN_URL });
        const [guid, token] = res.body.split(',');
        if (!/\w+/.test(guid) || !/\w+/.test(token)) {
            throw new BaseErr('读取token失败!', Err.HTTP);
        }
        this.log('连接代理服务器。。。', { guid, token })
        this.get({ url: `http://${guid}.${token}.iikira.com.token` }).then().catch();
        //稍微等等再测试
        this.sleep(100);
        this.log('连接代理完成 待测试。。。', { guid, token })
        const status = await this.checkConnectStatus(true);
        return status;
    }
}

new App("腾讯大王卡动态", 'gsonhub.tencent').run();