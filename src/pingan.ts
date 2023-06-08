import VpnBox, { BaseErr, Err } from "./lib/VpnBox";
require('./tpl/pingan.tpl.sgmodule');

class App extends VpnBox {
    public doRequestAction($request: ScriptRequest): VpnResult | Promise<VpnResult> {
        if ($request.url.includes('pingan.log')) {
            return this.handelLogHttp();
        } else {
            return false;
        }
    }

    public doResponseAction($request: ScriptRequest, $response: ScriptResponse): VpnResult | Promise<VpnResult> {
        if ($request.url.includes('baiyunuser/entranceguard/getList')) {
            try {
                let res = JSON.parse($response.body);
                res.obj = res.obj.map((vo: Record<string, unknown>) => { vo.limitTime = '2099-09-17'; return vo });
                let body = JSON.stringify(res);
                this.log(body);
                return { body };
            } catch (error) {
                this.log('解析json失败,修改响应体失败', { url: $request.url, body: $response.body })
                throw new BaseErr('修改响应数据失败', Err.BASE);
            }
        }else{
            return false;
        }
    }

    public doScriptAction(): VpnResult | Promise<VpnResult> {
        return false;
    }
}
new App('平安白云', 'gsonhub.pingan').run();

