import VpnBox, { BaseErr, Err } from "./lib/VpnBox";
require('./tpl/10086.tpl.sgmodule');
class App extends VpnBox {
    public doRequestAction($request: ScriptRequest): VpnResult | Promise<VpnResult> {
        if ($request.url.includes("/qhmcc_wap/newQueryPackage/index.json")) {
            if ($request.headers && $request.headers['Cookie']) {
                this.log("读取header成功", $request.headers);
                this.setStore('login_cookie', $request.headers['Cookie']);
                this.log("读取cookie成功", $request.headers['Cookie']);
                this.msg(this.appName, "读取cookie成功", '');
            } else {
                this.log("读取cookie失败", $request.headers);
                this.msg(this.appName, "读取cookie失败", '');
            }
        }
        return false;
    }
    public async doResponseAction($request: ScriptRequest, $response: ScriptResponse): Promise<VpnResult> {
        throw new BaseErr("Method not implemented.");
    }
    public doScriptAction(): VpnResult | Promise<VpnResult> {
        throw new BaseErr("Method not implemented.");
    }
}

new App("青海移动", 'gsonhub.10086').run();


//https://www.app.qh.chinamobile.com/qhmcc_wap/newQueryPackage/index.json
