/* jshint esnext: true */

const expect               = require('chai').expect;
const extractor            = require('../src/extractor');
const cjsFixtures          = require('./extractor-fixtures/cjs.json');
const cjsRecursiveFixtures = require('./extractor-fixtures/cjs-recursive.json');
const cjsFlatFixtures      = require('./extractor-fixtures/cjs-flat.json');
const es6Fixtures          = require('./extractor-fixtures/es6.json');
const amdFixtures          = require('./extractor-fixtures/amd.json');

function runFixture(pFixture) {
    it(pFixture.title, () => {
        expect(
            extractor.extractDependencies(
                pFixture.input.fileName,
                {
                    baseDir: pFixture.input.baseDir,
                    moduleSystems: pFixture.input.moduleSystems
                }
            )
        ).to.deep.equal(
            pFixture.expected
        );
    });
}

function runRecursiveFixture(pFixture) {
    it(pFixture.title, () => {
        expect(
            extractor.extractRecursive(
                pFixture.input.fileName,
                pFixture.input.options
            )
        ).to.deep.equal(pFixture.expected);
    });
}
function runRecursiveFlattenedFixture(pFixture) {
    it(pFixture.title, () => {
        expect(
            extractor.extractRecursiveFlattened(
                pFixture.input.fileName,
                pFixture.input.options
            )
        ).to.deep.equal(pFixture.expected);
    });
}

describe ('CommonJS - ', () => cjsFixtures.forEach(runFixture));
describe ('CommonJS recursive - ', () => cjsRecursiveFixtures.forEach(runRecursiveFixture));
describe ('CommonJS recursive flattened - ', () => cjsFlatFixtures.forEach(runRecursiveFlattenedFixture));
describe ('ES6 - ', () => es6Fixtures.forEach(runFixture));
describe ('AMD - ', () => amdFixtures.forEach(runFixture));

describe('Error scenarios - ', () => {
    it('Raises an exception on syntax errors', () => {
        expect(
            () => extractor.extractDependencies("test/extractor-fixtures/syntax-error.js")
        ).to.throw("Extracting dependencies ran afoul of... Unexpected token (1:3)");
    });
    it('Raises an exception on non-existing files', () => {
        expect(
            () => extractor.extractDependencies("non-existing-file.js")
        ).to.throw("Extracting dependencies ran afoul of... ENOENT: no such file or directory, open 'non-existing-file.js'");
    });
});
