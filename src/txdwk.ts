import VpnBox, { BaseErr, Err } from "./lib/VpnBox";
require('./tpl/txdwk.tpl.sgmodule');
class App extends VpnBox {

    public static readonly TOKEN_URL = 'http://kc.iikira.com/kingcard';

    public async doRequestAction($request: ScriptRequest): Promise<VpnResult> {
        if ($request.url.includes('txdwk.log')) {
            return this.handelLogHttp();
        } else if ($request.url.includes('txdwk.json')) {
            let message = '';
            let connected = false;
            try {
                const res = await this.fetchGuidTokenToConnect();
                if (res.status == 204) {
                    message = '连接成功！'
                    connected = true;
                } else {
                    message = '连接失败！系统错误，' + JSON.stringify(res);
                }
            } catch (err) {
                let msg = '';
                if (err instanceof BaseErr) {
                    msg = err.message;
                }
                message = '连接失败！系统异常，' + msg;
            }
            this.log(message)
            let html = this.renderHtml(message)
            return this.httpResponseResult(html, { 'Content-Type': 'text/html;charset=utf-8' });
        }
        return false;
    }

    private renderHtml(htm: string) {
        const html = `
        <html>
        <title>大王卡动态免流</title>
        <link rel="icon" href="https://txwk.10010.com/favicon.ico" type="image/x-icon">
        <link rel="shortcut icon" href="https://txwk.10010.com/favicon.ico" type="image/x-icon">
        <link rel="apple-touch-icon" sizes="180x180" href="https://txwk.10010.com/favicon.ico">
        <meta name=viewport content="width=device-width,user-scalable=no,initial-scale=1,minimum-scale=1,maximum-scale=1">
        <body style="color:rgba(131, 109, 70, 0.8);">
            <h1 align="center" >腾讯大王卡动态免流</h1>  
            <h2 align="center" style='margin-top:30px'>${htm}</h2>
        </body>
        </html>
        `
        return html;
    }

    public async doResponseAction($request: ScriptRequest, $response: ScriptResponse): Promise<VpnResult> {
        return false;
    }


    public async doScriptAction(): Promise<VpnResult> {
        await this.fetchGuidTokenToConnect();
        return {};
    }

    private async fetchGuidTokenToConnect() {
        const res = await this.get({ url: App.TOKEN_URL });
        const [guid, token] = res.body.split(',');
        this.log('连接代理服务器。。。', { guid, token })
        this.get({ url: `http://${guid}.${token}.iikira.com.token` }).then().catch();
        this.log('连接代理完成 待测试。。。', { guid, token })
        const response = await this.get({ url: `http://www.gstatic.com/generate_204` });
        this.log(response);
        return response;
    }
}

new App("腾讯大王卡动态", 'gsonhub.txdwk').run();