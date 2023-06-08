import VpnBox, { BaseErr, Err } from "./lib/VpnBox";
require('./tpl/demo.tpl.sgmodule');
class App extends VpnBox {
    public doRequestAction($request: ScriptRequest): VpnResult | Promise<VpnResult> {
        throw new Error("Method not implemented.");
    }
    public doResponseAction($request: ScriptRequest, $response: ScriptResponse): VpnResult | Promise<VpnResult> {
        throw new Error("Method not implemented.");
    }
    public doScriptAction(): VpnResult | Promise<VpnResult> {
        throw new Error("Method not implemented.");
    }
}

new App("开发示s例",'gsonhub.demo');