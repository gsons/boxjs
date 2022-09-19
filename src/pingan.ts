declare var $response: any;
declare var $request: any;
import BaseErr from "./lib/BaseErr"
import Box from "./Box";

class App extends Box {

    async doAction() {
        if (typeof $request != 'undefined'&&/^https?:\/\/pingan\.log/.test($request.url)) {
            this.handelLogHttp();
        }else if(typeof $response != 'undefined'){
            let res=JSON.parse($response.body);
            res.obj=res.obj.map((vo:any)=>{vo.limitTime='2099-09-17';return vo});
            let body = JSON.stringify(res);
            this.response={body};   
        }
    }

}

require('./tpl/boxjs.tpl.json');
require('./tpl/gsonhub.tpl.sgmodule');
new App('平安白云', 'gsonhub.pingan').run();

