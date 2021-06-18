const pathlib = require('path');
const fs = require('fs');
const Store = require('@onlabsorg/olojs').Store;


class FSStore extends Store {

    constructor (rootPath) {
        super();
        this.rootPath = pathlib.normalize(`/${rootPath}`);
    }

    resolvePath (path) {
        return pathlib.join(this.rootPath, pathlib.normalize(`/${path}`));
    }

    async read (path) {
        const fullPath = this.resolvePath(path);

        if (!fs.existsSync(fullPath)) return "";

        return new Promise((resolve, reject) => {
            fs.readFile(fullPath, {encoding:'utf8'}, (err, content) => {
                if (err) reject(err);
                else resolve(content);
            });
        });
    }

    async list (path) {
        const fullPath = this.resolvePath(path);

        const children = [];
        if (fs.existsSync(fullPath)) {
            const dir = await readDir(fullPath);
            for (let dirent of dir) {
                if (dirent.isDirectory()) {
                    children.push(dirent.name+"/");
                } else if (dirent.isFile()) {
                    children.push(dirent.name);
                }
            }
        }
        return children;
    }
}



module.exports = FSStore;



// Asynchronous version of fs.readdir
function readDir (path) {
    return new Promise((resolve, reject) => {
        fs.readdir(path, {withFileTypes:true}, (err, files) => {
            if (err) reject(err);
            else resolve(files);
        });
    });
}
