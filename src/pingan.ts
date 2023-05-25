import VpnBox, { Action, BaseErr, Err } from "./VpnBox";

require('./tpl/pingan.tpl.sgmodule');

class App extends VpnBox {

    async doAction() {
        switch (this.action) {
            case Action.Request:
                if ($request.url.includes('pingan.log')) {
                    this.handelLogHttp();
                }
                break;
            case Action.Response:
                if ($request.url.includes('baiyunuser/entranceguard/getList')) {
                    try {
                        let res = JSON.parse($response.body);
                        res.obj = res.obj.map((vo: Record<string, any>) => { vo.limitTime = '2099-09-17'; return vo });
                        let body = JSON.stringify(res);
                        this.log(body);
                        this.response = { body };
                    } catch (error) {
                        this.log('解析json失败,修改响应体失败', { url: $request.url, body: $response.body })
                        throw new BaseErr('修改响应数据失败', Err.BASE);
                    }
                }
                break;
            case Action.Script:
                break;
        }
    }
}
new App('平安白云', 'gsonhub.pingan').run();

