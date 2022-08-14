import Box from "./Box";

class AppLog extends Box {
    constructor(name: string, namespace: string) {
        super(name, namespace)
    }
    async run() {
        let log=this.getStore(Box.APP_LOG_KEY,true);
        console.log(log);
    }
}

const name = '筋斗云日志';
const namespace = 'gsonhub.jindouyun';

const app = new AppLog(name, namespace);
app.run().catch((e) => {
    app.log(e);
}).finally(() => {
    app.done();
});
