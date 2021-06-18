const IPFS = require('ipfs-core');

async function test () {
    const ipfs = await IPFS.create({repo: `${__dirname}/test-files`});
    
    //await ipfs.files.mkdir('/tdir');
    await ipfs.files.write('/hello-world', new TextEncoder().encode('Hello, world!'));
    
    await ipfs.stop();
}

test();