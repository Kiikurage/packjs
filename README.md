#packjs

packing javascript file to one file.

##usage

1. Write include file path (relative) in each heads of javascript files.

```javascript
console.log('foo');
// @include ./module.js
console.log('bar');
```

2. Run command.

```bash
$ node packjs.js sourcefile.js targetfile.js
```

3. Output like this.

```javascript
console.log('foo');
function someModule(){};
console.log('bar');
```

4. If you run with ```-w``` option, then command run as **watching mode** and everytime you update file, do packing automaticaly.

```bash
$ node packjs.js sourcefile.js targetfile.js -w
```
