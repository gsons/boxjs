export enum ENV {
    Surge = 'Surge', Loon = 'Loon', QuanX = 'QuanX', Shadowrocket = 'Shadowrocket', Node = 'Node'
};

export enum Action {

    //修改响应
    Response = 'http-response',

    //修改请求头
    Request = 'http-request',

    //直接运行脚本 定时任务
    Script = 'run-script'
};


export enum Err {
    BASE, HTTP, SYS, OTHER
};

export class BaseErr extends Error {
    public code: Err;
    constructor(msg: string, code: Err = Err.BASE) {
        super(msg);
        this.name = 'baseErr';
        this.code = code;
        this.stack = (<any>new Error()).stack;
        Object.setPrototypeOf(this, BaseErr.prototype);
    }
}

abstract class VpnBox {
    /**
     * 运行环境
     */
    public env: ENV;

    /**
     * 应用名称
     */
    public appName: string;

    /**
     * 缓存命名空间
     */
    private namespace: string;

    /**
     * 启动时间戳 用于计算时间差
     */
    private startTime: number;

    /**
     * 是否禁用系统通知
     */
    private isMute: boolean = false;

    private logList: Array<string> = [];

    private static APP_LOG_KEY: string = 'boxjs-log';

    private logSeparator: string = '\n\n';

    public result: VpnResult;

    private isNeedRewrite: false;

    public action: Action;

    constructor(appName: string, namespace: string) {
        this.appName = appName;
        this.namespace = namespace;

        this.startTime = new Date().getTime();

        this.log(`🔔${this.appName}, 开始!`);

        this.initAction();

        this.initEnv();

        let mute = this.getStore('mute');

        this.isMute = mute == 'true';

        require('./tpl/boxjs.tpl.json');
    }

    private initAction() {

        if (typeof $response != 'undefined') {
            this.action = Action.Response;
        }
        else if (typeof $request != 'undefined') {
            this.action = Action.Request;
        } else {
            this.action = Action.Script;
        }
        this.log('脚本类型为：' + this.action);
    }

    private async doAction() {
        switch (this.action) {
            case Action.Request:
                this.result = await this.doRequestAction($request);
                break;
            case Action.Response:
                this.result = await this.doResponseAction($request, $response);
                break;
            case Action.Script:
                this.result = await this.doScriptAction();
                break;
            default:
                this.log(this.appName, 'Unknow Action', '未知的脚本类型');
                this.result = false;
                break;
        }
        if (this.result === false) {
            this.msg(this.appName, '不合法的脚本', '请检查脚本配置信息');
        }
    }

    //没匹配到脚本请返回false
    public abstract doRequestAction($request: ScriptRequest): Promise<VpnResult> | VpnResult;

    public abstract doResponseAction($request: ScriptRequest, $response: ScriptResponse): Promise<VpnResult> | VpnResult;

    public abstract doScriptAction(): Promise<VpnResult> | VpnResult;

    public run() {

        this.doAction().catch((err) => {
            if (err instanceof BaseErr) {
                this.log('' + err.code);
                if (err.code == Err.BASE) {
                    this.msg(this.appName, err.message, '');
                }
                else if (err.code == Err.HTTP) {
                    if (Math.random() > 0.8) {
                        this.msg(this.appName, '网络异常：' + err.message, '');
                    }
                    else {
                        this.log(this.appName, '网络异常Log:' + err.message, '');
                    }
                } else {
                    this.log(err.message, '');
                }
            } else {
                this.log(err);
            }
            this.result = this.ajaxFailResult(err.message || err);
        }).finally(() => {
            this.done();
        });
    }

    transParams(data: Record<string, string | number>) {
        return Object.keys(data)
            .map(k => `${k}=${encodeURIComponent(data[k])}`)
            .join('&')
    }

