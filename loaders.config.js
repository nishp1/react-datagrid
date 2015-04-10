module.exports = [
    {
        test: /\.jsx$/,
        loader: 'babel-loader',
        exclude: /node_modules/
    },
    {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
    },
    {
        test: /\.json$/,
        loader: 'json-loader'
    },
    {
        test: /\.styl$/,
        loader: 'style-loader!css-loader!stylus-loader'
    },
    {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
    },
    { test: /\.svg$/, loader: 'raw-loader' },
    {
        test: /\.png$/,
        loader: 'url-loader?mimetype=image/png'
    }
]