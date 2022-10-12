const fs = require('fs');
const os = require('os');

// 获取当前电脑IP
function getIPAdress() {
    var interfaces = os.networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
  }

  
module.exports = function (context) {
    const isProduction = process.env.NODE_ENV == 'production';
    const divi = isProduction ? 60 * 1000 : 1000;
    const version = parseInt((new Date().getTime() - new Date('2022-01-01').getTime()) / divi).toString(36) //从2022年开始算 分钟/秒 时间戳的36进制 生成版本号
    const options = this.getOptions();
    const baseUrl = isProduction ? options.onlineUrl : getIPAdress() ;
    const env = isProduction?'prod':'dev';
    let arr=/(\w+)\.tpl\.(\w+)/.exec(this.resourcePath);
    const [, name, ext] = arr?arr:[];
    let content = context
        .replace(/\${baseUrl}/g, baseUrl)
        .replace(/\${version}/g, version)
        .replace(/\${env}/g, env);
    const fileName = `${name}.${ext}`;
    console.log(`\x1B[32m compile complete url path is ${baseUrl}/${fileName}?v=${version}\n`);
    fs.writeFile(`dist/${fileName}`, content, () => { });
    return '{}';
};

