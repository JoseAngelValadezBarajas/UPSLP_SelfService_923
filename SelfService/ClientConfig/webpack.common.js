//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const autoprefixer = require('autoprefixer');
const clientBundleOutputScriptsDir = '../../wwwroot/js';
const clientBundleOutputContentDir = '../../wwwroot/css/';
const cssnano = require('cssnano')({ 'safe': true });
const webpack = require('webpack');

module.exports = (env, argv) => {
    return {
        devtool: argv.mode !== 'production' ? 'cheap-module-source-map' : 'source-map',

        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.scss', '.css'],
            fallback: {
                'fs': false,
                'timers': require.resolve('timers-browserify')
            }
        },

        module: {
            rules: [
                {
                    exclude: [/\.(js|jsx)$/, /\.css$/, /\.scss$/, /\.json$/, /\.bmp$/, /\.gif$/, /\.svg$/, /\.png$/, /\.(ts|tsx)$/],
                    loader: require.resolve('file-loader'),
                    options: {
                        name: clientBundleOutputContentDir + 'static/[name].[hash:8].[ext]'
                    }
                },
                {
                    test: /\.(tsx?)|(js)$/i,
                    loader: 'babel-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.css$/i,
                    use: [
                        MiniCssExtractPlugin.loader,
                        { loader: 'css-loader', options: { importLoaders: 1, sourceMap: true } },
                        { loader: 'postcss-loader', options: { postcssOptions: { plugins: [autoprefixer, cssnano] } } }
                    ]
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        MiniCssExtractPlugin.loader,
                        { loader: 'css-loader', options: { importLoaders: 1, sourceMap: true } },
                        'sass-loader'
                    ]
                }
            ]
        },

        optimization: {
            splitChunks: {
                cacheGroups: {
                    defaultVendor: {
                        test: /[\\/]node_modules[\\/]/,
                        chunks: 'all',
                    }
                }
            }
        },

        output: {
            path: __dirname + clientBundleOutputScriptsDir,
            filename: '[name].js'
        },

        performance: {
            hints: false
        },

        plugins: [
            new MiniCssExtractPlugin({
                filename: `${clientBundleOutputContentDir}[name].css`
            }),
            new webpack.ProvidePlugin({
                process: 'process/browser'
            })
            //,new BundleAnalyzerPlugin()
            //,new FilterWarningsPlugin({ // For now this plugin is not compatible with webpack 5
            //    exclude: /mini-css-extract-plugin[^]*Conflicting order between:/
            //})
        ]
    };
};