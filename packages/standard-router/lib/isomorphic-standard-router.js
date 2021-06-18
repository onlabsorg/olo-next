


const Router = require('@onlabsorg/olojs/lib/router');
const MemoryStore = require('@onlabsorg/olojs/lib/memory-store');
const HTTPStore = require('@onlabsorg/olojs/lib/http-store');


 
class StandardStore extends Router {
    
    constructor (olojs, homeStore, ipfsProtocol) {
        super({
            '/home'  : homeStore,
            '/temp'  : new olojs.MemoryStore(),
            '/http'  : new olojs.HTTPStore('http:/'),
            '/https' : new olojs.HTTPStore('https:/'),
            // 'ipfs': ipfsProtocol,
        });
    }
}


module.exports = StandardStore;