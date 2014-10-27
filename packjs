#!/usr/bin/env node

var fs = require('fs'),
    path = require('path');

var packjs = {
    /**
     *  監視状態に関する列挙体
     *  @enum {number}
     */
    WatchState: {
        WATCH_NOW: 1,
        WATCH_PREV: 2,
    },

    /**
     *  ログの出力カラーに関する列挙体
     *  @enum {string}
     */
    LogColor: {
        RED: '\x1b[31m',
        GREEN: '\x1b[32m',
        BLUE: '\x1b[34m',
        NORMAL: '\x1b[m'
    },

    /**
     *	読込元ファイル名
     *	@type {string}
     */
    SOURCE_PATH: '',

    /**
     *	出力先ファイル名
     *	@type {string}
     */
    TARGET_PATH: '',

    /**
     *  ファイルの更新監視を行うか
     *  @type {boolean}
     */
    flagWatch: false,

    /**
     *	読み込んだコンポーネント一覧
     *	@type {object<string, boolean>}
     */
    includedFilePath: null,

    /**
     *  二重書き換え防止セマフォア
     */
    semaphore: false,

    /**
     *	初期化を行う
     */
    setup: function() {
        var argv = Array.prototype.slice.call(process.argv, 0),
            argvWithoutOption = [];

        for (var i = 2, max = argv.length; i < max; i++) {
            switch (argv[i]) {
                case '-w':
                    this.flagWatch = true;
                    break;

                default:
                    argvWithoutOption.push(argv[i]);
                    break;
            }
        }

        this.SOURCE_PATH = path.resolve(argvWithoutOption[0]);
        this.TARGET_PATH = path.resolve(argvWithoutOption[1]);
    },

    /**
     *  ファイルの監視を開始する
     */
    watch: function() {
        this.semaphore = false;
        this.watchedFilePath = {};
        this.watchFile(this.SOURCE_PATH);
    },

    /**
     *  ファイルを監視する
     *  @param {string} sourcePath 監視するファイルのパス
     */
    watchFile: function(sourcePath) {
        var data, modulePath, dirname;

        dirname = path.dirname(sourcePath);
        try {
            data = this.loadFile(sourcePath)
        } catch (e) {
            console.log(this.LogColor.RED + 'error' + this.LogColor.NORMAL);
            console.error(e);
            return
        }

        for (var i = 0, max = data.includes.length; i < max; i++) {
            modulePath = path.resolve(path.join(dirname, data.includes[i].path));
            this.watchFile(modulePath);
        }

        switch (this.watchedFilePath[sourcePath]) {
            case this.WatchState.WATCH_NOW:
                break;

            case this.WatchState.WATCH_PREV:
                this.watchedFilePath[sourcePath] = this.WatchState.WATCH_NOW;
                break;

            default:
                fs.watchFile(sourcePath, {
                    interval: 2000
                }, this.updateFileHandler);
                console.log(this.LogColor.BLUE + 'watch' + this.LogColor.NORMAL);
                console.log(sourcePath);
                this.watchedFilePath[sourcePath] = this.WatchState.WATCH_NOW;
                break;
        }
    },

    /**
     *  指定されたファイルの更新監視を解除する
     *  @param {string} sourcePath 監視を解除するファイルのパス
     */
    unwatchFile: function(filePath) {
        filePath = path.resolve(filePath);

        console.log(this.LogColor.BLUE + 'unwatch' + this.LogColor.NORMAL);
        console.log(filePath);
        fs.unwatchFile(filePath, this.updateFileHandler);
        delete this.watchedFilePath[filePath]
    },

    /**
     *  ファイルの更新に対するハンドラ
     */
    updateFileHandler: function() {
        if (packjs.semaphore) {
            return;
        }
        packjs.semaphore = true;

        packjs.pack();
        packjs.updateWatchFile();

        packjs.semaphore = false;
    },

    /**
     *  監視ファイルの一覧を更新する
     */
    updateWatchFile: function() {
        for (var filePath in this.watchedFilePath) {
            this.watchedFilePath[filePath] = this.WatchState.WATCH_PREV;
        }

        this.watchFile(this.SOURCE_PATH);

        for (var filePath in this.watchedFilePath) {
            if (this.watchedFilePath[filePath] !== this.WatchState.WATCH_PREV) {
                continue
            }

            this.unwatchFile(filePath);
        }
    },

    /**
     *	パッキングを開始する
     */
    pack: function() {
        var packed;
        try {
            this.includedFilePath = [];
            packed = this.parseFile(this.SOURCE_PATH);
            fs.writeFileSync(this.TARGET_PATH, packed);

            console.log(this.LogColor.GREEN + 'pack' + this.LogColor.NORMAL);
            console.log('finish packing successfully.');
        } catch (e) {
            console.log(this.LogColor.RED + 'error' + this.LogColor.NORMAL);
            console.error(e);
        }
    },

    /**
     *	ファイルをパースし、必要なコンポーネントをすべて追加する
     *	@param {string} filepath ファイルのパス
     */
    parseFile: function(sourcePath) {
        var data, modulePath, dirname, packed, cursor;

        if (this.isDuplicate(sourcePath)) {
            return;
        }
        this.includedFilePath.push(sourcePath);

        dirname = path.dirname(sourcePath);
        data = this.loadFile(sourcePath);
        packed = '';
        cursor = 0;

        for (var i = 0, max = data.includes.length; i < max; i++) {
            modulePath = path.resolve(path.join(dirname, data.includes[i].path));
            packed +=
                data.body.substring(cursor, data.includes[i].from) +
                '\n' + this.parseFile(modulePath) + '\n';
            cursor = data.includes[i].from + data.includes[i].length;
        }
        packed += data.body.substring(cursor, data.body.length);

        return packed
    },

    /**
     *	読み込み済みかどうかを確認する
     *	@param {string} filepath 検査するファイルのパス
     *	@return {boolean} すでに読み込み済みの場合trueを返す
     */
    isDuplicate: function(filepath) {
        filepath = path.resolve(filepath);
        return !(this.includedFilePath.indexOf(filepath) === -1);
    },

    /**
     *  監視済みかどうかを確認する
     *  @param {string} filepath 検査するファイルのパス
     *  @return {boolean} すでに監視済みの場合trueを返す
     */
    isDuplicateWatch: function(filepath) {
        filepath = path.resolve(filepath);
        return !(this.watchedFilePath.indexOf(filepath) === -1);
    },

    /**
     *	ファイルを読み込む
     *	@param {string} filepath ファイルのパス
     *	@return {string} ファイル本文
     */
    loadFile: function(filepath) {
        var includes = [],
            regIncludes = /\s*\/\/@include\s+([^\s]+)\s*/g,
            ma, body;

        filepath = path.resolve(filepath);

        body = fs.readFileSync(filepath, 'utf8');

        while (ma = regIncludes.exec(body)) {
            includes.push({
                from: ma.index,
                length: ma[0].length,
                path: ma[1]
            });
        }

        return {
            path: filepath,
            body: body,
            includes: includes
        }
    },


}

packjs.setup();
if (packjs.flagWatch) {
    packjs.watch();
} else {
    packjs.pack();
}