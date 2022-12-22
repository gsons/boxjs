const path = require('path');
// const isProduction = process.env.NODE_ENV == 'production';
const http=require('http-server');
http.createServer();

const config = {
    entry: {
        "cloud": './src/cloud.ts',
        "10010": './src/10010.ts',
        "pingan": './src/pingan.ts',
        "10000": './src/10000.ts'
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
                        onlineUrl: 'https://raw.githubusercontent.com/gsons/boxjs/main/dist',  
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
