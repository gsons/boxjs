import Box from "./Box";
const RSAEncrypt = require('./lib/JSEncrypt');

declare var $request: any;


class App extends Box {

    appId: string;
    mobile: string;
    password: string;
    cookie: string;
    smscode: string;

    constructor(name: string, namespace: string) {
        super(name, namespace);
        this.init();
    }

    init() {
        this.appId = this.getStore(`appId`, true);
        this.mobile = this.getStore(`mobile`, true);
        this.password = this.getStore(`password`, true);
        this.cookie = this.getStore(`cookie`, true);
        this.smscode = this.getStore(`smscode`, true);
        const obj = {
            appId: this.appId,
            mobile: this.mobile,
            password: this.password,
            cookie: this.cookie,
            smscode: this.smscode
        };
        console.log(JSON.stringify(obj));
    }

    async query() {
        this.log('〽️ 开始尝试查询流量');
        var cookie = this.cookie;
        let vo = await this.post({
            url: 'https://m.client.10010.com/servicequerybusiness/operationservice/queryOcsPackageFlowLeftContentRevisedInJune',
            headers: { cookie },
        })
        let body = vo.body;

        let res;
        try {
            res = JSON.parse(body);
        } catch (e) {
            throw new Error("查询流量失败！JSON数据解析异常");
        }

        console.log('↓ res body')
        console.log(JSON.stringify(res))


        if (vo.status == 200 && res.code === '0000') {
            this.log('🍪查询流量成功！');
            return res;
        } else {
            const desc = res.desc;
            let errMsg = '查询流量失败！未知错误';
            if (String(body) === '999999' || String(body) === '999998') {
                return false;
            } else if (res.code === '4114030182') {
                errMsg = '"查询流量失败！系统升级';
            } else if (desc) {
                errMsg = "查询流量失败！" + desc;
            }
            throw new Error(errMsg);
        }
    }

