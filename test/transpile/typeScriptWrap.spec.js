"use strict";

const expect = require("chai").expect;
const fs     = require('fs');
const wrap  = require("../../src/extractor/transpile/typeScriptWrap");

describe("typescript transpiler", () => {
    it("tells the typescript transpiler is available", () => {
        expect(
            wrap.isAvailable()
        ).to.equal(true);
    });

    it("transpiles typescript", () => {
        expect(
            wrap.transpile(
                fs.readFileSync("./test/transpile/fixtures/typescriptscript.ts", 'utf8')
            )
        ).to.equal(
            fs.readFileSync("./test/transpile/fixtures/typescriptscript.js", 'utf8')
        );
    });

    it("transpiles tsx", () => {
        fs.writeFileSync(
            "./wap.js",
            wrap.transpile(
                fs.readFileSync("./test/transpile/fixtures/tsx.tsx", 'utf8')
            ),
            'utf8'
        );
        expect(
            wrap.transpile(
                fs.readFileSync("./test/transpile/fixtures/tsx.tsx", 'utf8')
            )
        ).to.equal(
            fs.readFileSync("./test/transpile/fixtures/tsx.js", 'utf8')
        );
    });
});
