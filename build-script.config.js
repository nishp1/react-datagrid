'use strict';

module.exports = {
    entry: './index.jsx',
    output: {
        filename: 'index.js'
    },
    module: {
        loaders: require('./loaders.config')
    },
    externals: {
        'react': 'React',
        'moment': 'moment'
    },
    resolve: {
        // Allow to omit extensions when requiring these files
        extensions: ['', '.js', '.jsx']
    }
}