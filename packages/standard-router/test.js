const {expect} = require('chai');
const olojs = require('@onlabsorg/olojs');
const StandardRouter = require('.');

describe('StandardStore instance', () => {
    
    it("should mount the passed homeStore under `/home`", async () => {
        const store = await StandardRouter(new olojs.MemoryStore({
            "/path/to/doc1": "...",
            "/path/to/doc2": "...",
            "/path/to/doc3": "...",
        }));
        expect((await store.list('/home')).sort()).to.deep.equal(['path/']);
        expect((await store.list('/home/path')).sort()).to.deep.equal(['to/']);
        expect((await store.list('/home/path/to')).sort()).to.deep.equal(['doc1','doc2','doc3']);
    });

    it("should mount a memory-store under `/temp`", async () => {
        const store1 = await StandardRouter(new olojs.MemoryStore({}));
        const store2 = await StandardRouter(new olojs.MemoryStore({}));
        await store1.write('/temp/path/to/doc', "doc content");
        expect(await store1.read('/temp/path/to/doc')).to.equal("doc content");
        expect(await store2.read('/temp/path/to/doc')).to.equal("");
    });

    it("should mount the root HTTP store under `/http`", async () => {
        const store = await StandardRouter(new olojs.MemoryStore({}));
        const response = await fetch("http://raw.githubusercontent.com/onlabsorg/olojs/master/README.md");
        const readme = await response.text();
        expect(await store.read('/http/raw.githubusercontent.com/onlabsorg/olojs/master/README.md')).to.equal(readme);
    });

    it("should mount the root HTTPS store under `/https`", async () => {
        const store = await StandardRouter(new olojs.MemoryStore({}));
        const response = await fetch("https://raw.githubusercontent.com/onlabsorg/olojs/master/README.md");
        const readme = await response.text();
        expect(await store.read('/https/raw.githubusercontent.com/onlabsorg/olojs/master/README.md')).to.equal(readme);        
    });

    it.skip("should mount the root ipfs store under `/ipfs`", async () => {});
});