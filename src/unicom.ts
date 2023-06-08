import VpnBox, { BaseErr } from "./lib/VpnBox";
import { RSAEncrypt } from "./lib/JSEncrypt";
require('./tpl/unicom.tpl.sgmodule');

class App extends VpnBox {
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
        this.appId = this.getStore(`appId`) ?? '';
        this.mobile = this.getStore(`mobile`) ?? '';
        this.password = this.getStore(`password`) ?? '';
        this.cookie = this.getStore(`cookie`) ?? '';
        this.smscode = this.getStore(`smscode`) ?? '';
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
        this.log('--- 开始尝试查询流量');
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
            throw new BaseErr("查询流量失败！JSON数据解析异常");
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
            throw new BaseErr(errMsg);
        }
    }

    async dologin() {
        this.log('--- 开始尝试密码方式登录');

        if (this.getSignCount() > 4) {
            throw new BaseErr('⚠️ 当日登录已超过四次！请明天再试')
        }

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

        this.incSignCount();

        let body = vo.body;

        console.log('↓ res body')
        console.log(body);

        let res;
        try {
            res = JSON.parse(body)
        } catch (e) {
            throw new BaseErr("密码方式登录失败！JSON数据解析异常");
        }



        let code = res.code;
        if (code === '0') {
            const headers = vo.headers;
            let cookie = headers['set-cookie'] || headers['Set-Cookie'];
            if (Array.isArray(cookie)) {
                cookie = cookie.join('; ')
            }
            this.log(` 密码方式登录 Cookie`)
            if (!cookie) {
                throw new BaseErr(`获取到的密码方式登录 Cookie 为空！`)
            }
            this.cookie = cookie;
            this.log(cookie)
            this.setStore('cookie', cookie, true);
            this.log('🍪 密码方式登录成功！');
            return true;
        } else {
            let desc = res.dsc;
            throw new BaseErr('密码方式登录失败！' + (desc || '未知错误'))
        }
    }

    public async doRequestAction($request: ScriptRequest): Promise<VpnResult> {
        let [, action] = /action=(\w+)/.exec($request.url) ?? [];
        switch (action) {
            case 'send_code':
                return await this.handleSendCodeAction();
            case 'login':
                return await this.handleLoginAction();
            case 'query':
                return await this.handleQueryAction();
            default:
                if ($request.url.includes("10010.log")) {
                    return this.handelLogHttp();
                } else if ($request.url.includes("10010.json")) {
                    return await this.handleQueryAction();
                } else {
                    return false;
                }
        }
    }
    public doResponseAction($request: ScriptRequest, $response: ScriptResponse): VpnResult | Promise<VpnResult> {
        return false;
    }
    public async doScriptAction(): Promise<VpnResult> {
        this.log('以脚本方式运行');
        return await this.handleQueryAction();
    }

    async handleLoginAction() {
        this.log('运行 》  中国联通验证码登录');

        if (!this.mobile || !this.smscode) {
            throw new BaseErr('⚠️ 请配置 手机号(mobile), 验证码(smscode)')
        }

        this.log('〽️ 开始尝试验证码方式登录');
        let appId = this.appId;
        let vo = await this.post({
            url: 'https://m.client.10010.com/mobileService/radomLogin.htm',
            body: this.transParams({
                mobile: RSAEncrypt(this.mobile),
                password: RSAEncrypt(this.smscode),
                appId: this.randomString(160),
                version: 'iphone_c@9.0100',
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })

        let body = vo.body;
        this.log('↓ res body')
        this.log(body);

        let res;
        try {
            res = JSON.parse(body)
        } catch (e) {
            throw new BaseErr("验证码方式登录失败，JSON数据解析异常Z");
        }

        let code = res.code;
        if (code === '0') {
            const headers = vo.headers;
            let cookie = headers['set-cookie'] || headers['Set-Cookie'];
            if (Array.isArray(cookie)) {
                cookie = cookie.join('; ')
            }
            this.log(` 验证码方式登录 Cookie`)
            if (!cookie) {
                throw new BaseErr(`获取到的验证码方式登录 Cookie 为空！`)
            }
            this.cookie = cookie;
            this.log('cookie:\n' + cookie)
            this.setStore('cookie', cookie, true);
            this.setStore('appId', res.appId, true);
            this.log('appId:\n' + appId)
            this.msg(this.appName, '🍪 验证码方式登录成功！', '');
            return this.ajaxSuccessResult('验证码方式登录成功！');
        } else {
            let desc = res.dsc;
            throw new BaseErr('验证码方式登录失败！' + (desc || '未知错误'))
        }
    }


    async handleSendCodeAction() {
        this.log('运行 》  中国联通发送验证码');

        if (!this.mobile) {
            throw new BaseErr('⚠️ 请配置 手机号(mobile))');
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
            throw new BaseErr("发送验证码失败！JSON数据解析异常，" + body);
        }

        if (res.rsp_code == '0000') {
            this.msg(this.appName, '发送验证码成功', '');
            return this.ajaxSuccessResult('发送验证码成功');
        } else {
            throw new BaseErr("发送验证码失败！" + body);
        }
    }

    async handleQueryAction() {
        this.log('运行 》  中国联通查询流量');

        if (!this.cookie && (!this.appId || !this.mobile || !this.password)) {
            throw new BaseErr('⚠️ 请配置 Cookie 或 appId, 手机号(mobile), 密码(password)')
        }
        let res = await this.query();
        if (res) {
        } else {
            await this.dologin();
            res = await this.query();
        }
        return this.handleQuery(res);
    }


    getFeeFlowLimt(feeflow: number) {
        var dd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate() + 1;
        return parseInt((feeflow / dd).toFixed(0));
    }

    handleQuery(res: any) {
        if (res) {
            let old_obj: any = null;
            try {
                old_obj = JSON.parse(this.getStore(`vvv_flow`) ?? '');
            } catch (error) {
                //throw new BaseErr('解析JSON异常');
            }
            const query_date = this.date('yyyy-MM-dd', res.time.replace(/-/g, '/'));

            const fee_used_flow = parseFloat((res.summary.sum - res.summary.freeFlow).toFixed(2));
            const fee_remain_flow = parseFloat(res.resources[0].remainResource);
            const fee_all_flow = parseInt((fee_used_flow + fee_remain_flow).toFixed(0));
            const free_used_flow = parseFloat(res.summary.freeFlow);
            const used_flow = parseFloat(res.summary.sum);
            const sum_top_flow = (res.summary.sumfengDing * 1024);
            const remain_top_flow = parseFloat(res.summary.remainFengDing);

            const second = (old_obj) ? parseFloat(((new Date(res.time.replace(/-/g, '/')).getTime() - new Date(old_obj.query_date_time.replace(/-/g, '/')).getTime()) / 1000).toFixed(2)) : 0;
            const second_flow = (old_obj && old_obj.fee_used_flow < fee_used_flow) ? parseFloat((fee_used_flow - old_obj.fee_used_flow).toFixed(2)) : 0;

            const last_day_fee_flow = (old_obj && old_obj.last_day_fee_flow >= 0) ? old_obj.last_day_fee_flow : fee_used_flow;//0点已用收费流量
            const offset_fee = parseFloat((fee_used_flow - last_day_fee_flow).toFixed(2));
            const one_day_fee_flow = offset_fee >= 0 ? offset_fee : old_obj.one_day_fee_flow;//当天已用收费流量

            const last_day_free_flow = (old_obj && old_obj.last_day_free_flow >= 0) ? old_obj.last_day_free_flow : free_used_flow;//0点已用免费流量
            const offset_free = parseFloat((free_used_flow - last_day_free_flow).toFixed(2));
            const one_day_free_flow = (offset_free >= 0 ? offset_free : old_obj.one_day_free_flow);//当天已用免费流量

            const last_day_flow = (old_obj && old_obj.last_day_flow >= 0) ? old_obj.last_day_flow : used_flow;//0点已用流量
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

                'fee_flow_limit': this.getFeeFlowLimt(fee_remain_flow),
            };

            if (old_obj) {
                if (obj.one_day_fee_flow > (obj.fee_flow_limit / 2) && obj.second_flow > 0.1) {
                    this.msg(this.appName, `今日已用流量已超过${one_day_fee_flow}，当日可用流量${obj.fee_flow_limit}`, `今日已用流量已超过${one_day_fee_flow}，当日可用流量${obj.fee_flow_limit}，${obj.second}s 期间 产生跳点流量${obj.second_flow}`)
                }
                else if (obj.second_flow > 1) {
                    this.log(`${obj.second}s 期间 产生跳点流量${obj.second_flow} 今日已用流量${one_day_fee_flow}`, '');
                }

                //每天0点发送流量报告
                if (old_obj.query_date != obj.query_date) {
                    //重置0点流量缓存
                    obj.last_day_fee_flow = fee_used_flow;
                    obj.last_day_free_flow = free_used_flow;
                    obj.last_day_flow = used_flow;
                    this.msg(this.appName, `过去一天已用收费流量${one_day_fee_flow}`, `过去一天已用流量${one_day_flow}，免费流量${one_day_free_flow}，收费流量${one_day_fee_flow}`);
                }
            }
            const objstr = JSON.stringify(obj);
            this.log(objstr);
            this.setStore(`vvv_flow`, objstr, true);
            return this.ajaxSuccessResult('查询流量成功', obj);
        } else {
            throw new BaseErr('查询流量失败');
        }
    }
}

new App('中国联通', 'gsonhub.10010').run();