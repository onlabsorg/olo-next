const path = require('path');

module.exports = {
        
    entry: "./browser.js",
    
    output: {
        filename: 'olo.js',
        chunkFilename: '[name].bundle.js',
        path: path.resolve(__dirname, './public/bin')
    },  
    
    // resolve: {
    //     fallback: {
    //         "fs": false,
    //         "path": false,
    //         "http": false,
    //         "https": false,
    //     } 
    // }
}
