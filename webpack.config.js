const path = require('path');


const isProduction = process.env.NODE_ENV == 'production';

const config = {
    entry: {
        "somersaultcloud": './src/somersaultcloud.ts',
        "10010": './src/10010.ts'
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
                            production: 'https://raw.githubusercontent.com/gsons/boxjs/main/dist',
                            development: 'http://192.168.101.149:8080',
                        }

                    },
                },
                exclude: ['/node_modules/'],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
    },

    devServer: {
        hot: false,
        static: path.join(__dirname, 'dist')
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
