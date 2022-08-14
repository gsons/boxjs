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
    Surge, Loon, QuanX, Shadowrocket,Node
};


class Box {

    //VPN环境名称
    public env: ENV;

    //应用名称
    private name: string;

    //缓存命名空间
    private namespace: string;

    private isNeedRewrite: false;

    private logMsg:string[];

    private logSeparator:string;

    private startTime:number;

    constructor(name: string, namespace: string) {
        this.name = name;
        this.namespace = namespace;
        this.logMsg=[];
        this.logSeparator='';
        this.startTime=new Date().getTime();
        this.log('', `🔔${this.name}, 开始!`);
        this.initEnv();
    }

    public done(val = {}) {
        const endTime = new Date().getTime()
        const costTime = (endTime - this.startTime) / 1000
        this.log('', `🔔${this.name}, 结束! 🕛 ${costTime} 秒`)
        $done(val);
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

    log(...logMsg:string[]) {
        if (logMsg.length > 0) {
            this.logMsg = [...this.logMsg, ...logMsg]
        }
        console.log(logMsg.join(this.logSeparator))
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