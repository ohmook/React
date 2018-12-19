const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    mode: 'development',
    //mode: 'production',
    entry: {
        index : ['./resource/index.js'] //,
        //lib : ['./resource/lib/cascade.js'],
        //lib2 : ['react'],
    },
    output: {
        path: __dirname + '/public/',
        filename: 'bundle.js'
    },
    devServer: {
        inline: true,
        port: 7777,
        contentBase: __dirname + '/public/'
    },
    module: {
        rules: [
            {
                test    : /\.jsx?$/,
                use     :"babel-loader",
                exclude : ["/node_modules/"]
            }, {
                test: /\.css$/,
                //use: ['style-loader', 'css-loader'],
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                }),
            }, {
                test: /\.(ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader',
                options: {
                    name: '[hash].[ext]',
                    limit: 1
                }
            }
        ]
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            minimize: true,
        }),
        // new webpack.DefinePlugin({
        //     'process.env.NODE_ENV': JSON.stringify('production'), // 아래 EnvironmentPlugin처럼 할 수도 있습니다.
        // }),
        new webpack.optimize.ModuleConcatenationPlugin(),
       // new webpack.EnvironmentPlugin(['NODE_ENV']), // 요즘은 위의 DefinePlugin보다 이렇게 하는 추세입니다.
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
            DEBUG: true
        }),
        new ExtractTextPlugin({
            filename: 'app.css',
        })
    ],
    optimization: {
        minimize: true,
        splitChunks: {},
        concatenateModules: true,
    },
    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.json', '.jsx', '.css']
    },
    devtool: 'source-map'
};