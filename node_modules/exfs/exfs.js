var fs = require("fs"),
    path = require("path");

/**
 *  copy original function references
 */

Object.keys(fs).forEach(function(name) {
    exports[name] = fs[name];
});



function mkdir(targetPath, mode, callback, flagCreate) {
    if (typeof mode === "function") {
        //argument "mode" may be disappointed
        flagCreate = callback;
        callback = mode;
        mode = undefined;
    }

    if (!flagCreate) {
        return fs.mkdir(targetPath, mode, callback);
    }

    var dirs = targetPath.split(path.sep),
        currentPath = "";

    function core() {
        if (!dirs.length) {
            return callback();
        }

        currentPath += dirs.shift() + path.sep;

        fs.exists(currentPath, function(exists) {
            if (exists) {
                return core();
            }

            fs.mkdir(currentPath, mode, core);
        });
    }
    core();
}
exports.mkdir = mkdir;

function mkdirSync(targetPath, mode, flagCreate) {
    if (typeof mode === "boolean") {
        //argument "mode" may be disappointed
        flagCreate = mode;
        mode = undefined;
    }

    if (!flagCreate) {
        return fs.mkdirSync(targetPath, mode);
    }

    var dirs = targetPath.split(path.sep),
        currentPath = "";

    while (dirs.length) {
        currentPath += dirs.shift() + path.sep;
        if (fs.existsSync(currentPath)) {
            continue
        }

        fs.mkdirSync(currentPath, mode);
    }
}
exports.mkdirSync = mkdirSync;

function writeFile(filename, data, options, callback, flagCreate) {
    if (typeof options === "function") {
        //argument "options" may be disappointed
        flagCreate = callback;
        callback = options;
        options = undefined;
    }

    if (!flagCreate) {
        return fs.writeFile(filename, data, options, callback);
    }

    mkdir(path.dirname(filename), function() {
        return fs.writeFile(filename, data, options, callback);
    }, true);
}
exports.writeFile = writeFile;

function writeFileSync(filename, data, options, flagCreate) {
    if (typeof options === "boolean") {
        //argument "options" may be disappointed
        flagCreate = options;
        options = undefined;
    }

    if (!flagCreate) {
        return fs.writeFileSync(filename, data, options);
    }

    mkdirSync(path.dirname(filename), true);
    fs.writeFileSync(filename, data, options);
}
exports.writeFileSync = writeFileSync;
