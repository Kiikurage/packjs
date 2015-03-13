// jasmine spec for exfs
var exfs = require("../exfs.js"),
    fs = require("fs");

describe("exfs", function() {
    it("should make deep directory", function() {
        exfs.mkdirSync("./test1/test2/test3", true);

        expect(fs.existsSync("./test1/test2/test3")).toBe(true);

        fs.rmdirSync("./test1/test2/test3");
        fs.rmdirSync("./test1/test2");
        fs.rmdirSync("./test1");
    });
    it("should make deep directory if directory is not exist at writing file.", function() {
        exfs.writeFileSync("./test1/test2/test3.txt", "TEST", true);

        expect(fs.readFileSync("./test1/test2/test3.txt").toString()).toBe("TEST");

        fs.unlinkSync("./test1/test2/test3.txt");
        fs.rmdirSync("./test1/test2");
        fs.rmdirSync("./test1");
    });
});
