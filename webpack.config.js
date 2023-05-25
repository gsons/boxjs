const path = require('path');

const config = {
    entry: {
        "pingan": './src/pingan.ts',
        "telecom": './src/telecom.ts',
        "unicom": './src/unicom.ts',
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
