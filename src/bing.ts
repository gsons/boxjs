import VpnBox, { BaseErr, Err } from "./VpnBox";
require('./tpl/bing.tpl.sgmodule');
class App extends VpnBox {

    public doRequestAction($request: ScriptRequest): VpnResult | Promise<VpnResult> {
        if($request.url.includes("www.bing.com")){
            const headers={...$request.headers,...{"X-Forwarded-For":'1.1.1.1'}};
            return {headers}
        }
        return false;
    }
    public doResponseAction($request: ScriptRequest, $response: ScriptResponse): VpnResult | Promise<VpnResult> {
        return false;
    }
    public doScriptAction(): VpnResult | Promise<VpnResult> {
        return false;
    }

}

new App('必应AI','gsonhub.bing');