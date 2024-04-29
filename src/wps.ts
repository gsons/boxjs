import VpnBox, { BaseErr, Err } from "./lib/VpnBox";
require('./tpl/wps.tpl.sgmodule');

class App extends VpnBox {
    public doRequestAction($request: ScriptRequest): VpnResult | Promise<VpnResult> {
        if ($request.url.includes('wps.log')) {
            return this.handelLogHttp();
        } else {
            return false;
        }
    }

    public doResponseAction($request: ScriptRequest, $response: ScriptResponse): VpnResult | Promise<VpnResult> {
        if ($request.url.includes('proxy/msg-sender/api/v1/masshelper/c/detail')) {
            try {
                let res = JSON.parse($response.body);
                let pairs=res['data']['data'][0]['pairs'];
                pairs=pairs.map((vo: Record<string, string>) => { 
                    if(/岗位 工资|岗位工资|工资合计|个人应发合计/.test(vo.field)) vo.value=(2500+parseFloat(vo.value))+'';
                    else if(/本月应代扣个税额/.test(vo.field)) {
                        vo.value=(parseFloat(vo.value)+2500*0.03)+'';
                    }
                    else if(/实发工资/.test(vo.field)) {
                        vo.value=(2500+parseFloat(vo.value)-2500*0.03).toFixed(2);
                    }
                    else if(/入职时间/.test(vo.field)) vo.value='2020-07-27'
                    return vo 
                });
                res['data']['data'][0]['pairs']=pairs;
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
new App('WPS', 'gsonhub.wps').run();

