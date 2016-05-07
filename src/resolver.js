"use strict";

const path    = require('path');
const _       = require('lodash');
const resolve = require('resolve');

function isRelativeModuleName(pString) {
    return pString.startsWith(".");
}

function normalizeDepName(pDep) {
    return pDep.endsWith(".json")||pDep.endsWith(".node")? pDep : pDep + ".js";
}

function resolveCJSModule(pModuleName, pBaseDir) {
    return resolve.isCore(pModuleName) ? pModuleName
            : path.relative(
                pBaseDir,
                resolve.sync(
                    pModuleName,
                    {
                        basedir: pBaseDir
                    }
                )
            );
}

function resolveAMDModule(pModuleName /*, pBaseDir*/) {
    // TODO resolution of non-relative AMD modules
    //      AMD de gakste!!
    // lookups:
    // - require.config kerfuffle
    // - maybe use mrjoelkemp/module-lookup-amd ?
    return pModuleName;
}

exports.isRelativeModuleName = isRelativeModuleName;

exports.resolveModuleToPath = function (pDependency, pBaseDir, pFileDir) {
    if(isRelativeModuleName(pDependency.moduleName)){
        return path.relative(
            pBaseDir,
            path.join(pFileDir, normalizeDepName(pDependency.moduleName))
        );
    } else {
        if(_.includes(["cjs", "es6"], pDependency.moduleSystem)){
            return resolveCJSModule(pDependency.moduleName, pBaseDir);
        } else {
            return resolveAMDModule(pDependency.moduleName, pBaseDir);
        }
    }
};
