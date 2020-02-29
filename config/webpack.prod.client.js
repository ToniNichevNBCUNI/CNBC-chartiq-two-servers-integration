const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const Loadable  = require('react-loadable/webpack');
const getEnvironmentConstants = require('../getEnvironmentConstants');
const fs = require('fs');

const publicPath = `http://${process.env.APP_HOST}:${process.env.ASSETS_SERVER_PORT}/dist/`;
// const publicPath = `http://${process.env.APP_HOST}:${process.env.ASSETS_SERVER_PORT}`;

console.log(`Assets will be served from: ${process.env.APP_HOST} ${process.env.ASSETS_SERVER_PORT}`);

module.exports = {
  mode: 'production',

  devtool: '',

	resolve: {
		extensions: ['.js', '.jsx']
  },
  
  externals: {
		jquery: 'jQuery'
	},     

  entry: [
    './src/index.js',
  ], 

  output: {
    filename: '[name]-bundle.js',
    publicPath
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
        //test: /\.(png|jp(e*)g|svg)$/,  
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
							publicPath: `http://localhost:${process.env.ASSETS_SERVER_PORT}/dist/css/img`
						}
					}
				]
			},      

    ]
  },

  plugins: [
    new webpack.DefinePlugin({ 'process.env' : getEnvironmentConstants() } ), 

    new Loadable.ReactLoadablePlugin({
        filename: './dist/loadable-manifest.json',
    }),  

    new MiniCssExtractPlugin({
        // these are optional
        //filename: "[name].css",
        //chunkFilename: "[id].css"
    }),

    new OptimizeCSSAssetsPlugin({}),

    new webpack.IgnorePlugin({
			checkResource 
		}),        
  ]
};


function checkResource(resource, context) {
	if (!/^chartiq\//.test(resource)) {
		return false;
	}

	if (
		fs.existsSync('./node_modules/' + resource)
		|| fs.existsSync('./node_modules/' + resource + '.js')
	) {
		return false;
	}
	console.warn('ERROR finding ' + resource);
	return true;
}