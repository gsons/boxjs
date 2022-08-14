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
    Surge, Loon, QuanX, Shadowrocket, Node
};


class Box {

    //VPN环境名称
    public env: ENV;

    //应用名称
    protected name: string;

    //缓存命名空间
    private namespace: string;

    private isNeedRewrite: false;

    private logMsg: string[];

    private logSeparator: string;

    private startTime: number;

    public static APP_LOG_KEY = 'boxjs-log';

    private isMute: boolean;

    public response={};

    constructor(name: string, namespace: string) {
        this.name = name;
        this.namespace = namespace;
        this.logMsg = [];
        this.logSeparator = '';
        this.startTime = new Date().getTime();
        this.log(`🔔${this.name}, 开始!`);
        this.initEnv();
    }

    public done(val = {}) {
        const endTime = new Date().getTime();
        const costTime = (endTime - this.startTime) / 1000;

        this.log(`🔔${this.name}, 结束! 🕛 ${costTime} 秒`);
        let cacheLog = this.getStore(Box.APP_LOG_KEY, true);
        cacheLog = cacheLog ? cacheLog : '' + this.logMsg.join('\n');
        this.setStore(Box.APP_LOG_KEY, cacheLog, true);
        console.log(`本次运行日志已缓存到变量 ${this.namespace + '.' + Box.APP_LOG_KEY}`);
        console.log('response: '+JSON.stringify(this.response));
        if (this.env == ENV.Node) {
            process.exit(1);
        } else {
            $done(val);
        }

    }

    getStore(key: string, attach = false): string {
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

    msg(title: string, subtitle: string, body: string) {
        if (this.env == ENV.Surge || this.env == ENV.Shadowrocket || this.env == ENV.Loon) $notification.post(title, subtitle, body)
        else if (this.env == ENV.QuanX) $notify(title, subtitle, body)
    }

    log(...logMsg: string[]) {
        logMsg = logMsg.map((vo) => { return this.date('yyyy-MM-dd HH:mm:ss') + ' ' + vo + '\n' });
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

    httpResponse(res: any) {
        this.response = {
            response: {
                status: 200,
                body: JSON.stringify(res),
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST,GET',
                    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
                },
            },
        }
    }

    private  send(opts: any):Promise<any>{
        console.log(JSON.stringify(opts));
        console.log('SEND1');
        return new Promise((resolve, reject) => {
            this.doRequest(opts, (err: any, resp: any, body: any) => {
                try {
                    body = JSON.parse(body)
                } catch (error) {
                    body = null;
                    this.log('JSON解析错误' + error);
                }
                console.log('SEND2');
                if (err) reject(err)
                else resolve(body)
            });
        })
    }

    post(opt: any) {
        opt['method'] = 'post';
        return  this.send(opt);
    }

    get(opt: any) {
        opt['method'] = 'get';
        return  this.send(opt);
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
            console.error('Node环境 不支持');
            callback('Node环境 不支持', null, null)
        }
    }


    setStore(key: string, val: string, attach = false): boolean {
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
        } else if ('undefined' !== typeof $httpClient && 'undefined' === typeof $loon) {
            this.env = ENV.Surge;
        }
        else if ('undefined' !== typeof $loon) {
            this.env = ENV.Loon;
        }
        else if ('undefined' !== typeof $rocket) {
            this.env = ENV.Shadowrocket;
        } else {
            this.env = ENV.Node;
        }
    }


}
export default Box;