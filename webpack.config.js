var webpack = require('webpack')
var autoprefixer = require('autoprefixer')
var HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    entry: {
        main: './src/index.js'
    },
    output: {
        path: './dist',
        publicPath: '',
        filename: 'index.js'
    },
    module: {
        loaders: [
            {
                // edit this for additional asset file types
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader?limit=819200'
            },
            {
                test: /\.js$/,
                // excluding some local linked packages.
                // for normal use cases only node_modules is needed.
                exclude: /node_modules|db|server|libs|dist|vue\/dist|vue-router\/|vue-loader\/|vue-hot-reload-api\//,
                loader: 'babel'
            },
            {   test: /\.css$/,
                loader: 'style-loader!css-loader!postcss-loader'
            },
            {
                test: /\.scss$/,
                loader: "style!css!sass!postcss-loader"
            },
            {
                test: /\.less$/,
                loader: 'style-loader!css-loader!less-loader'
            },
            {
                test: /\.(woff|svg|eot|ttf)\??.*$/,
                loader: 'url-loader?limit=50000&name=[path][name].[ext]'
            }
        ]
    },
    postcss: [autoprefixer({browsers:['last 2 versions','iOS 8']})],
    // example: if you wish to apply custom babel options
    // instead of using vue-loader's default:
    babel: {
        presets: ['es2015', 'stage-0', 'react'],
        plugins: [
        "add-module-exports", 
        'transform-runtime',
            [
                "antd",  
                { 
                    "style": "css" 
                }
            ]
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     }
        // }),
        new HtmlWebpackPlugin({
            title: '德扑神器',
            filename: 'index.html',
            template: './public/index.html',
            hash: true,
        })
    ]
}
// //
// if (process.env.NODE_ENV !== 'production') {
//     module.exports.plugins = [
//         new webpack.DefinePlugin({
//             'process.env': {
//                 NODE_ENV: JSON.stringify('production')
//             }
//         }),
//
//         new webpack.optimize.OccurenceOrderPlugin()
//     ]
// } else {
//     module.exports.devtool = '#source-map'
// }
