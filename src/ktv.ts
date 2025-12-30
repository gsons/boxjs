import VpnBox, { BaseErr, Err } from "./lib/VpnBox";
require('./tpl/ktv.tpl.sgmodule');
class App extends VpnBox {

    public doRequestAction($request: ScriptRequest): VpnResult | Promise<VpnResult> {
        if ($request.url.includes('ktv.log')) {
            return this.handelLogHttp();
        }
        else {
            return false;
        }
    }

    public doResponseAction($request: ScriptRequest, $response: ScriptResponse): VpnResult | Promise<VpnResult> {
        if ($request.url.includes('public/mini_pro/user/get_user_info')) {
            try {
                let res = JSON.parse($response.body);
                let data=res.data;
                data['EXPIRE_DATE']=2177424000;
                data['VIP_STATUS']=2;
                res.data = data;
                let body = JSON.stringify(res);
                this.log(body);
                return { body };
            } catch (error) {
                this.log('解析json失败,修改响应体失败', { url: $request.url, body: $response.body })
                throw new BaseErr('修改响应数据失败', Err.BASE);
            }
        }
        else if ($request.url.includes('core/login/login')) {
            try {
                let res = JSON.parse($response.body);
                let user_info=res.data.user_info;
                user_info['EXPIRE_DATE']=2177424000;
                user_info['VIP_STATUS']=2;
                res['data']['user_info'] = user_info;
                let body = JSON.stringify(res);
                this.log(body);
                return { body };
            } catch (error) {
                this.log('解析json失败,修改响应体失败', { url: $request.url, body: $response.body })
                throw new BaseErr('修改响应数据失败', Err.BASE);
            }
        }
        else {
            this.log('未匹配到需要修改的响应...');
            return false;
        }
    }


    public doScriptAction(): VpnResult | Promise<VpnResult> {
        throw new Error("Method not implemented.");
    }
}

new App("KTV", 'gsonhub.ktv').run();