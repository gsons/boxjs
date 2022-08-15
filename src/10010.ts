import Box from "./Box";

class App extends Box {
    constructor(name: string, namespace: string) {
        super(name, namespace)
    }

    async run() {
        
    }
}

const name = '中国联通';
const namespace = 'gsonhub.10010';

const app = new App(name, namespace);
app.run().catch((e) => {
    app.log(e);
}).finally(() => {
    app.done();
});
