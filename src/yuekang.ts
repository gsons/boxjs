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
                this.log(`sid:${sid} request header↓ 2135`);
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
            } else {
                this.log(`sid:${sid} request header↓ 2135`);
                //this.log(JSON.stringify($request));
                // this.log(`sid:${sid} response ↓`);
                // this.log(JSON.stringify(res));
                this.response = { body };
            }

        }
    }

}

require('./tpl/boxjs.tpl.json');
require('./tpl/gsonhub.tpl.sgmodule');
new App('粤康码', 'gsonhub.yuekang').run();

