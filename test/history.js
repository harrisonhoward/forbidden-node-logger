const NodeLogger = require("../src/index");
const Logger = new NodeLogger.Logger({ dirPath: __dirname + "/historyLOG" });

// Handle error by not handling it
Logger.on("error", () => { });

Logger.log("none", "Log 1");
Logger.log("none", "Log 2");
Logger.warn("Warn 3");
Logger.error("Error 4");
const log5 = Logger.info("Info 5");
Logger.info("Info 6");
Logger.info("Info 7");

console.log("\nLogger History");
console.log(Logger.history.map(log => { return { prefix: log.prefix, seperator: log.seperator, log: log.clean() } }));
console.log("\nFirst 2");
// @ts-ignore
console.log(Logger.history.first(2).map(log => { return { prefix: log.prefix, seperator: log.seperator, log: log.clean() } }));
console.log("\nLast 2");
// @ts-ignore
console.log(Logger.history.last(2).map(log => { return { prefix: log.prefix, seperator: log.seperator, log: log.clean() } }));
console.log("\nGet Log 5");
console.log(Logger.history.get(log5));

console.log("\nGet Latest Log");
Logger.fileHistory.getLatestLog()
    .then(arr => console.log(arr))
    .then(() => {
        console.log("\nGet Log by Day"); // Should look the same as getLatestLog()
        Logger.fileHistory.getLogByDay(new Date().getDate())
            .then(arr => console.log(arr))
            .then(() => {
                console.log("\nGet Logs by Month");
                Logger.fileHistory.getLogsByMonth(new Date().getMonth() + 1)
                    .then(obj => console.log(obj))
                    .then(() => {
                        console.log("\nGet Logs by Year");
                        Logger.fileHistory.getLogsByYear(new Date().getFullYear())
                            .then(obj => console.log(obj));
                    });
            });
    });