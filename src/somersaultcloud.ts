import Box from "./Box";

class App extends Box {

    constructor(name: string, namespace: string) {
        super(name, namespace)
    }

    fetchJindouyun(html: string) {
        let [, remain_flow, unit] = /<h4>剩余流量<\/h4>\n\s+<\/div>\n\s+<div class="card-body">\n\s+<span class="counter">(.*)?<\/span> (MB|GB|KB)/.exec(html);
        let [, online, sum] = /<h4>同时在线设备数<\/h4>\n\s+<\/div>\n\s+<div class="card-body">\n\s+<span class="counter">(\d+)<\/span> \/ <span class="counterup">(\d+)<\/span>/.exec(html);
        let [, used_flow] = /今日已用: (.*?)<\/li>/.exec(html);
        let [, last_used_date] = /上次使用时间: (.*?)<\/li>/.exec(html);
        let [, momey] = /<h4>钱包余额<\/h4>\n\s+<\/div>\n\s+<div class="card-body">\n\s+¥\s+<span class="counter">(.*)?<\/span>/.exec(html);
        let [, commission] = /累计获得返利金额: ¥(.*?)<\/li>/.exec(html);

        let res = {
            remain_flow: remain_flow + unit,
            online: online,
            sum: sum,
            used_flow: used_flow,
            last_used_date: last_used_date,
            momey: momey,
            commission: commission
        };
        this.log('↓ fetchJindouyun');
        this.log(JSON.stringify(res));
        return res;
    }

    async run() {
        this.log('ABCD');
    }
}

const name='筋斗云';
const namespace='gsonhub.jindouyun';

const app = new App(name, namespace);
app.run().catch((e) => {
    app.log(e);
}).finally(() => {
    app.done();
});
