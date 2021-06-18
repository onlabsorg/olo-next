const path = require('path');


module.exports = {
        
    entry: {
        'browser-store': './index.js',
    },
    
    output: {
        filename: '[name].js',
        chunkFilename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    }
}
