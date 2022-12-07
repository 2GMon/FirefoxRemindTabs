import path from 'path';
import { fileURLToPath } from 'url';
import WebExtPlugin from 'web-ext-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import RemoveEmptyScriptsPlugin from 'webpack-remove-empty-scripts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const src = path.resolve(__dirname, 'src');
const dist = path.resolve(__dirname, 'build');
const nodeModules = path.resolve(__dirname, 'node_modules');
const reactUMD = path.resolve(nodeModules, 'react', 'umd');
const reactDomUMD = path.resolve(nodeModules, 'react-dom', 'umd');

const config = {
    mode: 'production',
    optimization: {
        minimize: false,
    },
    entry: {
        content: path.resolve(src, 'content_script.ts'),
        background: path.resolve(src, 'background_script.ts'),
        options: path.resolve(src, 'options/script.ts'),
        "options.css": path.resolve(src, 'options/style.css'),
        browserAction: path.resolve(src, 'browserAction/script.ts'),
        "browserAction.css": path.resolve(src, 'browserAction/style.css'),
        pageAction: path.resolve(src, 'pageAction/index.tsx'),
    },
    output: {
        path: dist,
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
            },
            {
                test: /\.tsx$/,
                use: 'ts-loader',
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
        ],
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js', ],
    },
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM'
    },
    plugins: [
        new RemoveEmptyScriptsPlugin(),
        new CopyPlugin({
            patterns: [
                { from: path.resolve(src, 'icons'), to: 'icons' },
                { from: path.resolve(reactUMD, 'react.production.min.js'), to: 'react.production.min.js' },
                { from: path.resolve(reactDomUMD, 'react-dom.production.min.js'), to: 'react-dom.production.min.js' },
            ]
        }),
        new MiniCssExtractPlugin({
            filename: '[name]',
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(src, 'browserAction/index.html'),
            filename: 'browserAction.html',
            chunks: ['browserAction', 'browserAction.css']
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(src, 'pageAction/index.html'),
            filename: 'pageAction.html',
            chunks: ['pageAction']
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(src, 'options/index.html'),
            filename: 'options.html',
            chunks: ['options', 'options.css']
        }),
        new WebExtPlugin({ sourceDir: __dirname, firefox: 'firefoxdeveloperedition' }),
    ],
};
export default config;
