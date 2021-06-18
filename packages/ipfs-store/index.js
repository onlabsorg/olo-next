const pathlib = require('path');
const olojs = require('@onlabsorg/olojs');



class IPFSStore extends olojs.Store {
    
    constructor (ipfs, cid='') {
        super();
        this.ipfs = ipfs;
        this.cid = normalizeCID(cid);
    }
    
    async read (path) {
        const cid = normalizeCID( pathlib.join(this.cid, `${path}.olo`) );
        
        try {
            var content = "";
            for await (const chunk of this.ipfs.cat(cid)) {
                content += new TextDecoder().decode(chunk);
            }
            return content;
        } catch (error) {
            return "";
        }
    }
    
    async list (path) {
        const cid = normalizeCID( pathlib.join(this.cid, path, '/') );
        
        if (cid === '') {
            throw new this.constructor.ReadOperationNotAllowedError('/');
        }

        try {
            const children = [];
            for await (let file of this.ipfs.ls(cid)) {
                if (file.type === 'dir') {
                    children.push( file.path.slice(cid.length) + '/' );
                } else if (file.type === 'file' && file.path.slice(-4) === '.olo') {
                    children.push( file.path.slice(cid.length, -4) );                
                }
            }
            return children;                    
        } catch (error) {
            return [];
        }
    }    
    
    // Fetches all the content of the given path and returns it in a 
    // mutable MemoryStore.
    async clone (path='/') {
        path = pathlib.join(path, '/');
        const storeClone = new olojs.MemoryStore();
        
        for await (let docPath of listDeep(this, path)) {
            await storeClone.write(docPath.slice(path.length), await this.read(docPath));
        }    
            
        return storeClone;                
    }
    
    static async create (ipfs, store) {
        const files = [];
        for await (let path of listDeep(store, '/')) {
            files.push({
                path: `${path}.olo`,
                content: await store.read(path)
            })
        }
        
        const items = ipfs.addAll(files, {wrapWithDirectory:true});
        for await (let item of items) {
            if (item.path === '') {
                return new this(ipfs, String(item.cid));
            }
        }        
    }
}


function normalizeCID (cid) {
    while (cid[0] === '/') cid = cid.slice(1);
    return cid === "" ? "" : pathlib.normalize(cid);
}

async function* listDeep (store, path) {
    const list = await store.list(path);
    for (let childName of list) {
        let subPath = pathlib.join(path, childName);
        if (subPath.slice(-1) === '/' && childName !== "") {
            for await (let docPath of listDeep(store, subPath)) {
                yield docPath;
            }
        } else {
            yield subPath;
        }
    }
}



module.exports = {
    IPFSStore,
}
