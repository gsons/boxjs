declare var $response: any;
declare var $request: any;

import Box from "./Box";

class App extends Box {

    async doAction() {
        if (typeof $request != 'undefined'&&/^https?:\/\/10000\.log/.test($request.url)) {
            this.handelLogHttp();
        }
    }

}

new App('中国电信', 'gsonhub.10000').run();

