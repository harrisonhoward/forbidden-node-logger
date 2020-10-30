const Log = require("./util/structures/Log");
const LogHistory = require("./util/structures/LogHistory");
const FileHistory = require("./util/file/FileHistory");
const { EventEmitter } = require("events");

module.exports = class Logger extends EventEmitter {
    /**
     * @param {Object} options
     * @param {Function} [options.prefix] The prefix for each log (default if undefined)
     * @param {String} [options.dirPath] The directory path for the log file (no file support if undefined)
     * @param {String} seperator Used to seperate the prefix and log (default if undefined)
    */
    constructor(options = {}, seperator = " : ") {
        super();
        this._seperator = seperator;
        this._prefix = options.prefix || (() => { return new Date().toISOString().replace("T", " ").substr(0, 19) });
        this._dirPath = options.dirPath;
        this._history = new LogHistory();

        if (this._seperator != undefined
            && typeof this._seperator !== "string") {
            throw new Error(".seperator is not a string");
        }
        if (this._prefix != undefined) {
            if (typeof this._prefix === "function") {
                // Execute the function if it is one
                const prefix = this._prefix();
                if (typeof prefix !== "string") {
                    throw new Error(".prefix() did not return a string");
                }
            } else {
                throw new Error(".prefix() is not a function");
            }
        }
        if (this._dirPath != undefined) {
            if (typeof this._dirPath !== "string") {
                throw new Error(".dirPath is not a string");
            }
            // Remove extension
            if (this._dirPath.match(/\.[0-9a-z]{1,10}$/i)) {
                this._dirPath = this._dirPath.replace(/\.[0-9a-z]{1,10}$/i, "");
            }
            this._fileHistory = new FileHistory(this.dirPath, this);
        }
        this.log = this.log.bind(this);
        this.eventLog = this.eventLog.bind(this);
        this.info = this.info.bind(this);
        this.debug = this.debug.bind(this);
        this.warn = this.warn.bind(this);
        this.error = this.error.bind(this);
    }

    /**
     * Send a log message to the console
     * @param {("none"|"info"|"debug"|"warn"|"error")} type Contains the type of log. If invalid will be prepended to logs and type will be "none"
     * @param  {...String | Object} logs Message that gets sent to the console
     * @returns {Log}
    */
    log(type, ...logs) {
        if (!this.CONFIG.TYPES.includes(type)) {
            logs.unshift(type);
            type = "none";
        }
        const currentLog = new Log(this.prefix(), this.seperator, type, ...logs);
        console.log(`${currentLog.prefix}${currentLog.seperator}${currentLog.format()}`);
        this.emit("log", currentLog);
        this.history.add(currentLog);
        return currentLog;
    }

    /**
     * Use eventLog when logging a message INSIDE OF THE LOGGER EVENTS
     * This method does the same as log() but does not emit the log event
     * @param {("none"|"info"|"debug"|"warn"|"error")} type Contains the type of log. If invalid will be prepended to logs and type will be "none"
     * @param  {...String | Object} logs Message that gets sent to the console
     * @returns {Log}
    */
    eventLog(type, ...logs) {
        if (!this.CONFIG.TYPES.includes(type)) {
            logs.unshift(type);
            type = "none";
        }
        const currentLog = new Log(this.prefix(), this.seperator, type, ...logs);
        console.log(`${currentLog.prefix}${currentLog.seperator}${currentLog.format()}`);
        this.history.add(currentLog);
        return currentLog;
    }

    /**
     * Send an info message to the console
     * @param  {...String | Object} logs Message that gets sent to the console
     * @returns {Log}
    */
    info(...logs) {
        const currentLog = this.log("info", `&_3&-0[INFO]&r&-3`, ...logs);
        this.emit("info", currentLog);
        return currentLog;
    }

    /**
     * Send a debug message to the console
     * @param  {...String | Object} logs Message that gets sent to the console
     * @returns {Log}
    */
    debug(...logs) {
        const currentLog = this.log("debug", `&_2&-0[DEBUG]&r&-2`, ...logs);
        this.emit("debug", currentLog);
        return currentLog;
    }

    /**
     * Send a warn message to the console
     * @param  {...String | Object} logs Message that gets sent to the console
     * @returns {Log}
    */
    warn(...logs) {
        const currentLog = this.log("warn", `&_6&-0[WARN]&r&-6`, ...logs);
        this.emit("warn", currentLog);
        return currentLog;
    }

    /**
     * Send an error message to the console
     * @param  {...String | Object} logs Message that gets sent to the console
     * @returns {Log}
    */
    error(...logs) {
        const currentLog = this.log("error", `&_4&-0[ERROR]&r&-4`, ...logs);
        this.emit("error", currentLog);
        return currentLog;
    }

    /**
     * Contains all the colour codes and log types
     * @returns {Object} 
    */
    get CONFIG() {
        return require("./config.json");
    }

    /**
     * Contains the collection of logs
     * @returns {LogHistory} 
    */
    get history() {
        return this._history;
    }

    /**
     * Contains the instance of FileHistory
     * @returns {FileHistory}
    */
    get fileHistory() {
        return this._fileHistory;
    }

    /**
     * Contains the Logger prefix
     * @returns {Function} 
    */
    get prefix() {
        return this._prefix;
    }

    /**
     * Contains the Logger directory path
     * @returns {String} 
    */
    get dirPath() {
        return this._dirPath;
    }

    /**
     * Contains the Logger seperator
     * @returns {String} 
    */
    get seperator() {
        return this._seperator;
    }
}