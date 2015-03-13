exfs
====
convenience extension of fs

## Install

```bash
npm install exfs
```


## usage
### exfs.mkdir(path, [mode], callback, **createFlag**)
Asynchronously make directory if directory isn't exist

When the directory in which new folder will be made is not exist, if `createFlag=true`, this function make it. if `createFlag=false`, this function throw an error.

```Javascript
var exfs = require("esfs");
exfs.mkdir("./you/can/make/this/very/very/deep/directory/at/a/time", callback, true);
```

### exfs.writeFile(filename, data, [options], callback, **createFlag**)
Asynchronously writes data to a file

When the directory in which file is made is not exist, if `createFlag=true`, this function make it. if `createFlag=false`, this function throw an error.

```Javascript
var exfs = require("esfs");
var path = ("./you/can/make/this/very/very/deep/directory/at/a/time");

exfs.writeFile(path, "Hello World!", callback, true);
```
