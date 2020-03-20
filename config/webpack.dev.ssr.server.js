const path = require('path');
const nodeExternals = require('webpack-node-externals');
const webpack =require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const NodemonPlugin = require('nodemon-webpack-plugin');
const getEnvironmentConstants = require('../getEnvironmentConstants');

console.log(`Server is starting at: ${process.env.APP_HOST} ${process.env.SERVER_PORT}`);

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  target: "node",
  /*
  node: {
    __dirname: false, // use the standard Node behavior of __dirname
  },
  */

  //externals: [nodeExternals(), {jquery: 'jQuery'}],
  externals: [nodeExternals()],
 
	resolve: {
		extensions: ['.js', '.jsx']
	},  
   
  entry: {
    server: './ssr-server.js'
  },

  output: {
    filename: '[name]-bundle.js',
    path: path.resolve(__dirname, '../', 'server-build'),

  },  
  
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },

      // SCSS
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[folder]-[local]--[hash:base64:5]',
              },
            }
          },
          {
            loader: 'sass-loader',
          }
        ],
      },
      // images
      {
        //test: /\.(png|jp(e*)g|svg|gif)$/,  
        //test: /^((?!(PhoenixChartWrapper\/chartiq)).)*\.(png|jp(e*)g|svg)$/, 
        test: /^((?!(PhoenixChartWrapper\/chartiq)).)*\.(png|jp(e*)g|svg|gif)$/, 
        use: [{
            loader: 'url-loader',
            options: { 
                limit: 8000, // Convert images < 8kb to base64 strings
                name: 'images/[hash]-[name].[ext]'
            } 
        }]
      },

      //File loader used to load fonts
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader']
      },

      // *************************************
      // ChartIQ
      // *************************************
          
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css"
    }), 

    // on the server we still need one bundle
    new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1
    }),    

    new webpack.DefinePlugin({ 'process.env' : getEnvironmentConstants() } ),  

    new NodemonPlugin({
      watch: path.resolve('./dist'),
      ext: 'js,json,jsx',
      script: `./server-build/server-bundle.js`,
      verbose: true,
      // Node arguments.
      // nodeArgs: [ '--inspect-brk' ]
    }),
    

    /*
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/PhoenixChartWrapper$/,
      contextRegExp: /.*$/
      })      
      */

      new webpack.IgnorePlugin({
        checkResource 
      }),       
  ]
};

function checkResource(resource, context) {
  
  // matching PhoenixChartWrapper component, loaded through loadable from PhoenixChartWrapper/index.js
	if (/^\.\/PhoenixChartWrapperContainer$/.test(resource)) { 
		return true;
  }
	return false;
}