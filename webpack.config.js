var path = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var extractPlugin = new ExtractTextPlugin({
    filename: "assets/css/main.css"
});

var DIST_DIR = path.resolve(__dirname, "dist");
var SRC_DIR = path.resolve(__dirname, "client");

var config = {
    entry: SRC_DIR + "/app/index.js",
    output: {
        path: DIST_DIR,
        filename: "app/bundle.js",
        publicPath: "/dist"
    },
    module: {
        rules: [
            {
                test: /\.js?/,
                include: SRC_DIR,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: ["react", "es2015", "stage-2"]
                        }
                    }
                ]
            },
            { test: /\.css$/, loader: 'style-loader!css-loader'},
            {
                test: /\.scss$/,
                include: SRC_DIR,
                exclude: '/node_modules/' ,
                use: extractPlugin.extract({
                    use: ["css-loader", "sass-loader"]
                })
            },
            { 
                test: /\.(png|woff|woff2|eot|ttf|svg)$/, 
                loader: 'file-loader',
                options: {
                    outputPath: 'assets/fonts/'
                }
            }
        ]
    },
    devtool: 'source-map',
    plugins: [
        extractPlugin
    ]
};

module.exports = config;;