    async dologin() {
        this.log('〽️ 开始尝试密码方式登录');
        let appId = this.appId;
        let vo = await this.post({
            url: 'https://m.client.10010.com/mobileService/login.htm',
            body: this.transParams({
                mobile: RSAEncrypt(this.mobile),
                password: RSAEncrypt(this.password),
                appId,
                version: 'iphone_c@9.0100',
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })

        let body = vo.body;
        let res;
        try {
            res = JSON.parse(body)
        } catch (e) {
            throw new Error("密码方式登录失败！JSON数据解析异常");
        }

        console.log('↓ res body')
        console.log(body);

        let code = res.code;
        if (code === '0') {
            const headers = vo.headers;
            let cookie = headers['set-cookie'] || headers['Set-Cookie'];
            if (Array.isArray(cookie)) {
                cookie = cookie.join('; ')
            }
            this.log(` 密码方式登录 Cookie`)
            if (!cookie) {
                throw new Error(`获取到的密码方式登录 Cookie 为空！`)
            }
            this.cookie = cookie;
            this.log(cookie)
            this.setStore('cookie', cookie, true);
            this.log('🍪 密码方式登录成功！');
            return true;
        } else {
            let desc = res.dsc;
            throw new Error('密码方式登录失败！' + (desc || '未知错误'))
        }
    }

    async doAction() {
        let url = (typeof $request != 'undefined' && $request.method != 'OPTIONS' ) ? $request.url : '';
        let [, action] = /action=(\w+)/.exec(url) ?? [];

        switch (action) {
            case 'send_code':
                await this.handleSendCodeAction();
                break;
            case 'login':
                await this.handleLoginAction();
                break;
            case 'query':
                await this.handleQueryAction();
                break;
            default:
                if (/^https?:\/\/10010\.log/.test(url)) {
                    this.handelLogHttp();
                } else {
                    await this.handleQueryAction();
                }

                break;
        }
    }

    async handleLoginAction() {
        this.log('运行 》  中国联通验证码登录');

        if (!this.mobile || !this.smscode) {
            throw new Error('⚠️ 请配置 手机号(mobile), 验证码(smscode)')
        }

        this.log('〽️ 开始尝试验证码方式登录');
        let appId = this.appId;
        let vo = await this.post({
            url: 'https://m.client.10010.com/mobileService/randomlogin.htm',
            body: this.transParams({
                mobile: RSAEncrypt(this.mobile),
                password: RSAEncrypt(this.smscode),
                appId: this.random(160),
                version: 'iphone_c@9.0100',
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })

        let body = vo.body;
        let res;
        try {
            res = JSON.parse(body)
        } catch (e) {
            throw new Error("验证码方式登录失败！JSON数据解析异常");
        }
        console.log('↓ res body')
        console.log(body);

        let code = res.code;
        if (code === '0') {
            const headers = vo.headers;
            let cookie = headers['set-cookie'] || headers['Set-Cookie'];
            if (Array.isArray(cookie)) {
                cookie = cookie.join('; ')
            }
            this.log(` 验证码方式登录 Cookie`)
            if (!cookie) {
                throw new Error(`获取到的验证码方式登录 Cookie 为空！`)
            }
            this.cookie = cookie;
            this.log('cookie:\n' + cookie)
            this.setStore('cookie', cookie, true);
            this.setStore('appId', res.appId, true);
            this.log('appId:\n' + appId)
            this.msg(this.name, '🍪 验证码方式登录成功！', '');
            this.ajaxSuccess('验证码方式登录成功！');
        } else {
            let desc = res.dsc;
            throw new Error('验证码方式登录失败！' + (desc || '未知错误'))
        }
    }


    async handleSendCodeAction() {
        this.log('运行 》  中国联通发送验证码');

        if (!this.mobile) {
            throw new Error('⚠️ 请配置 手机号(mobile))');
        }

        this.log('〽️ 开始尝试发送验证码');
        let vo = await this.post({
            url: 'https://m.client.10010.com/mobileService/sendRadomNum.htm',
            body: this.transParams({
                mobile: RSAEncrypt(this.mobile),
                version: 'iphone_c@9.0100',
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })

        let body = vo.body;
        let res;
        try {
            res = JSON.parse(body)
        } catch (e) {
            throw new Error("发送验证码失败！JSON数据解析异常，" + body);
        }

        if (res.rsp_code == '0000') {
            this.msg(this.name, '发送验证码成功', '');
            this.ajaxSuccess('发送验证码成功');
        } else {
            throw new Error("发送验证码失败！" + body);
        }
    }

    async handleQueryAction() {
        this.log('运行 》  中国联通查询流量');

        if (!this.cookie && (!this.appId || !this.mobile || !this.password)) {
            throw new Error('⚠️ 请配置 Cookie 或 appId, 手机号(mobile), 密码(password)')
        }
        let res = await this.query();
        if (res) {
        } else {
            await this.dologin();
            res = await this.query();
        }
        this.handleQuery(res);
    }



    handleQuery(res: any) {
        if (res) {
            let old_obj = null;
            try {
                old_obj = JSON.parse(this.getStore(`vvv_flow`, true));
            } catch (error) {
                //throw new Error('解析JSON异常');
            }
            const query_date = this.date('yyyy-MM-dd', res.time.replace(/-/g, '/'));

            const fee_used_flow = parseFloat(res.sumresource);
            const fee_remain_flow = parseFloat(res.resources[0].remainResource);
            const fee_all_flow = parseInt((fee_used_flow + fee_remain_flow).toFixed(0));
            const free_used_flow = parseFloat(res.summary.freeFlow);
            const used_flow = parseFloat(res.summary.sum);
            const sum_top_flow = (res.summary.sumfengDing * 1024);
            const remain_top_flow = parseFloat(res.summary.remainFengDing);

            const second = (old_obj) ? parseFloat(((new Date(res.time.replace(/-/g, '/')).getTime() - new Date(old_obj.query_date_time.replace(/-/g, '/')).getTime()) / 1000).toFixed(2)) : 0;
            const second_flow = (old_obj && old_obj.fee_remain_flow > fee_remain_flow) ? parseFloat((old_obj.fee_remain_flow - fee_remain_flow).toFixed(2)) : 0;

            const last_day_fee_flow = (old_obj && old_obj.last_day_fee_flow) ? old_obj.last_day_fee_flow : fee_used_flow;//0点已用收费流量
            const offset_fee = parseFloat((fee_used_flow - last_day_fee_flow).toFixed(2));
            const one_day_fee_flow = offset_fee >= 0 ? offset_fee : old_obj.one_day_fee_flow;//当天已用收费流量

            const last_day_free_flow = (old_obj && old_obj.last_day_free_flow) ? old_obj.last_day_free_flow : free_used_flow;//0点已用免费流量
            const offset_free = parseFloat((free_used_flow - last_day_free_flow).toFixed(2));
            const one_day_free_flow = (offset_free >= 0 ? offset_free : old_obj.one_day_free_flow);//当天已用免费流量

            const last_day_flow = (old_obj && old_obj.last_day_flow) ? old_obj.last_day_flow : used_flow;//0点已用流量
            const offset_flow = parseFloat((used_flow - last_day_flow).toFixed(2));
            const one_day_flow = (offset_flow >= 0 ? offset_flow : old_obj.one_day_flow);//当天已用流量

            var obj = {
                'query_date_time': res.time,
                'query_date': query_date,
                'fee_used_flow': fee_used_flow,
                'fee_remain_flow': fee_remain_flow,
                'fee_all_flow': fee_all_flow,
                'free_used_flow': free_used_flow,
                'used_flow': used_flow,
                'sum_top_flow': sum_top_flow,
                'remain_top_flow': remain_top_flow,

                'last_day_fee_flow': last_day_fee_flow,
                'one_day_fee_flow': one_day_fee_flow,

                'last_day_free_flow': last_day_free_flow,
                'one_day_free_flow': one_day_free_flow,

                'last_day_flow': last_day_flow,
                'one_day_flow': one_day_flow,

                'second': second,//每次查询时间差
                'second_flow': second_flow,//时间差产生的收费流量
            };

            if (old_obj) {
                if (obj.second_flow > 0) {
                    this.msg('中国联通', `${obj.second}s 期间 产生跳点流量${obj.second_flow} 今日已用流量${one_day_flow}`, '');
                }

                //每天0点发送流量报告
                if (old_obj.query_date != obj.query_date) {
                    //重置0点流量缓存
                    obj.last_day_fee_flow = fee_used_flow;
                    obj.last_day_free_flow = fee_used_flow;
                    obj.last_day_flow = used_flow;
                    this.msg('中国联通', `过去一天已用流量${one_day_flow}，免费流量${one_day_free_flow}，收费流量${one_day_fee_flow}`, '');
                }
            }
            const objstr = JSON.stringify(obj);
            this.log(objstr);
            this.setStore(`vvv_flow`, objstr, true);
            this.ajaxSuccess('查询流量成功', obj);
        } else {
            throw new Error('查询流量失败');
        }
    }
}

new App('中国联通', 'gsonhub.10010').run();

