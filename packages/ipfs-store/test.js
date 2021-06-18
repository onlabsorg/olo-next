
const TEST_CID = "QmbkZZR9gbq1joauSSvPu32unyQrVMQyve19XXAwGHDG16";


const expect = require("chai").expect;
const fs = require('fs');
const olojs = require('@onlabsorg/olojs');
const IPFS = require('ipfs-core');
const {IPFSStore} = require('./index');


describe('IPFSStore', () => {
    var ipfs, store;
    
    before(async () => {
        ipfs = await IPFS.create();
        store = new IPFSStore(ipfs, TEST_CID);
    });
    
    describe('constructor', () => {
        
        it('should return an instance of olojs.Store', () => {
            expect(store).to.be.instanceof(olojs.Store);
        });
    });
    
    describe('store instance', () => {
        
        describe('store.read - async method', () => {
            
            it("should return the content of <store.cid>/<path>.olo", async () => {
                var expectedContent = fs.readFileSync(`${__dirname}/test-store/dir/greet.olo`, 'utf8');
                var content = await store.read('/dir/greet');
                expect(content).to.equal(expectedContent);
            });
            
            it("should return the content of <store.cid>/<path>/.olo when a directory path is passed", async () => {
                var expectedContent = fs.readFileSync(`${__dirname}/test-store/dir/.olo`, 'utf8');
                var content = await store.read('/dir/');
                expect(content).to.equal(expectedContent);                
            });
            
            it("should return an empty string if the document doesn't exist", async () => {
                var content = await store.read('/path/to/non-existing/doc');
                expect(content).to.equal("");
            });
        });
        
        describe('store.list - async method', () => {
            
            it("should return the names of the child items of <store.cid>/<path>, limited to files with .olo extension and directories", async () => {
                var children = await store.list('/');
                expect(children.sort()).to.deep.equal([
                    'circle', 
                    'dir/', 
                    'greet', 
                    'greet0' 
                ]);
                
                children = await store.list('/dir');
                expect(children.sort()).to.deep.equal([
                    '', 
                    'greet', 
                ]);
            });
            
            it("should return an empty array if the directory doesn't exist", async () => {
                var children = await store.list('/path/to/non-existing/dir/');
                expect(children.sort()).to.deep.equal([]);
            });
        });  
        
        describe("store.write - async method", () => {
            
            it("should throw a `WriteOperationNotAllowed` error", async () => {
                try {
                    await store.write("/path/to/doc1", "source of doc 1");
                    throw new Error("Id didn't throw");
                } catch (error) {
                    expect(error).to.be.instanceof(olojs.Store.WriteOperationNotAllowedError);
                    expect(error.message).to.equal("Operation not allowed: WRITE /path/to/doc1");
                }
            });
        });

        describe("store.delete - async method", () => {
            
            it("should throw a `WriteOperationNotAllowed` error", async () => {
                try {
                    await store.delete("/path/to/doc1");
                    throw new Error("Id didn't throw");
                } catch (error) {
                    expect(error).to.be.instanceof(olojs.Store.WriteOperationNotAllowedError);
                    expect(error.message).to.equal("Operation not allowed: WRITE /path/to/doc1");
                }
            });
        });

        describe("store.deleteAll - async method", () => {
            
            it("should throw a `WriteOperationNotAllowed` error", async () => {
                try {
                    await store.deleteAll("/path/to/");
                    throw new Error("Id didn't throw");
                } catch (error) {
                    expect(error).to.be.instanceof(olojs.Store.WriteOperationNotAllowedError);
                    expect(error.message).to.equal("Operation not allowed: WRITE /path/to/");
                }
            });
        });
        
        describe("store.clone - async method", () => {
            
            it("should return a memory store with all the content of the ipfs store", async function () {
                var storeClone = await store.clone();
                expect(await storeClone.read('/dir/greet')).to.equal(
                    fs.readFileSync(`${__dirname}/test-store/dir/greet.olo`, 'utf8')
                );
                expect((await storeClone.list('/')).sort()).to.deep.equal([
                    'circle', 
                    'dir/', 
                    'greet', 
                    'greet0' 
                ]);
                expect((await storeClone.list('/dir/')).sort()).to.deep.equal([
                    '', 
                    'greet', 
                ]);    
                
                var storeClone = await store.clone('/dir/');
                expect(await storeClone.read('/greet')).to.equal(
                    fs.readFileSync(`${__dirname}/test-store/dir/greet.olo`, 'utf8')
                );
                expect((await storeClone.list('/')).sort()).to.deep.equal([
                    '', 
                    'greet', 
                ]);                    
            });
        });    
    });
    
    describe('root store instance', () => {
        
        describe('rootStore.read', () => {
            
            it("should return the content of <path>.olo", async () => {
                const store = new IPFSStore(ipfs);
                var expectedContent = fs.readFileSync(`${__dirname}/test-store/dir/greet.olo`, 'utf8');
                var content = await store.read(`${TEST_CID}/dir/greet`);
                expect(content).to.equal(expectedContent);
            });
            
            it("should return the content of <path>/.olo when a directory path is passed", async () => {
                const store = new IPFSStore(ipfs);
                var expectedContent = fs.readFileSync(`${__dirname}/test-store/dir/.olo`, 'utf8');
                var content = await store.read(`${TEST_CID}/dir/`);
                expect(content).to.equal(expectedContent);                
            });
            
            it("should return an empty string if the document doesn't exist", async () => {
                const store = new IPFSStore(ipfs);

                var content = await store.read('/path/to/non-existing/doc');
                expect(content).to.equal("");

                var content = await store.read(`${TEST_CID}/path/to/non-existing/doc`);
                expect(content).to.equal("");
            });
        });

        describe('rootStore.list - async method', () => {
            
            it("should return the names of the child items of <path>, limited to files with .olo extension and directories", async () => {
                const store = new IPFSStore(ipfs);

                var children = await store.list(`${TEST_CID}/`);
                expect(children.sort()).to.deep.equal([
                    'circle', 
                    'dir/', 
                    'greet', 
                    'greet0' 
                ]);
                
                children = await store.list(`${TEST_CID}/dir`);
                expect(children.sort()).to.deep.equal([
                    '', 
                    'greet', 
                ]);
            });
            
            it("should return an empty array if the directory doesn't exist", async () => {
                const store = new IPFSStore(ipfs);

                var children = await store.list('/path/to/non-existing/dir/');
                expect(children.sort()).to.deep.equal([]);

                var children = await store.list(`${TEST_CID}/path/to/non-existing/dir/`);
                expect(children.sort()).to.deep.equal([]);
            });
            
            it("should return a ReadOperationNotAllowed error if trying to list '/'", async () => {
                const store = new IPFSStore(ipfs);
                try {
                    await store.list("/");
                    throw new Error("Id didn't throw");
                } catch (error) {
                    expect(error).to.be.instanceof(IPFSStore.ReadOperationNotAllowedError);
                    expect(error.message).to.equal("Operation not allowed: READ /");
                }                
            });
        });          

        describe("rootStore.clone - async method", () => {
            
            it("should return a memory store with all the content of the ipfs store", async function () {
                this.timeout(10000);
                const store = new IPFSStore(ipfs);
                var storeClone = await store.clone(`${TEST_CID}/`);
                expect(await storeClone.read('/dir/greet')).to.equal(
                    fs.readFileSync(`${__dirname}/test-store/dir/greet.olo`, 'utf8')
                );
                expect((await storeClone.list('/')).sort()).to.deep.equal([
                    'circle', 
                    'dir/', 
                    'greet', 
                    'greet0' 
                ]);
                expect((await storeClone.list('/dir/')).sort()).to.deep.equal([
                    '', 
                    'greet', 
                ]);                
            });

            it("should throw a ReadOperationNotAllowed error if trying to clone '/'", async () => {
                const store = new IPFSStore(ipfs);
                try {
                    await store.clone("/");
                    throw new Error("Id didn't throw");
                } catch (error) {
                    expect(error).to.be.instanceof(IPFSStore.ReadOperationNotAllowedError);
                    expect(error.message).to.equal("Operation not allowed: READ /");
                }                                
            });
        });    
    });
    
    describe("create - static async method", () => {
        
        it("should upload the given olojs Store to IPFS and return its cid", async () => {
            var memStore = new olojs.MemoryStore({
                '/doc1': "content of document @ /doc1",
                '/dir/doc2': "content of document @ /dir/doc2",
                '/dir/doc3': "content of document @ /dir/doc3"
            });
            var new_store = await IPFSStore.create(ipfs, memStore);
            
            expect(await new_store.read('/doc1')).to.equal("content of document @ /doc1");
            expect(await new_store.read('/dir/doc2')).to.equal("content of document @ /dir/doc2");
            expect(await new_store.read('/dir/doc3')).to.equal("content of document @ /dir/doc3");
            expect(await new_store.list('/')).to.deep.equal(['dir/', 'doc1']);
            expect(await new_store.list('/dir')).to.deep.equal(['doc2', 'doc3']);
        });
    });
    
    after(async () => {
        await ipfs.stop();
    });
});
