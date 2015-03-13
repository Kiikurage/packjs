#packjs

packing javascript file to one file.

##Install

Use npm

```bash
sudo npm install -g pack-js
```

##Usage

1. Write include file path (relative) in each heads of javascript files.

```javascript
//sourcefile.js
var module = require('./module.js');
```

2. Run command.

```bash
$ packjs sourcefile.js destination.js
```

3. Output like this. Module context is guarded by function closure.

```javascript
//destination.js
var module = (function(m){
    (function(module, exports){

        /**
         *  module body is here.
         */

    }(m, m.exports={}));
    return module.exports;
}({}));
```

4. If you run with ```-w``` option, then command run as **watching mode** and everytime you update file, do packing automaticaly.

```bash
$ packjs sourcefile.js destination.js -w
```
