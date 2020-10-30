const CONFIG = require("../../config.json");

module.exports = class Log {
    /**
     * 
     * @param {String} prefix Prefix for each log
     * @param {String} seperator Seperates the prefix from the log
     * @param {("none"|"info"|"debug"|"warn"|"error")} type Type of log
     * @param  {...String | Object} logs The log message that was sent to the console
    */
    constructor(prefix, seperator, type, ...logs) {
        this._prefix = prefix;
        this._seperator = seperator;
        this._type = type;
        this._log = "";
        this._dateAdded = new Date().valueOf();

        for (let log of logs) {
            if (typeof log === "number") {
                log = log + "";
            }
            if (log == undefined
                || typeof log === "undefined") {
                log = "";
            }
            if (typeof log === "string") {
                this._log += log;
            } else if (typeof log.stack === "string"
                || typeof log.message === "string") {
                this._log += log.stack ? log.stack : log.message;
            } else if (typeof log === "object") {
                try {
                    this._log += require("util").inspect(log);
                } catch (err) {
                    this._log += JSON.stringify(log);
                }
            } else {
                throw new Error("log must be a \"string\" or \"object\"");
            }
            const index = logs.indexOf(log);
            if (logs.length > 1 && index < logs.length - 1) {
                this._log += " ";
            }
        }
        this._log += "&r";
    }

    /**
     * Get the prefix of the Log
     * @returns {String}
    */
    get prefix() {
        return this._prefix;
    }

    /**
     * Get the seperator of the Log
     * @returns {String}
    */
    get seperator() {
        return this._seperator;
    }

    /**
     * Get the type of the log
     * @returns {("none"|"info"|"debug"|"warn"|"error")}
    */
    get type() {
        return this._type;
    }

    /**
     * Get the log of the Log
     * @returns {String}
    */
    get log() {
        return this._log;
    }

    /**
     * Get the date of which the log was added
     * @returns {Number}
    */
    get dateAdded() {
        return this._dateAdded;
    }

    /**
     * Converts colour codes into the proper ANSI code
     * Returns the output
     * @returns {String}
    */
    format() {
        let log = this.log;
        const codes = this._CODES;
        const matches = log.match(/(&.)[0-9a-z]{0,1}/gmi);
        if (matches && Array.isArray(matches)) {
            for (const match of matches) {
                const split = match.split("");
                if (["-", "_"].includes(split[1])) {
                    const type = codes.find(item => item.key === split[1]);
                    const colour = codes.find(item => item.key === split[2]);
                    if (type && colour && colour.type) {
                        const ansi = CONFIG.COLOUR[colour.type][type.value][colour.value];
                        log = log.replace(`&${split[1]}${split[2]}`, ansi);
                    }
                } else {
                    const format = codes.find(item => item.key === split[1]);
                    if (format && ["SPECIAL", "FORMAT"].includes(format.type)) {
                        const ansi = CONFIG[format.type][format.value];
                        log = log.replace(`&${split[1]}`, ansi);
                    }
                }
            }
        }
        return log;
    }

    /**
     * Returns a clean log without colour codes and ANSI code
     * @returns {String}
    */
    clean() {
        return this.log
            .replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, "")
            .replace(/(&.)[0-9a-z]{0,1}/gmi, "");
    }

    /**
     * The colour codes available
     * @returns {Array<Object>}
    */
    get _CODES() {
        return [
            { key: "-", value: "FG" },
            { key: "_", value: "BG" },

            { key: "4", value: "red", type: "DARK" },
            { key: "c", value: "red", type: "BRIGHT" },
            { key: "6", value: "yellow", type: "DARK" },
            { key: "e", value: "yellow", type: "BRIGHT" },
            { key: "2", value: "green", type: "DARK" },
            { key: "a", value: "green", type: "BRIGHT" },
            { key: "3", value: "cyan", type: "DARK" },
            { key: "b", value: "cyan", type: "BRIGHT" },
            { key: "1", value: "blue", type: "DARK" },
            { key: "9", value: "blue", type: "BRIGHT" },
            { key: "5", value: "magenta", type: "DARK" },
            { key: "d", value: "magenta", type: "BRIGHT" },
            { key: "7", value: "white", type: "DARK" },
            { key: "f", value: "white", type: "BRIGHT" },
            { key: "0", value: "black", type: "DARK" },
            { key: "8", value: "black", type: "BRIGHT" },

            { key: "r", value: "reset", type: "SPECIAL" },
            { key: "k", value: "reverse", type: "SPECIAL" },
            { key: "l", value: "bold", type: "FORMAT" },
            { key: "o", value: "italic", type: "FORMAT" },
            { key: "n", value: "under", type: "FORMAT" },
            { key: "m", value: "strike", type: "FORMAT" },
        ];
    }
}