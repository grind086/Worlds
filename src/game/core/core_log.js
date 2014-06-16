pc.extend(game, function () {
    var Levels = {
        LOG: 0,
        WARN: 1,
        ERROR: 2,
        INFO: 3,
        DEBUG: 4
    };

    // Console logging functions
    var fns = {};
    fns[Levels.LOG] = console.log;
    fns[Levels.WARN] = console.warn;
    fns[Levels.ERROR] = console.error;
    fns[Levels.INFO] = console.info;
    fns[Levels.DEBUG] = console.debug;

    game.debugInfo.log = [];

    var log = {
        Levels: Levels,
        level: Levels.DEBUG,
        _data: [],
        _write: function () {
            var args = Array.prototype.slice.call(arguments);
            var level = args.shift();

            if (level <= game.log.level) {
                game.log._data.push([level, args[0]]);
            }
            game.debugInfo.log.push([level, args[0]]);

            fns[level].apply(this, args);
        }
    };

    // Helper functions
    log.write = log._write.bind(console, Levels.LOG);
    log.warn = log._write.bind(console, Levels.WARN);
    log.error = log._write.bind(console, Levels.ERROR);
    log.info = log._write.bind(console, Levels.INFO);
    log.debug = log._write.bind(console, Levels.DEBUG);

    // Intercept the console
    console.log = log.write;
    console.warn = log.warn;
    console.error = log.error;
    console.info = log.info;
    console.debug = log.debug;

    return {
        log: log
    };
}());