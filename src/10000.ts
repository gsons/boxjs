declare var $response: any;
declare var $request: any;

import Box from "./Box";
const RSAEncrypt = require('./lib/JSEncrypt');
import BaseErr from "./lib/BaseErr"

class App extends Box {

    mobile: string;
    password: string;

    constructor(name: string, namespace: string) {
        super(name, namespace);
        this.mobile = this.getStore(`mobile`);
        this.password = this.getStore(`password`);
        if (!this.mobile || !this.password) {
            throw new BaseErr('⚠️ 请配置 手机号(mobile), 密码(password)')
        }
    }
    async doAction() {
        if (typeof $request != 'undefined' && /^https?:\/\/10000\.log/.test($request.url)) {
            this.handelLogHttp();
        } else {
            let res=await this.doQuery2();
            this.log((res.body));
            this.ajaxSuccess('查询流量成功', res);
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

    encrypt(message:string){
       const  key="MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDBkLT15ThVgz6/NOl6s8GNPofdWzWbCkWnkaAm7O2LjkM1H7dMvzkiqdxU02jamGRHLX/ZNMCXHnPcW/sDhiFCBN18qFvy8g6VYb9QtroI09e176s+ZCtiv7hbin2cCTj99iUpnEloZm19lwHyo69u5UMiPMpq0/XKBO8lYhN/gwIDAQAB";
       return  RSAEncrypt(message,key)
    }
    async doQuery2(token=''){
        token='V1.09fWZECWr2GyTVA/hcirmqqJRwzWKfWgbMNp4sJ3CZtAh+nUARmBvV5Hj6vj6dCFBpujols9/xajA3djrmLGS2uI+xnqCnDQ5MwfvZIbNX6+g1O4MPiP2ZzatZHLQIhyC';
        let Ts = this.date('yyyyMMddHHmm00')
        let body = {
            content: {
                fieldData: {
                    provinceCode:"600101",
                    cityCode:"8441900",
                    shopId:'20002',
                    isChinatelecom:'0',
                    account:this.TransPhone(this.mobile)      
                },
                attach: "test"
            },
            headerInfos: {
                clientType:'#9.6.1#channel50#iPhone X Plus#',
                timestamp:Ts,
                code:'userFluxPackage',
                shopId:'20002',
                source:'110003',
                sourcePassword:'Sid98s',
                token:token,
                userLoginName:this.mobile,
            }
        }

        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json; charset\u003dUTF-8",
            "Connection": "Keep-Alive",
            "Accept-Encoding": "gzip",
        };

        this.log('〽️ 开始尝试密码方式登录');
        this.log(JSON.stringify(body));

        let res = await this.post({
            url: "https://appfuwu.189.cn:9021/query/qryImportantData",
            headers: headers,
            body: JSON.stringify(body)
        });
        return res;
    }

    async doQuery(token=''){
        token='V1.09fWZECWr2GyTVA/hcirmqqJRwzWKfWgbMNp4sJ3CZtAh+nUARmBvV5Hj6vj6dCFBpujols9/xajA3djrmLGS2uI+xnqCnDQ5MwfvZIbNX6+g1O4MPiP2ZzatZHLQIhyC';
        let Ts = this.date('yyyyMMddHHmm00')
        let body = {
            content: {
                fieldData: {
                    queryFlag:'0',
                    accessAuth:'1',
                    account:this.TransPhone(this.mobile)           
                },
                attach: "test"
            },
            headerInfos: {
                clientType:'#9.6.1#channel50#iPhone X Plus#',
                timestamp:Ts,
                code:'userFluxPackage',
                shopId:'20002',
                source:'110003',
                sourcePassword:'Sid98s',
                token:token,
                userLoginName:this.mobile,
            }
        }

        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json; charset\u003dUTF-8",
            "Connection": "Keep-Alive",
            "Accept-Encoding": "gzip",
        };

        this.log('〽️ 开始尝试密码方式登录');
        this.log(JSON.stringify(body));

        let res = await this.post({
            url: "https://appfuwu.189.cn:9021/query/userFluxPackage",
            headers: headers,
            body: JSON.stringify(body)
        });
        return res;
    }

    async doLogin() {
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

    
        this.log('〽️ 开始尝试密码方式登录');
        this.log(JSON.stringify(body));

        let res = await this.post({
            url: "https://appgologin.189.cn:9031/login/client/userLoginNormal",
            headers: headers,
            body: JSON.stringify(body)
        });
        return res;
    }



}

new App('中国电信', 'gsonhub.10000').run();

