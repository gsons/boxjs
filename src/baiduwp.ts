import VpnBox, { BaseErr, Err } from "./lib/VpnBox";
require('./tpl/baiduwp.tpl.sgmodule');
class App extends VpnBox {
    public doRequestAction($request: ScriptRequest): VpnResult | Promise<VpnResult> {
        if($request.url.includes("baiduwp.log")){
            return this.handelLogHttp();
        }
        else if($request.url.includes('baidupcs.com/file')){
            let headers=$request.headers;
            let user_agent= this.getStore('user_agent');
            //设置默认值
            if(!user_agent){
                user_agent='LogStatistic';
                this.setStore('user_agent',user_agent);
            }
    
            headers['User-Agent']=user_agent;
            return {headers};
        }else{
            return false;
        }
    }

    public doResponseAction($request: ScriptRequest, $response: ScriptResponse): VpnResult | Promise<VpnResult> {
        throw new Error("Method not implemented.");
    }
    public doScriptAction(): VpnResult | Promise<VpnResult> {
        throw new Error("Method not implemented.");
    }
}

new App("百度网盘直链",'gsonhub.baiduwp').run();