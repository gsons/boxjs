import VpnBox from "./VpnBox";
require('./tpl/cloud.tpl.sgmodule');

class App extends VpnBox {

    public async doRequestAction($request: ScriptRequest): Promise<VpnResult> {
        if ($request.url.includes("cloud.log")) {
            return this.handelLogHttp();
        } else if ($request.url.includes("somersaultcloud.xyz/user/profile") || $request.url.includes("somersaultcloud.top/user/profile")) {
            if ($request.headers && $request.headers['Cookie']) {
                this.setStore('login_cookie', $request.headers['Cookie']);
                this.log("读取cookie成功", $request.headers['Cookie']);
                this.msg(this.appName, "读取cookie成功", '');
            } else {
                this.log("读取cookie失败", $request.headers);
                this.msg(this.appName, "读取cookie失败", '');
            }
            return {};
        }
        else if ($request.url.includes("cloud.json")) {
            const url = "https://www.somersaultcloud.xyz/user";
            const opt = { url };
            const res = await this.get(opt);
            return this.ajaxSuccessResult('获取个人信息',{data:[]});
        }
        else {
            //没匹配到脚本请返回false
            return false;
        }
    }
    public doResponseAction($request: ScriptRequest, $response: ScriptResponse): VpnResult | Promise<VpnResult> {
        return false;
    }
    public doScriptAction(): VpnResult | Promise<VpnResult> {
        return false;
    }
}

new App("筋斗云", 'gsonhub.cloud').run();