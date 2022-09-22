declare var $response: any;
declare var $request: any;
import BaseErr from "./lib/BaseErr";
const  cryptoJs = require('./lib/crypto');
import Box from "./Box";

class App extends Box {

    async doAction() {

        if (typeof $request != 'undefined' && /^https?:\/\/yuekang\.log/.test($request.url)) {
            this.handelLogHttp();
        } else if (typeof $response != 'undefined') {
            this.msg(this.name,'yuekangma','yuekangma');
            let res = JSON.parse($response.body);
            // const sid='b6386e844c900f6767b068c4107a9f1a62';
            // let str = cryptoJs.AES.decrypt(res.data.encode, cryptoJs.enc.Utf8.parse(sid), {
            //     mode: cryptoJs.modcrypto.ECB,
            //     padding: cryptoJs.pad.Pkcs7
            // }).toString(cryptoJs.enc.Utf8);
            // this.log(str);
            this.log(JSON.stringify($response.headers));
            let body = JSON.stringify(res);
            this.log(body);
            this.response = { body };
        }

        // b6386e844c900f6767b068c4107a9f1a62
        // console.log(e.enc.Utf8.parse);
        // console.log(e.AES.decrypt);
        // let encode = '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';
        // encode = 'koEykRQj7Di5Zkl58moOcDEO4wFMCPJNDAC//lC7Mns1j8iGzcR4nGIn7W0CBz4n4ulobHqxUClOy513aPO4Jluwqx7HOrVwBAo4ZYevQccnEuGFxoHFiv1vcjgHdwXwgrmaa7/Rv6AAcprvCfh7sTgiHFziWgyCKiQqFQNISYKgN64MNuFYMg7TmTuYxcmE3p0bvwZBTbYFoOhXxiJ4aNWTj1xrM/G7glUbs/uMGPL0tEfj26eOObnQjL9hZ2MdWcNZ+5SJ2ssq0tU23dQkh21mhjB7uymQgDGe3rnVxLmURgTgXxFH4wP/ar567Te4GA6nEmJ3y8EAjnYiE9BF4/i/iNyaJnolipKxmRtQfghlW7a+YQoDBY6vHfxCNrM34PietHwYOA7hTeEVEka9gEBxOiZddBJOxjCtVM2bvGpL9LnyRj+jWx7Hjk5qp33Ox7TmlYKW8X7i9McB02I8JN1Kaa8/nqYy5Oat2UGUMyk=';
        // encode = 'koEykRQj7Di5Zkl58moOcDEO4wFMCPJNDAC//lC7Mns1j8iGzcR4nGIn7W0CBz4n4ulobHqxUClOy513aPO4Jluwqx7HOrVwBAo4ZYevQccnEuGFxoHFiv1vcjgHdwXwgrmaa7/Rv6AAcprvCfh7sTgiHFziWgyCKiQqFQNISYKgN64MNuFYMg7TmTuYxcmE3p0bvwZBTbYFoOhXxiJ4aNWTj1xrM/G7glUbs/uMGPL0tEfj26eOObnQjL9hZ2MdWcNZ+5SJ2ssq0tU23dQkh21mhjB7uymQgDGe3rnVxLmURgTgXxFH4wP/ar567Te4GA6nEmJ3y8EAjnYiE9BF4/i/iNyaJnolipKxmRtQfghlW7a+YQoDBY6vHfxCNrM34PietHwYOA7hTeEVEka9gEBxOiZddBJOxjCtVM2bvGpL9LnyRj+jWx7Hjk5qp33Ox7TmlYKW8X7i9McB02I8JIu7pYrfAhD/muc2sk3cRvGg2x++C41KdBMEQlZyMo79FubcmDCQNnCNBdGgjCavYKH77g3Yf4quLvaId8sM1uMfs2Hs39I/m9N9UeYvVRVSxHyZjA2NknUXVhZDYSx2uQuoJLANNjG3Ef3rwtOVIl1n3BDkwdi5kwZmlhKf70MkDxUVm9OiN1D0AzXkusYQLtlwDdiZBKxWykGRqbrPU6QirVUNKsgyP3sJ8XIrJY+oqEjjjtafgTB30jpqouCKa8+hOqTB/QXuQv9qAk3dM8z74pcFlT+VB0soG9MkVI1elvMUn+VctWQ3ywgcp8tCswvS7Ke5pWP5WXUREwbg370bQ992NoHHCuiMkxF8ni4nZmzwcoJ65tGA2LUU8D0aCYZpFleZ4K6ytfR9e+M/+XhXJBXpgKpPZHNnuxb290wc1BQknTaBZ4HTY1mGpvCIcZXJjPkcbsPw/A01I69FaYpH8LNUnOrp3nhVWTrAKZvdQjvIDQvPmpZxT7YRtTXWufSMw13GuJq8NwtLXfYvlkIQ4rVkUBGCtp9/6DRBxosYXkiFjVsb+S7sU4hwDcjIIhCRcbNLIyklXw1Y+bnT1cwoF/RoiCY1egb6eOx/erUlIju1EgrfEYVtp3VY8IVWogzAzziX5ioWEDv6lfabzcdP42JN/7v/3tfieW/CVem2TN3kLuDVkApglQP9xi988Geb4MwCUxCVs/pkk1MT2e6VlszBC5qkTphMyA1Fna2lS8l6RTBvh7T+sfnRE4wM8w0TxECadS6ZhSQFYQK/aIFfnYxUH8hdQPf/IzLWoqLEHrHPejpDoAAMIXHrVFVqkVgDFL7k/0ylcZjhQ9o/ICaYvG0nPBxsTq9AV+JYN1+5NAUASQ1+LjOCjNJm/Xi5VFss41g0tHtUjxQtw3P5olzELFecwqOn8Z0LnraCGPJ9b+Cf7BFe042PuwWoAdIO2rQZm8rOPtgNuWnARVGBMIA=';
        // let ss = e.MD5('b6386e844c900f6767b068c4107a9f1a62')
        // let sss = e.AES.decrypt(encode, e.enc.Utf8.parse(ss), {
        //     mode: e.mode.ECB,
        //     padding: e.pad.Pkcs7
        // }).toString(e.enc.Utf8);
        // console.log(sss);
        // sss = e.AES.encrypt(sss, e.enc.Utf8.parse(ss), {
        //     mode: e.mode.ECB,
        //     padding: e.pad.Pkcs7
        // }).ciphertext.toString(e.enc.Base64);
        // console.log(sss);
    }

}

require('./tpl/boxjs.tpl.json');
require('./tpl/gsonhub.tpl.sgmodule');
new App('粤康码', 'gsonhub.yuekang').run();

