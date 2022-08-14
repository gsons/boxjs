import Box from "./Box";

class App{
    public box:Box;
    constructor(){
        this.box=new Box('中国联通','gsonhub.10010');
    }
    async run(){
        
    } 
}

const app=new App();

app.run().catch((e)=>{

}).finally(()=>{
    app.box.done();
});
//console.log(Box);