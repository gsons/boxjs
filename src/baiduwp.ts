import VpnBox, { BaseErr, Err } from "./lib/VpnBox";
require('./tpl/baiduwp.tpl.sgmodule');
class App extends VpnBox {
    public async doRequestAction($request: ScriptRequest): Promise<VpnResult> {
        if ($request.url.includes("baiduwp.log")) {
            return this.handelLogHttp();
        }
        else if ($request.url.includes('baidupcs.com/file')) {
            let headers = $request.headers;

            let user_agent = this.getStore('user_agent');
            //设置默认值
            if (!user_agent) {
                user_agent = 'LogStatistic';
                this.setStore('user_agent', user_agent);
            }
            headers['User-Agent'] = user_agent;

            let aria2_ip = this.getStore('aria2_ip');
            let is_aria2 = this.getStore('is_aria2') == 'true';

            //远程电脑下载 
            if (aria2_ip && is_aria2) {
                let aria2_urls = this.getStore('aria2_urls');
                //设置默认值
                if (!aria2_urls) {
                    aria2_urls = '[]';
                    this.setStore('aria2_urls', aria2_urls);
                }
                let aria2_url_list: Array<string> = JSON.parse(aria2_urls);

                if (aria2_url_list.includes($request.url)) {
                    throw new BaseErr('该链接已下载,请勿重复下载。。。' + $request.url, Err.SYS);
                } else {
                    aria2_url_list.push($request.url);
                }

                headers['User-Agent'] = '';//禁用手机本地下载
                let param = {
                    "id": this.randomString(10),
                    "jsonrpc": "2.0",
                    "method": "aria2.addUri",
                    "params": [[$request.url], {
                        "header": ["User-Agent:" + user_agent]
                    }]
                }
                const url = aria2_ip == 'auto' ? await this.fetchAria2Url() : aria2_ip;
                this.log("ARIA2 RPC URL:", url);
                this.log("ARIA2 RPC param:", param)
                const res = await this.post({ url: url, body: JSON.stringify(param) });
                const data = JSON.parse(res.body);
                if (data['result']) {
                    this.setStore('aria2_urls', JSON.stringify(aria2_url_list));
                    this.msg(this.appName, '下载成功！', res.body);
                } else {
                    this.msg(this.appName, '下载失败！', res.body);
                }
            }
            
            this.log('读取到百度直链URL:' + $request.url);
            return { headers };
        } else {
            return false;
        }
    }

    private async fetchAria2Url() {
        const url = "https://gitee.com/jsonp/jsonp/raw/master/get_cpolar_list.js";
        const res = await this.get({ url: url });
        const [, body] = /get_cpolar_list\((.*?)\)/.exec(res.body) ?? [];
        const list: Array<any> = JSON.parse(body);
        const obj = list.find(obj => obj.name === 'aria2');
        if (obj && obj.domain) {
            const rpcUrl = `http://${obj.domain}/jsonrpc`;
            return rpcUrl;
        } else {
            throw new BaseErr('无法读取Aria2域名', Err.BASE);
        }
    }

    public doResponseAction($request: ScriptRequest, $response: ScriptResponse): VpnResult | Promise<VpnResult> {
        throw new Error("Method not implemented.");
    }
    public doScriptAction(): VpnResult | Promise<VpnResult> {
        throw new Error("Method not implemented.");
    }
}

new App("百度网盘直链", 'gsonhub.baiduwp').run();