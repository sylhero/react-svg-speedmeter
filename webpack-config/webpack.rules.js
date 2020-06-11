const path = require('path');

module.exports = [
    {
        enforce: 'pre',
        test: /\.tsx?$/,
        include: [path.resolve(__dirname, '../src')],
        exclude: /node_modules/,
        use: [
            {
                loader: 'eslint-loader',
                options: {
                    fix: false
                }
            }
        ]
    },
    {
        test: /\.tsx?$/,
        include: [path.resolve(__dirname, '../src')],
        exclude: /node_modules/,
        use: [
            {
                loader: 'ts-loader'
            }
        ]
    },
    {
        test: /\.jsx?$/,
        include: /node_modules/,
        use: [
            {
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true
                }
            }
        ]
    }
];
