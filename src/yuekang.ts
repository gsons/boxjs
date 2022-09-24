declare var $response: any;
declare var $request: any;
import BaseErr from "./lib/BaseErr";
const cryptoJs = require('./lib/crypto');
import Box from "./Box";

class App extends Box {

    async doAction() {

        if (typeof $request != 'undefined' && /^https?:\/\/yuekang\.log/.test($request.url)) {
            this.handelLogHttp();
        } else if (typeof $response != 'undefined') {

            if($request.headers&&$request.headers['x-tif-sid']){
                this.setStore('tif_sid',$request.headers['x-tif-sid'],true);
            }
            let sid=this.getStore('tif_sid',true);
            sid=sid??'710754c49540aeba586da70662574e5eca';
            let res = JSON.parse($response.body);
            let body = JSON.stringify(res);

            if (/collection\/ykmindex\/nat/.test($request.url)) {
                this.log(`sid:${sid} request header↓`);
                this.log(JSON.stringify($request));
                this.log('response header↓ ');
                this.log(JSON.stringify($response.headers));
                this.log('response body↓ ');
                this.log(body);
                this.log('encodedata body↓ ');
                this.log(res.data.encode);
                try {
                    const md5_sid = cryptoJs.MD5(sid);
                    let str = cryptoJs.AES.decrypt(res.data.encode, cryptoJs.enc.Utf8.parse(md5_sid), {
                        mode: cryptoJs.mode.ECB,
                        padding: cryptoJs.pad.Pkcs7
                    }).toString(cryptoJs.enc.Utf8);
                   

                    let obj = JSON.parse(str);
                    let new_res = res;
                    new_res.data.obj = obj;
                    new_res.data.new_encode = cryptoJs.AES.encrypt(str, cryptoJs.enc.Utf8.parse(md5_sid), {
                        mode: cryptoJs.mode.ECB,
                        padding: cryptoJs.pad.Pkcs7
                    }).ciphertext.toString(cryptoJs.enc.Base64);
                    this.log('new res body↓ ');
                    this.log(JSON.stringify(new_res));
                } catch (error) {
                    this.log('str decode error', error);
                }
                this.response = { body };
            } 
            //修改缓存时间达到秒开核酸码的目的
            else if(/api\/open\/r\/ykmlb\/GetInfo/.test($request.url)){
                this.log(`sid:${sid} request header↓`);
                this.log(JSON.stringify($request));
                for(let i in res.data.renqunhechaconfig){
                    //改成缓存一年
                    res.data.renqunhechaconfig[i]=res.data.renqunhechaconfig[i]+40000000;
                }
                let body = JSON.stringify(res);
                this.log('new res body↓');
                this.log(body);
                this.response = { body };
            }
            else {
                //this.log(`sid:${sid} request header↓`);
                this.response = { body };
            }

        }
    }

}

new App('粤康码', 'gsonhub.yuekang').run();

