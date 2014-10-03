#packjs

packing javascript file to one file.

##usage

1. Write include file path (relative) in each heads of javascript files.

```
//@include ./moudleFile.js
```

2. Run command.

```
$ packjs sourcefile.js targetfile.js
```

3. If you run with ```-w``` option, then command run as **watching mode** and everytime you update file, do packing automaticaly.

```
$ packjs sourcefile.js targetfile.js -w
```
