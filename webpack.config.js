const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
    mode: 'development',
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            // 強制使用 CJS 版本，避免 Webpack 4 無法解析 .mjs 中的 optional chaining
            'vue-router': path.resolve(__dirname, 'node_modules/vue-router/dist/vue-router.cjs')
        },
        extensions: ['.js', '.vue', '.json']
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                // vue-router 4.x 的 .mjs / .cjs 均含有 optional chaining 等現代語法
                // 需要 babel 轉換才能讓 Webpack 4 正確解析
                test: /\.[mc]js$/,
                include: path.resolve(__dirname, 'node_modules/vue-router'),
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: [
                            '@babel/plugin-transform-optional-chaining',
                            '@babel/plugin-transform-nullish-coalescing-operator'
                        ]
                    }
                },
                type: 'javascript/auto'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: './public/index.html'
        })
    ],
    devServer: {
        port: 8080,
        historyApiFallback: true,
        hot: true,
        open: false
    }
}
