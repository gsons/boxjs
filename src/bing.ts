import VpnBox, { BaseErr, Err } from "./VpnBox";
require('./tpl/bing.tpl.sgmodule');
class App extends VpnBox {

    public doRequestAction($request: ScriptRequest): VpnResult | Promise<VpnResult> {
        // this.log('http request url ',$request.url);
        if($request.url.includes("bing.log")){
            return this.handelLogHttp();
        }
        else if($request.url.includes("bing.com")){
            const headers={...$request.headers,...{"X-Forwarded-For":'1.1.1.1'}};
            // this.log('new http headers',headers);
            return {headers}
        }else{
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

new App('必应AI','gsonhub.bing').run();