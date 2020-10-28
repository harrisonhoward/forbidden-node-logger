const { Logger } = require("../../index");
const Log = require("../structures/Log");
const ReadWrite = require("./ReadWrite");
const fs = require("fs");
const removeFileExtension = /[.]log/gi;

module.exports = class FileHistory {
    /**
     * 
     * @param {String} dirPath 
     * @param {Logger} Logger The logger instance
    */
    constructor(dirPath, Logger) {
        this.dirPath = dirPath;
        this.Logger = Logger;

        this.year = (() => { return new Date().getFullYear() });
        this.month = (() => { return (new Date().getMonth() + 1).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false }) });
        this.day = (() => { return new Date().getDate().toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false }) });

        if (!this.dirPath.endsWith("/")) {
            this.dirPath += "/";
        }

        this._handleCatch = this._handleCatch.bind(this);

        this.Logger.on("log", async (log) => {
            await this.writeNewLog(log);
        });
        this.Logger.on("warn", async (log) => {
            await this.writeNewLog(log, "-warn");
        });
        this.Logger.on("error", async (log) => {
            await this.writeNewLog(log, "-error");
        });
    }

    /**
     * Get lines from the log by the year, month and day entered
     * @param {Number} day If not provided. Executed like getLatestLog()
     * @param {Number} month If not provided. Current month
     * @param {Number} year If not provided. Current year
     * @returns {Promise<void | Array<String>>}
    */
    async getLogByDay(day = undefined, month = new Date().getMonth() + 1, year = new Date().getFullYear()) {
        if (!day) {
            return this.getLatestLog();
        }
        if (isNaN(day)) {
            day = new Date().getDate();
            this.Logger.eventLog("none", `&_6&-0[WARN]&r&-6`, "day must be a number");
        }
        if (isNaN(month)) {
            month = new Date().getMonth();
            this.Logger.eventLog("none", `&_6&-0[WARN]&r&-6`, "month must be a number");
        }
        if (isNaN(year)) {
            year = new Date().getFullYear();
            this.Logger.eventLog("none", `&_6&-0[WARN]&r&-6`, "year must be a number");
        }

        // @ts-ignore
        day = day.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
        // @ts-ignore
        month = month.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
        const readFile = `${this.dirPath}${year}/${month}`;
        await ReadWrite.dirIfNotExists(readFile).catch(this._handleCatch);
        return await ReadWrite.read(`${readFile}/${day}.log`).catch(this._handleCatch);
    }

    /**
     * Get lines from all logs by the month and year provided
     * @param {Number} month If not provided. Current month
     * @param {Number} year If not provided. Current year
     * @returns {Promise<Object>} Each log identified as the number of the day (i.e. 05 will become 5)
    */
    async getLogsByMonth(month = new Date().getMonth() + 1, year = new Date().getFullYear()) {
        const logs = {};
        if (isNaN(month)) {
            month = new Date().getMonth() + 1;
            this.Logger.eventLog("none", `&_6&-0[WARN]&r&-6`, "month must be a number");
        }
        if (isNaN(year)) {
            year = new Date().getFullYear();
            this.Logger.eventLog("none", `&_6&-0[WARN]&r&-6`, "year must be a number");
        }

        // @ts-ignore
        month = month.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
        const readDir = `${this.dirPath}${year}/${month}`;
        await ReadWrite.dirIfNotExists(readDir).catch(this._handleCatch);
        return new Promise(resolve => {
            fs.readdirSync(readDir)
                // @ts-ignore
                .filter(file => file.endsWith(".log") && !isNaN(file.replace(removeFileExtension, "")))
                .forEach(async (file, index, files) => {
                    const fileName = parseInt(file.replace(removeFileExtension, ""));
                    logs[fileName] = await this.getLogByDay(fileName, month, year);
                    if (index == files.length - 1) {
                        resolve(logs);
                    }
                });
        });
    }

    /**
     * Get lines from all logs by year provided
     * @param {Number} year If not provided. Current year
     * @returns {Promise<Object>} Each month identified as number of the month 
     * and each log identified as the number of the day (i.e. 05 will become 5)
    */
    async getLogsByYear(year = new Date().getFullYear()) {
        const logs = {};
        if (isNaN(year)) {
            year = new Date().getFullYear();
            this.Logger.eventLog("none", `&_6&-0[WARN]&r&-6`, "year must be a number");
        }
        const readDir = `${this.dirPath}${year}`;
        await ReadWrite.dirIfNotExists(readDir).catch(this._handleCatch);
        return new Promise(resolve => {
            fs.readdirSync(readDir)
                // @ts-ignore
                .filter(folder => !isNaN(folder))
                .forEach(async (month, index, months) => {
                    const monthName = parseInt(month);
                    // @ts-ignore
                    logs[monthName] = await this.getLogsByMonth(month, year);
                    if (index == months.length - 1) {
                        resolve(logs);
                    }
                });
        });
    }

    /**
     * Get lines from the latest log file
     * @returns {Promise<void | Array<String>>}
    */
    async getLatestLog() {
        const readFile = `${this.dirPath}${this.year()}/${this.month()}`;
        await ReadWrite.dirIfNotExists(readFile).catch(this._handleCatch);
        return await ReadWrite.read(`${readFile}/${this.day()}.log`).catch(this._handleCatch);
    }

    /**
     * 
     * @param {Error} err 
    */
    _handleCatch(err) {
        this.Logger.eventLog("none", `&_4&-0[ERROR]&r&-4`, err.stack);
    }

    /**
     * 
     * @param {Log} log 
     * @param {String} name 
    */
    async writeNewLog(log, name = "") {
        const writeFile = `${this.dirPath}${this.year()}/${this.month()}`;
        await ReadWrite.dirIfNotExists(writeFile).catch(this._handleCatch);
        await ReadWrite
            .write(
                `${writeFile}/${this.day()}${name}.log`,
                `${this.Logger.prefix()}${this.Logger.seperator}${log.clean()}\n`).catch(this._handleCatch
                );
    }
}