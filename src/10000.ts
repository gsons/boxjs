declare var $response: any;
declare var $request: any;

import Box from "./Box";
const RSAEncrypt = require('./lib/JSEncrypt');
import BaseErr from "./lib/BaseErr"

class App extends Box {

    mobile: string;
    password: string;
    token: string;

    constructor(name: string, namespace: string) {
        super(name, namespace);
        this.mobile = this.getStore(`mobile`);
        this.password = this.getStore(`password`);
        this.token = this.getStore(`token`);
    }
    async doAction() {
        if (typeof $request != 'undefined' && /^https?:\/\/10000\.log/.test($request.url)) {
            this.handelLogHttp();
        }
        else if (typeof $request != 'undefined' && /^https?:\/\/10000\.json/.test($request.url)) {
            let vvv_flow=null;
            try {  
                vvv_flow=JSON.parse(this.getStore(`vvv_flow`, true));
                await this.handleQuery();
            } catch (error) {
                this.log(error.message);
                this.ajaxSuccess('查询出错，从缓存获取',vvv_flow);
            }
        }
        else {
            await this.handleQuery();
        }
    }

    async handleQuery() {
        let res = false;
        if (this.token) {
            res = await this.doQuery(this.token);
        }
        if (res === false) {
            const login_info = await this.doLogin();
            this.token = login_info.token;
            this.setStore('token', this.token);
            this.setStore('login_info', JSON.stringify(login_info));
            res = await this.doQuery(this.token);
        }
        if (res) {
            await this.queryJson(res);
        }else{
            throw new BaseErr('查询失败');
        }
    }

    TransPhone(phoneNum: string) {
        let result = ''
        let ArrPhone = phoneNum.toString().split('')
        for (let i = 0; i < 11; i++) {
            result = `${result}` + String.fromCharCode(ArrPhone[i].charCodeAt(0) + 2 & 65535)
        }
        return result
    }

    encrypt(message: string) {
        const key = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDBkLT15ThVgz6/NOl6s8GNPofdWzWbCkWnkaAm7O2LjkM1H7dMvzkiqdxU02jamGRHLX/ZNMCXHnPcW/sDhiFCBN18qFvy8g6VYb9QtroI09e176s+ZCtiv7hbin2cCTj99iUpnEloZm19lwHyo69u5UMiPMpq0/XKBO8lYhN/gwIDAQAB";
        return RSAEncrypt(message, key)
    }
    async doQuery(token = '') {
        this.log('〽️ 开始尝试查询');
        let Ts = this.date('yyyyMMddHHmm00')
        let body = {
            content: {
                fieldData: {
                    provinceCode: "600101",
                    cityCode: "8441900",
                    shopId: '20002',
                    isChinatelecom: '0',
                    account: this.TransPhone(this.mobile)
                },
                attach: "test"
            },
            headerInfos: {
                clientType: '#9.6.1#channel50#iPhone X Plus#',
                timestamp: Ts,
                code: 'userFluxPackage',
                shopId: '20002',
                source: '110003',
                sourcePassword: 'Sid98s',
                token: token,
                userLoginName: this.mobile,
            }
        }

        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json; charset\u003dUTF-8",
            "Connection": "Keep-Alive",
            "Accept-Encoding": "gzip",
        };


        console.log('〽️ request body');
        console.log(JSON.stringify(body));

        let res = await this.post({
            url: "https://appfuwu.189.cn:9021/query/qryImportantData",
            headers: headers,
            body: JSON.stringify(body)
        });

        console.log('response body:');
        console.log(res.body);

