declare var $request: any;
import BaseErr from "./lib/BaseErr"
import Box from "./Box";

class App extends Box {

    private signurlKey = 'sign_url';

    private signheaderKey = 'sign_header';

    async handelSign() {
        this.log('运行 》 筋斗云签到');
        let header = JSON.parse(this.getStore(this.signheaderKey, true));
        let url = this.getStore(this.signurlKey, true);

        let [domain] = /https?:\/\/.*?\//.exec(url);
        
        let opts = {
            url: `${domain}user/checkin`,
            headers: header,
        };
        this.log('Http request:' + opts.url);
        let data = await this.post(opts);
        try {
            data = JSON.parse(data.body);
        } catch (error) {
            throw new BaseErr('登录状态可能已经失效' + error);
        }

        this.msg(this.name, data.msg, (JSON.stringify(data)));
    }

    handelSignCookie() {
        this.log('运行 》 获取筋斗云COOKIE');
        this.setStore(this.signurlKey, $request.url, true);
        this.setStore(this.signheaderKey, JSON.stringify($request.headers), true);
        this.msg(this.name, `获取Cookie: 成功 (筋斗云)`, ``);
    }

    async handelWebHttp() {
        this.log('运行 》  筋斗云个人信息查询http服务器');
        let url = this.getStore(this.signurlKey, true);
        let header = JSON.parse(this.getStore(this.signheaderKey, true));
        let opt = {
            url: url,
            headers: header,
        };

        let res = null;
        let vo = await this.get(opt);
        try {
            res = this.fetchJindouyun(vo.body);
        } catch (error) {
            throw new BaseErr(`获取筋斗云个人信息失败，登录状态可能已经失效:` + error);
        }
        this.ajaxSuccess('获取筋斗云个人信息成功', res);
    }



    async doAction() {
        if (typeof $request != 'undefined' && $request.method != 'OPTIONS') {
            if (/^https?:\/\/(www\.|)somersaultcloud\.(xyz|top)\/user$/.test($request.url)) {
                this.handelSignCookie();
            }
            else if (/^https?:\/\/somersaultcloud\.json/.test($request.url)) {
                await this.handelWebHttp();
            }
            else if (/^https?:\/\/somersaultcloud\.log/.test($request.url)) {
                this.handelLogHttp();
            } else {
                await this.handelSign();
            }
        } else {
            await this.handelSign();
        }
    }

    fetchJindouyun(html: string) {
        let [, remain_flow, unit] = /<h4>剩余流量<\/h4>\n\s+<\/div>\n\s+<div class="card-body">\n\s+<span class="counter">(.*)?<\/span> (MB|GB|KB)/.exec(html);
        let [, online, sum] = /<h4>同时在线设备数<\/h4>\n\s+<\/div>\n\s+<div class="card-body">\n\s+<span class="counter">(\d+)<\/span> \/ <span class="counterup">(\d+)<\/span>/.exec(html);
        let [, used_flow] = /今日已用: (.*?)<\/li>/.exec(html);
        let [, last_used_date] = /上次使用时间: (.*?)<\/li>/.exec(html);
        let [, momey] = /<h4>钱包余额<\/h4>\n\s+<\/div>\n\s+<div class="card-body">\n\s+¥\s+<span class="counter">(.*)?<\/span>/.exec(html);
        let [, commission] = /累计获得返利金额: ¥(.*?)<\/li>/.exec(html);

        let res = {
            remain_flow: remain_flow + unit,
            online: online,
            sum: sum,
            used_flow: used_flow,
            last_used_date: last_used_date,
            momey: momey,
            commission: commission
        };
        this.log('↓ fetchJindouyun');
        this.log(JSON.stringify(res));
        return res;
    }
}

new App('筋斗云', 'gsonhub.somersaultcloud').run();

