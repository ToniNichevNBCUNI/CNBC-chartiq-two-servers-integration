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
    alias: {
      app: path.resolve(projectRootPath, 'src/app/'),
      utilities: path.resolve(projectRootPath, 'src/utilities/'),
    },     
		extensions: ['.js', '.jsx']   
  },
  
	externals: {
		jquery: 'jQuery'
	},   

  entry: [
    './src/index.js',
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
        test: /\.(png|jp(e*)g|svg|gif|cur)$/,  
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
				test: /.*(chartiq|PhoenixChartWrapper).*\.css$/,
				use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: true,
            }
          },
					'css-loader',
					'sass-loader'
				]
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
  // exclude missing plug-ins that we don't have license.
	if (!/^chartiq\//.test(resource)) {
		return false;
	}

	if (
		fs.existsSync('./node_modules/' + resource)
		|| fs.existsSync('./node_modules/' + resource + '.js')
	) {
		return false;
	}
	console.warn('WARNING finding ' + resource);
	return true;
}