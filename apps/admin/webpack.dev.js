const { merge } = require('webpack-merge')
const common = require('./webpack.base.js')

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        port: process.env.PORT,
        historyApiFallback: true,
    },
    resolve: {
        fallback: {
            fs: false,
            tls: false,
            net: false,
            path: false,
            zlib: false,
            http: false,
            https: false,
            stream: false,
            crypto: false,
            assert: false,
        },
    },
})