        let data = JSON.parse(res.body);
        if (data.responseData.resultCode == '0000') {
            return data;
        }
        else {
            return false;
        }
    }

    getFeeFlowLimt(feeflow: number) {
        var dd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate() + 1;
        return parseInt((feeflow / dd).toFixed(0));
    }


    async queryJson(res: any) {
        if (res) {
            let old_obj = null;
            try {
                old_obj = JSON.parse(this.getStore(`vvv_flow`, true));
            } catch (error) {
                //throw new BaseErr('解析JSON异常');
            }

            let UnlimitInfo = res.responseData.data.flowInfo.specialAmount
            let LimitInfo = res.responseData.data.flowInfo.commonFlow

            let unlimitbalancetotal = 0, unlimitusagetotal = 0, unlimitratabletotal = 0

            //免费流量
            if (UnlimitInfo != null) {
                unlimitbalancetotal = Number(UnlimitInfo.balance)
                unlimitusagetotal = Number(UnlimitInfo.used)
                unlimitratabletotal = unlimitbalancetotal + unlimitusagetotal
            }

            //收费流量
            let limitbalancetotal = 0, limitusagetotal = 0, limitratabletotal = 0
            if (LimitInfo != null) {
                limitbalancetotal = Number(LimitInfo.balance)
                limitusagetotal = Number(LimitInfo.used)
                limitratabletotal = limitbalancetotal + limitusagetotal
            }

            res.time = this.date('yyyy-MM-dd HH:mm:ss');
            const query_date = this.date('yyyy-MM-dd', res.time.replace(/-/g, '/'));
            const fee_used_flow = Number((limitusagetotal / 1024).toFixed(2));
            const fee_remain_flow = Number((limitbalancetotal / 1024).toFixed(2));
            const fee_all_flow = Number((limitratabletotal / 1024).toFixed(2));

            const free_used_flow = Number((unlimitusagetotal / 1024).toFixed(2));

            const used_flow = Number(((limitusagetotal + unlimitusagetotal) / 1024).toFixed(2));

            const sum_top_flow = Number(((unlimitratabletotal + limitratabletotal) / 1024).toFixed(2));
            const remain_top_flow = Number(((limitbalancetotal + unlimitbalancetotal) / 1024).toFixed(2));

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
                    this.msg(this.name, `今日已用流量已超过${one_day_fee_flow}，当日可用流量${obj.fee_flow_limit}`, `今日已用流量已超过${one_day_fee_flow}，当日可用流量${obj.fee_flow_limit}，${obj.second}s 期间 产生跳点流量${obj.second_flow}`)
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
                    this.msg(this.name, `过去一天已用收费流量${one_day_fee_flow}`, `过去一天已用流量${one_day_flow}，免费流量${one_day_free_flow}，收费流量${one_day_fee_flow}`);
                }
            }
            const objstr = JSON.stringify(obj);
            this.log(objstr);
            this.setStore(`vvv_flow`, objstr, true);
            this.ajaxSuccess('查询流量成功', obj);
        } else {
            throw new BaseErr('查询流量失败');
        }
    }

    async product(token = '') {
        this.log('〽️ 开始尝试查询');
        let Ts = this.date('yyyyMMddHHmm00')
        let body = {
            content: {
                fieldData: {
                    queryFlag: '0',
                    accessAuth: '1',
                    account: this.TransPhone(this.mobile)
                },
                attach: "test"
            },
            headerInfos: {
                clientType: '#9.6.1#channel50#iPhone X Plus#',
                timestamp: Ts,
                code: 'userFluxPackage',
                shopId: '20002',
                source: '110003',
                sourcePassword: 'Sid98s',
                token: token,
                userLoginName: this.mobile,
            }
        }
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json; charset\u003dUTF-8",
            "Connection": "Keep-Alive",
            "Accept-Encoding": "gzip",
        };
        this.log('request body');
        this.log(JSON.stringify(body));
        let res = await this.post({
            url: "https://appfuwu.189.cn:9021/query/userFluxPackage",
            headers: headers,
            body: JSON.stringify(body)
        });
        this.log('response body:');
        this.log(res.body);
        let data = JSON.parse(res.body);
        if (data.responseData.resultCode == '0000') {
            return data;
        }
        else {
            return false;
        }
    }

    async doLogin() {
        this.log('运行 》  中国电信密码登录');
        if (!this.mobile || !this.password) {
            throw new BaseErr('⚠️ 请配置手机号(mobile), 密码(password)')
        }

        let Ts = this.date('yyyyMMddHHmm00')
        let message = `iPhone 14 13.2.3${this.mobile}${this.mobile}${Ts}${this.password}0$$$0.`;
        let body = {
            content: {
                fieldData: {
                    accountType: '',
                    authentication: this.password,
                    deviceUid: `3${this.mobile}`,
                    isChinatelecom: '0',
                    loginAuthCipherAsymmertric: this.encrypt(message),
                    loginType: "4",
                    phoneNum: this.TransPhone(this.mobile),
                    systemVersion: "13.2.3",
                },
                attach: "iPhone"
            },
            headerInfos: {
                clientType: '#9.6.1#channel50#iPhone 14 Pro#',
                code: 'userLoginNormal',
                shopId: '20002',
                source: '110003',
                sourcePassword: 'Sid98s',
                timestamp: Ts,
                userLoginName: this.mobile,
            }
        }
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json; charset\u003dUTF-8",
            "Connection": "Keep-Alive",
            "Accept-Encoding": "gzip",
        };


        let errMsg = '系统错误';
        this.log('〽️ 开始尝试密码方式登录');
        this.log('request body');
        this.log(JSON.stringify(body));
        let res = await this.post({
            url: "https://appgologin.189.cn:9031/login/client/userLoginNormal",
            headers: headers,
            body: JSON.stringify(body)
        });

        this.log('response body:');
        this.log(res.body);
        let data = JSON.parse(res.body);
        try {
            let login_info = data.responseData.data.loginSuccessResult;
            if (login_info && login_info.token) {
                this.log('登录成功');
                return login_info;
            } else {
                let re = data.responseData.resultDesc || data.headerInfos.reason;
                if (re) {
                    errMsg = re;
                }
            }
        } catch (error) {
            errMsg = error.message;
        }
        throw new BaseErr('登录失败！' + errMsg);
    }

}

new App('中国电信', 'gsonhub.10000').run();

