const fs = require('fs');

module.exports = function (context) {
    const isProduction = process.env.NODE_ENV == 'production';
    const divi = isProduction ? 60 * 1000 : 1000;
    const version = parseInt((new Date().getTime() - new Date('2022-01-01').getTime()) / divi).toString(36) //从2022年开始算 分钟/秒 时间戳的36进制 生成版本号
    const options = this.getOptions();
    const baseUrl = isProduction ? options.baseurl.online : options.baseurl.local;
    const [, name, ext] = /(\w+)\.tpl\.(\w+)/.exec(this.resourcePath)??[];
    let content = context
        .replace(/\${baseUrl}/g, baseUrl)
        .replace(/\${version}/g, version);
    const fileName = `${name}.${ext}`;
    console.log(`\x1B[32m compile complete url path is ${baseUrl}/${fileName}?v=${version}\n`);
    fs.writeFile(`dist/${fileName}`, content, () => { });
    return '{}';
};

