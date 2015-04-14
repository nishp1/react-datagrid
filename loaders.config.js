module.exports = [
    {
        test: /\.jsx$/,
        loaders: [
            // 'react-hot',
            'jsx-loader?insertPragma=React.DOM&harmony']
    },
    {
        test: /\.js$/,
        loaders: [
            // 'react-hot',
            'jsx-loader?harmony']
    },
    {
        test: /\.styl$/,
        loader: 'style-loader!css-loader!stylus-loader'
    },
    {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
    }
]