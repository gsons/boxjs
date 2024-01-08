import VpnBox, { BaseErr, Err } from "./lib/VpnBox";
require('./tpl/sniff.tpl.sgmodule');


class App extends VpnBox {

    public doRequestAction($request: ScriptRequest): VpnResult | Promise<VpnResult> {
        const isStream = /\.(flv|m3u8)\?/.test($request.url);
        if (isStream) {
            let streamList_str = this.getStore('stream_list');
            let streamList: Array<Record<string, string>> = streamList_str ? JSON.parse(streamList_str) : [];
            streamList=streamList.slice(0,18);
            streamList.unshift({ link: $request.url, record_time: this.date('yyyy-MM-dd HH:mm:ss') });
            this.setStore('stream_list', JSON.stringify(streamList));
            return {};
        }
        if ($request.url.includes('sniff.json')) {
            let streamList_str = this.getStore('stream_list');
            let stream_list: Array<string> = streamList_str ? JSON.parse(streamList_str) : [];
            return this.httpResponseResult({ stream_list });
        }
        else if ($request.url.includes('sniff.log')) {
            return this.handelLogHttp();
        }
        else {
            return false;
        }
    }

    public async doResponseAction($request: ScriptRequest, $response: ScriptResponse): Promise<VpnResult> {
        throw new Error("Method not implemented.");
    }
    public doScriptAction(): VpnResult | Promise<VpnResult> {
        throw new Error("Method not implemented.");
    }
}

new App("流媒体资源嗅探", 'gsonhub.sniff').run();