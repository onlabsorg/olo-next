var expect = require("chai").expect;
var loadlib = require("../../lib/modules").require;
var {context} = require("../../lib/interpreter");


describe("inspect module", function () {
    
    describe("inspect.log", () => {
        var jslog, logged;
        
        before(() => {
            jslog = console.log;
            console.log = (...args) => {
                logged = args;
            }
        });
        
        it("should log the passed arguments to the console", async () => {
            const inspect = await loadlib('inspect');
            await inspect.log.call(context, 10,'abc',{x:1});
            expect(logged).to.deep.equal(["Inspect:", [10,'abc',{x:1}]]);
        });
        
        it("should return the argument tuple stringified", async () => {
            const inspect = await loadlib('inspect');
            expect(await inspect.log.call(context, 10,'abc',{x:1})).to.equal("10abc[[Namespace of 1 items]]");
        });
        
        after(() => {
            console.log = jslog;
        });
    });
});

