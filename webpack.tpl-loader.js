const fs = require('fs');
const os = require('os');

// 获取当前电脑IP
function getIPAdress() {
    var interfaces = os.networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' &&  /^(192|10)\./.test(alias.address) && !alias.internal) {
                return alias.address;
            }
        }
    }
}


module.exports = function (context) {
    const isProduction = process.env.NODE_ENV == 'production';
    const divi = isProduction ? 60 * 1000 : 1000;
    const version = parseInt((+new Date() - +new Date('2022-01-01')) / divi).toString(36) //从2022年开始算 分钟/秒 时间戳的36进制 生成版本号
    const options = this.getOptions();
    const lcoalurl = 'http://' + getIPAdress() + ':8080';
    const baseUrl = isProduction ? options.onlineUrl : lcoalurl;
    const env = isProduction ? 'prod' : 'dev';
    let arr = /(\w+)\.tpl\.(\w+)/.exec(this.resourcePath);
    const [, name, ext] = arr ? arr : [];
    let content = context
        .replace(/\${baseUrl}/g, baseUrl)
        .replace(/\${version}/g, version)
        .replace(/\${env}/g, env);
    const fileName = `${name}.${ext}`;
    console.log(`\x1B[32m compile complete url path is ${baseUrl}/${fileName}?v=${version}`);
    fs.writeFile(`dist/${fileName}`, content, () => { });
    return '{}';
};

