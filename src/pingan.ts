import VpnBox, { BaseErr, Err } from "./lib/VpnBox";
require('./tpl/pingan.tpl.sgmodule');

const default_lock_list = [
    {
        "id": "46608c206462494495bbfed4893ea0e6",
        "name": "门禁地址8号",
        "code": "10447942",
        "bluetoothUUID": "E2C56DB5-DFFB-4848-D2B0-60D0F5A71096",
        "bluetoothName": "BYB764D6F0F",
        "bluetoothMajor": "30285",
        "bluetoothMinor": "28431",
        "attendanceCode": "",
        "sn": "DBA49E76",
        "address": "门禁地址8号",
        "crtUser": "null",
        "crtTime": "2018-12-20 16:16:14",
        "crtName": "null",
        "updUser": "null",
        "updTime": "2024-06-13 16:31:51",
        "status": 0,
        "productKey": "3B62A31470525ADF",
        "limitTime": "2399-09-19",
        "macNum": "7F:2B:76:4D:6F:0F",
        "companyId": "e5f08eee82d44ddbb8ea0d28a0585299",
        "companyName": "门禁系统",
        "houseNumberCode": "b236cc2b-f61d-462a-bc4f-dc68134fb344"
    },
    {
        "id": "3914b00107a64e9b87a150718d8dc14c",
        "name": "默认大门",
        "code": "36339320",
        "bluetoothUUID": "E2C56DB5-DFFB-4848-D2B0-60D0F5A71096",
        "bluetoothName": "BY58F3CB61C",
        "bluetoothMajor": "36668",
        "bluetoothMinor": "46620",
        "attendanceCode": "",
        "sn": "8472858A",
        "address": "门禁地址1号",
        "crtUser": "null",
        "crtTime": "2018-12-20 13:57:37",
        "crtName": "null",
        "updUser": "null",
        "updTime": "2024-03-10 13:06:49",
        "status": 0,
        "productKey": "7FBE27A26E9EE52F",
        "limitTime": "2399-09-23",
        "macNum": "80:85:8F:3C:B6:1C",
        "companyId": "e5f08eee82d44ddbb8ea0d28a0585299",
        "companyName": "门禁系统",
        "houseNumberCode": "5e8d5d9b-77c4-b15a-e053-0a29005eb15a"
    }
];

class App extends VpnBox {

    private cache_key_lock_json = "cache_key_lock_json";

    public doRequestAction($request: ScriptRequest): VpnResult | Promise<VpnResult> {
        if ($request.url.includes('pingan.log')) {
            return this.handelLogHttp();
        }
        else if ($request.url.includes('pingan.json')) {
            const lock_json = this.getStore(this.cache_key_lock_json) || '[]';
            return this.ajaxSuccessResult('', JSON.parse(lock_json));
        }
        else {
            return false;
        }
    }

    public doResponseAction($request: ScriptRequest, $response: ScriptResponse): VpnResult | Promise<VpnResult> {
        if ($request.url.includes('baiyunuser/entranceguard/getList')) {
            try {
                let res = JSON.parse($response.body);
                let list = res.obj.map((vo: Record<string, unknown>) => { vo.limitTime = '2099-09-17'; return vo });
                if ($argument == 'gsonhub') {
                    default_lock_list.forEach((item) => {
                        const find = list.find((v: Record<string, unknown>) => v.id == item.id);
                        if (!find) list.push(item);
                    })
                }
                res.obj = list;
                let body = JSON.stringify(res);
                this.log(body);
                this.setStore(this.cache_key_lock_json, JSON.stringify(list));
                return { body };
            } catch (error) {
                this.log('解析json失败,修改响应体失败', { url: $request.url, body: $response.body })
                throw new BaseErr('修改响应数据失败', Err.BASE);
            }
        } else {
            return false;
        }
    }

    public doScriptAction(): VpnResult | Promise<VpnResult> {
        return false;
    }
}
new App('平安白云', 'gsonhub.pingan').run();