    public httpResponseResult(res: any, headers: Record<string, string> = {}): VpnResult {
        const defaultHeaders = {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST,GET',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        };
        return {
            response: {
                status: 200,
                body: typeof res == 'string' ? res : JSON.stringify(res),
                headers: { ...defaultHeaders, ...headers }
            },
        }
    }

    randomString(length: number) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    public handelLogHttp(): VpnResult {
        this.log(`运行 》 ${this.appName}系统运行日志http服务器`);
        let cacheLog = this.getStore(VpnBox.APP_LOG_KEY) || '';
        const reg = new RegExp(this.logSeparator, 'g');
        cacheLog = cacheLog.replace(reg, '<br>');
        return this.httpResponseResult(cacheLog, { 'Content-Type': 'text/html;charset=utf-8' });
    }


    public send(opt: HttpOption): Promise<HttpResponse> {
        return new Promise((resolve, reject) => {
            this.doRequest(opt, (err: any, resp: any, body: any) => {
                if (err) reject(new BaseErr(err, Err.HTTP))
                else resolve(resp)
            });
        })
    }


    public async post(opt: HttpOption) {
        opt['method'] = 'post';
        return await this.send(opt);
    }

    public async get(opt: HttpOption) {
        opt['method'] = 'get';
        return await this.send(opt);
    }

    private doRequest(opts: Record<string, any>, callback = (err: any, resp: any, body: any) => { }) {
        const method = opts.method ? opts.method.toLocaleLowerCase() : 'post'
        if (opts.body && opts.headers && !opts.headers['Content-Type']) {
            opts.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        }
        if (opts.headers) delete opts.headers['Content-Length']
        if (this.env == ENV.Surge || this.env == ENV.Shadowrocket || this.env == ENV.Loon) {
            if (this.env == ENV.Surge && this.isNeedRewrite) {
                opts.headers = opts.headers || {}
                Object.assign(opts.headers, {
                    'X-Surge-Skip-Scripting': false
                })
            }
            $httpClient[method](opts, (err: any, resp: any, body: any) => {
                if (!err && resp) {
                    resp.body = body
                    resp.statusCode = resp.status ? resp.status : resp.statusCode
                    resp.status = resp.statusCode
                }
                callback(err, resp, body)
            })
        } else if (this.env == ENV.QuanX) {
            opts.method = method
            if (this.isNeedRewrite) {
                opts.opts = opts.opts || {}
                Object.assign(opts.opts, {
                    hints: false
                })
            }
            $task.fetch(opts).then(
                (resp: any) => {
                    const {
                        statusCode: status,
                        statusCode,
                        headers,
                        body
                    } = resp
                    callback(null, {
                        status,
                        statusCode,
                        headers,
                        body
                    }, body)
                },
                (err: any) => callback((err && err.error) || 'UndefinedError', null, null)
            )
        } else if (this.env == ENV.Node) {
            this.print('nodejs http request', opts, this.env);
        }
    }


    public ajaxSuccessResult(msg: string, data: any = null): VpnResult {
        let result = { time: +new Date(), datetime: this.date('yyyy-MM-dd HH:mm:ss'), code: 1, 'msg': msg, data: data };
        return this.httpResponseResult(result);
    }

    public ajaxFailResult(msg: string, data: any = null): VpnResult {
        let result = { time: +new Date(), datetime: this.date('yyyy-MM-dd HH:mm:ss'), code: 0, 'msg': msg, data: data };
        return this.httpResponseResult(result);
    }

    private done() {
        const endTime = new Date().getTime();
        const costTime = (endTime - this.startTime) / 1000;
        this.print('运行 response: ' + JSON.stringify(this.result));
        this.log(`🔔${this.appName}, 结束! 🕛 ${costTime} 秒 ${this.logSeparator}`);
        if (this.env == ENV.Node) {
            //@ts-ignore
            process.exit(1);
        } else {
            let cacheLog = this.getStore(VpnBox.APP_LOG_KEY) || '';
            cacheLog = cacheLog.split(this.logSeparator).slice(0, 10000).join(this.logSeparator);
            cacheLog = this.logList.join('') + cacheLog
            this.setStore(VpnBox.APP_LOG_KEY, cacheLog);
            this.print(`注意本次运行日志已缓存到变量 ${this.namespace + '.' + VpnBox.APP_LOG_KEY}`);
            $done(this.result);
        }
    }

    public msg(title: string, subtitle: string, body: string) {
        if (this.isMute) return;
        this.log('==============📣系统通知📣==============' + this.logSeparator + title + this.logSeparator + subtitle + this.logSeparator + body);
        if (this.env == ENV.Surge || this.env == ENV.Shadowrocket || this.env == ENV.Loon) $notification.post(title, subtitle, body)
        else if (this.env == ENV.QuanX) $notify(title, subtitle, body)
    }

    public print(...logList: Array<any>) {
        logList = logList.map((vo) => { return this.date('yyyy-MM-dd HH:mm:ss') + ' ' + vo + this.logSeparator });
        console.log(logList.join(this.logSeparator))
    }

    public log(...logList: Array<any>) {
        logList = logList.map((vo) => { return this.date('yyyy-MM-dd HH:mm:ss') + ' ' + (typeof vo == 'string' ? vo : JSON.stringify(vo)) + this.logSeparator });
        if (logList.length > 0) {
            this.logList = [...this.logList, ...logList]
        }
        console.log(logList.join(this.logSeparator))
    }

    public getStore(key: string, attach = true): string | null {
        if (attach) {
            key = this.namespace + '.' + key;
        }
        if (this.env == ENV.Surge || this.env == ENV.Shadowrocket || this.env == ENV.Loon) {
            return $persistentStore.read(key)
        } else if (this.env == ENV.QuanX) {
            return $prefs.valueForKey(key)
        }
        return null;
    }

    public setStore(key: string, val: string, attach = true): boolean {
        if (attach) {
            key = this.namespace + '.' + key;
        }
        if (this.env == ENV.Surge || this.env == ENV.Shadowrocket || this.env == ENV.Loon) {
            return $persistentStore.write(val, key)
        } else if (this.env == ENV.QuanX) {
            return $prefs.setValueForKey(val, key)
        }
        return false;
    }


    private initEnv() {
        if ('undefined' !== typeof $task) {
            this.env = ENV.QuanX;
        }
        else if ('undefined' !== typeof $loon) {
            this.env = ENV.Loon;
        }
        else if ('undefined' !== typeof $rocket) {
            this.env = ENV.Shadowrocket;
        }
        else if ('undefined' !== typeof $httpClient && 'undefined' === typeof $loon) {
            this.env = ENV.Surge;
        }
        else {
            this.env = ENV.Node;
        }
        this.log('当前APP为: ' + this.env);
    }



    public date(fmt: string, ts: string = '') {
        const date = ts ? new Date(ts) : new Date()
        let o: Record<string, any> = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'H+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds(),
            'q+': Math.floor((date.getMonth() + 3) / 3),
            'S': date.getMilliseconds()
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
        for (let k in o) {
            let item = o[k];
            if (new RegExp('(' + k + ')').test(fmt))
                fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? item : ('00' + item).substr(('' + item).length))
        }
        return fmt
    }

    public getSignCount() {
        let SignCount = this.getStore('sign_count');
        let td = this.date('yyyyMMdd');
        if (SignCount) {
            let [date, num] = SignCount.split('_');
            if (date == td && num) {
                return Number(num);
            } else {
                this.setStore('sign_count', `${td}_0`);
                return 0;
            }
        } else {
            this.setStore('sign_count', `${td}_0`);
            return 0;
        }
    }

    public incSignCount() {
        let num = this.getSignCount();
        num++;
        let td = this.date('yyyyMMdd');
        this.setStore('sign_count', `${td}_${num}`);
    }
}

export default VpnBox;