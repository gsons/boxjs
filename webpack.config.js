const path = require('path');
// const isProduction = process.env.NODE_ENV == 'production';
const http=require('http-server');
http.createServer();

const config = {
    entry: {
        "somersaultcloud": './src/somersaultcloud.ts',
        "10010": './src/10010.ts',
        "pingan": './src/pingan.ts'
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
            {
                test: /\.tpl\.\w+$/i,
                use: {
                    loader: './webpack.tpl-loader',
                    options: {
                        baseurl: {
                            //线上地址
                            online: 'https://raw.githubusercontent.com/gsons/boxjs/main/dist',
                            //本地地址
                            local: 'http://192.168.88.3:8080',
                        }

                    },
                },
                exclude: ['/node_modules/'],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
    }
};

module.exports = () => {
    config.mode = 'production';
    return config;
};
