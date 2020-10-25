const NodeLogger = require("../src/index");
const Logger = new NodeLogger.Logger();

Logger.on("log", log => console.log(`EVENT LOG: ${log.clean()} on ${log.prefix}`));
Logger.on("info", log => console.log(`EVENT INFO: ${log.clean()} on ${log.prefix}\n`));
Logger.on("debug", log => console.log(`EVENT DEBUG: ${log.clean()} on ${log.prefix}\n`));
Logger.on("warn", log => console.log(`EVENT WARN: ${log.clean()} on ${log.prefix}\n`));
Logger.on("error", log => console.log(`EVENT ERROR: ${log.clean()} on ${log.prefix}\n`));

Logger.log("none", "This is a log message");
console.log("");
Logger.info("This is an info message");
Logger.debug("This is a debug message");
Logger.warn("This is a warn message");
Logger.error("This is an error message");
Logger.log("none", "&_5This is a custom message&r &-2:)");