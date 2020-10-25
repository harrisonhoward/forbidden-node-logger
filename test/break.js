const NodeLogger = require("../src/index");
const Logger = new NodeLogger.Logger();

Logger.on("log", log => Logger.log(log.clean()));
Logger.eventLog("none", "This is designed to break and show off what not to do with the Logger events");
Logger.eventLog("none", "Starts in 5 seconds");

setTimeout(() => {
    Logger.log("none", "Do not log the log event with another log because then it'll log another log of that log because you logged the event log");
}, 5000);