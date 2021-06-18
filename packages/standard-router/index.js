const olojs = require('@onlabsorg/olojs');
// const ipfs = require(...);
// const IPFSStore = require(...);

const IsomorphicStandardRouter = require('./lib/isomorphic-standard-router');

module.exports = async function (homeStore) {
    const ipfsProtocol = undefined;
    return new IsomorphicStandardRouter(olojs, homeStore, ipfsProtocol)
}