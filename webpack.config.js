const path = require('path');
const glob = require('glob');
// const isProduction = process.env.NODE_ENV == 'production';

// 获取入口文件列表
function getEntryFiles() {
    const entryFiles = {};
    const files = glob.sync('./src/*.ts',{posix:true,dotRelative:true}); // 使用通配符匹配多个入口文件
    files.forEach((file) => {
        const entryName = file.replace('./src/', '').replace('.ts', '');
        if (entryName != 'global.d' && entryName != 'VpnBox') entryFiles[entryName] = file;
    });
    return entryFiles;
}

const config = {
    entry: getEntryFiles(),
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
