"use strict";

const jsWrap        = require("./javaScriptWrap");
const tsWrap        = require("./typeScriptWrap");
const lsWrap        = require("./liveScriptWrap");
const coffeeWrap    = require("./coffeeWrap")();
const litCoffeeWrap = require("./coffeeWrap")(true);


/* for a rationale on how .jsx parsing works - see
 * https://github.com/sverweij/dependency-cruiser/blob/develop/src/extract/transpile/jsxImplementationRationale.md
 */
const extension2wrapper = {
    ".js"        : jsWrap,
    ".jsx"       : jsWrap,
    ".ts"        : tsWrap,
    ".tsx"       : tsWrap,
    ".ls"        : lsWrap,
    ".coffee"    : coffeeWrap,
    ".litcoffee" : litCoffeeWrap,
    ".coffee.md" : litCoffeeWrap
};

module.exports.getWrapper = pExtension => extension2wrapper[pExtension] || jsWrap;
module.exports.allExtensions =
    Object.keys(extension2wrapper)
        .map(
            pKey => ({
                extension: pKey,
                available: extension2wrapper[pKey].isAvailable()
            })
        );
module.exports.scannableExtensions =
    Object.keys(extension2wrapper)
        .filter(
            pKey => extension2wrapper[pKey].isAvailable()
        );
