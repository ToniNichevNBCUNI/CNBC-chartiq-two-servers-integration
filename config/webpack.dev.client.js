const getEnvironmentConstants = require('../getEnvironmentConstants');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');
const Loadable  = require('react-loadable/webpack');
const path = require('path');
const fs = require('fs');


const publicPath = `http://${process.env.APP_HOST}:${process.env.ASSETS_SERVER_PORT}/dist/`;

const projectRootPath = path.resolve(__dirname, '../');

module.exports = {
  mode: 'development',
  
  devtool: 'source-map',

	resolve: {
		extensions: ['.js', '.jsx'],
    alias: {
      app: path.resolve(__dirname, 'src/app/'),
    },    
  },
  
	externals: {
		jquery: 'jQuery'
	},   

  entry: [
    './src/index.js'
  ],    

  output: {
    // path: `${projectRootPath}/src`,    
    filename: '[name]-bundle.js',
    publicPath
  },  

  devServer: {
    staticOptions: {
      redirect: true,
    },
    headers: { 'Access-Control-Allow-Origin': '*' },
    disableHostCheck: true,
    contentBase: __dirname + '/src',
    hot: true,
    port: process.env.ASSETS_SERVER_PORT,
    noInfo: true,
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
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[folder]-[local]--[hash:base64:5]',
              },
              importLoaders: 2,              
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('autoprefixer')()],
              sourceMap: true              
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },             
          }
        ],
      },

      // images
      {
        test: /.*\.(png|jp(e*)g|svg|gif)$/,  
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
    ]
  },
  plugins: [
    new webpack.DefinePlugin({ 'process.env' : getEnvironmentConstants() } ),  

    new MiniCssExtractPlugin({
      chunkFilename: '[id].css',
      filename: '[name].css',
    }),    

    new Loadable.ReactLoadablePlugin({
        filename: './dist/loadable-manifest.json',
      }),

    // hot reload
    new webpack.HotModuleReplacementPlugin(),

    new webpack.IgnorePlugin({
			checkResource 
		}),    
  ]
};

function checkResource(resource, context) {
  // matching PhoenixChartWrapperContainer component and exclude it from the bundle
	if (/^\.\/PhoenixChartWrapperContainer$/.test(resource)) { 
		return true;
  }
	return false;
}