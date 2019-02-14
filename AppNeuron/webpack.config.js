"use strict";

var BrowserSyncPlugin = require("browser-sync-webpack-plugin");

module.exports = {
    context: __dirname,
    entry: {
        app: './Scripts/ReactComponents/app.jsx'
        //search: './src/search.js'
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/Scripts/bundles'
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/react', '@babel/env']
                    }
                }
            },
            {
                test: /\.jsx$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/react', '@babel/env']
                    }
                }
            }
        ]
    },
    plugins: [
        new BrowserSyncPlugin()
    ]
};