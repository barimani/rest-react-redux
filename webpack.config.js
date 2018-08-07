var path = require('path');

module.exports = {
    // mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
        library: 'restredux',
        libraryTarget: 'umd',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                        plugins: ['@babel/plugin-proposal-class-properties']
                    },
                }
            }
        ]
    },
    externals: {
        axios: 'axios',
        react: 'react',
        redux: 'redux',
        ['react-redux']: 'react-redux',
        ['redux-thunk']: 'redux-thunk'
    }
};