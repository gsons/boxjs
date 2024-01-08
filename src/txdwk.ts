import VpnBox, { BaseErr, Err } from "./lib/VpnBox";
require('./tpl/txdwk.tpl.sgmodule');
class App extends VpnBox {

    public static readonly TOKEN_URL = 'http://kc.iikira.com/kingcard';

    public async doRequestAction($request: ScriptRequest): Promise<VpnResult> {
        if ($request.url.includes('txdwk.log')) {
            return this.handelLogHttp();
        } else if ($request.url.includes('txdwk.json')) {
            let htm = '';
            try {
                const res = await this.fetchGuidTokenToConnect();
                if (res.status == 503) {
                    htm = '连接成功！'
                } else {
                    htm = '连接失败！系统异常，' + JSON.stringify(res);
                }
            } catch (err) {
                let msg = '';
                if (err instanceof BaseErr) {
                    msg = err.message;
                }
                htm = '连接失败！系统异常，' + msg;
            }
            let html=`<html><title>腾讯大王卡动态免流</title><body><h1 align='center'>${htm}</h1></body></html>`;

            return this.httpResponseResult(html, { 'Content-Type': 'text/html;charset=utf-8' });
        }
        return false;
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
        const response = await this.get({ url: `http://${guid}.${token}.iikira.com.token` });
        this.log(response);
        return response;
    }
}

new App("腾讯大王卡动态", 'gsonhub.txdwk').run();