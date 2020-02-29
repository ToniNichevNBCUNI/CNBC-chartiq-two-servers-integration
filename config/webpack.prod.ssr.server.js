const path = require('path');
const nodeExternals = require('webpack-node-externals');
const webpack =require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const getEnvironmentConstants = require('../getEnvironmentConstants');

console.log(`Server is starting at: ${process.env.APP_HOST} ${process.env.SERVER_PORT}`);

module.exports = {
  mode: 'production',

  devtool: '',

  target: "node",

  externals: [nodeExternals()],

	resolve: {
		extensions: ['.js', '.jsx']
	},      

  entry: {
    server: './ssr-server.js'
  },

  output: {
    filename: '[name]-bundle.js',
    path: path.resolve(__dirname, '../', 'server-build') 
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
              importLoaders: 2,              
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('autoprefixer')()],
            },
          },
          {
            loader: 'sass-loader',
          }
        ],
      },

      // images
      {
        // test: /\.(png|jp(e*)g|svg)$/,  
        test: /^((?!(chartiq)).)*\.(png|jp(e*)g|svg)$/,  
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

			/* CHARTIQ CSS bundling rule, using SASS */
			{
				test: /.*(chartiq).*\.css$/,
				use: [
          'style-loader',
					'css-loader',
					'sass-loader'
				]
			},      

			/* image bundling rule, images are referenced via css */
			{
				test: /.*(chartiq).*\.(jpg|gif|png|svg|cur)$/,
        //test: /\.(jpg|gif|png|svg|cur)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: './css/img/',
							publicPath: 'css/img/'
						}
					}
				]
			},        

    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css"
    }), 
    new OptimizeCSSAssetsPlugin({}),  
    // on the server we still need one bundle
    new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1
    }),    
    new webpack.DefinePlugin({ 'process.env' : getEnvironmentConstants() } ),  
  ]
};