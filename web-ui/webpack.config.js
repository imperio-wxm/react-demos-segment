const webpack = require('webpack');
var path = require('path');

module.exports = {
  devtool: 'eval-source-map',
  entry: {
    main: path.resolve(__dirname, './app/main.js'),
  },
  output: {
    path: path.resolve(__dirname, './resources/static/js'),
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: "./resources/static/js", //本地服务器所加载的页面所在的目录
    historyApiFallback: true, //不跳转
    inline: true, //实时刷新
    host: 'localhost', //本地前端服务
    port: 8901,
    proxy: {
      '/api/*': {
          target: 'http://localhost:8900', // 本地后端服务
          changeOrigin: true,
          pathRewrite: {'^/api': ''},
          secure: false
      }
    }
  },
  resolve: {
    extensions: ['*', '.js', '.json', '.scss', '.less', 'jsonp'],
  },
  module: {
    rules: [{
        test: /\.less/,
        use: ['style', 'css', 'less']
      },
      {
        test: /\.css$/,
        use: [{
          loader: "style-loader"
        }, {
          loader: "css-loader"
        }]
      },
      {
        test: /\.(png|jpg|jpeg)$/,
        use: ['url']
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ["es2015","stage-2","react"],
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin('版权所有，翻版必究'),
    new webpack.HotModuleReplacementPlugin() //热加载插件
  ]
}