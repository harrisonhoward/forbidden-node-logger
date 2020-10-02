const LogRequire = require("../src/index");
const Logger = new LogRequire({ dirPath: __dirname + "/historyLOG" });

// Handle error by not handling it
Logger.on("error", () => { });

Logger.log("Log 1");
Logger.log("Log 2");
Logger.warn("Warn 3");
Logger.error("Error 4");
const log5 = Logger.info("Info 5");
Logger.info("Info 6");
Logger.info("Info 7");

console.log("\nLogger History");
console.log(Logger.history.map(log => { return { prefix: log.prefix, seperator: log.seperator, log: log.clean() } }));
console.log("\nFirst 2");
console.log(Logger.history.first(2).map(log => { return { prefix: log.prefix, seperator: log.seperator, log: log.clean() } }));
console.log("\nLast 2");
console.log(Logger.history.last(2).map(log => { return { prefix: log.prefix, seperator: log.seperator, log: log.clean() } }));
console.log("\nGet Log 5");
console.log(Logger.history.get(log5));

console.log("\nGet Current Log");
Logger.fileHistory.getCurrentLog().then(arr => console.log(arr));