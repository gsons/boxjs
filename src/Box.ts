import BaseErr from "./lib/BaseErr";
import {Err} from "./lib/BaseErr";

declare var $task: any;
declare var $persistentStore: any;
declare var $prefs: any;
declare var $httpClient: any;
declare var $loon: any;
declare var $rocket: any;
declare var $notification: any;
declare var $notify: any;
declare var $done: any;


enum ENV {
    Surge='Surge', Loon='Loon', QuanX='QuanX', Shadowrocket='Shadowrocket', Node='Node'
};


abstract class Box {

    //环境名称
    public env: ENV;

    //应用名称
    protected name: string;

    //缓存命名空间
    private namespace: string;

    private isNeedRewrite: false;

    private logMsg: string[];

    private logSeparator: string;

    private startTime: number;

    public isMute = false;

    public static APP_LOG_KEY = 'boxjs-log';

    public response = {};


    constructor(name: string, namespace: string) {
        this.name = name;
        this.namespace = namespace;
        this.logMsg = [];
        this.logSeparator = '';
        this.startTime = new Date().getTime();
        this.log(`🔔${this.name}, 开始!\n`);
        this.initEnv();
        this.log('当前环境为：' + this.env);
        let mute = this.getStore('mute', true);
        this.isMute = mute == 'true';
        require('./tpl/boxjs.tpl.json');
        require('./tpl/gsonhub.tpl.sgmodule');
    }

    //入口方法
    abstract doAction(): Promise<void>;

    public run() {
        this.doAction().catch((err) => {
            if(err instanceof BaseErr){
                this.log(''+err.code);
                if(err.code==Err.BASE){
                    this.msg(this.name, err.message,'');
                }
                else if(err.code==Err.HTTP){
                    if(Math.random()>0.8){
                        this.msg(this.name, '网络异常：'+err.message,'');
                    }
                    else{
                        this.log(this.name, '网络异常Log：'+err.message,'');
                    }
                }else{
                    this.log(err.message,'');
                }
            }else{
                this.log(err);
            }
            this.ajaxFail(err.message||err);
        }).finally(() => {
            this.done();
        });
    }

    //todo 类型
    transParams(data: any) {
        return Object.keys(data)
            .map(k => `${k}=${encodeURIComponent(data[k])}`)
            .join('&')
    }

    random(length: number) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    public done() {
        const endTime = new Date().getTime();
        const costTime = (endTime - this.startTime) / 1000;
        console.log('response: ' + JSON.stringify((this.response)));
        this.log(`🔔${this.name}, 结束! 🕛 ${costTime} 秒`);
        if (this.env == ENV.Node) {
            process.exit(1);
        } else {
            let cacheLog = '\n' + this.getStore(Box.APP_LOG_KEY, true);
            cacheLog=cacheLog.split('\n').slice(0,10000).join('\n');
            cacheLog = this.logMsg.reverse().join('\n') + (cacheLog ? cacheLog : '');
            this.setStore(Box.APP_LOG_KEY, cacheLog, true);
            console.log(`注意本次运行日志已缓存到变量 ${this.namespace + '.' + Box.APP_LOG_KEY}`);
            $done(this.response);
        }
    }

    getStore(key: string, attach = true): string {
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


    handelLogHttp() {
        this.log(`运行 》 ${this.name}系统运行日志http服务器`);
        let cacheLog = this.getStore(Box.APP_LOG_KEY, true);
        cacheLog=cacheLog?cacheLog:'';
        cacheLog = cacheLog.replace(/\n/g, '<br>');
        this.httpResponse(cacheLog, { 'Content-Type': 'text/html;charset=utf-8' });
    }

    msg(title: string, subtitle: string, body: string) {
        this.log('==============📣系统通知📣==============' + '\n' + title + '\n' + subtitle + '\n' + body);
        if (this.isMute) return;
        if (this.env == ENV.Surge || this.env == ENV.Shadowrocket || this.env == ENV.Loon) $notification.post(title, subtitle, body)
        else if (this.env == ENV.QuanX) $notify(title, subtitle, body)
    }

    log(...logMsg: string[]) {
        logMsg = logMsg.map((vo) => { return this.date('yyyy-MM-dd HH:mm:ss') + ' ' + vo });
        if (logMsg.length > 0) {
            this.logMsg = [...this.logMsg, ...logMsg]
        }
        console.log(logMsg.join(this.logSeparator))
    }

    /**
     * 示例:$.time('yyyy-MM-dd qq HH:mm:ss.S') $.time('yyyyMMddHHmmssS')
     * y:年 M:月 d:日 q:季 H:时 m:分 s:秒 S:毫秒 
     * 其中y可选0-4位占位符、S可选0-1位占位符，其余可选0-2位占位符
     * @param fmt 格式化参数
     * @param ts 根据指定时间戳返回格式化日期
     * @returns 
     */
    date(fmt: string, ts: Date = null) {
        const date = ts ? new Date(ts) : new Date()
        let o = {
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
            //@ts-ignore
            let item = o[k];
            if (new RegExp('(' + k + ')').test(fmt))
                fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? item : ('00' + item).substr(('' + item).length))
        }
        return fmt
    }

    httpResponse(res: any, headers: any = {}) {
        const HEADER = {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST,GET',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        };
        let header = Object.assign(HEADER, headers);
        this.response = {
            response: {
                status: 200,
                body: typeof res == 'string' ? res : JSON.stringify(res),
                headers: header
            },
        }
    }

    ajaxSuccess(msg: string, data: any = null) {
        let result = { time: new Date().getTime(), datetime: this.date('yyyy-MM-dd HH:mm:ss'), code: 1, 'msg': msg, data: data };
        this.httpResponse(result);
    }

    ajaxFail(msg: string, data: any = null) {
        let result = { time: new Date().getTime(), datetime: this.date('yyyy-MM-dd HH:mm:ss'), code: 0, 'msg': msg, data: data };
        this.httpResponse(result);
    }

    /**
     * @param opt 
     * @returns {status,body,headers}
     */
    private send(opts: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.doRequest(opts, (err: any, resp: any, body: any) => {
                if (err) reject(new BaseErr(err,Err.HTTP))
                else resolve(resp)
            });
        })
    }

    /**
     * 
     * @param opt 
     * @returns {status,body,headers}
     */
    async post(opt: any) {
        opt['method'] = 'post';
        return await this.send(opt);
    }

    async get(opt: any) {
        opt['method'] = 'get';
        return await this.send(opt);
    }

    //todo 类型问题
    private doRequest(opts: any, callback = (err: any, resp: any, body: any) => { }) {
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
            console.log(this.env);
            //@ts-ignore
        }
    }




    setStore(key: string, val: string, attach = true): boolean {
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

    getLoginNum(){
        let loginNum=this.getStore('login_num');
        let td=this.date('yyyyMMdd');
        if(loginNum){
            let [date,num]=loginNum.split('_');
            if(date==td&&num){
                return Number(num);
            }else{
                this.setStore('login_num',`${td}_0`);
                return 0;
            }
        }else{
            this.setStore('login_num',`${td}_0`);
            return 0;
        }
    }

    incLoginNum(){
        let num=this.getLoginNum();
        num++;
        let td=this.date('yyyyMMdd');
        this.setStore('login_num',`${td}_${num}`);
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
    }


}
export default Box;