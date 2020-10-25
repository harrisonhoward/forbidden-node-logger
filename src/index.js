"use strict";

const Logger = require("./Logger");

function NodeLogger(options, seperator) {
    return new Logger(options, seperator);
}

NodeLogger.Logger = Logger;
NodeLogger.Log = require("./util/structures/Log");
NodeLogger.LogHistory = require("./util/structures/LogHistory");
NodeLogger.FileHistory = require("./util/file/FileHistory");
NodeLogger.ReadWrite = require("./util/file/ReadWrite");

module.exports = NodeLogger;