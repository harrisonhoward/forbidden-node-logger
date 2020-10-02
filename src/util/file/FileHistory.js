const Logger = require("../../index");
const ReadWrite = require("./ReadWrite");

module.exports = class FileHistory {
    /**
     * 
     * @param {String} dirPath 
     * @param {Logger} Logger The logger instance
    */
    constructor(dirPath, Logger) {
        this.dirPath = dirPath;
        this.Logger = Logger;
        this.waiting = false;

        this.year = (() => { return new Date().getFullYear() });
        this.month = (() => { return new Date().getMonth().toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false }) });
        this.day = (() => { return new Date().getDate().toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false }) });

        if (!this.dirPath.endsWith("/")) {
            this.dirPath += "/";
        }

        this._handleCatch = this._handleCatch.bind(this);

        this.Logger.on("log", async (log) => {
            const writeFile = `${this.dirPath}${this.year()}/${this.month()}/${this.day()}.log`;
            await ReadWrite.dirIfNotExists(`${this.dirPath}${this.year()}/${this.month()}`).catch(this._handleCatch);
            await ReadWrite.write(writeFile, `${Logger.prefix()}${Logger.seperator}${log.clean()}\n`).catch(this._handleCatch);;
        });
    }

    /**
     * Get lines from the current log file
     * @returns {Promise<String[]>}
    */
    async getCurrentLog() {
        const readFile = `${this.dirPath}${this.year()}/${this.month()}/${this.day()}.log`;
        await ReadWrite.dirIfNotExists(`${this.dirPath}${this.year()}/${this.month()}`).catch(this._handleCatch);;
        return await ReadWrite.read(readFile).catch(this._handleCatch);;
    }

    /**
     * 
     * @param {Error} err 
    */
    _handleCatch(err) {
        this.Logger.eventLog(`&_4&-0[ERROR]&r&-4`, err.stack);
    }
}