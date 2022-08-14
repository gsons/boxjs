declare var $request: any;

import Box from "./Box";

enum EVENT {
    WEB_HTTP, LOG_HTTP, SIGN_COOKIE, SIGN,
}

class App extends Box {
    private event: EVENT;

    private signurlKey = 'sign_url';

    private signheaderKey = 'sign_header';

    constructor(name: string, namespace: string) {
        super(name, namespace);
        this.initEvent();
    }

    async dispatchEvent() {
        switch (this.event) {
            case EVENT.WEB_HTTP:
                await this.handelWebHttp();
                break;
            case EVENT.LOG_HTTP:
                this.handelLogHttp();
                break;

            case EVENT.SIGN_COOKIE:
                this.handelSignCookie();
                break;
            case EVENT.SIGN:
                await this.handelSign();
                break;
            default:
                await this.handelSign();
                break;
        }
    }

    async handelSign() {
        let header ={};// JSON.parse(this.getStore(this.signheaderKey, true));
        let url ='http://www.10010.json/user';// this.getStore(this.signurlKey, true);
        let [domain] = /https?:\/\/.*?\//.exec(url);
        let opts = {
            url: `${domain}user/checkin`,
            headers: header,
        };
        this.log('Http request:' + opts.url);
        let data = await this.get(opts);
        this.msg(this.name, data.msg, (JSON.stringify(data)));
    }

    handelSignCookie() {
        this.setStore(this.signurlKey, $request.url, true);
        this.setStore(this.signheaderKey, JSON.stringify($request.headers), true);
        this.msg(this.name, `获取Cookie: 成功 (筋斗云)`, ``);
    }

    handelLogHttp() {
        let cacheLog = this.getStore(Box.APP_LOG_KEY, true);
        this.httpResponse(cacheLog);
    }

    async handelWebHttp() {
        let url = this.getStore(this.signurlKey, true);
        let header = JSON.parse(this.getStore(this.signheaderKey, true));
        let opt = {
            url: url,
            headers: header,
        };

        let res = null;
        let html = await this.post(opt);
        try {
            res = this.fetchJindouyun(html);
        } catch (error) {
            this.log(`获取筋斗云个人信息失败:` + error);
            this.msg(name, `获取筋斗云个人信息失败`, error)
        }
        let result = { time: new Date().getTime(), datetime: this.date('yyyy-MM-dd HH:mm:ss'), code: res ? 1 : 0, 'msg': res ? '获取筋斗云个人信息成功' : '获取筋斗云个人信息失败', data: res ? res : null };
        this.httpResponse(res);
    }


    initEvent() {
        if (typeof $request != 'undefined' && $request.method != 'OPTIONS' && /^https?:\/\/(www\.|)somersaultcloud\.(xyz|top)\/user$/.test($request.url)) {
            this.event = EVENT.SIGN_COOKIE;
        }
        else if (typeof $request != 'undefined' && $request.method != 'OPTIONS' && /^https?:\/\/jindouyun\.json/.test($request.url)) {
            this.event = EVENT.WEB_HTTP;
        }
        else if (typeof $request != 'undefined' && $request.method != 'OPTIONS' && /^https?:\/\/jindouyun\.log/.test($request.url)) {
            this.event = EVENT.LOG_HTTP;
        }
        else {
            this.event = EVENT.SIGN;
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

const name = '筋斗云机场';
const namespace = 'gsonhub.somersaultcloud';

const app = new App(name, namespace);
app.dispatchEvent().catch((e) => {
    app.log('EEEEEEEEEERRRRRRRRRRR'+e);
}).finally(() => {
    app.done(app.response);
});