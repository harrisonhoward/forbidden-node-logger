const LogRequire = require("../src/index");
const Logger = new LogRequire();

Logger.on("log", log => Logger.log(log.clean()));
Logger.eventLog("This is designed to break and show off what not to do with the Logger events");
Logger.eventLog("Starts in 5 seconds");

setTimeout(() => {
    Logger.log("Do not log the log event with another log because then it'll log another log of that log because you logged the event log");
}, 5000);