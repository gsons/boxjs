// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');

const isProduction = process.env.NODE_ENV == 'production';


const v=parseInt(new Date().getTime()/1000).toString(36);
const fs = require('fs')
fs.readFile('src/gsonhub.sgmodule.tpl', (err, buffer) => {
    let content = buffer.toString().replace(/v=VERSION/g, '_=' + v);
    fs.writeFile('dist/gsonhub.sgmodule', content, () => { });
    console.log('************************************')
    console.log('* 本次发布版本号为：'+v+'')
    console.log('************************************')
});


const config = {
    entry: {
        "somersaultcloud": './src/somersaultcloud.ts',
        "10010": './src/10010.ts',
        "test": './src/test.ts'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [

    ],
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                loader: 'ts-loader',
                exclude: ['/node_modules/'],
            },
            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';


    } else {
        config.mode = 'development';
    }
    return config;
};
